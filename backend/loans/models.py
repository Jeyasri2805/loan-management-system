from django.conf import settings
from django.db import models
from django.utils import timezone


class LoanApplication(models.Model):
    """A single loan application submitted by a user."""

    GENDER_CHOICES = [("Male", "Male"), ("Female", "Female"), ("Other", "Other")]

    EMPLOYMENT_CHOICES = [
        ("Student", "Student"),
        ("Salaried", "Salaried"),
        ("Self-Employed", "Self-Employed"),
        ("Business", "Business"),
        ("Government Employee", "Government Employee"),
    ]

    LOAN_TYPE_CHOICES = [
        ("Education Loan", "Education Loan"),
        ("Personal Loan", "Personal Loan"),
        ("Home Loan", "Home Loan"),
        ("Vehicle Loan", "Vehicle Loan"),
        ("Business Loan", "Business Loan"),
    ]

    TENURE_CHOICES = [
        (6, "6 Months"),
        (12, "1 Year"),
        (24, "2 Years"),
        (60, "5 Years"),
    ]

    STATUS_PENDING = "Pending"
    STATUS_APPROVED = "Approved"
    STATUS_REJECTED = "Rejected"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_APPROVED, "Approved"),
        (STATUS_REJECTED, "Rejected"),
    ]

    # Default interest rates per loan type (annual %).
    INTEREST_BY_TYPE = {
        "Education Loan": 8.5,
        "Personal Loan": 12.0,
        "Home Loan": 7.5,
        "Vehicle Loan": 9.5,
        "Business Loan": 11.0,
    }

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="loan_applications",
    )

    # Personal details
    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    # Identity
    aadhaar_number = models.CharField(max_length=12)
    pan_number = models.CharField(max_length=10)

    # Employment & loan details
    employment_type = models.CharField(max_length=30, choices=EMPLOYMENT_CHOICES)
    loan_type = models.CharField(max_length=30, choices=LOAN_TYPE_CHOICES)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2)
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2)
    tenure_months = models.PositiveIntegerField(choices=TENURE_CHOICES)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Address
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=80)
    state = models.CharField(max_length=80)
    pincode = models.CharField(max_length=10)

    # Misc
    purpose = models.TextField(blank=True)

    # Lifecycle
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.full_name} - {self.loan_type} ({self.status})"

    # ----- Computed financial helpers -----
    @property
    def monthly_interest_rate(self) -> float:
        return float(self.interest_rate) / 12 / 100

    @property
    def monthly_emi(self) -> float:
        principal = float(self.loan_amount)
        n = int(self.tenure_months)
        r = self.monthly_interest_rate
        if r == 0:
            return round(principal / n, 2) if n else 0
        emi = principal * r * ((1 + r) ** n) / (((1 + r) ** n) - 1)
        return round(emi, 2)

    @property
    def total_amount(self) -> float:
        return round(self.monthly_emi * int(self.tenure_months), 2)

    @property
    def interest_amount(self) -> float:
        return round(self.total_amount - float(self.loan_amount), 2)

    @property
    def remaining_amount(self) -> float:
        return round(self.total_amount - float(self.amount_paid), 2)

    @property
    def due_date(self):
        """Approximate next-EMI due date = created + 1 month after approval."""
        from datetime import timedelta

        return (self.created_at + timedelta(days=30)).date()
