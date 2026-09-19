
from django.db import models
from django.conf import settings


class Surah(models.Model):
    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Verse(models.Model):
    surah = models.ForeignKey(Surah, on_delete=models.CASCADE, related_name="verses")
    number = models.IntegerField()   
    text = models.TextField()

    class Meta:
        unique_together = ("surah", "number")

    def __str__(self):
      return f"{self.surah.number}:{self.number}"





class SurahAudio(models.Model):
    surah = models.ForeignKey( Surah,on_delete=models.CASCADE,related_name='audios')
    
    reciter_ar = models.CharField(max_length=100)
    reciter_en = models.CharField(max_length=100)

    rewaya_ar = models.CharField(max_length=100)
    rewaya_en = models.CharField(max_length=100)

    server = models.URLField()
    audio_url = models.URLField()

    def __str__(self):
        return f"{self.reciter_ar} - سورة {self.surah.number}"
    
class StudentRecitation(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    verse = models.ForeignKey(
        Verse,
        on_delete=models.CASCADE
    )

    audio_file = models.FileField(
        upload_to='student_recitations/'
    )

    recognized_text = models.TextField(
        blank=True,
        null=True
    )

    score = models.FloatField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    wrong_words = models.JSONField(
        default=list,
        blank=True
    )

    comparison = models.JSONField(
        default=list,
        blank=True
    )

    statistics = models.JSONField(
        default=dict,
        blank=True
    )