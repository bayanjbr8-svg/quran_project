from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models import Avg
from quizzes.models import QuizResult

from .models import (
    Lesson,
    LessonComment,
    LessonRating,
    LessonProgress
)

from .serializers import (
    LessonSerializer,
    LessonCommentSerializer,
    LessonRatingSerializer
)

from .permissions import IsStudent, IsTeacher

from notifications.models import Notification


# --------------------- الدروس ---------------------
class LessonCreateView(APIView):

    permission_classes = [IsAuthenticated, IsTeacher]

    def post(self, request):

        serializer = LessonSerializer(data=request.data)

        if serializer.is_valid():

            lesson = serializer.save(
                teacher=request.user
            )

            User = get_user_model()

            students = User.objects.filter(
                   role="student"
            )

            for student in students:

                Notification.objects.create(
                    user=student,
                    title="درس جديد 📚",
                    message=f"تم إضافة درس جديد: {lesson.title}"
                )

            return Response(
                serializer.data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )


class LessonListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.is_staff:

            lessons = Lesson.objects.filter(
                teacher=request.user
            )

        else:

            lessons = Lesson.objects.all()

        serializer = LessonSerializer(
            lessons,
            many=True
        )

        return Response(serializer.data)


# --------------------- التعليقات ---------------------
class LessonCommentCreateView(APIView):

    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, lesson_id):

        try:
            lesson = Lesson.objects.get(id=lesson_id)

        except Lesson.DoesNotExist:

            return Response({
                "detail": "الدرس غير موجود"
            }, status=404)

        serializer = LessonCommentSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(
                student=request.user,
                lesson=lesson
            )

            return Response(
                serializer.data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )


class TeacherReplyView(APIView):

    permission_classes = [IsAuthenticated, IsTeacher]

    def patch(self, request, comment_id):

        try:
            comment = LessonComment.objects.get(
                id=comment_id
            )

        except LessonComment.DoesNotExist:

            return Response({
                "detail": "التعليق غير موجود"
            }, status=404)

        comment.teacher_reply = request.data.get(
            "teacher_reply"
        )

        comment.replied_at = timezone.now()

        comment.save()

        serializer = LessonCommentSerializer(comment)

        return Response(serializer.data)


# --------------------- التقييم ---------------------
class LessonRatingCreateView(APIView):

    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, lesson_id):

        try:
            lesson = Lesson.objects.get(id=lesson_id)

        except Lesson.DoesNotExist:

            return Response({
                "detail": "الدرس غير موجود"
            }, status=404)

        rating_value = request.data.get("rating")

        if not rating_value or not (
            1 <= int(rating_value) <= 5
        ):

            return Response({
                "detail": "قيم بين 1 و 5"
            }, status=400)

        rating, created = LessonRating.objects.update_or_create(
            lesson=lesson,
            student=request.user,
            defaults={
                "rating": rating_value
            }
        )

        serializer = LessonRatingSerializer(rating)

        return Response(
            serializer.data,
            status=201 if created else 200
        )


# --------------------- إنهاء الدرس ---------------------
class LessonCompleteView(APIView):

    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, lesson_id):

        try:
            lesson = Lesson.objects.get(id=lesson_id)

        except Lesson.DoesNotExist:

            return Response({
                "detail": "الدرس غير موجود"
            }, status=404)

        progress, created = LessonProgress.objects.get_or_create(
            student=request.user,
            lesson=lesson
        )

        progress.is_completed = True
        progress.completed_at = timezone.now()

        progress.save()

        return Response({
            "message": "تم تسجيل إكمال الدرس"
        }, status=status.HTTP_200_OK)


# --------------------- الطلاب الذين أكملوا الدرس ---------------------
class LessonProgressView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):

        lesson = Lesson.objects.get(id=lesson_id)

        completed = LessonProgress.objects.filter(
            lesson=lesson,
            is_completed=True
        ).select_related("student")

        data = [

            {
                "id": p.student.id,
                "username": p.student.username
            }

            for p in completed
        ]

        return Response({

            "lesson": lesson.title,

            "completed_count": len(data),

            "completed_students": data

        })


# --------------------- الطلاب الذين لم يكملوا الدرس ---------------------
class LessonMissingStudentsView(APIView):

    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request, lesson_id):

        lesson = Lesson.objects.get(id=lesson_id)

        User = get_user_model()

        completed_ids = LessonProgress.objects.filter(
            lesson=lesson,
            is_completed=True
        ).values_list(
            "student_id",
            flat=True
        )

        missing = User.objects.filter(
            is_staff=False
        ).exclude(
            id__in=completed_ids
        )

        data = [

            {
                "id": s.id,
                "username": s.username
            }

            for s in missing
        ]

        return Response({

            "lesson": lesson.title,

            "missing_count": len(data),

            "missing_students": data

        })


# --------------------- تقدم الطالب ---------------------
# --------------------- تقدم الطالب ---------------------
class StudentProgressView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # =========================
        # الدروس
        # =========================

        total_lessons = Lesson.objects.count()

        completed_lessons = LessonProgress.objects.filter(
            student=request.user,
            is_completed=True
        ).count()

        lesson_progress_percentage = (
            (completed_lessons / total_lessons) * 100
            if total_lessons > 0 else 0
        )

        # تفاصيل تقدم الدروس
        progress = LessonProgress.objects.filter(
            student=request.user
        ).select_related("lesson")

        lesson_data = []

        for item in progress:

            lesson_data.append({

                "lesson": item.lesson.title,
                "completed": item.is_completed,
                "completed_at": item.completed_at

            })

        # =========================
        # الاختبارات
        # =========================

        quiz_results = QuizResult.objects.filter(
            student=request.user
        ).select_related("quiz")

        quizzes_taken = quiz_results.count()

        quizzes_passed = quiz_results.filter(
            passed=True
        ).count()

        average_score = quiz_results.aggregate(
            avg=Avg("score")
        )["avg"] or 0

        # تفاصيل نتائج الاختبارات
        quiz_data = []

        for result in quiz_results:

            quiz_data.append({

                "quiz": result.quiz.title,
                "score": result.score,
                "passed": result.passed,
                "completed_at": result.completed_at

            })

        # =========================
        # Response
        # =========================

        return Response({

            "student": request.user.username,

            "lessons": {

                "total": total_lessons,

                "completed": completed_lessons,

                "progress_percentage": round(
                    lesson_progress_percentage,
                    2
                ),

                "details": lesson_data

            },

            "quizzes": {

                "taken": quizzes_taken,

                "passed": quizzes_passed,

                "average_score": round(
                    average_score,
                    2
                ),

                "details": quiz_data

            }

        })

         