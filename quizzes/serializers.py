from rest_framework import serializers
from .models import Quiz, Question, Choice, QuizResult

#"الاختيار"
class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ["id", "text"]


       # "السؤال"
class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "text", "choices"]


        #"الاختبار"
class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ["id", "title", "lesson", "questions"]

#"نتيجة الطالب"
class QuizResultSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = QuizResult
        fields = ["id", "quiz", "user", "score", "submitted_at"]   