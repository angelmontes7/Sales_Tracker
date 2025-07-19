from rest_framework import serializers
from .models import Sale

class SaleSerializer(serializers.ModelSerializer): # Creates serializer fields corresponding exactly to model fields.
    class Meta:
        model = Sale # specifices which django model this serializer is tied to
        fields = '__all__' # specifies that every column in the Sale table will be handled