from rest_framework import serializers
from .models import Lesson, LessonComment, LessonRating

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "title", "video", "teacher", "created_at"]
        read_only_fields = ["teacher", "created_at"]


class LessonCommentSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField(read_only=True)
    lesson = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = LessonComment
        fields = [
            "id",
            "lesson",
            "student",
            "text",
            "teacher_reply",
            "created_at",
            "replied_at",
        ]
        read_only_fields = ["student", "teacher_reply", "replied_at", "lesson"]


class LessonRatingSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField(read_only=True)
    lesson = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = LessonRating
        fields = ["id", "lesson", "student", "rating", "created_at"]
        read_only_fields = ["student", "lesson", "created_at"]
