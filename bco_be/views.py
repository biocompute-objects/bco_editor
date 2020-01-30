from django.shortcuts import render
from .models import *
from .serializers import *
from .utils import *
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework_mongoengine import viewsets as meviewsets
import pdb
import datetime
from dateutil.parser import parse

class ToolViewSet(meviewsets.ModelViewSet):
	lookup_field = 'id'
	queryset = Tool.objects.all()
	serializer_class = ToolSerializer

class BcoObjectViewSet(meviewsets.ModelViewSet):
	authentication_classes = (TokenAuthentication, )
	permission_classes = [IsAuthenticated]
	lookup_field = 'id'
	queryset = BcoObject.objects.all()
	serializer_class = BcoObjectSerializer

	def check_bco_embrago(self, provenance_domain, email):
		if "embargo" in provenance_domain:
			if "start_time" in provenance_domain["embargo"] and "end_time" in provenance_domain["embargo"]:

				for o in provenance_domain["contributors"]:
					if 'createdBy' in o['contribution'] and user.email == o['email']:
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

	def retrieve(self, request, id, format=None):
		bco = self.get_object()
		provenance_domain = bco['provenance_domain']
		if self.check_bco_embrago(provenance_domain, request.user.email):
			serializer = BcoObjectSerializer(bco)
			return Response(serializer.data)
		else:
			return Response({}, status=status.HTTP_404_NOT_FOUND)

	@action(detail=False)
	def new_id(self, request):
		bco_id = new_bco_id();
		return Response({ 'bco_id': bco_id })


class UserViewSet(viewsets.ModelViewSet):
	authentication_classes = (TokenAuthentication, )
	permission_classes = [IsAuthenticated]
	queryset = User.objects.all()
	serializer_class = UserSerializer

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