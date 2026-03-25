/* ===========================================
   Checkout Flow — checkout.html + choosePayment.html
   =========================================== */
$(document).ready(function () {
    const imgBase = '../../public/images/products/';

    // ========================================================================
    // Checkout Page (checkout.html)
    // ========================================================================
    const $checkoutItems = $('#checkout-items');
    if ($checkoutItems.length) {
        const cart = CartManager.getCart();

        if (cart.length === 0) {
            window.location.href = '/cart';
            return;
        }

        // Render order summary
        let itemsHtml = '';
        $.each(cart, function (i, item) {
            const lineTotal = (item.product_price * item.quantity).toFixed(2);
            itemsHtml +=
                '<div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">' +
                '  <img src="' + imgBase + item.product_image + '" class="rounded-3" width="60" height="80" style="object-fit:cover;" alt="' + item.product_name + '">' +
                '  <div class="flex-grow-1">' +
                '    <h6 class="fw-bold mb-0">' + item.product_name + '</h6>' +
                '    <small class="text-muted">' + item.format + ' x ' + item.quantity + '</small>' +
                '  </div>' +
                '  <span class="fw-bold">$' + lineTotal + '</span>' +
                '</div>';
        });
        $checkoutItems.html(itemsHtml);

        // Show total
        $('#checkout-total').text(CartManager.getCartTotal().toFixed(2));

        // Load addresses
        const addresses = JSON.parse(localStorage.getItem('inwza_addresses')) || [
            { address_id: 1, label: 'Home', full_name: 'John Smith', phone: '+66 812 345 678', address_line: '123 Sukhumvit Road', city: 'Bangkok', province: 'Bangkok', postal_code: '10110', is_default: true },
            { address_id: 2, label: 'Work', full_name: 'John Smith', phone: '+66 891 234 567', address_line: '456 Silom Tower, Floor 15', city: 'Bangkok', province: 'Bangkok', postal_code: '10500', is_default: false }
        ];
        // Save default addresses if not saved yet
        if (!localStorage.getItem('inwza_addresses')) {
            localStorage.setItem('inwza_addresses', JSON.stringify(addresses));
        }

        const $addressList = $('#checkout-address');
        if ($addressList.length) {
            let addrHtml = '';
            $.each(addresses, function (i, addr) {
                const checked = addr.is_default ? ' checked' : '';
                addrHtml +=
                    '<div class="form-check mb-3 p-3 border rounded-3">' +
                    '  <input class="form-check-input" type="radio" name="shipping-address" id="addr-' + addr.address_id + '" value="' + addr.address_id + '"' + checked + '>' +
                    '  <label class="form-check-label w-100" for="addr-' + addr.address_id + '">' +
                    '    <strong>' + addr.label + '</strong> — ' + addr.full_name + '<br>' +
                    '    <small class="text-muted">' + addr.address_line + ', ' + addr.city + ' ' + addr.postal_code + '</small>' +
                    '  </label>' +
                    '</div>';
            });
            $addressList.html(addrHtml);
        }

        // Continue to payment
        $('#btn-continue-payment').on('click', function () {
            const selectedAddr = $('input[name="shipping-address"]:checked').val();
            if (selectedAddr) {
                sessionStorage.setItem('inwza_selected_address', selectedAddr);
            }
            window.location.href = '/choosePayment';
        });
    }

    // ========================================================================
    // Choose Payment Page (choosePayment.html)
    // ========================================================================
    const $paymentTotal = $('#payment-total');
    if ($paymentTotal.length) {
        $paymentTotal.text(CartManager.getCartTotal().toFixed(2));

        // Payment method tabs
        $('.tab-btn').on('click', function () {
            $('.tab-btn').removeClass('active');
            $(this).addClass('active');
        });

        // Confirm order
        $('#btn-confirm-order').on('click', function () {
            const cart = CartManager.getCart();
            if (cart.length === 0) return;

            const paymentMethod = $('.tab-btn.active').text().trim() || 'Credit Card';
            const addrId = parseInt(sessionStorage.getItem('inwza_selected_address')) || 1;
            const addresses = JSON.parse(localStorage.getItem('inwza_addresses')) || [];
            const address = addresses.find(function (a) { return a.address_id === addrId; }) || addresses[0] || {};

            // Create order
            const order = {
                order_id: Date.now(),
                created_at: new Date().toISOString(),
                total_price: CartManager.getCartTotal(),
                status: 'completed',
                payment_method: paymentMethod,
                address: address,
                items: cart.map(function (item) {
                    return {
                        product_id: item.product_id,
                        product_name: item.product_name,
                        quantity: item.quantity,
                        unit_price: item.product_price,
                        format: item.format,
                        product_image: item.product_image
                    };
                })
            };

            // Save to order history
            const orders = JSON.parse(localStorage.getItem('inwza_orders')) || [];
            orders.unshift(order);
            localStorage.setItem('inwza_orders', JSON.stringify(orders));

            // Clear cart
            CartManager.clearCart();
            sessionStorage.removeItem('inwza_selected_address');

            // Show success and redirect
            alert('Order placed successfully! Thank you for your purchase.');
            window.location.href = '/account';
        });
    }
});
