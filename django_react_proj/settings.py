"""
Django settings for django_react_proj project.

Generated by 'django-admin startproject' using Django 2.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'jg^$(lbjb*3-+cv(88ngpb4xb=6vbvxj*1i)%m!*c2(e_i6%b8'

# SECURITY WARNING: don't run with debug turned on in production!

ALLOWED_HOSTS = []

DEBUG = True

# Application definition

INSTALLED_APPS = [
    'bco_be',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'rest_auth',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'rest_auth.registration',
    'rest_framework_swagger'
]
SITE_ID = 1

MIDDLEWARE = [
    # 'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'bco_be.middleware.dev_cors_middleware'
]

CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = 'django_react_proj.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontend', 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_react_proj.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases
# mongodb+srv://dbadmin:dbpassword@cluster0-rdqzb.mongodb.net/test?retryWrites=true&w=majority

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        # 'NAME': 'test',
        'NAME': 'bcodb',
        'USER': '',
        'PASSWORD': '',
        # 'HOST': 'mongodb+srv://dbadmin:dbpassword@cluster0-rdqzb.mongodb.net/test?retryWrites=true&w=majority'
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

REST_FRAMEWORK = { 
    'UNAUTHENTICATED_USER': None,
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'EXCEPTION_HANDLER': 'bco_be.exception_handler.custom_exception_handler'
}

# rest auth custom serializer
REST_AUTH_SERIALIZERS = {
    'LOGIN_SERIALIZER': 'bco_be.serializers.LoginSerializer'
}

# rest auth registration custom serializer
REST_AUTH_REGISTER_SERIALIZERS = {
    'REGISTER_SERIALIZER': 'bco_be.serializers.RegisterSerializer',
    
}

# disable email verification
ACCOUNT_EMAIL_VERIFICATION = 'none'

AUTH_USER_MODEL = 'bco_be.User'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/
    
# REACT_APP_DIR = os.path.join(BASE_DIR, 'frontend')

# STATICFILES_DIRS = [
#     os.path.join(REACT_APP_DIR, 'build', 'static'),
# ]

STATIC_URL = '/assets/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
# print(STATIC_ROOT)

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

import mongoengine

# mongoengine.connect(
#     db='test',
#     host='mongodb+srv://dbadmin:dbpassword@cluster0-rdqzb.mongodb.net/test?retryWrites=true&w=majority'
# )

# mongodb+srv://dbadmin:dbpassword@cluster0-rdqzb.mongodb.net/test?retryWrites=true&w=majority

mongoengine.connect(
    db="bcodb",
    host="localhost"
)