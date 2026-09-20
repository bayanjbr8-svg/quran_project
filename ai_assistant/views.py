from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from openai import OpenAI
from django.conf import settings
from django.db.models import Avg

from courses.models import Lesson
from quizzes.models import QuizResult

from .local_answers import LOCAL_QURAN_ANSWERS


# =========================================================
# الاتصال بـ Groq
# =========================================================

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)


# =========================================================
# الإجابات المحلية الاحتياطية لـ AI Quran Tutor
# =========================================================

def get_local_answer(question):

    question = question.strip().lower()

    for topic, data in LOCAL_QURAN_ANSWERS.items():

        for keyword in data["keywords"]:

            if keyword.lower() in question:
                return data["answer"]

    return (
        "حالياً المساعد الذكي غير متصل أو لا توجد معلومات كافية. "
        "يمكنك مراجعة الدرس أو سؤال المعلم."
    )

# =========================================================
# AI Quran Tutor
# =========================================================

class QuranAIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        message = request.data.get("message")
        lesson_id = request.data.get("lesson_id")

        # ---------- Validation ----------

        if not message:
            return Response({
                "error": "message is required"
            }, status=400)

        if not lesson_id:
            return Response({
                "error": "lesson_id is required"
            }, status=400)

        # ---------- Get Lesson ----------

        try:

            lesson = Lesson.objects.get(
                id=lesson_id
            )

        except Lesson.DoesNotExist:

            return Response({
                "error": "Lesson not found"
            }, status=404)

        # ---------- Check lesson description ----------

        if not lesson.description:

            return Response({
                "error": (
                    "This lesson has no description yet. "
                    "AI needs lesson content."
                )
            }, status=400)

        # ---------- Lesson Context ----------

        lesson_context = f"""
Official Lesson Content (Primary Source)

Lesson Title:
{lesson.title}

Lesson Description:
{lesson.description}
"""

        # ---------- AI ----------

        try:

            response = client.chat.completions.create(

                model="openai/gpt-oss-120b",

                messages=[

                    {
                        "role": "system",

                        "content": """
You are a specialized Quran and Tajweed tutor
for a Quran learning platform.

STRICT RULES:

- Use lesson content as your PRIMARY source.
- Do not contradict lesson content.
- Never invent tajweed rules.
- Never invent examples.
- If information is missing, say exactly:

لا أملك معلومة مؤكدة

- Explain in simple Arabic suitable for students.
- Keep answers educational and concise.
"""
                    },

                    {
                        "role": "user",

                        "content": f"""
{lesson_context}

Student Question:
{message}
"""
                    }

                ],

                temperature=0.2
            )

            answer = response.choices[0].message.content

            return Response({

                "source": "groq",

                "lesson_id": lesson.id,

                "lesson_title": lesson.title,

                "question": message,

                "answer": answer

            })

        except Exception:

            fallback_answer = get_local_answer(
                message
            )

            return Response({

                "source": "local_backup",

                "lesson_id": lesson.id,

                "lesson_title": lesson.title,

                "question": message,

                "answer": fallback_answer

            })


# =========================================================
# AI Performance Recommendation
# =========================================================

class AIPerformanceRecommendationView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # -------------------------------------------------
        # الحصول على نتائج اختبارات الطالب الحالي
        # -------------------------------------------------

        quiz_results = QuizResult.objects.filter(

            student=request.user

        ).select_related(

            "quiz",
            "quiz__lesson"

        )

        # -------------------------------------------------
        # إذا لم يحل الطالب أي اختبار
        # -------------------------------------------------

        if not quiz_results.exists():

            return Response({

                "message": (
                    "لا توجد نتائج اختبارات كافية "
                    "لتحليل الأداء."
                )

            })

        # -------------------------------------------------
        # حساب متوسط الدرجات
        # -------------------------------------------------

        average_score = quiz_results.aggregate(

            avg=Avg("score")

        )["avg"] or 0

        # -------------------------------------------------
        # الاختبارات التي لم ينجح بها الطالب
        # -------------------------------------------------

        failed_quizzes = quiz_results.filter(

            passed=False

        )

        failed_data = []

        for result in failed_quizzes:

            failed_data.append({

                "quiz": result.quiz.title,

                "lesson": result.quiz.lesson.title,

                "score": result.score

            })

        # -------------------------------------------------
        # تجهيز بيانات الأداء للـ AI
        # -------------------------------------------------

        performance_context = f"""

Student Performance:

Average Quiz Score:
{round(average_score, 2)}

Failed Quizzes:
{failed_data}
"""

        # -------------------------------------------------
        # طلب التوصية من AI
        # -------------------------------------------------

        try:

            response = client.chat.completions.create(

                model="openai/gpt-oss-120b",

                messages=[

                    {

                        "role": "system",

                        "content": """
أنت مساعد تعليمي لمنصة لتعليم القرآن والتجويد.

مهمتك تحليل أداء الطالب وإعطاؤه توصية تعليمية مناسبة.

القواعد:

- اعتمد فقط على بيانات أداء الطالب المقدمة لك.
- لا تخترع درجات أو معلومات غير موجودة.
- إذا كان الطالب ضعيفاً في اختبار معين،
  اقترح مراجعة الدرس المرتبط به.
- إذا كان الأداء جيداً،
  شجع الطالب على الاستمرار.
- استخدم اللغة العربية البسيطة.
- اجعل التوصية قصيرة وواضحة.
- لا تقدم أحكاماً دينية جديدة.
"""
                    },

                    {

                        "role": "user",

                        "content": f"""
{performance_context}

أعطني توصية تعليمية مناسبة لهذا الطالب
بناءً على أدائه.
"""
                    }

                ],

                temperature=0.2

            )

            recommendation = (
                response.choices[0]
                .message.content
            )

            return Response({

                "source": "groq",

                "average_score": round(
                    average_score,
                    2
                ),

                "failed_quizzes": failed_data,

                "recommendation": recommendation

            })

        # -------------------------------------------------
        # إذا فشل الاتصال بالـ AI
        # -------------------------------------------------

        except Exception:

            if average_score < 60:

                recommendation = (

                    "ننصحك بمراجعة الدروس المرتبطة "
                    "بالاختبارات التي لم تنجح فيها، "
                    "ثم محاولة تحسين نتيجتك "
                    "في الاختبارات القادمة."

                )

            elif average_score < 80:

                recommendation = (

                    "أداؤك جيد، لكن يمكنك تحسين نتيجتك "
                    "بمراجعة الدروس والتركيز على النقاط "
                    "التي أخطأت فيها."

                )

            else:

                recommendation = (

                    "أداء ممتاز! استمر في مراجعة الدروس "
                    "والمحافظة على مستواك."

                )

            return Response({

                "source": "local_backup",

                "average_score": round(
                    average_score,
                    2
                ),

                "failed_quizzes": failed_data,

                "recommendation": recommendation

            })
        