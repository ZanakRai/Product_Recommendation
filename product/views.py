from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializer import ProductSerializer,UserRegistrationSerializer,LoginSerializer,UserSerializer
from .recommender import get_similar_products 
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated


# Frontend Views
@require_http_methods(["GET"])
def listproducts(request):
    
    return render(request, 'index.html')

@require_http_methods(["GET"])
def products_page(request):
    return render(request, 'products.html')

@require_http_methods(["GET"])
def about_page(request):
    return render(request, 'about.html')

@require_http_methods(["GET","POST"])
def login_page(request):
    return render(request, 'login.html')

@require_http_methods(["GET","POST"])
def register_page(request):
    return render(request, 'register.html')


class RegistrationView(APIView):
    def post(self, request):
        data = request.data
        serializer = UserRegistrationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Registration successful"}, status=201)
        return Response(serializer.errors, status=400)
    

class LoginView(APIView):
    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")

        serializer = LoginSerializer(data=data)
        if serializer.is_valid():
            user = authenticate(username=username, password=password)
            if user:
                token,_ = Token.objects.get_or_create(user=user)
                data = UserSerializer(user).data
                data['token'] = token.key
                data['message']= "Success"

                return Response(data)
            return Response({'message':"No user is found"})
        return Response(serializer.errors)






class ProductAPI(APIView):
    def get(self,request):
        page_number=request.GET.get('page',1)
        products=Product.objects.all().order_by("?")
        paginator=Paginator(products,10)
        page_obj=paginator.get_page(page_number)
        serializer=ProductSerializer(page_obj,many=True)
        
        return Response({
            "products":serializer.data,
            "has_next":page_obj.has_next(),
            "has_previous":page_obj.has_previous(),
            "num_pages":paginator.num_pages,
            "current_page":page_obj.number
        })
    
class ProductDetailAPI(APIView):
    def get(self,request,id):
        try:
            product=Product.objects.get(id=id)
            serializer=ProductSerializer(product)
            similar_products=get_similar_products(id,top_product=5)
            similar_serializer_product=ProductSerializer(similar_products,many=True)
            return Response({
                "product":serializer.data,
                "similar_products": similar_serializer_product.data
            })
        except Product.DoesNotExist:
            return Response({"error":"Product not found"},status=404)