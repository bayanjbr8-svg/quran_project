import os
import json
import django
from pathlib import Path

# 🔴 ضروري يكونوا قبل أي import من Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quran_platform.settings")
django.setup()

# ⬇️ هاد الاستيراد لازم يجي بعد setup
from quran_app.models import Surah, SurahAudio


def load_surah_audio():
    base_dir = Path(__file__).resolve().parent
    audio_dir = base_dir / "data" / "audio"

    if not audio_dir.exists():
        print("❌ مجلد audio غير موجود")
        return

    json_files = list(audio_dir.glob("*.json"))
    print(f"📄 عدد ملفات JSON: {len(json_files)}")

    created = 0

    for json_file in json_files:
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        for item in data:
            surah_number = item.get("id")
            link = item.get("link")

            if not surah_number or not link:
                continue

            try:
                surah = Surah.objects.get(number=surah_number)
            except Surah.DoesNotExist:
                continue

            SurahAudio.objects.create(
                surah=surah,
                reciter_ar=item.get("reciter", {}).get("ar", ""),
                reciter_en=item.get("reciter", {}).get("en", ""),
                rewaya_ar=item.get("rewaya", {}).get("ar", ""),
                rewaya_en=item.get("rewaya", {}).get("en", ""),
                server=item.get("server", ""),
                audio_url=link,
            )

            created += 1

    print(f"✅ تم تحميل {created} ملف صوتي بنجاح!")


if __name__ == "__main__":
    load_surah_audio()
