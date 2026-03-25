// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== MENU TOGGLE FUNCTIONALITY ====================
    let menu = document.querySelector('#menu-btn');
    let navbar = document.querySelector('.header .navbar');
    
    if (menu && navbar) {
        menu.onclick = () => {
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        };
    }
    
    // ==================== CLOSE MENU ON SCROLL ====================
    window.onscroll = () => {
        if (menu && navbar) {
            menu.classList.remove('fa-times');
            navbar.classList.remove('active');
        }
        // Close login form if it exists
        let loginForm = document.querySelector('.login-form-container');
        if (loginForm) {
            loginForm.classList.remove('active');
        }
        // Close search form on scroll
        let searchForm = document.querySelector('.search-form');
        if (searchForm && searchForm.classList.contains('active')) {
            searchForm.classList.remove('active');
        }
    };
    
    // ==================== THEME TOGGLE (DARK/LIGHT MODE) ====================
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                themeBtn.classList.remove('fa-moon');
                themeBtn.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeBtn.classList.remove('fa-sun');
                themeBtn.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Check for saved theme preference
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeBtn.classList.remove('fa-moon');
            themeBtn.classList.add('fa-sun');
        }
    }
    
    // ==================== SEARCH FUNCTIONALITY ====================
    const searchBtn = document.getElementById('search-btn');
    const searchForm = document.querySelector('.search-form');
    const closeSearch = document.getElementById('close-search');
    const searchSubmit = document.getElementById('search-submit');
    const searchBox = document.getElementById('search-box');
    
    if (searchBtn && searchForm) {
        searchBtn.addEventListener('click', () => {
            searchForm.classList.add('active');
        });
    }
    
    if (closeSearch && searchForm) {
        closeSearch.addEventListener('click', () => {
            searchForm.classList.remove('active');
        });
    }
    
    if (searchSubmit && searchBox) {
        searchSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            const query = searchBox.value.toLowerCase().trim();
            if (query) {
                showNotification(`Searching for "${query}"...`);
                searchBox.value = '';
                searchForm.classList.remove('active');
                // You can add actual search functionality here
                console.log(`Search query: ${query}`);
            } else {
                showNotification('Please enter a search term');
            }
        });
        
        searchBox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchBox.value.toLowerCase().trim();
                if (query) {
                    showNotification(`Searching for "${query}"...`);
                    searchBox.value = '';
                    searchForm.classList.remove('active');
                } else {
                    showNotification('Please enter a search term');
                }
            }
        });
    }
    
    // ==================== CART FUNCTIONALITY ====================
    let cart = JSON.parse(localStorage.getItem('tourCart')) || [];
    
    // Update cart UI
    function updateCartUI() {
        const container = document.getElementById('cart-items-list');
        const totalEl = document.getElementById('cart-total');
        
        if (!container) return;
        
        if (cart.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #777;">Your cart is empty</p>';
            if (totalEl) totalEl.innerText = 'Total: NPR 0';
            return;
        }
        
        let total = 0;
        container.innerHTML = '';
        
        cart.forEach((item, idx) => {
            total += item.price * item.qty;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small>NPR ${item.price} x ${item.qty}</small>
                </div>
                <div>
                    <span style="color: var(--main-color); font-weight: bold;">NPR ${item.price * item.qty}</span>
                    <i class="fas fa-trash remove-item" data-idx="${idx}" style="cursor: pointer; color: #ff4757; margin-left: 1rem;"></i>
                </div>
            `;
            container.appendChild(div);
        });
        
        if (totalEl) totalEl.innerText = `Total: NPR ${total}`;
        localStorage.setItem('tourCart', JSON.stringify(cart));
        
        // Add remove functionality to new remove buttons
        document.querySelectorAll('.remove-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.idx);
                cart.splice(idx, 1);
                updateCartUI();
                showNotification('Item removed from cart');
            });
        });
    }
    
    // Add to cart function
    function addToCart(name, price) {
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.qty++;
            showNotification(`${name} quantity updated to ${existing.qty}`);
        } else {
            cart.push({ name, price, qty: 1 });
            showNotification(`${name} added to cart!`);
        }
        updateCartUI();
        
        // Animate cart icon
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    // Cart sidebar toggle
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            updateCartUI();
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
    
    // Checkout functionality
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
            } else {
                showModal('Checkout', `Order placed successfully!\nTotal: NPR ${cart.reduce((sum, item) => sum + (item.price * item.qty), 0)}\nThank you for shopping with us!`);
                cart = [];
                updateCartUI();
                cartSidebar.classList.remove('active');
            }
        });
    }
    
    // Add to cart buttons for shop items
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));
            addToCart(name, price);
        });
    });
    
    // ==================== SWIPER SLIDERS ====================
    
    // Home Slider
    var homeSwiper = new Swiper(".home-slider", {
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        speed: 800,
        effect: 'slide',
    });
    
    // Product Slider - Shows 4 items by default
    var productSwiper = new Swiper(".product-slider", {
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 25,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        },
    });
    
    // Reviews Slider - Shows 4 reviews by default
    var reviewsSwiper = new Swiper(".review-slider", {
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 15,
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 25,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        },
    });
    
    // ==================== PACKAGE LOAD MORE FUNCTIONALITY ====================
    let loadMoreBtn = document.querySelector('.packages .load-more .btn');
    if (loadMoreBtn) {
        let currentItem = 6;
        let boxes = document.querySelectorAll('.packages .box-container .box');
        
        // Initially hide boxes beyond first 6
        for (let i = currentItem; i < boxes.length; i++) {
            boxes[i].style.display = 'none';
        }
        
        loadMoreBtn.onclick = () => {
            for (let i = currentItem; i < currentItem + 3 && i < boxes.length; i++) {
                boxes[i].style.display = 'block';
                boxes[i].style.animation = 'fadeIn 0.5s ease';
            }
            currentItem += 3;
            if (currentItem >= boxes.length) {
                loadMoreBtn.style.display = 'none';
            }
        };
    }
    
    // ==================== PACKAGE BUTTONS ====================
    const packageBtns = document.querySelectorAll('.package-btn');
    packageBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const packageName = btn.getAttribute('data-pkg');
            showModal('Package Booking', `You selected ${packageName} package!\n\nOur travel expert will contact you within 24 hours with details and special offers.`);
        });
    });
    
    // ==================== CATEGORY BUTTONS ====================
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const activityName = btn.getAttribute('data-name');
            showModal('Adventure Activity', `${activityName} in Nepal!\n\nCheck your email for detailed information, pricing, and availability.`);
        });
    });
    
    // ==================== ABOUT BUTTON ====================
    const aboutBtn = document.getElementById('about-btn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('About Tour Management System', 'We are Nepal\'s premier tour operator since 2010.\n\n✓ 5000+ Happy Travelers\n✓ 100+ Expert Guides\n✓ 50+ Unique Destinations\n✓ 24/7 Customer Support\n\nYour adventure starts here!');
        });
    }
    
    // ==================== SERVICE BUTTONS ====================
    const serviceBtns = document.querySelectorAll('.service-btn');
    serviceBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const service = btn.closest('.box').querySelector('h3').textContent;
            showModal('Our Service', `${service}\n\nWe provide professional ${service.toLowerCase()} with experienced staff to ensure you have the best experience possible. Contact us for more details!`);
        });
    });
    
    // ==================== NEWSLETTER SUBSCRIPTION ====================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('sub-email');
            const email = emailInput.value.trim();
            
            if (email && email.includes('@') && email.includes('.')) {
                showNotification(`Thanks for subscribing! We'll send updates to ${email}`);
                emailInput.value = '';
                // Store in localStorage
                let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
                }
            } else if (email) {
                showNotification('Please enter a valid email address');
            } else {
                showNotification('Please enter your email address');
            }
        });
    }
    
    // ==================== MODAL FUNCTIONALITY ====================
    const modal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const closeModal = document.getElementById('close-modal');
    
    function showModal(title, message) {
        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.textContent = message;
        if (modal) modal.classList.add('active');
    }
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // ==================== NOTIFICATION FUNCTIONALITY ====================
    let notificationTimeout;
    
    function showNotification(message, type = 'success') {
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Clear existing timeout
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }
        
        // Set color based on type
        const colors = {
            success: 'var(--main-color)',
            error: '#ff4757',
            info: '#3498db'
        };
        
        notification.style.backgroundColor = colors[type] || colors.success;
        notification.textContent = message;
        notification.style.display = 'block';
        
        notificationTimeout = setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
                notification.style.opacity = '1';
            }, 300);
        }, 3000);
    }
    
    // ==================== SMOOTH SCROLLING ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '' && href !== '#!') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu after clicking
                    if (navbar && navbar.classList.contains('active')) {
                        navbar.classList.remove('active');
                        if (menu) menu.classList.remove('fa-times');
                    }
                }
            }
        });
    });
    
    // ==================== PRODUCT QUICK VIEW (Optional) ====================
    const quickViewBtns = document.querySelectorAll('.quick-view');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.closest('.slide');
            const productName = product.querySelector('h3').textContent;
            const productPrice = product.querySelector('.price').textContent;
            showModal('Product Details', `${productName}\n${productPrice}\n\nHigh-quality trekking gear designed for comfort and durability. Perfect for all your adventure needs!`);
        });
    });
    
    // ==================== SHARE FUNCTIONALITY ====================
    const shareBtns = document.querySelectorAll('.share-product');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const product = btn.closest('.slide');
            const productName = product.querySelector('h3').textContent;
            const shareText = `Check out ${productName} at Tour Management System!`;
            
            try {
                if (navigator.share) {
                    await navigator.share({
                        title: 'Tour Management System',
                        text: shareText,
                        url: window.location.href
                    });
                    showNotification('Shared successfully!');
                } else {
                    await navigator.clipboard.writeText(shareText);
                    showNotification('Link copied to clipboard!');
                }
            } catch (err) {
                console.log('Error sharing:', err);
            }
        });
    });
    
    // ==================== ANIMATION ON SCROLL ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate sections on scroll
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // ==================== INITIAL CART UPDATE ====================
    updateCartUI();
    
    // ==================== CONSOLE LOG FOR DEBUGGING ====================
    console.log('Tour Management System initialized successfully!');
    console.log(`Cart contains: ${cart.length} item(s)`);
});