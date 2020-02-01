from django.conf.urls import url
from django.urls import path,include
from rest_framework_mongoengine import routers as merouters
from rest_framework import routers
from .views import UserViewSet, BcoObjectViewSet, CustomRegisterView
 
router = routers.DefaultRouter()
router.register(r'user', UserViewSet)

merouter = merouters.DefaultRouter()
merouter.register(r'bco', BcoObjectViewSet)

urlpatterns = [
	path(r'', include(router.urls)),
	path(r'auth/', include('rest_auth.urls')),
	url(r'auth/signup/$', CustomRegisterView.as_view(), name='register_view'),
	url(r'auth/signup/', include('rest_auth.registration.urls'))
]
 
urlpatterns += merouter.urls