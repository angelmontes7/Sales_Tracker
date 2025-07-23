from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Sale
from .serializers import SaleSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    authentication_classes = [TokenAuthentication, JWTAuthentication] # allows bot and users
    permission_classes = [IsAuthenticated]
