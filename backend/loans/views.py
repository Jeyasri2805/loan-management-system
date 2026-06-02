from django.db.models import Count, Q, Sum
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveAPIView,
    ListAPIView,
)

from .models import LoanApplication
from .permissions import IsAdminRole, IsRegularUser
from .serializers import (
    EmiPaymentSerializer,
    LoanApplicationSerializer,
    LoanStatusUpdateSerializer,
)


class UserLoanListCreateView(ListCreateAPIView):
    """List the current user's loans or submit a new application."""

    serializer_class = LoanApplicationSerializer
    permission_classes = [IsAuthenticated, IsRegularUser]

    def get_queryset(self):
        return LoanApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserLoanDetailView(RetrieveAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [IsAuthenticated, IsRegularUser]

    def get_queryset(self):
        return LoanApplication.objects.filter(user=self.request.user)


class UserStatsView(APIView):
    """Aggregated stats for the user dashboard cards & charts."""

    permission_classes = [IsAuthenticated, IsRegularUser]

    def get(self, request):
        qs = LoanApplication.objects.filter(user=request.user)
        total_borrowed = sum(float(l.loan_amount) for l in qs.filter(status="Approved"))
        total_paid = sum(float(l.amount_paid) for l in qs)
        total_remaining = sum(
            l.remaining_amount for l in qs.filter(status="Approved")
        )
        return Response(
            {
                "total_applications": qs.count(),
                "approved": qs.filter(status="Approved").count(),
                "pending": qs.filter(status="Pending").count(),
                "rejected": qs.filter(status="Rejected").count(),
                "total_borrowed": round(total_borrowed, 2),
                "total_paid": round(total_paid, 2),
                "total_remaining": round(total_remaining, 2),
            }
        )


class EmiPaymentView(APIView):
    """Record an EMI payment against an approved loan."""

    permission_classes = [IsAuthenticated, IsRegularUser]

    def post(self, request, pk):
        try:
            loan = LoanApplication.objects.get(pk=pk, user=request.user)
        except LoanApplication.DoesNotExist:
            return Response({"detail": "Loan not found."}, status=404)

        if loan.status != LoanApplication.STATUS_APPROVED:
            return Response(
                {"detail": "EMI can be paid only on approved loans."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = EmiPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = float(serializer.validated_data["amount"])

        new_paid = float(loan.amount_paid) + amount
        if new_paid > loan.total_amount:
            new_paid = loan.total_amount

        loan.amount_paid = new_paid
        loan.save()
        return Response(LoanApplicationSerializer(loan).data)


# -------- Admin endpoints --------


class AdminLoanListView(ListAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        qs = LoanApplication.objects.select_related("user").all()
        params = self.request.query_params
        status_q = params.get("status")
        loan_type_q = params.get("loan_type")
        search_q = params.get("search")

        if status_q:
            qs = qs.filter(status=status_q)
        if loan_type_q:
            qs = qs.filter(loan_type=loan_type_q)
        if search_q:
            qs = qs.filter(
                Q(full_name__icontains=search_q)
                | Q(email__icontains=search_q)
                | Q(phone__icontains=search_q)
                | Q(aadhaar_number__icontains=search_q)
                | Q(pan_number__icontains=search_q)
            )
        return qs


class AdminLoanDetailView(RetrieveAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    queryset = LoanApplication.objects.select_related("user").all()


class AdminLoanStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def patch(self, request, pk):
        try:
            loan = LoanApplication.objects.get(pk=pk)
        except LoanApplication.DoesNotExist:
            return Response({"detail": "Loan not found."}, status=404)

        serializer = LoanStatusUpdateSerializer(loan, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(LoanApplicationSerializer(loan).data)


class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        qs = LoanApplication.objects.all()
        by_type = list(
            qs.values("loan_type").annotate(count=Count("id")).order_by("loan_type")
        )
        totals = qs.aggregate(
            total_amount=Sum("loan_amount"),
            paid=Sum("amount_paid"),
        )
        return Response(
            {
                "total_applications": qs.count(),
                "approved": qs.filter(status="Approved").count(),
                "pending": qs.filter(status="Pending").count(),
                "rejected": qs.filter(status="Rejected").count(),
                "total_amount": float(totals["total_amount"] or 0),
                "total_paid": float(totals["paid"] or 0),
                "by_type": by_type,
            }
        )
