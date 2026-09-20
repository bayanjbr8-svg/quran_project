
from django.urls import path

from .views import (
    QuranAIView,
    AIPerformanceRecommendationView
)


urlpatterns = [

    # AI Quran Tutor
    path(
        "chat/",
        QuranAIView.as_view(),
        name="ai-chat"
    ),

    # AI Performance Recommendation
    path(
        "recommendation/",
        AIPerformanceRecommendationView.as_view(),
        name="ai-performance-recommendation"
    ),

]