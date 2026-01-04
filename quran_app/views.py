from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Surah, Verse, TafsirVerse,SurahAudio
from .serializers import SurahSerializer, VerseSerializer, TafsirSerializer,SurahAudioSerializer


class SurahViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Surah.objects.all()
    serializer_class = SurahSerializer


class VerseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Verse.objects.all()
    serializer_class = VerseSerializer
class TafsirByVerse(APIView):
    def get(self, request, surah_number, verse_number):
        try:
            verse = Verse.objects.get(
                surah__number=surah_number,
                number=verse_number
            )
        except Verse.DoesNotExist:
            return Response({"error": "الآية غير موجودة"}, status=404)

        tafsir_list = TafsirVerse.objects.filter(verse=verse)

        # فلترة حسب query parameters
        source_id = request.GET.get('source_id')
        language = request.GET.get('language')

        if source_id:
            tafsir_list = tafsir_list.filter(source__source_id=source_id)
        if language:
            tafsir_list = tafsir_list.filter(source__language=language)

        serializer = TafsirSerializer(tafsir_list, many=True)
        return Response(serializer.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import TafsirSource

class TafsirSourcesList(APIView):
    def get(self, request):
        sources = TafsirSource.objects.all()
        data = [
            {
                "source_id": s.source_id,
                "name": s.name,
                "language": s.language
            }
            for s in sources
        ]
        return Response(data)



class SurahAudioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SurahAudio.objects.all()
    serializer_class = SurahAudioSerializer
