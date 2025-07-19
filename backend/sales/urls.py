from django.urls import path
from .views import create_sale

urlpatterns = [
    path('sales/', create_sale, name='create_sale') # Maps web request to the create_sale view
]