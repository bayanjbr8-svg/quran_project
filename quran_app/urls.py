from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    SurahViewSet,
    VerseViewSet,
    SurahAudioViewSet,
    UploadRecitationView,
    MyRecitationsView,
    MyStatisticsView,
    TeacherDashboardView,
)


router = DefaultRouter()

router.register("surah", SurahViewSet)
router.register("verse", VerseViewSet)
router.register("surah-audio", SurahAudioViewSet)


urlpatterns = [
    path("", include(router.urls)),

    path(
        "upload-recitation/",
        UploadRecitationView.as_view()
    ),

    path(
        "my-recitations/",
        MyRecitationsView.as_view()
    ),

    path(
        "my-statistics/",
        MyStatisticsView.as_view(),
        name="my-statistics"
    ),

    path(
        "teacher/dashboard/",
        TeacherDashboardView.as_view(),
        name="teacher-dashboard"
    ),
]