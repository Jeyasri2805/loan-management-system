from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "full_name", "phone", "role", "is_staff")
    search_fields = ("email", "full_name", "phone")
    list_filter = ("role", "is_staff", "is_superuser")
    fieldsets = UserAdmin.fieldsets + (
        ("Profile", {"fields": ("full_name", "phone", "role")}),
    )
