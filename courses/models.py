from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Lesson(models.Model):
    title = models.CharField(max_length=200)
    video = models.FileField(upload_to="lessons/videos/", null=True, blank=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lessons")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class LessonComment(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="comments")
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lesson_comments")
    text = models.TextField()
    teacher_reply = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    replied_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Comment by {self.student} on {self.lesson}"


class LessonRating(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="ratings")
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lesson_ratings")
    rating = models.PositiveSmallIntegerField()  # 1 → 5
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("lesson", "student")

    def __str__(self):
        return f"{self.rating} ⭐ - {self.lesson}"
