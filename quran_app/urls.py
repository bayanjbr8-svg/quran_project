from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SurahViewSet, VerseViewSet, TafsirByVerse
from .views import SurahAudioViewSet

router = DefaultRouter()
router.register(r'surah', SurahViewSet)
router.register(r'verse', VerseViewSet)
router.register(r'surah-audio', SurahAudioViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path("tafsir/<int:surah_number>/<int:verse_number>/", TafsirByVerse.as_view()),
]
