from rest_framework import serializers

from .models import Relacion, TipoRelacion, Usuario


class UsuarioSerializer(serializers.ModelSerializer):
	class Meta:
		model = Usuario
		fields = '__all__'


class TipoRelacionSerializer(serializers.ModelSerializer):
	class Meta:
		model = TipoRelacion
		fields = '__all__'


class RelacionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Relacion
		fields = '__all__'

	def validate(self, attrs):
		usuario1 = attrs.get('rel_usuario1')
		usuario2 = attrs.get('rel_usuario2')

		if usuario1 and usuario2 and usuario1 == usuario2:
			raise serializers.ValidationError(
				'Un usuario no puede tener una relacion consigo mismo.'
			)

		return attrs
