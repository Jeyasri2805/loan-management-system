from django.urls import path

from .views import AdminLoginView, MeView, SignupView, UserLoginView


urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", UserLoginView.as_view(), name="user-login"),
    path("admin-login/", AdminLoginView.as_view(), name="admin-login"),
    path("me/", MeView.as_view(), name="me"),
]
