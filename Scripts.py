import django
import os
import csv

os.environ['DJANGO_SETTINGS_MODULE'] = 'Recommended_System.settings'
django.setup()
from product.models import Product
from django.contrib.auth.models import User


file="flipkart_com-ecommerce_sample.csv"

with open(file,mode='r',encoding='utf-8') as f:
    reader=csv.DictReader(f)

    for row in reader:
        product_name=row['product_name']
        product_image=eval(row['image'])[0]
        description=row['description']
        category=row['product_category_tree'].split('>>')[0].strip('["]')
        price=row["retail_price"]
        
        # Skip if price is empty or invalid
        if not price or price.strip() == '':
            continue
        
        try:
            price = float(price)
        except ValueError:
            continue

        

        Product.objects.create(
            product_name=product_name,
            product_image=product_image,
            description=description,
            category=category,
            price=price
        )

print("Data Imported Successfully")        