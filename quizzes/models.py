from django.db import models

# Create your models here.
from django.db import models
from courses.models import Lesson
from django.conf import settings


# كل درس → اختبار واحد
class Quiz(models.Model):
    lesson = models.OneToOneField(
        Lesson,
        on_delete=models.CASCADE,
        related_name="quiz"
    )
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"Quiz for {self.lesson.title}"


# كل اختبار → عدة أسئلة (30 سؤال مثلاً)
class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="questions"
    )
    text = models.TextField()

    def __str__(self):
        return self.text


# لكل سؤال 4 خيارات (واحد فقط صحيح)
class Choice(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="choices"
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


# حفظ نتيجة الطالب
class QuizResult(models.Model):
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField()
    passed = models.BooleanField(default=False)
   
    submitted_at = models.DateTimeField(auto_now_add=True) 