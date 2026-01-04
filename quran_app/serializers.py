from rest_framework import serializers
from .models import TafsirVerse,TafsirSource,Surah, Verse,SurahAudio
from rest_framework.views import APIView
from rest_framework.response import Response


class SurahSerializer(serializers.ModelSerializer):
    class Meta:
        model = Surah
        fields = ["id", "number", "name"]

class VerseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verse
        fields = ["id", "number", "text"]
        
class TafsirSerializer(serializers.ModelSerializer):
    source_id = serializers.IntegerField(source='source.source_id')
    source_name = serializers.CharField(source='source.name')
    language = serializers.CharField(source='source.language')
    class Meta:
        model = TafsirVerse
        fields = ['source_id', 'source_name', 'language', 'text']


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


class SurahAudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurahAudio
        fields = [
            'id',
            'surah',
            'reciter_ar',
            'reciter_en',
            'rewaya_ar',
            'rewaya_en',
            'audio_url'
        ]
