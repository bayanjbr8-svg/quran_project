import re

def normalize_arabic(text):

    if not text:
        return ""

    text = re.sub(
        r'[\u064B-\u065F\u0670\u06D6-\u06ED]',
        '',
        text
    )

    text = re.sub(r"[^\w\s]", "", text)

    text = text.replace("ٱ", "ا")
    text = text.replace("أ", "ا")
    text = text.replace("إ", "ا")
    text = text.replace("آ", "ا")

    return " ".join(text.split())