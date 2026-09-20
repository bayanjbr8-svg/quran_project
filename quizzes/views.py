from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count
from django.contrib.auth import get_user_model

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Quiz, Choice, QuizResult
from .serializers import QuizCreateSerializer

from users.permissions import IsTeacher


class QuizViewSet(viewsets.ViewSet):

    permission_classes = [IsAuthenticated]

    # -----------------------------------
    # الصلاحيات
    # -----------------------------------
    def get_permissions(self):

        if self.action in [
            'create_quiz',
            'update',
            'partial_update',
            'destroy'
        ]:
            return [IsAuthenticated(), IsTeacher()]

        return [IsAuthenticated()]

    # -----------------------------------
    # إنشاء اختبار
    # -----------------------------------
    @action(detail=False, methods=["post"])
    def create_quiz(self, request):

        serializer = QuizCreateSerializer(data=request.data)

        if serializer.is_valid():
            quiz = serializer.save()

            return Response({
                "message": "تم إنشاء الاختبار بنجاح",
                "quiz_id": quiz.id
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # -----------------------------------
    # إرسال الإجابات
    # -----------------------------------
    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):

        quiz = get_object_or_404(Quiz, pk=pk)

        already_taken = QuizResult.objects.filter(
            student=request.user,
            quiz=quiz
        ).exists()

        if already_taken:
            return Response({
                "message": "لا يمكنك إعادة الاختبار"
            }, status=status.HTTP_400_BAD_REQUEST)

        answers = request.data.get("answers", [])
        total_questions = quiz.questions.count()

        if len(answers) != total_questions:
            return Response({
                "message": "يجب الإجابة على جميع الأسئلة"
            }, status=status.HTTP_400_BAD_REQUEST)

        correct_answers = 0

        for answer in answers:

            question_id = answer.get("question")
            choice_id = answer.get("choice")

            is_correct = Choice.objects.filter(
                id=choice_id,
                question_id=question_id,
                is_correct=True
            ).exists()

            if is_correct:
                correct_answers += 1

        percentage = (correct_answers / total_questions) * 100
        passed = percentage >= 60

        if percentage >= 90:
            message = "أحسنت! أداء ممتاز 🌟"
        elif percentage >= 60:
            message = "نتيجة جيدة 👏"
        else:
            message = "حاول مرة أخرى 💪"

        result = QuizResult.objects.create(
            student=request.user,
            quiz=quiz,
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
            "submitted_at": result.completed_at
        }, status=status.HTTP_200_OK)

    # -----------------------------------
    # نتيجة الطالب
    # -----------------------------------
    @action(detail=True, methods=["get"])
    def result(self, request, pk=None):

        quiz = get_object_or_404(Quiz, pk=pk)

        try:
            result = QuizResult.objects.get(
                student=request.user,
                quiz=quiz
            )

        except QuizResult.DoesNotExist:
            return Response({
                "message": "لم تقم بحل الاختبار بعد"
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "quiz": quiz.title,
            "score": result.score,
            "passed": result.passed,
            "submitted_at": result.completed_at
        }, status=status.HTTP_200_OK)

    # -----------------------------------
    # كل النتائج (للمعلم)
    # -----------------------------------
    @action(detail=False, methods=["get"])
    def all_results(self, request):

        if not request.user.is_staff:
            return Response({
                "message": "غير مصرح لك"
            }, status=status.HTTP_403_FORBIDDEN)
        
        results = QuizResult.objects.filter(
          quiz__lesson__teacher=request.user
         )
       

        data = []

        for result in results:
            data.append({
                "student": result.student.username,
                "quiz": result.quiz.title,
                "score": result.score,
                "passed": result.passed,
                "completed_at": result.completed_at
            })

        return Response(data)

    # -----------------------------------
    # لوحة تحكم المعلم
    # -----------------------------------
    @action(detail=False, methods=["get"])
    def teacher_dashboard(self, request):

        if not request.user.is_staff:
            return Response({
                "message": "غير مصرح لك"
            }, status=status.HTTP_403_FORBIDDEN)
        
        quizzes = Quiz.objects.filter(
          lesson__teacher=request.user
         )
        
        data = []

        for quiz in quizzes:

            results = QuizResult.objects.filter(quiz=quiz)

            avg_score = results.aggregate(
                avg=Avg("score")
            )["avg"] or 0

            data.append({
                "quiz": quiz.title,
                "lesson": quiz.lesson.title,
                "students_count": results.count(),
                "average_score": round(avg_score, 2),
            })

        return Response(data)

    # -----------------------------------
    # Leaderboard (ترتيب الطلاب)
    # -----------------------------------
    @action(detail=False, methods=["get"])
    def leaderboard(self, request):

        if not request.user.is_staff:
            return Response({
                "message": "غير مصرح لك"
            }, status=status.HTTP_403_FORBIDDEN)

        User = get_user_model()
         



        students = User.objects.filter(
           quizresult__quiz__lesson__teacher=request.user
           ).annotate(
           avg_score=Avg("quizresult__score"),
           quizzes_count=Count("quizresult")
           ).distinct().order_by("-avg_score")
        

        data = []

        for student in students:
            data.append({
                "student": student.username,
                "average_score": round(student.avg_score or 0, 2),
                "quizzes_count": student.quizzes_count
            })

        return Response(data)

    # -----------------------------------
    # الطلاب الذين لم يحلوا الاختبار
    # -----------------------------------
    @action(detail=True, methods=["get"])
    def missing_students(self, request, pk=None):

        if not request.user.is_staff:
            return Response({
                "message": "غير مصرح لك"
            }, status=status.HTTP_403_FORBIDDEN)

        quiz = get_object_or_404(Quiz, pk=pk)

        submitted_students_ids = QuizResult.objects.filter(
            quiz=quiz
        ).values_list("student_id", flat=True)

        User = get_user_model()

        all_students = User.objects.filter(is_staff=False)

        missing_students = all_students.exclude(
            id__in=submitted_students_ids
        )

        data = []

        for student in missing_students:
            data.append({
                "id": student.id,
                "username": student.username
            })

        return Response({
            "quiz": quiz.title,
            "missing_students_count": missing_students.count(),
            "missing_students": data
        })