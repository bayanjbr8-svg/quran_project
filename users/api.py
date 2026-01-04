from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # معلومات إضافية اختيارية
        token["username"] = user.username
        return token

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer
