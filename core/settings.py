"""
Django settings for core project.

Generated by 'django-admin startproject' using Django 4.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import os
from datetime import timedelta
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-=utx##huq3!w+=hb-lc!saug)!%mbywwlp0l*q#l9wi4$kgj%u'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# 'bixtonlighting.com', 'main.bixtonlighting.com'
ALLOWED_HOSTS = ['bixtonlighting.com', 'main.bixtonlighting.com']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'django_cron',
    # 'rest_framework.authtoken',
    # 'rest_framework_swagger',
    'djoser',
    # data tables
    'users',
    'userdetails',
    'company_inventory',
    'company_invoice',
    'distributor_inventory',
    'distrubutor_salesref',
    'distrubutor_salesref_invoice',
    'distributor_invoice',
    'dealer_details',
    'primary_sales_area',
    'salesref_return',
    'not_buy_details',
    'sales_ref_leave',
    'item_category',
    'dealer_category',
    'manager_distributor',
    'sales_return',
    'system_settings',
    'inventory_history',
    'past_invoice_data',
    'exceutive_manager',
    'executive_distributor',
    # 'api',
    'api',
    'api.userdetailsapp',
    'api.companyInventory',
    'api.managerdistributors',
    'api.distributor',
    'api.companyInvoices',
    'api.dashboard',
    'api.distrubutorsalesrefs',
    'api.distributor_invoices',
    'api.dealers',
    'api.psa_api',
    'api.distrubutorsalesrefinvoices',
    'api.return_salesref',
    'api.notbuydetails',
    'api.salesrefleave',
    'api.itemcategory',
    'api.dealercategory',
    'api.salesreturn',
    'api.reports',
    'api.systemsettings',
    'api.pastinvdata',
    'api.user',
    'api.excutivemanager',
    'api.executivedistributor',

    # reports
    'api.reports.userreport',
    'api.reports.stockreport',
    'api.reports.dealerreport',
    'api.reports.salesreport',
    'api.reports.delevaryreport',
    'api.reports.marketreturnreport',
    'api.reports.salesreturnreport',
    'api.reports.pendingorderreport',
    'api.reports.paymentsreport',
    'api.reports.chequeinhandreport',
    'api.reports.marketcreditreport',
    'api.reports.nonbuyingreport',
    'api.reports.psareport',
    'api.reports.deleveredsalesreport',
    'api.reports.creditbillscollectionreport',
    'api.reports.collectionsheet',
    'api.reports.normalfocreport',
    'api.reports.totaloutstanding',
    'api.reports.dealerpattern',

    'api.reports.oldcreditbillsreport',


]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases


# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'bixtonlightingdb',
        'USER': 'doadmin',
        'PASSWORD': 'AVNS_GlClCnbEOaZm-02AQFW',
        'HOST': 'db-postgresql-blr1-42114-do-user-13856971-0.b.db.ondigitalocean.com',
        'PORT': '25060',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Colombo'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
STATICFIELS_DIRS = [
    os.path.join(BASE_DIR, "static")
]
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.UserAccount'

# cron job
CRON_CLASSES = [
    "inventory_history.cron.AutoCreateCronJob",
]

# Email Settings
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = '587'
EMAIL_HOST_USER = 'ebrandinginnovations@gmail.com'
EMAIL_HOST_PASSWORD = 'mwcbsfjsezgpcguo'
EMAIL_USE_TLS = True
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'


REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # 'DEFAULT_AUTHENTICATION_CLASSES': [
    #     'rest_framework.authentication.BasicAuthentication',
    #     'rest_framework.authentication.SessionAuthentication',
    # ]


}
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'UPDATE_LAST_LOGIN': True,
    'AUTH_HEADER_TYPES': ('JWT',),
}
DOMAIN = 'https://bixtonlighting.com'
SITE_NAME = 'Bixton Distribution Management System'
DJOSER = {
    'LOGIN_FIELD': 'user_name',
    'PASSWORD_RESET_CONFIRM_URL': True,
    'USER_CREATE_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_URL': 'reset/{uid}/{token}',
    # 'ACTIVATION_URL': 'activate/{uid}/{token}',
    # 'SEND_ACTIVATION_EMAIL': True,
    'SERIALIZERS': {
        'user_create': 'users.serializers.UserCreateSerializer',
        'user': 'users.serializers.UserCreateSerializer',
        'user_delete': 'djoser.serializers.UserDeleteSerializer',


    }
}
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://bixtonlighting.com:3000",
    "https://bixtonlighting.com:3000",
    "https://bixtonlighting.com",
    "http://bixtonlighting.com",
]
