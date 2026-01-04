from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import QuizSerializer
from .models import Quiz, Choice, QuizResult
from users.permissions import IsTeacher


class QuizViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # إنشاء أو تعديل أو حذف اختبار → فقط معلم
        if self.action in ['create_quiz', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsTeacher()]
        # تقديم الإجابات أو عرض النتيجة → أي مستخدم مسجّل (طالب/أستاذ)
        return [IsAuthenticated()]

    # --------------------
    # إرسال الإجابات (طالب)
    # POST /api/quizzes/{id}/submit/
    # --------------------
    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        # منع إعادة الحل
        if QuizResult.objects.filter(quiz=quiz, user=request.user).exists():
            return Response({"detail": "لقد قمت بحل هذا الاختبار مسبقاً"}, status=status.HTTP_400_BAD_REQUEST)

        answers = request.data.get("answers", [])
        total_questions = quiz.questions.count()

        if len(answers) != total_questions:
            return Response({"detail": "يجب الإجابة على جميع الأسئلة"}, status=status.HTTP_400_BAD_REQUEST)

        correct_answers = 0
        for ans in answers:
            question_id = ans.get("question")
            choice_id = ans.get("choice")
            if Choice.objects.filter(id=choice_id, question_id=question_id, is_correct=True).exists():
                correct_answers += 1

        percentage = (correct_answers / total_questions) * 100
        PASS_PERCENTAGE = 60
        passed = percentage >= PASS_PERCENTAGE

        def get_message(percentage):
            if percentage >= 90:
                return "أحسنت! أداء رائع 🌟"
            elif percentage >= 60:
                return "بارك الله فيك، نتيجة جيدة 👏"
            else:
                return "لا تيأس، حاول مرة أخرى 💪"

        message = get_message(percentage)

        result = QuizResult.objects.create(
            quiz=quiz,
            user=request.user,
            score=percentage,
            passed=passed
        )

        return Response({
            "quiz": quiz.title,
            "correct_answers": correct_answers,
            "total_questions": total_questions,
            "percentage": percentage,
            "passed": passed,
            "message": message,
            "submitted_at": result.submitted_at
        }, status=status.HTTP_200_OK)

    # --------------------
    # عرض نتيجة الطالب
    # GET /api/quizzes/{id}/result/
    # --------------------
    @action(detail=True, methods=["get"])
    def result(self, request, pk=None):
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            result = QuizResult.objects.get(quiz=quiz, user=request.user)
        except QuizResult.DoesNotExist:
            return Response({"detail": "لم تقم بحل هذا الاختبار بعد"}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "quiz": quiz.title,
            "percentage": result.score,
            "passed": result.passed,
            "total_questions": quiz.questions.count(),
            "submitted_at": result.submitted_at
        }, status=status.HTTP_200_OK)

    # --------------------
    # إنشاء اختبار (أستاذ فقط)
    # POST /api/quizzes/create_quiz/
    # --------------------
    @action(detail=False, methods=["post"])
    def create_quiz(self, request):
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            quiz = serializer.save()
            return Response({
                "detail": "Quiz created successfully",
                "quiz_id": quiz.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)