from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Sale
from .serializers import SaleSerializer

# Post request to send discord bot data to database
@api_view(['POST'])
def create_sale(request):
    serializer = SaleSerializer(data=request.data) # Gets data from sale serializer
    if serializer.is_valid(): # Checks if the data is valid
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED) # Returns a reponse saying eveything went good
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # Returns this response if data passed into the serializer is bad
