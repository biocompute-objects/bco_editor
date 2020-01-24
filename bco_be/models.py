from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import ugettext_lazy as _
from django.conf import settings

from mongoengine import Document, EmbeddedDocument, fields, DynamicDocument
from rest_framework_mongoengine.fields import *

class User(AbstractUser):
    username = models.CharField(blank=True, null=True, max_length=50)
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return "{}".format(self.email)


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    #other fields here
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255,blank=True, null=True,)
    address = models.CharField(max_length=255,blank=True, null=True,)
    city = models.CharField(max_length=255,blank=True, null=True,)
    state = models.CharField(max_length=255,blank=True, null=True,)
    picture = models.CharField(max_length=255,blank=True, null=True,)


    def __str__(self):
          return "%s's profile" % self.user

class ToolInput(EmbeddedDocument):
    name = fields.StringField(required=True)
    value = fields.DynamicField(required=True)

class Tool(Document):
    label = fields.StringField(required=True)
    description = fields.StringField(required=True, null=True)
    inputs = fields.ListField(fields.EmbeddedDocumentField(ToolInput))

class BcoObject(DynamicDocument):
	bco_object = GenericField(required=True)