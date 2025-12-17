from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import Product

def get_similar_products(id,top_product=10):
    vectorizer=TfidfVectorizer(stop_words='english')
    product_description=Product.objects.all().values_list('description',flat=True)
    tfid_matrix=vectorizer.fit_transform(product_description)
    unique_product=Product.objects.get(id=id)
    all_products=list(Product.objects.all())
    unique_product_index=all_products.index(unique_product)
    cosine_similarity_scores=cosine_similarity(tfid_matrix[unique_product_index],tfid_matrix).flatten()
    similar_cosine_indices=cosine_similarity_scores.argsort()[-top_product-1:-1][::-1]
    similar_product=[i for i in similar_cosine_indices if i!=unique_product_index]
    recommended_products=[all_products[i] for i in similar_product]
    return recommended_products