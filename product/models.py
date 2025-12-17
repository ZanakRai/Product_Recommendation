from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    
    product_name=models.CharField(max_length=255)
    product_image=models.URLField(max_length=500)
    description=models.TextField()
    category=models.CharField(max_length=255)
    price=models.DecimalField(max_digits=10, decimal_places=2)
    created_at=models.DateTimeField(auto_now_add=True)
    