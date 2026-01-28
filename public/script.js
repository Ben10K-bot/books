let currentLang = 'en';
let books = [];
let selectedBook = null;

const translations = {
    en: {
        introTitle: "Your Gateway to Knowledge",
        introText: "Welcome to Booka, a curated collection of world-class literature. Whether you're looking for timeless classics or modern masterpieces, we connect you directly with the books you love.",
        exploreBtn: "Explore Collection",
        searchPlaceholder: "Search books or authors...",
        devText: "Developed by:",
        contactText: "Direct Purchase via WhatsApp",
        buyBtn: "Buy Now",
        modalTitle: "Complete Your Purchase",
        modalDesc: "Choose a developer to finalize your order via WhatsApp:",
        langBtn: "العربية",
        price: "Price: ",
        currency: "SAR"
    },
    ar: {
        introTitle: "بوابتك إلى المعرفة",
        introText: "مرحباً بكم في بوكا، مجموعة مختارة من الأدب العالمي. سواء كنت تبحث عن الكلاسيكيات الخالدة أو الروائع الحديثة، فنحن نصلك مباشرة بالكتب التي تحبها.",
        exploreBtn: "استكشف المجموعة",
        searchPlaceholder: "ابحث عن الكتب أو المؤلفين...",
        devText: "تم التطوير بواسطة:",
        contactText: "الشراء المباشر عبر واتساب",
        buyBtn: "اشتري الآن",
        modalTitle: "أكمل عملية الشراء",
        modalDesc: "اختر مطوراً لإتمام طلبك عبر واتساب:",
        langBtn: "English",
        price: "السعر: ",
        currency: "ر.س"
    }
};

// DOM Elements
const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const modal = document.getElementById('purchase-modal');
const closeModal = document.querySelector('.close');

// Fetch Books
async function fetchBooks() {
    try {
        const response = await fetch('/api/books');
        books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Render Books
function renderBooks(booksToRender) {
    bookList.innerHTML = '';
    if (booksToRender.length === 0) {
        bookList.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">${currentLang === 'en' ? 'No books found.' : 'لم يتم العثور على كتب.'}</p>`;
        return;
    }

    booksToRender.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        const title = currentLang === 'en' ? book.title_en : book.title_ar;
        const author = currentLang === 'en' ? book.author_en : book.author_ar;
        const desc = currentLang === 'en' ? book.description_en : book.description_ar;
        const priceLabel = translations[currentLang].price;
        const currency = translations[currentLang].currency;

        card.innerHTML = `
            <img src="${book.image}" alt="${title}" loading="lazy">
            <div class="book-info">
                <h3>${title}</h3>
                <p class="author">${author}</p>
                <p class="description">${desc}</p>
                <p class="price">${priceLabel} ${book.price} ${currency}</p>
                <button class="buy-btn" onclick="openPurchaseModal(${book.id})">
                    <i class="fab fa-whatsapp"></i> ${translations[currentLang].buyBtn}
                </button>
            </div>
        `;
        bookList.appendChild(card);
    });
}

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = books.filter(book => {
        return book.title_en.toLowerCase().includes(term) || 
               book.title_ar.includes(term) || 
               book.author_en.toLowerCase().includes(term) || 
               book.author_ar.includes(term);
    });
    renderBooks(filtered);
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Language Toggle
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', currentLang);
    updateUI();
    renderBooks(books);
});

function updateUI() {
    const t = translations[currentLang];
    document.getElementById('intro-title').textContent = t.introTitle;
    document.getElementById('intro-text').textContent = t.introText;
    document.getElementById('explore-btn').textContent = t.exploreBtn;
    document.getElementById('search-input').placeholder = t.searchPlaceholder;
    document.getElementById('dev-text').textContent = t.devText;
    document.getElementById('contact-text').textContent = t.contactText;
    document.getElementById('modal-title').textContent = t.modalTitle;
    document.getElementById('modal-desc').textContent = t.modalDesc;
    langToggle.textContent = t.langBtn;
}

// Modal Logic
function openPurchaseModal(bookId) {
    selectedBook = books.find(b => b.id === bookId);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closePurchaseModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

closeModal.onclick = closePurchaseModal;
window.onclick = (event) => {
    if (event.target == modal) closePurchaseModal();
};

// WhatsApp Integration
document.getElementById('contact-fatma').onclick = () => sendWhatsApp('966543936890');
document.getElementById('contact-diala').onclick = () => sendWhatsApp('966500114875');

function sendWhatsApp(phone) {
    const bookName = currentLang === 'en' ? selectedBook.title_en : selectedBook.title_ar;
    const text = encodeURIComponent(`I am interested in "${bookName}" book and want to buy it`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    closePurchaseModal();
}

function init() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        currentLang = savedLang;
        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    }

    fetchBooks();
    updateUI();
}

init();
