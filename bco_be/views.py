from django.shortcuts import render
from .models import *
from .serializers import *
from .utils import *
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework_mongoengine import viewsets as meviewsets

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