from rest_framework_mongoengine.serializers import *
from rest_framework import serializers as origin_serializers
from .models import *
 
class ToolSerializer(DocumentSerializer):
    class Meta:
        model = Tool
        fields = '__all__'

class BcoObjectSerializer(DynamicDocumentSerializer):
    class Meta:
        model = BcoObject
        fields = '__all__'

class UserProfileSerializer(origin_serializers.ModelSerializer):
	class Meta:
		model = UserProfile
		fields = ('phone_number', 'address', 'city', 'state')

class UserSerializer(origin_serializers.HyperlinkedModelSerializer):
	profile = UserProfileSerializer(required=True)

	class Meta:
		model = User
		fields = ('email', 'first_name', 'last_name', 'password', 'profile', 'id')
		extra_kwargs = {'password': {'write_only': True}}

	def create(self, validated_data):
		profile_data = validated_data.pop('profile')
		password = validated_data.pop('password')
		user = User(**validated_data)
		user.set_password(password)
		user.save()
		UserProfile.objects.create(user=user, **profile_data)
		return user

	def update(self, instance, validated_data):
		print(validated_data)
		profile_data = validated_data.pop('profile')
		try:
			profile = instance.profile
		except:
			profile = UserProfile.objects.create(user=instance, **profile_data)
		instance.email = validated_data.get('email', instance.email)
		instance.save()

		profile.phone_number = profile_data.get('phone_number', profile.phone_number)
		profile.address = profile_data.get('address', profile.address)
		profile.city = profile_data.get('city', profile.city)
		profile.state = profile_data.get('state', profile.state)
		profile.save()

		return instance