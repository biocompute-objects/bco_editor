from rest_framework_mongoengine.serializers import *
from rest_framework import serializers as origin_serializers
from rest_framework_mongoengine.validators import (
	UniqueTogetherValidator, UniqueValidator
)
# from mongoengine.errors import ValidationError
from .models import *
from .utils import *

from django.contrib.auth import get_user_model, authenticate
from django.core.mail import send_mail

from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from datetime import datetime
import pdb

class ToolSerializer(DocumentSerializer):
	class Meta:
		model = Tool
		fields = '__all__'

class BcoObjectSerializer(DynamicDocumentSerializer):
	class Meta:
		model = BcoObject
		fields = '__all__'
		lookup_field = 'object_id'

	def create(self, validated_data):
		object_id = validated_data.pop('object_id')
		# check if object_id is valid
		# if not, create new one
		#
		if check_object_id(object_id):
			object_id = new_object_id();
		# create checksum
		#
		validated_data['object_id'] = object_id
		data = hashed_object(validated_data)
		if not checksum_valid(data['etag']):
			raise origin_serializers.ValidationError('Object is already existed')

		bco = BcoObject(**data)
		bco.save()
		return bco

	def update(self, instance, validated_data):
		object_id = validated_data.pop('object_id')
		if not check_object_id(object_id):
			object_id = new_object_id();

		validated_data['object_id'] = object_id
		data = hashed_object(validated_data)

		[setattr(instance, k, v) for k, v in data.items()]
		instance.save()
		return instance

class UserProfileSerializer(origin_serializers.ModelSerializer):
	class Meta:
		model = UserProfile
		fields = ('phone_number', 'address', 'city', 'state', 'picture', 'orcid')

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
		instance.first_name = validated_data.get('first_name', instance.first_name)
		instance.last_name = validated_data.get('last_name', instance.last_name)
		instance.save()

		profile.first_name = validated_data.get('first_name', profile.first_name)
		profile.last_name = validated_data.get('last_name', profile.last_name)
		profile.phone_number = profile_data.get('phone_number', profile.phone_number)
		profile.address = profile_data.get('address', profile.address)
		profile.city = profile_data.get('city', profile.city)
		profile.state = profile_data.get('state', profile.state)
		profile.picture = profile_data.get('picture', profile.picture)
		profile.orcid = profile_data.get('orcid', profile.orcid)
		profile.save()

		return instance

class RegisterSerializer(origin_serializers.Serializer):
	email = origin_serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
	first_name = origin_serializers.CharField(required=True, write_only=True)
	last_name = origin_serializers.CharField(required=True, write_only=True)
	password1 = origin_serializers.CharField(required=True, write_only=True)
	password2 = origin_serializers.CharField(required=True, write_only=True)

	def validate_email(self, email):
		email = get_adapter().clean_email(email)
		if allauth_settings.UNIQUE_EMAIL:
			if email and email_address_exists(email):
				raise origin_serializers.ValidationError("A user is already registered with this e-mail address.")
		return email

	def validate_password1(self, password):
		return get_adapter().clean_password(password)

	def validate(self, data):
		if data['password1'] != data['password2']:
			raise origin_serializers.ValidationError("The two password fields didn't match.")
		return data

	def get_cleaned_data(self):
		return {
			'first_name': self.validated_data.get('first_name', ''),
			'last_name': self.validated_data.get('last_name', ''),
			'password1': self.validated_data.get('password1', ''),
			'email': self.validated_data.get('email', ''),
		}

	def save(self, request):
		adapter = get_adapter()
		user = adapter.new_user(request)
		self.cleaned_data = self.get_cleaned_data()
		adapter.save_user(request, user, self)
		setup_user_email(request, user, [])

		self.cleaned_data.pop('password1')
		self.cleaned_data.pop('email')

		profile = UserProfile.objects.create(user=user, **self.cleaned_data)

		admins = User.objects.filter(is_superuser=True)
		admin_emails = [x.email for x in admins]
		now = datetime.now()
		template = 'User with user name: {} and email address: {} applied for an account on {}.'.format(profile.first_name + ' ' + profile.last_name, user.email, now.strftime("%m/%d/%Y, %H:%M:%S"))
		try:
			send_mail(
				'New User Registration',
				template,
				'mail_sender@portal.aws.biochemistry.gwu.edu',
				admin_emails,
				fail_silently=False,
			)
		except Exception as e:
			print(e)
			pass

		# user.profile.save()
		return user

UserModel = get_user_model()
class LoginSerializer(serializers.Serializer):
	username = serializers.CharField(required=False, allow_blank=True)
	email = serializers.EmailField(required=False, allow_blank=True)
	password = serializers.CharField(style={'input_type': 'password'})

	def authenticate(self, **kwargs):
		return authenticate(self.context['request'], **kwargs)

	def _validate_email(self, email, password):
		user = None

		if email and password:
			user = self.authenticate(email=email, password=password)
		else:
			msg = 'Must include "email" and "password".'
			raise exceptions.ValidationError(msg)

		return user

	def _validate_username(self, username, password):
		user = None

		if username and password:
			user = self.authenticate(username=username, password=password)
		else:
			msg = 'Must include "username" and "password".'
			raise exceptions.ValidationError(msg)

		return user

	def _validate_username_email(self, username, email, password):
		user = None

		if email and password:
			user = self.authenticate(email=email, password=password)
		elif username and password:
			user = self.authenticate(username=username, password=password)
		else:
			msg = 'Must include either "username" or "email" and "password".'
			raise exceptions.ValidationError(msg)

		return user

	def validate(self, attrs):
		username = attrs.get('username')
		email = attrs.get('email')
		password = attrs.get('password')

		user = None

		if 'allauth' in settings.INSTALLED_APPS:
			from allauth.account import app_settings

			# Authentication through email
			if app_settings.AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.EMAIL:
				user = self._validate_email(email, password)

			# Authentication through username
			elif app_settings.AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.USERNAME:
				user = self._validate_username(username, password)

			# Authentication through either username or email
			else:
				user = self._validate_username_email(username, email, password)

		else:
			# Authentication without using allauth
			if email:
				try:
					username = UserModel.objects.get(email__iexact=email).get_username()
				except UserModel.DoesNotExist:
					pass

			if username:
				user = self._validate_username_email(username, '', password)

		# Did we get back an active user?
		if user:
			if not user.is_active:
				msg = 'User account is disabled.'
				raise exceptions.ValidationError(msg)
		else:
			msg = 'Unable to log in with provided credentials.'
			raise exceptions.ValidationError(msg)

		# If required, is the email verified?
		if 'rest_auth.registration' in settings.INSTALLED_APPS:
			from allauth.account import app_settings
			if app_settings.EMAIL_VERIFICATION == app_settings.EmailVerificationMethod.MANDATORY:
				email_address = user.emailaddress_set.get(email=user.email)
				if not email_address.verified:
					raise serializers.ValidationError('E-mail is not verified.')

		if not user.is_active:
			raise serializers.ValidationError('User is not active. Please contact Admin.')

		attrs['user'] = user
		return attrs
