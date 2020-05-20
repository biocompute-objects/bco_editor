from django.shortcuts import render
from bco_be.models import *
from bco_be.serializers import *
from bco_be.utils import *
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework_mongoengine import viewsets as meviewsets
from rest_framework.views import APIView
from dateutil.parser import parse
from rest_auth.registration.views import RegisterView
from rest_framework.parsers import FileUploadParser
from django.contrib.sites.shortcuts import get_current_site
import pdb
import datetime
import string
import random

def random_generator(size=20, chars=string.ascii_uppercase + string.digits):
	return ''.join(random.choice(chars) for x in range(size))

class FileUploadView(APIView):
	parser_class = (FileUploadParser,)

	def post(self, request, format=None):
		if 'file' not in request.data:
			raise ParseError("Empty content")

		up_file = request.data['file']
		path = 'media/' + random_generator() + up_file.name
		destination = open(path, 'wb+')
		for chunk in up_file.chunks():
			destination.write(chunk)
		destination.close()
		print(request.get_host())
		return Response("{0}://{1}{2}".format(request.scheme, request.get_host(), '/' + path), status.HTTP_201_CREATED)

class ToolViewSet(meviewsets.ModelViewSet):
	lookup_field = 'id'
	queryset = Tool.objects.all()
	serializer_class = ToolSerializer

class BcoObjectViewSet(meviewsets.ModelViewSet):
	authentication_classes = (TokenAuthentication, )
	permission_classes = [IsAuthenticated]
	lookup_field = 'object_id'
	queryset = BcoObject.objects.all()
	serializer_class = BcoObjectSerializer

	def get_object(self):
		object_id = self.kwargs.get('object_id')
		# object_id = revise_object_id('/' + object_id)
		object_id = 'http://portal.aws.biochemistry.gwu.edu/bco/' + object_id
		return self.queryset.get(object_id=object_id)

	def check_bco_embrago(self, provenance_domain, email):
		if "embargo" in provenance_domain:
			if "start_time" in provenance_domain["embargo"] and "end_time" in provenance_domain["embargo"]:

				for o in provenance_domain["contributors"]:
					if 'createdBy' in o['contribution'] and email == o['email']:
						return True

				start_time = provenance_domain["embargo"]["start_time"]
				end_time = provenance_domain["embargo"]["end_time"]

				if start_time and end_time:
					now = datetime.datetime.now()
					start_time = parse(start_time, ignoretz=True)
					end_time = parse(end_time, ignoretz=True)
					if start_time < now and end_time > now:
						return True
					else:
						return False
			
		return True

	def list(self, request):
		user = request.user
		all_bcos = BcoObject.objects.all()
		result = []

		for bco in all_bcos:
			provenance_domain = bco['provenance_domain']
			if self.check_bco_embrago(provenance_domain, user.email):
				result.append(self.get_serializer(bco).data)

		return Response(result)

	def retrieve(self, request, object_id, format=None):
		bco = self.get_object()
		provenance_domain = bco['provenance_domain']
		if self.check_bco_embrago(provenance_domain, request.user.email):
			serializer = BcoObjectSerializer(bco)
			return Response(serializer.data)
		else:
			return Response({}, status=status.HTTP_404_NOT_FOUND)

	@action(detail=False)
	def new_id(self, request):
		object_id = new_object_id();
		return Response({ 'object_id': object_id })


class UserViewSet(viewsets.ModelViewSet):
	authentication_classes = (TokenAuthentication, )
	
	queryset = User.objects.all()
	serializer_class = UserSerializer

	def get_permissions(self):
		permission_classes = []
		if self.action == 'forgot_password':
			permission_classes = [AllowAny]
		else:
			permission_classes = [IsAuthenticated]		
		return [permission() for permission in permission_classes]

	@action(detail=False)
	def detail_info(self, request, pk=None, **kwargs):
		serializer = self.get_serializer(request.user)
		return Response(serializer.data)

	@action(detail=False, methods=['post'])
	def change_password(self, request, pk=None, **kwargs):
		password = request.POST.get('password', '')
		user = request.user
		user.set_password(password)
		user.save()
		return Response(True)

	@action(detail=False, methods=['post'])
	def forgot_password(self, request, pk=None, **kwargs):
		email = request.data.get('email', '')
		user = User.objects.get(email=email)
		if user is not None:
			# send email to admin
			try:
				admins = User.objects.filter(is_superuser=True)
				admin_emails = [x.email for x in admins]
				now = datetime.datetime.now()
				template = 'User with user name: {} and email address: {} would like to forgot password {}.'.format(user.first_name + ' ' + user.last_name, user.email, now.strftime("%m/%d/%Y, %H:%M:%S"))
				try:
					send_mail(
					    'Forgot Password Request',
					    template,
					    'support@openbox.com',
					    admin_emails,
					    fail_silently=False,
					)
				except Exception as e:
					print(e)
					pass
				return Response(status=status.HTTP_202_ACCEPTED)
			except Exception as e:
				print(e)
				return Response(status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response(status=status.HTTP_404_NOT_FOUND)

class CustomRegisterView(RegisterView):
	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = self.perform_create(serializer)
		user.is_active = False
		user.save()
		headers = self.get_success_headers(serializer.data)

		return Response(self.get_response_data(user),
						status=status.HTTP_201_CREATED,
						headers=headers)
