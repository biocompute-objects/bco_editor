"""django_react_proj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf.urls import url
from rest_framework_swagger.views import get_swagger_view
from django.conf import settings
from django.conf.urls.static import static
# from . import views


schema_view = get_swagger_view(title='API')

# Necessary?  path('api/bco/<str:encoded_url>/', include('bco_be.urls')),

urlpatterns = [
    path('api/', include('bco_be.urls')),
    url(r'^explorer/$', schema_view),
    path('admin/', admin.site.urls),
    path(r'auth/', include('django.contrib.auth.urls')),
    # url(r'^', views.FrontendAppView.as_view())
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


admin.site.site_header = "Biocompute Administration"
admin.site.site_title = "BCO Admin Portal"
admin.site.index_title = "Welcome to BCO Admin Portal"
