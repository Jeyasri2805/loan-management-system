from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import (
    LoginSerializer,
    SignupSerializer,
    UserSerializer,
    get_tokens_for_user,
)


class SignupView(APIView):
    """Create a new regular user (role = user)."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response(
            {
                "message": "Signup successful",
                "user": UserSerializer(user).data,
                **tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class UserLoginView(APIView):
    """Login endpoint for the customer-facing app."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        if user.role != User.ROLE_USER:
            return Response(
                {"detail": "Please use the admin login page."},
                status=status.HTTP_403_FORBIDDEN,
            )
        tokens = get_tokens_for_user(user)
        return Response(
            {"message": "Login successful", "user": UserSerializer(user).data, **tokens}
        )


class AdminLoginView(APIView):
    """Login endpoint reserved for admin accounts."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        if user.role != User.ROLE_ADMIN:
            return Response(
                {"detail": "Not authorized as admin."},
                status=status.HTTP_403_FORBIDDEN,
            )
        tokens = get_tokens_for_user(user)
        return Response(
            {"message": "Admin login successful", "user": UserSerializer(user).data, **tokens}
        )


class MeView(APIView):
    """Return the currently authenticated user's profile."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
