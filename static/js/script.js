// API Configuration
const API_BASE = 'http://localhost:8000/api';
let allProducts = [];
let currentProduct = null;
let currentPage = 1;
let totalPages = 1;
let hasNext = false;
let hasPrevious = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the home page or products page
    if (document.getElementById('featuredGrid')) {
        loadFeaturedProducts();
    } else if (document.getElementById('productsGrid')) {
        loadProductsPage();
        setupEventListeners();
    }
});

// Load Featured Products (Home Page)
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE}/products/?page=1`);
        const data = await response.json();
        displayFeaturedProducts(data.products.slice(0, 6));
    } catch (error) {
        console.error('Error loading featured products:', error);
        document.getElementById('featuredGrid').innerHTML = '<div class="loading">Failed to load products</div>';
    }
}

// Display Featured Products
function displayFeaturedProducts(products) {
    const grid = document.getElementById('featuredGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<div class="loading">No products found</div>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductDetail(${product.id})">
            <img src="${product.product_image}" alt="${product.product_name}" onerror="this.src='https://via.placeholder.com/250?text=No+Image'">
            <div class="product-card-content">
                <h3>${product.product_name}</h3>
                <p class="category">${product.category}</p>
                <p>${product.description.substring(0, 100)}...</p>
                <div class="product-card-footer">
                    <span class="product-price">Rs. ${parseFloat(product.price).toFixed(2)}</span>
                    <button class="btn btn-primary">View</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Products with Pagination
async function loadProductsPage() {
    try {
        const response = await fetch(`${API_BASE}/products/?page=1`);
        const data = await response.json();
        
        currentPage = data.current_page;
        totalPages = data.num_pages;
        hasNext = data.has_next;
        hasPrevious = data.has_previous;
        allProducts = data.products;
        
        displayProducts(data.products);
        loadCategories();
        displayPagination();
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = '<div class="loading">Failed to load products</div>';
    }
}

// Display Pagination Controls
function displayPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    let html = '<div class="pagination">';
    
    // Previous Button
    if (hasPrevious) {
        html += `<button class="btn-page" onclick="loadProductsPage(${currentPage - 1})">← Previous</button>`;
    } else {
        html += `<button class="btn-page" disabled>← Previous</button>`;
    }
    
    // Page Numbers (Show 1-10 initially, then dynamic range around current page)
    const maxPageDisplay = 10;
    let startPage = 1;
    let endPage = Math.min(maxPageDisplay, totalPages);
    
    // If current page is beyond page 10, adjust the range
    if (currentPage > maxPageDisplay) {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
        
        // Ensure we don't go beyond total pages
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, totalPages - 9);
        }
        
        // Show first page if not in range
        if (startPage > 1) {
            html += `<button class="btn-page" onclick="loadProductsPage(1)">1</button>`;
            if (startPage > 2) {
                html += `<span class="page-ellipsis">...</span>`;
            }
        }
    }
    
    // Display page numbers
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            html += `<button class="btn-page active">${i}</button>`;
        } else {
            html += `<button class="btn-page" onclick="loadProductsPage(${i})">${i}</button>`;
        }
    }
    
    // Show last page if not in range
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="page-ellipsis">...</span>`;
        }
        html += `<button class="btn-page" onclick="loadProductsPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next Button
    if (hasNext) {
        html += `<button class="btn-page" onclick="loadProductsPage(${currentPage + 1})">Next →</button>`;
    } else {
        html += `<button class="btn-page" disabled>Next →</button>`;
    }
    
    html += `<span class="page-info">Page ${currentPage} of ${totalPages}</span>`;
    html += '</div>';
    
    paginationContainer.innerHTML = html;
}

// Display Products
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<div class="loading">No products found</div>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductDetail(${product.id})">
            <img src="${product.product_image}" alt="${product.product_name}" onerror="this.src='https://via.placeholder.com/250?text=No+Image'">
            <div class="product-card-content">
                <h3>${product.product_name}</h3>
                <p class="category">${product.category}</p>
                <p>${product.description.substring(0, 100)}...</p>
                <div class="product-card-footer">
                    <span class="product-price">Rs. ${parseFloat(product.price).toFixed(2)}</span>
                    <button class="btn btn-primary">View</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Categories
function loadCategories() {
    const categories = [...new Set(allProducts.map(p => p.category))];
    const select = document.getElementById('categoryFilter');
    
    // Clear existing options except first one
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
}

// Filter Products (Client-side filtering on current page)
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value;

    const filtered = allProducts.filter(product => {
        const matchesSearch = product.product_name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    displayProducts(filtered);
}

// Open Product Detail
async function openProductDetail(productId) {
    try {
        const response = await fetch(`${API_BASE}/product/${productId}/`);
        const data = await response.json();
        currentProduct = data.product;

        // Update modal with product details
        document.getElementById('modalImage').src = data.product.product_image;
        document.getElementById('modalImage').onerror = function() {
            this.src = 'https://via.placeholder.com/500?text=No+Image';
        };
        document.getElementById('modalName').textContent = data.product.product_name;
        document.getElementById('modalCategory').textContent = data.product.category;
        document.getElementById('modalDescription').textContent = data.product.description;
        document.getElementById('modalPrice').textContent = `Rs. ${parseFloat(data.product.price).toFixed(2)}`;

        // Display similar products
        displaySimilarProducts(data.similar_products);

        // Show modal
        document.getElementById('productModal').classList.add('show');
    } catch (error) {
        console.error('Error loading product details:', error);
        alert('Failed to load product details');
    }
}

// Display Similar Products
function displaySimilarProducts(products) {
    const grid = document.getElementById('similarGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<p>No similar products found</p>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="similar-product-card" onclick="openProductDetail(${product.id})">
            <img src="${product.product_image}" alt="${product.product_name}" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">
            <div class="similar-product-card-content">
                <h4>${product.product_name.substring(0, 30)}...</h4>
                <p class="price">Rs. ${parseFloat(product.price).toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

// Close Modal
function closeModal() {
    document.getElementById('productModal').classList.remove('show');
}

// Add to Cart (Demo)
function addToCart() {
    if (currentProduct) {
        alert(`${currentProduct.product_name} added to cart!`);
    }
}

// Scroll to Products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
}
