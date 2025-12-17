from django.contrib import admin

# Register your models here.
from .models import Product
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'category', 'price', 'created_at')
    search_fields = ('product_name', 'category')
    list_filter = ('category', 'created_at')
admin.site.register(Product, ProductAdmin)