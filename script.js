// بيانات المنتجات الافتراضية
const products = [
    {
        id: 1,
        name: "ساعة يد فاخرة",
        image: "https://i.imgur.com/jw5Jxhe.png",
        price: 480,
        desc: "ساعة يد بتصميم أنيق ومواد عالية الجودة مع ضمان سنتين."
    },
    {
        id: 2,
        name: "سماعات لاسلكية",
        image: "https://i.imgur.com/8zA6P4W.png",
        price: 210,
        desc: "سماعات عالية الدقة تدعم عزل الضوضاء وعمر بطارية طويل."
    },
    {
        id: 3,
        name: "حقيبة جلد أصلية",
        image: "https://i.imgur.com/1h4RwhC.png",
        price: 320,
        desc: "حقيبة يد جلدية فاخرة بتصميم كلاسيكي ومساحة واسعة."
    },
    {
        id: 4,
        name: "نظارة شمسية راقية",
        image: "https://i.imgur.com/EVQwYTx.png",
        price: 155,
        desc: "إطارات أ��يقة وعدسات مقاومة للأشعة الضارة مع تصميم عصري."
    }
];

// تحديث عداد السلة في جميع الصفحات
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || "[]");
    document.querySelectorAll('#cart-count').forEach(span => {
        span.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    });
}

// عرض المنتجات في الصفحة الرئيسية
function renderProducts() {
    const productsList = document.getElementById('products-list');
    if (productsList) {
        productsList.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.desc.slice(0, 50)}...</p>
                <div class="price">${product.price} ر.س</div>
                <button onclick="goToProduct(${product.id})">عرض التفاصيل</button>
            `;
            productsList.appendChild(card);
        });
    }
}

// الانتقال لصفحة تفاصيل المنتج
function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// عرض تفاصيل منتج محدد
function renderProductDetails() {
    const detailsDiv = document.getElementById('product-details');
    if (!detailsDiv) return;
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === id);
    if (!product) {
        detailsDiv.innerHTML = '<p>المنتج غير موجود.</p>';
        return;
    }
    detailsDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-details-content">
            <h2>${product.name}</h2>
            <div class="price">${product.price} ر.س</div>
            <p>${product.desc}</p>
            <button onclick="addToCart(${product.id})">أضف إلى السلة</button>
        </div>
    `;
}

// إضافة منتج للسلة
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += 1;
    } else {
        cart.push({ id, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('تمت إضافة المنتج إلى السلة!');
}

// عرض سلة المشتريات
function renderCart() {
    const cartSection = document.getElementById('cart-section');
    if (!cartSection) return;
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        cartSection.innerHTML = `<h2>سلة المشتريات</h2><p>سلتك فارغة.</p>`;
        return;
    }
    let html = `<h2>سلة المشتريات</h2>
        <table class="cart-table">
            <thead>
                <tr>
                    <th>المنتج</th>
                    <th>الكمية</th>
                    <th>السعر</th>
                    <th>الإجمالي</th>
                    <th>حذف</th>
                </tr>
            </thead>
            <tbody>
    `;
    let total = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        const subtotal = product.price * item.qty;
        total += subtotal;
        html += `
            <tr>
                <td>
                    <img src="${product.image}" alt="${product.name}">
                    <div>${product.name}</div>
                </td>
                <td>${item.qty}</td>
                <td>${product.price} ر.س</td>
                <td>${subtotal} ر.س</td>
                <td><button class="remove-btn" onclick="removeFromCart(${product.id})">حذف</button></td>
            </tr>
        `;
    });
    html += `</tbody></table>
        <div class="cart-total"><b>الإجمالي الكلي:</b> ${total} ر.س</div>
        <div class="cart-actions">
            <button onclick="checkout()">إتمام الشراء</button>
            <button onclick="clearCart()" style="background:#b23a3a;color:#fff;">تفريغ السلة</button>
        </div>
    `;
    cartSection.innerHTML = html;
}

// حذف منتج من السلة
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// تفريغ السلة
function clearCart() {
    if (confirm('هل أنت متأكد من تفريغ السلة؟')) {
        localStorage.removeItem('cart');
        renderCart();
        updateCartCount();
    }
}

// إتمام عملية الشراء (وهمية)
function checkout() {
    if (confirm('هل تريد إتمام عملية الشراء؟')) {
        localStorage.removeItem('cart');
        renderCart();
        updateCartCount();
        alert('تم استلام طلبك بنجاح! سيتم التواصل معك قريبًا.');
    }
}

// تهيئة الصفحة بناءً على نوعها
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('products-list')) renderProducts();
    if (document.getElementById('product-details')) renderProductDetails();
    if (document.getElementById('cart-section')) renderCart();
});
