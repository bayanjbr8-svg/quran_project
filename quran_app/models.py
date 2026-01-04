from django.db import models


class TafsirSource(models.Model):
    # هذا هو رقم التفسير مثل: 14 = ابن كثير
    source_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    language = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.name} ({self.language})"


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



class TafsirVerse(models.Model):
    verse = models.ForeignKey(Verse, on_delete=models.CASCADE)
    source = models.ForeignKey(TafsirSource, on_delete=models.CASCADE)
    text = models.TextField()

    class Meta:
        unique_together = ('verse', 'source')

    def __str__(self):
        return f"{self.source.name} - {self.verse}"

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

