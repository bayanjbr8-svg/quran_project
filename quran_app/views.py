from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (
    Surah,
    Verse,
    SurahAudio,
    StudentRecitation,
)
from .serializers import (
    SurahSerializer,
    VerseSerializer,
    SurahAudioSerializer,
    StudentRecitationSerializer,
)

from .comparison import compare_recitation
from faster_whisper import WhisperModel
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsTeacher
from users.models import User
from django.db.models import Avg, Max

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

class SurahViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Surah.objects.all()
    serializer_class = SurahSerializer

class VerseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Verse.objects.all()
    serializer_class = VerseSerializer
    
    
class SurahAudioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SurahAudio.objects.all()
    serializer_class = SurahAudioSerializer

class UploadRecitationView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = StudentRecitationSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        recitation = serializer.save(
            user=request.user
        )

        audio_path = recitation.audio_file.path

        segments, _ = model.transcribe(
            audio_path,
            language="ar"
        )

        recognized_text = " ".join(
            segment.text for segment in segments
        )

        correct_text = recitation.verse.text

        comparison_result = compare_recitation(
            correct_text,
            recognized_text
        )

        recitation.recognized_text = recognized_text
        recitation.score = comparison_result["score"]
        recitation.wrong_words = comparison_result["wrong_words"]
        recitation.comparison = comparison_result["comparison"]
        recitation.statistics = comparison_result["statistics"]

        recitation.save()

        return Response(
            {
                "recognized_text": recognized_text,
                "correct_text": correct_text,
                **comparison_result,
                "is_correct": (
                    comparison_result["statistics"]["wrong_words"] == 0
                    and comparison_result["statistics"]["missing_words"] == 0
                    and comparison_result["statistics"]["extra_words"] == 0
                ),
            },
            status=201,
        )

class MyRecitationsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

       recitations = StudentRecitation.objects.filter(
        user=request.user
       ).order_by("-created_at")

       data = []

       for r in recitations:

            data.append({
            "id": r.id,
            "surah": r.verse.surah.name,
            "surah_number": r.verse.surah.number,
            "verse_number": r.verse.number,
            "correct_text": r.verse.text,
            "recognized_text": r.recognized_text,
            "score": r.score,
            "audio_file": request.build_absolute_uri(
                r.audio_file.url
            ) if r.audio_file else None,
            "created_at": r.created_at,
        })

       return Response(data)

class MyStatisticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        recitations = StudentRecitation.objects.filter(
            user=request.user
        )

        if not recitations.exists():

            return Response({
                "total_recitations": 0,
                "average_score": 0,
                "best_score": 0,
                "last_score": 0
            })

        stats = recitations.aggregate(
            average_score=Avg("score"),
            best_score=Max("score")
        )

        last = recitations.order_by("-created_at").first()

        return Response({
            "total_recitations": recitations.count(),
            "average_score": round(stats["average_score"], 2),
            "best_score": stats["best_score"],
            "last_score": last.score
        })
    
class TeacherDashboardView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsTeacher
    ]

    def get(self, request):

        total_students = User.objects.filter(
            role="student"
        ).count()

        recitations = StudentRecitation.objects.all()

        total_recitations = recitations.count()

        average_score = recitations.aggregate(
            Avg("score")
        )["score__avg"] or 0

        return Response({
            "total_students": total_students,
            "total_recitations": total_recitations,
            "average_score": round(average_score, 2)
        })