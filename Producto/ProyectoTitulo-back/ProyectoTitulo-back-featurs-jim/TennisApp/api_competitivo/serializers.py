from rest_framework import serializers

from .models import Inscripciones, Ranking, RankingUsuario, Torneos


class TorneosSerializer(serializers.ModelSerializer):
	class Meta:
		model = Torneos
		fields = '__all__'

	def validate(self, attrs):
		fecha_inicio = attrs.get('tor_fecha_inicio')
		fecha_fin = attrs.get('tor_fecha_fin')

		if fecha_inicio and fecha_fin and fecha_fin <= fecha_inicio:
			raise serializers.ValidationError(
				'La fecha de fin debe ser posterior a la fecha de inicio.'
			)

		return attrs


class InscripcionesSerializer(serializers.ModelSerializer):
	class Meta:
		model = Inscripciones
		fields = '__all__'


class RankingSerializer(serializers.ModelSerializer):
	class Meta:
		model = Ranking
		fields = '__all__'


class RankingUsuarioSerializer(serializers.ModelSerializer):
	class Meta:
		model = RankingUsuario
		fields = '__all__'

	def validate_raus_puntos(self, value):
		if value < 0:
			raise serializers.ValidationError('Los puntos no pueden ser negativos.')
		return value
