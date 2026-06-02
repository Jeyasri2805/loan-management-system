from django.core.management.base import BaseCommand

from accounts.models import User


class Command(BaseCommand):
    """Create a default admin account so the project is demo-ready out of the box."""

    help = "Seed a default admin user (admin@loanapp.com / admin123)."

    def handle(self, *args, **options):
        email = "admin@loanapp.com"
        password = "admin123"

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f"Admin already exists: {email}"))
            return

        user = User.objects.create(
            username=email,
            email=email,
            full_name="System Admin",
            phone="9999999999",
            role=User.ROLE_ADMIN,
            is_staff=True,
            is_superuser=True,
        )
        user.set_password(password)
        user.save()
        self.stdout.write(
            self.style.SUCCESS(f"Created admin: {email} / {password}")
        )
