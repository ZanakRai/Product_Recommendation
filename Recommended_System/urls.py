"""
URL configuration for Recommended_System project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path
from product.views import ProductAPI, ProductDetailAPI, listproducts, products_page, about_page,RegistrationView,LoginView,login_page,register_page

urlpatterns = [
    path('', listproducts, name='home'),
    path('products/', products_page, name='products'),
    path('about/', about_page, name='about'),
    path('admin/', admin.site.urls),
    path('api/products/', ProductAPI.as_view(), name='product-list'),
    path('api/product/<int:id>/', ProductDetailAPI.as_view(), name='product-detail'),
    path('api/register/',RegistrationView.as_view(),name='register_page'),
    path('api/login/',LoginView.as_view(),name='login_page'),
    path('login/', login_page,name='login'),
    path('register/',register_page,name='register')
]
