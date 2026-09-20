import os
import json
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quran_platform.settings")
django.setup()

from quran_app.models import TafsirSource, TafsirVerse, Surah, Verse

BASE_DIR = "data/tafsir/quran-tafsir-json-main/minified"

def load_tafsir():
    print("📘 بدء تحميل ملفات التفسير...")

    for file_name in os.listdir(BASE_DIR):
        if not file_name.endswith(".json"):
            continue

        full_path = os.path.join(BASE_DIR, file_name)
        print(f"📚 قراءة الملف: {file_name}")

        with open(full_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        tafsir_id = data["tafsir_id"]
        tafsir_name = data["tafsir_name"]
        lang = data["language"]

        # 🔥 إصلاح المشكلة الأساسية: استخدام source_id بدل id
        source, created = TafsirSource.objects.get_or_create(
            source_id=tafsir_id,
            defaults={"name": tafsir_name, "language": lang}
        )

        for chapter_data in data["data"]:
            surah_number = chapter_data["chapter"]

            # الحصول على السورة
            try:
                surah = Surah.objects.get(number=surah_number)
            except Surah.DoesNotExist:
                print(f"❌ السورة {surah_number} غير موجودة — تخطي.")
                continue

            for group in chapter_data["groups"]:
                start = group["start"]
                end = group["end"]
                tafseer_text = group["tafseer"]

                for verse_number in range(start, end + 1):

                    # الحصول على الآية
                    try:
                        verse = Verse.objects.get(surah=surah, number=verse_number)

                    except Verse.DoesNotExist:
                        print(f"❌ الآية {surah_number}:{verse_number} غير موجودة — تخطي.")
                        continue

                    # إنشاء التفسير
                    TafsirVerse.objects.update_or_create(
                        verse=verse,
                        source=source,
                        defaults={"text": tafseer_text}

                       )


        print(f"✔ تم تحميل: {file_name}")

    print("🎉 انتهى تحميل كل ملفات التفسير بنجاح!")


if __name__ == "__main__":
    load_tafsir()
