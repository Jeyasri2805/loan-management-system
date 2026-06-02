from django.contrib import admin

from .models import LoanApplication


@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "loan_type",
        "loan_amount",
        "tenure_months",
        "status",
        "created_at",
    )
    list_filter = ("status", "loan_type", "employment_type")
    search_fields = ("full_name", "email", "phone", "aadhaar_number", "pan_number")
