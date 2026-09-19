from difflib import SequenceMatcher
from .utils import normalize_arabic


def compare_recitation(correct_text, recognized_text):

    normalized_correct = normalize_arabic(correct_text)
    normalized_recognized = normalize_arabic(recognized_text)

    score = SequenceMatcher(
        None,
        normalized_correct,
        normalized_recognized
    ).ratio() * 100

    correct_words = normalized_correct.split()
    recognized_words = normalized_recognized.split()

    matcher = SequenceMatcher(
        None,
        correct_words,
        recognized_words
    )

    wrong_words = []
    comparison = []

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():

        if tag == "equal":

            for k in range(i1, i2):

                comparison.append({
                    "word": correct_words[k],
                    "status": "correct"
                })

        elif tag == "replace":

             for k in range(max(i2 - i1, j2 - j1)):

                expected_word = (
                    correct_words[i1 + k]
                    if i1 + k < i2
                    else None
                )

                said_word = (
                    recognized_words[j1 + k]
                    if j1 + k < j2
                   else None
                 )

                if expected_word is None:

                    wrong_words.append({
                         "type": "extra",
                        "position": i1 + k + 1,
                        "expected": None,
                        "said": said_word
                     })

                    comparison.append({
                        "word": said_word,
                         "status": "extra",
                         "message": "كلمة زائدة"
                    })

                elif said_word is None:

                    wrong_words.append({
                         "type": "missing",
                         "position": i1 + k + 1,
                         "expected": expected_word,
                         "said": None
                    })

                    comparison.append({
                         "word": expected_word,
                         "status": "missing",
                         "message": "لم يتم نطق الكلمة"
                    })

                else:

                    word_score = SequenceMatcher(
                    None,
                     expected_word,
                    said_word
                    ).ratio() * 100

                    wrong_words.append({
                    "type": "replace",
                    "position": i1 + k + 1,
                    "expected": expected_word,
                    "said": said_word
                    })

                    comparison.append({
                     "word": expected_word,
                     "status": "wrong",
                     "said": said_word,
                    "similarity": round(word_score, 2),
                     "message": "استبدلت الكلمة"
                })
        elif tag == "delete":

            for k in range(i1, i2):

                wrong_words.append({
                    "type": "missing",
                    "position": k + 1,
                    "expected": correct_words[k],
                    "said": None
                })

                comparison.append({
                    "word": correct_words[k],
                    "status": "missing",
                    "message": "لم يتم نطق الكلمة"
                })

        elif tag == "insert":

            for k in range(j1, j2):

                wrong_words.append({
                    "type": "extra",
                    "position": i1 + 1,
                    "expected": None,
                    "said": recognized_words[k]
                })

                comparison.append({
                    "word": recognized_words[k],
                    "status": "extra",
                    "message": "كلمة زائدة"
                })

    statistics = {
    "total_words": len(correct_words),
    "correct_words": sum(
        item["status"] == "correct"
        for item in comparison
    ),
    "wrong_words": sum(
        item["status"] == "wrong"
        for item in comparison
    ),
    "missing_words": sum(
        item["status"] == "missing"
        for item in comparison
    ),
    "extra_words": sum(
        item["status"] == "extra"
        for item in comparison
    ),
}
    return {
        "score": round(score, 2),
        "wrong_words": wrong_words,
        "comparison": comparison,
        "statistics": statistics,
    }