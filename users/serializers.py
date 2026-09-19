from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User
from quran_app.models import StudentRecitation
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        validated_data["password"] = make_password(
            validated_data["password"]
        )
        validated_data["role"] = "student"
        return super().create(validated_data)


class StudentListSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
        ]


class StudentRecitationSerializer(serializers.ModelSerializer):

    verse = serializers.CharField(source="verse.text")

    class Meta:
        model = StudentRecitation
        fields = [
            "id",
            "verse",
            "recognized_text",
            "score",
            "created_at",
        ]