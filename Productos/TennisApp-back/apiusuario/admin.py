from django.contrib import admin
from django import forms
from .models import Usuario, QRLoginToken

admin.site.register(Usuario)
admin.site.register(QRLoginToken)
