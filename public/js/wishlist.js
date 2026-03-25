/* ===========================================
   Wishlist Manager — localStorage-based wishlist
   =========================================== */
const WishlistManager = {
    STORAGE_KEY: 'inwza_wishlist',

    getWishlist: function () {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    },

    saveWishlist: function (list) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    },

    toggleWishlist: function (product_id, product_name, author, product_price, product_image) {
        const list = this.getWishlist();
        const idx = list.findIndex(function (item) {
            return item.product_id === product_id;
        });
        if (idx > -1) {
            list.splice(idx, 1);
            this.saveWishlist(list);
            return false; // removed
        } else {
            list.push({
                product_id: product_id,
                product_name: product_name,
                author: author,
                product_price: product_price,
                product_image: product_image
            });
            this.saveWishlist(list);
            return true; // added
        }
    },

    isInWishlist: function (product_id) {
        return this.getWishlist().some(function (item) {
            return item.product_id === product_id;
        });
    },

    removeFromWishlist: function (product_id) {
        const list = this.getWishlist().filter(function (item) {
            return item.product_id !== product_id;
        });
        this.saveWishlist(list);
    },

    getWishlistCount: function () {
        return this.getWishlist().length;
    }
};

window.WishlistManager = WishlistManager;

/* ===========================================
   Wishlist Page Rendering (only runs on wishlist.html)
   =========================================== */
$(document).ready(function () {
    const $wishlistItems = $('#wishlist-items');
    if ($wishlistItems.length === 0) return; // Not on wishlist page

    function renderWishlist() {
        const list = WishlistManager.getWishlist();
        $wishlistItems.empty();

        // Update stat numbers
        $('.stat-number').first().text(list.length);

        if (list.length === 0) {
            $wishlistItems.html(
                '<div class="text-center py-5">' +
                '  <i class="bi bi-heart display-1 text-muted mb-3"></i>' +
                '  <h3 class="fw-bold">Your wishlist is empty</h3>' +
                '  <p class="text-muted">Browse our collection and save books you love.</p>' +
                '  <a href="/products" class="btn btn-primary rounded-pill px-4 mt-3">Browse Books</a>' +
                '</div>'
            );
            return;
        }

        const imgBase = '../../public/images/products/';
        let html = '<div class="row g-4">';

        $.each(list, function (i, item) {
            html +=
                '<div class="col-lg-3 col-md-4 col-sm-6">' +
                '  <div class="card border-0 h-100 bg-transparent text-center book-card-hover position-relative" data-product-id="' + item.product_id + '">' +
                '    <button class="btn btn-sm position-absolute top-0 end-0 m-2 btn-remove-wishlist" data-product-id="' + item.product_id + '" style="z-index:2;">' +
                '      <i class="bi bi-x-circle-fill text-danger fs-5"></i>' +
                '    </button>' +
                '    <a href="/product/' + item.product_id + '">' +
                '      <img src="' + imgBase + item.product_image + '" class="card-img-top rounded-4 shadow-sm mb-3" alt="' + item.product_name + '" style="height: 320px; object-fit: cover;">' +
                '    </a>' +
                '    <h6 class="fw-bold mb-1">' + item.product_name + '</h6>' +
                '    <p class="text-muted small mb-1">' + item.author + '</p>' +
                '    <p class="fw-bold mb-2">$' + item.product_price.toFixed(2) + '</p>' +
                '    <button class="btn btn-primary btn-sm rounded-pill px-3 btn-add-to-cart-from-wishlist" ' +
                '      data-product-id="' + item.product_id + '" data-name="' + item.product_name + '" data-author="' + item.author + '" ' +
                '      data-price="' + item.product_price + '" data-image="' + item.product_image + '">' +
                '      <i class="bi bi-cart-plus me-1"></i> Add to Cart' +
                '    </button>' +
                '  </div>' +
                '</div>';
        });

        html += '</div>';
        $wishlistItems.html(html);
    }

    // Remove from wishlist
    $wishlistItems.on('click', '.btn-remove-wishlist', function (e) {
        e.stopPropagation();
        const pid = $(this).data('product-id');
        WishlistManager.removeFromWishlist(pid);
        renderWishlist();
        showToast('Removed from wishlist');
    });

    // Add to cart from wishlist
    $wishlistItems.on('click', '.btn-add-to-cart-from-wishlist', function (e) {
        e.stopPropagation();
        const $btn = $(this);
        CartManager.addToCart(
            $btn.data('product-id'),
            $btn.data('name'),
            $btn.data('author'),
            parseFloat($btn.data('price')),
            $btn.data('image'),
            1,
            'Paperback'
        );
    });

    renderWishlist();
});
