from django.contrib import admin
from .models import Surah, Verse, SurahAudio,TafsirVerse,TafsirSource

admin.site.register(Surah)
admin.site.register(Verse)
admin.site.register(SurahAudio)
admin.site.register(TafsirVerse)
admin.site.register(TafsirSource)