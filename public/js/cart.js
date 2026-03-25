/* ===========================================
   Cart Manager — localStorage-based shopping cart
   =========================================== */
const CartManager = {
    STORAGE_KEY: 'inwza_cart',

    getCart: function () {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    },

    saveCart: function (cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    },

    addToCart: function (product_id, product_name, author, product_price, product_image, quantity, format) {
        const cart = this.getCart();
        const existing = cart.find(function (item) {
            return item.product_id === product_id && item.format === format;
        });
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                product_id: product_id,
                product_name: product_name,
                author: author,
                product_price: product_price,
                product_image: product_image,
                quantity: quantity,
                format: format
            });
        }
        this.saveCart(cart);
        this.updateBadge();
        showToast(product_name + ' added to cart!');
    },

    removeFromCart: function (index) {
        const cart = this.getCart();
        cart.splice(index, 1);
        this.saveCart(cart);
        this.updateBadge();
    },

    updateQuantity: function (index, newQty) {
        const cart = this.getCart();
        if (newQty < 1) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQty;
        }
        this.saveCart(cart);
        this.updateBadge();
    },

    clearCart: function () {
        this.saveCart([]);
        this.updateBadge();
    },

    getCartCount: function () {
        return this.getCart().reduce(function (sum, item) {
            return sum + item.quantity;
        }, 0);
    },

    getCartTotal: function () {
        return this.getCart().reduce(function (sum, item) {
            return sum + (item.product_price * item.quantity);
        }, 0);
    },

    updateBadge: function () {
        const count = this.getCartCount();
        $('.cart-badge').each(function () {
            if (count > 0) {
                $(this).text(count).show();
            } else {
                $(this).hide();
            }
        });
    }
};

window.CartManager = CartManager;

/* ===========================================
   Toast Notification Helper
   =========================================== */
function showToast(message, type) {
    type = type || 'success';
    let $container = $('#toast-container');
    if ($container.length === 0) {
        $('body').append('<div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:1100"></div>');
        $container = $('#toast-container');
    }
    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
    const html = '<div id="' + toastId + '" class="toast align-items-center text-white ' + bgClass + ' border-0" role="alert">' +
        '<div class="d-flex">' +
        '<div class="toast-body">' + message + '</div>' +
        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>' +
        '</div></div>';
    $container.append(html);
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    $(toastEl).on('hidden.bs.toast', function () {
        $(this).remove();
    });
}

window.showToast = showToast;

/* ===========================================
   Cart Page Rendering (only runs on cart.html)
   =========================================== */
$(document).ready(function () {
    const $cartContainer = $('#cart-items-container');
    const $emptyMsg = $('#empty-cart-msg');
    const $subtotal = $('#cart-subtotal');
    const $btnCheckout = $('#btn-checkout');
    const $orderSummary = $cartContainer.closest('.col-lg-8').find('.card').not('.cart-item');

    if ($cartContainer.length === 0) return; // Not on cart page

    function renderCart() {
        const cart = CartManager.getCart();
        $cartContainer.empty();

        if (cart.length === 0) {
            $emptyMsg.removeClass('d-none');
            $subtotal.text('0.00');
            $btnCheckout.addClass('disabled').text('Cart is empty');
            return;
        }

        $emptyMsg.addClass('d-none');
        $btnCheckout.removeClass('disabled').text('Proceed to checkout');

        const imgBase = '../../public/images/products/';

        $.each(cart, function (index, item) {
            const lineTotal = (item.product_price * item.quantity).toFixed(2);
            const html =
                '<div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 cart-item" data-index="' + index + '">' +
                '  <div class="row g-0">' +
                '    <div class="col-md-4">' +
                '      <img src="' + imgBase + item.product_image + '" class="img-fluid h-100 w-100" alt="' + item.product_name + '" style="object-fit: cover; min-height: 250px;">' +
                '    </div>' +
                '    <div class="col-md-8 p-4 d-flex flex-column">' +
                '      <div class="d-flex justify-content-between align-items-start mb-2">' +
                '        <h4 class="fw-bold mb-0">' + item.product_name + '</h4>' +
                '        <h5 class="fw-bold text-primary mb-0">$<span class="item-price">' + item.product_price.toFixed(2) + '</span></h5>' +
                '      </div>' +
                '      <p class="text-muted small mb-4">by ' + item.author + '</p>' +
                '      <div class="mb-3">' +
                '        <label class="form-label small fw-bold text-muted mb-1">Format</label>' +
                '        <span class="badge bg-light text-dark border">' + item.format + '</span>' +
                '      </div>' +
                '      <div class="mt-auto d-flex align-items-center justify-content-between">' +
                '        <div class="d-flex align-items-center gap-3">' +
                '          <div class="input-group input-group-sm w-auto">' +
                '            <button class="btn btn-light border btn-minus" type="button"><i class="bi bi-dash"></i></button>' +
                '            <input type="text" class="form-control text-center item-qty bg-white border" value="' + item.quantity + '" readonly style="max-width: 50px;">' +
                '            <button class="btn btn-light border btn-plus" type="button"><i class="bi bi-plus"></i></button>' +
                '          </div>' +
                '          <a href="#" class="text-danger small text-decoration-none ms-3 btn-remove"><i class="bi bi-trash"></i> Remove</a>' +
                '        </div>' +
                '        <div class="text-end">' +
                '          <span class="text-muted small">Total</span>' +
                '          <h5 class="fw-bold text-dark mb-0">$<span class="item-total">' + lineTotal + '</span></h5>' +
                '        </div>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>';
            $cartContainer.append(html);
        });

        updateSubtotal();
    }

    function updateSubtotal() {
        $subtotal.text(CartManager.getCartTotal().toFixed(2));
    }

    // Event delegation for quantity buttons
    $cartContainer.on('click', '.btn-plus', function () {
        const $item = $(this).closest('.cart-item');
        const index = $item.data('index');
        const cart = CartManager.getCart();
        CartManager.updateQuantity(index, cart[index].quantity + 1);
        renderCart();
    });

    $cartContainer.on('click', '.btn-minus', function () {
        const $item = $(this).closest('.cart-item');
        const index = $item.data('index');
        const cart = CartManager.getCart();
        if (cart[index].quantity > 1) {
            CartManager.updateQuantity(index, cart[index].quantity - 1);
        } else {
            CartManager.removeFromCart(index);
        }
        renderCart();
    });

    $cartContainer.on('click', '.btn-remove', function (e) {
        e.preventDefault();
        const $item = $(this).closest('.cart-item');
        const index = $item.data('index');
        CartManager.removeFromCart(index);
        renderCart();
    });

    // Checkout button
    $btnCheckout.on('click', function () {
        if (CartManager.getCart().length > 0) {
            window.location.href = '/checkout';
        }
    });

    renderCart();
});
