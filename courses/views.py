from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import Lesson, LessonComment, LessonRating
from .serializers import LessonSerializer, LessonCommentSerializer, LessonRatingSerializer
from .permissions import IsStudent, IsTeacher


# --------------------- الدروس ---------------------
class LessonCreateView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def post(self, request):
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(teacher=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class LessonListView(APIView):
    permission_classes = [IsAuthenticated]  # كل من الأستاذ أو الطالب يمكنه المشاهدة

    def get(self, request):
        lessons = Lesson.objects.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)


# --------------------- التعليقات ---------------------
class LessonCommentCreateView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, lesson_id):
        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"detail": "الدرس غير موجود"}, status=404)

        serializer = LessonCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(student=request.user, lesson=lesson)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class TeacherReplyView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def patch(self, request, comment_id):
        try:
            comment = LessonComment.objects.get(id=comment_id)
        except LessonComment.DoesNotExist:
            return Response({"detail": "التعليق غير موجود"}, status=404)

        comment.teacher_reply = request.data.get("teacher_reply")
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
            return Response({"detail": "الدرس غير موجود"}, status=404)

        rating_value = request.data.get("rating")
        if not rating_value or not (1 <= int(rating_value) <= 5):
            return Response({"detail": "قيم بين 1 و 5"}, status=400)

        rating, created = LessonRating.objects.update_or_create(
            lesson=lesson,
            student=request.user,
            defaults={"rating": rating_value}
        )

        serializer = LessonRatingSerializer(rating)
        return Response(serializer.data, status=201 if created else 200)
