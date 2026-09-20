from django.urls import path
from .views import (
    LessonCreateView,
    LessonListView,
    LessonCommentCreateView,
    TeacherReplyView,
    LessonRatingCreateView,
     LessonCompleteView,
    LessonProgressView,
    LessonMissingStudentsView,
    StudentProgressView
)

urlpatterns = [
    path("create/", LessonCreateView.as_view(), name="lesson-create"),
    path("list/", LessonListView.as_view(), name="lesson-list"),
    path("lessons/<int:lesson_id>/comments/", LessonCommentCreateView.as_view(), name="lesson-comment"),
    path("comments/<int:comment_id>/reply/", TeacherReplyView.as_view(), name="teacher-reply"),
    path("lessons/<int:lesson_id>/rate/", LessonRatingCreateView.as_view(), name="lesson-rate"),
    
    path(
    "lessons/<int:lesson_id>/complete/",
    LessonCompleteView.as_view(),
    name="lesson-complete"
   
),

path(
    "lessons/<int:lesson_id>/progress/",
    LessonProgressView.as_view(),
    name="lesson-progress"
),

path(
    "lessons/<int:lesson_id>/missing_students/",
    LessonMissingStudentsView.as_view(),
    name="lesson-missing"
),
path(
    "progress/",
    StudentProgressView.as_view(),
    name="student-progress"
),
]
