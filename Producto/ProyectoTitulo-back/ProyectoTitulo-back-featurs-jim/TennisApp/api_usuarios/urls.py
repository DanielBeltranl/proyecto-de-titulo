from django.urls import include, path

from .views import *

urlpatterns = [
    path('usuarios/',UsuarioList, name='usuario-list'),
]