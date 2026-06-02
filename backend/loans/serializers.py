import re

from rest_framework import serializers

from .models import LoanApplication


AADHAAR_RE = re.compile(r"^\d{12}$")
PAN_RE = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]$")
PHONE_RE = re.compile(r"^[6-9]\d{9}$")
PINCODE_RE = re.compile(r"^\d{6}$")


class LoanApplicationSerializer(serializers.ModelSerializer):
    """Read/write serializer with computed EMI fields exposed to the frontend."""

    monthly_emi = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()
    interest_amount = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    due_date = serializers.SerializerMethodField()
    applicant = serializers.SerializerMethodField()

    class Meta:
        model = LoanApplication
        fields = [
            "id",
            "user",
            "applicant",
            "full_name",
            "email",
            "phone",
            "date_of_birth",
            "gender",
            "aadhaar_number",
            "pan_number",
            "employment_type",
            "loan_type",
            "monthly_income",
            "loan_amount",
            "tenure_months",
            "interest_rate",
            "address",
            "city",
            "state",
            "pincode",
            "purpose",
            "status",
            "amount_paid",
            "created_at",
            "updated_at",
            "monthly_emi",
            "total_amount",
            "interest_amount",
            "remaining_amount",
            "due_date",
        ]
        read_only_fields = [
            "id",
            "user",
            "status",
            "amount_paid",
            "interest_rate",
            "created_at",
            "updated_at",
        ]

    # ----- computed -----
    def get_monthly_emi(self, obj):
        return obj.monthly_emi

    def get_total_amount(self, obj):
        return obj.total_amount

    def get_interest_amount(self, obj):
        return obj.interest_amount

    def get_remaining_amount(self, obj):
        return obj.remaining_amount

    def get_due_date(self, obj):
        return obj.due_date

    def get_applicant(self, obj):
        return {
            "id": obj.user_id,
            "email": obj.user.email,
            "full_name": obj.user.full_name,
        }

    # ----- validation -----
    def validate_aadhaar_number(self, value):
        if not AADHAAR_RE.match(value):
            raise serializers.ValidationError("Aadhaar must be exactly 12 digits.")
        return value

    def validate_pan_number(self, value):
        value = value.upper()
        if not PAN_RE.match(value):
            raise serializers.ValidationError(
                "Invalid PAN format (e.g. ABCDE1234F)."
            )
        return value

    def validate_phone(self, value):
        if not PHONE_RE.match(value):
            raise serializers.ValidationError(
                "Enter a valid 10-digit Indian phone number."
            )
        return value

    def validate_pincode(self, value):
        if not PINCODE_RE.match(value):
            raise serializers.ValidationError("Pincode must be 6 digits.")
        return value

    def validate_loan_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Loan amount must be greater than 0.")
        if value > 10_000_000:
            raise serializers.ValidationError("Loan amount cannot exceed 1 crore.")
        return value

    def validate_monthly_income(self, value):
        if value <= 0:
            raise serializers.ValidationError("Monthly income must be greater than 0.")
        return value

    def create(self, validated_data):
        loan_type = validated_data.get("loan_type")
        validated_data["interest_rate"] = LoanApplication.INTEREST_BY_TYPE.get(
            loan_type, 10.0
        )
        return super().create(validated_data)


class LoanStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = ["status"]

    def validate_status(self, value):
        if value not in dict(LoanApplication.STATUS_CHOICES):
            raise serializers.ValidationError("Invalid status.")
        return value


class EmiPaymentSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value
