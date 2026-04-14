from django.shortcuts import render
from requests import Response
from rest_framework.decorators import api_view
from .models import Usuario
from .serializers import UsuarioSerializer


#La borramos luego, es para probar la db
@api_view(['GET'])
def UsuarioList(request):
    usuarios = Usuario.objects.all()
    if not usuarios:
        return Response({'message': 'No se encontraron usuarios.'}, status=404)
    serializer = UsuarioSerializer(usuarios, many=True)
    return Response(serializer.data)