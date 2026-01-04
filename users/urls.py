from django.urls import path
from .views import RegisterView, LoginView, TeacherOnlyView, StudentOnlyView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("teacher-only/", TeacherOnlyView.as_view()),
    path("student-only/", StudentOnlyView.as_view()),
]
