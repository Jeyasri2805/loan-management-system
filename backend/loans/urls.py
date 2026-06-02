from django.urls import path

from .views import (
    AdminLoanDetailView,
    AdminLoanListView,
    AdminLoanStatusUpdateView,
    AdminStatsView,
    EmiPaymentView,
    UserLoanDetailView,
    UserLoanListCreateView,
    UserStatsView,
)


urlpatterns = [
    # User endpoints
    path("", UserLoanListCreateView.as_view(), name="user-loans"),
    path("stats/", UserStatsView.as_view(), name="user-stats"),
    path("<int:pk>/", UserLoanDetailView.as_view(), name="user-loan-detail"),
    path("<int:pk>/pay/", EmiPaymentView.as_view(), name="user-loan-pay"),

    # Admin endpoints
    path("admin/all/", AdminLoanListView.as_view(), name="admin-loans"),
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("admin/<int:pk>/", AdminLoanDetailView.as_view(), name="admin-loan-detail"),
    path("admin/<int:pk>/status/", AdminLoanStatusUpdateView.as_view(), name="admin-loan-status"),
]
