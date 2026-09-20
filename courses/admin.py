from django.contrib import admin
from .models import Lesson, LessonComment, LessonRating

class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "teacher", "created_at")

# Register your other models

admin.site.register(Lesson)
admin.site.register(LessonComment)
admin.site.register(LessonRating)
