import re

from google import genai

from app.core.config import settings


# =========================================================
# GEMINI CLIENT
# =========================================================

client = None

if settings.GEMINI_API_KEY:
    client = genai.Client(
        api_key=settings.GEMINI_API_KEY
    )


# =========================================================
# SYSTEM PROMPT
# =========================================================

SYSTEM_PROMPT = """
You are Future AI.

You are an advanced AI assistant.

You help users with:

- Normal conversation
- Questions
- Programming
- React
- TypeScript
- JavaScript
- Python
- FastAPI
- MongoDB
- HTML
- CSS
- Debugging
- Code generation
- Project planning
- Technical explanations
- Writing
- Research

Never claim that an action was completed unless
it was actually completed.

Keep answers practical, clear and useful.
"""


# =========================================================
# INTENT DETECTION
# =========================================================

def detect_intent(message: str) -> str:

    if not message or not message.strip():
        return "TEXT"

    text = message.strip().lower()

    # =====================================================
    # VIDEO
    # =====================================================

    video_patterns = [
        r"\bcreate\s+(a\s+)?video\b",
        r"\bgenerate\s+(a\s+)?video\b",
        r"\bmake\s+(a\s+)?video\b",
        r"\bcreate\s+(an\s+)?animation\b",
        r"\bgenerate\s+(an\s+)?animation\b",
        r"\bmake\s+(an\s+)?animation\b",
        r"\bvideo\s+of\b",
        r"\banimated\s+video\b",
        r"\banimation\s+of\b",
        r"\bfilm\s+of\b",
        r"\bmovie\s+of\b",
        r"\bclip\s+of\b",
        r"\bmoving\s+image\b",
    ]

    for pattern in video_patterns:
        if re.search(pattern, text):
            print("Detected Intent: VIDEO")
            return "VIDEO"

    # =====================================================
    # IMAGE
    # =====================================================

    image_patterns = [
        r"\bcreate\s+(an?\s+)?image\b",
        r"\bgenerate\s+(an?\s+)?image\b",
        r"\bmake\s+(an?\s+)?image\b",
        r"\bcreate\s+(a\s+)?picture\b",
        r"\bgenerate\s+(a\s+)?picture\b",
        r"\bmake\s+(a\s+)?picture\b",
        r"\bcreate\s+(a\s+)?photo\b",
        r"\bgenerate\s+(a\s+)?photo\b",
        r"\bmake\s+(a\s+)?photo\b",
        r"\bcreate\s+(a\s+)?portrait\b",
        r"\bgenerate\s+(a\s+)?portrait\b",
        r"\bdraw\s+",
        r"\billustration\s+of\b",
        r"\bimage\s+of\b",
        r"\bpicture\s+of\b",
        r"\bphoto\s+of\b",
        r"\bportrait\s+of\b",
    ]

    for pattern in image_patterns:
        if re.search(pattern, text):
            print("Detected Intent: IMAGE")
            return "IMAGE"

    # =====================================================
    # VISUAL KEYWORDS
    # =====================================================

    visual_words = [
        "wallpaper",
        "logo",
        "poster",
        "thumbnail",
        "artwork",
        "illustration",
        "digital art",
        "concept art",
        "realistic photo",
        "cinematic photo",
    ]

    for word in visual_words:
        if word in text:
            print("Detected Intent: IMAGE")
            return "IMAGE"

    # =====================================================
    # DEFAULT
    # =====================================================

    print("Detected Intent: TEXT")

    return "TEXT"


# =========================================================
# GEMINI RESPONSE
# =========================================================

def generate_response(
    message: str,
    history: list | None = None
):

    if not message or not message.strip():
        return "Message is required."

    if client is None:
        return (
            "Gemini is not configured. "
            "Please check GEMINI_API_KEY "
            "in backend/.env."
        )

    try:

        # -------------------------------------------------
        # Build conversation input
        # -------------------------------------------------

        input_text = SYSTEM_PROMPT + "\n\n"

        if history:

            for item in history:

                role = item.get("role", "user")
                content = item.get("content", "")

                if content:
                    input_text += (
                        f"{role.upper()}: "
                        f"{content}\n"
                    )

        input_text += (
            f"\nUSER: {message}\n"
            "\nASSISTANT:"
        )

        # -------------------------------------------------
        # Gemini Interactions API
        # -------------------------------------------------

        interaction = client.interactions.create(
            model=settings.GEMINI_MODEL,
            input=input_text
        )

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        if interaction.output_text:

            return interaction.output_text

        return "Gemini returned an empty response."

    except Exception as error:

        print("Gemini Error:", error)

        return (
            "Sorry, Future AI could not "
            "generate a response right now."
        )