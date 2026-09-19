from django.urls import path
from .views import RegisterView, LoginView
from .views import StudentListView
from .views import StudentListView, StudentRecitationsView
urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
     path(
        "students/",
        StudentListView.as_view(),
        name="student-list"
    ),
    path(
    "students/<int:student_id>/recitations/",
    StudentRecitationsView.as_view(),
    name="student-recitations"
),
   
]
