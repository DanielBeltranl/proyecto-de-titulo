from rest_framework import serializers

from .models import Game, Partido, PartidoRol, PartidoUsuario, Punto, Set


class PartidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partido
        fields = '__all__'


class PartidoRolSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartidoRol
        fields = '__all__'


class PartidoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartidoUsuario
        fields = '__all__'


class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = '__all__'

    def validate_set_numero(self, value):
        if value <= 0:
            raise serializers.ValidationError('El numero de set debe ser mayor que 0.')
        return value


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

    def validate_game_numero(self, value):
        if value <= 0:
            raise serializers.ValidationError('El numero de game debe ser mayor que 0.')
        return value


class PuntoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Punto
        fields = '__all__'

    def validate_punto_numero(self, value):
        if value <= 0:
            raise serializers.ValidationError('El numero de punto debe ser mayor que 0.')
        return value
