from rest_framework import serializers
from .models import (
    Surah,
    Verse,
    SurahAudio,
    StudentRecitation,
)
class SurahSerializer(serializers.ModelSerializer):
    class Meta:
        model = Surah
        fields = ["id", "number", "name"]

class VerseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verse
        fields = ["id", "number", "text"]
        

        
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
class StudentRecitationSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentRecitation

        fields = [
            "id",
            "verse",
            "audio_file",
            "created_at"
        ]

        read_only_fields = [
            "id",
            "created_at"
        ]