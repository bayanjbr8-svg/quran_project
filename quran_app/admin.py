from django.contrib import admin
from .models import Surah, Verse, SurahAudio, StudentRecitation

admin.site.register(Surah)
admin.site.register(Verse)
admin.site.register(SurahAudio)
admin.site.register(StudentRecitation)