"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.urls import path, include
from django.views import defaults
from accounts.views import CustomSignupView
from allauth.headless.constants import Client

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/email/", defaults.page_not_found, kwargs={"exception": Exception("Page not Found")},),
    path("accounts/", include("allauth.urls")),
    path('accounts/', include('accounts.urls')),
    path(
        "_allauth/browser/v1/auth/signup",
        CustomSignupView.as_api_view(client=Client.BROWSER),
    ),
    path("_allauth/", include("allauth.headless.urls")),
    path('api/', include('api.urls')),  
]