/* ===========================================
   Account Pages — Address Book, Order History, Profile
   =========================================== */
$(document).ready(function () {
    const imgBase = '../../public/images/products/';

    // ========================================================================
    // Address Book Page (addressBook.html)
    // ========================================================================
    const $addressList = $('#address-list');
    if ($addressList.length) {
        // Pre-seed mock addresses if first load
        if (!localStorage.getItem('inwza_addresses')) {
            localStorage.setItem('inwza_addresses', JSON.stringify([
                { address_id: 1, label: 'Home', full_name: 'John Smith', phone: '+66 812 345 678', address_line: '123 Sukhumvit Road', city: 'Bangkok', province: 'Bangkok', postal_code: '10110', is_default: true },
                { address_id: 2, label: 'Work', full_name: 'John Smith', phone: '+66 891 234 567', address_line: '456 Silom Tower, Floor 15', city: 'Bangkok', province: 'Bangkok', postal_code: '10500', is_default: false }
            ]));
        }

        function renderAddresses() {
            const addresses = JSON.parse(localStorage.getItem('inwza_addresses')) || [];
            $addressList.empty();

            $.each(addresses, function (i, addr) {
                const defaultBadge = addr.is_default ? '<span class="badge bg-primary rounded-pill ms-2">Default</span>' : '';
                const setDefaultBtn = addr.is_default ? '' :
                    '<button class="btn btn-sm btn-outline-primary rounded-pill btn-set-default" data-id="' + addr.address_id + '">Set Default</button>';

                $addressList.append(
                    '<div class="card border-0 shadow-sm rounded-4 p-4 mb-3">' +
                    '  <div class="d-flex justify-content-between align-items-start">' +
                    '    <div>' +
                    '      <h6 class="fw-bold mb-1">' + addr.label + defaultBadge + '</h6>' +
                    '      <p class="mb-1">' + addr.full_name + '</p>' +
                    '      <p class="text-muted small mb-1">' + addr.address_line + '</p>' +
                    '      <p class="text-muted small mb-1">' + addr.city + ', ' + addr.province + ' ' + addr.postal_code + '</p>' +
                    '      <p class="text-muted small mb-0">' + (addr.phone || '') + '</p>' +
                    '    </div>' +
                    '    <div class="d-flex gap-2">' +
                    '      ' + setDefaultBtn +
                    '      <button class="btn btn-sm btn-outline-dark rounded-pill btn-delete-address" data-id="' + addr.address_id + '"><i class="bi bi-trash"></i></button>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'
                );
            });
        }

        // Add new address
        $('#saveAddressBtn').on('click', function () {
            const addressVal = $('#addressInput').val().trim();
            if (!addressVal) {
                showToast('Please enter an address', 'error');
                return;
            }
            const addresses = JSON.parse(localStorage.getItem('inwza_addresses')) || [];
            const newAddr = {
                address_id: Date.now(),
                label: 'New Address',
                full_name: 'John Smith',
                phone: '',
                address_line: addressVal,
                city: 'Bangkok',
                province: 'Bangkok',
                postal_code: '10000',
                is_default: addresses.length === 0
            };
            addresses.push(newAddr);
            localStorage.setItem('inwza_addresses', JSON.stringify(addresses));
            $('#addressInput').val('');
            renderAddresses();
            showToast('Address added!');
        });

        // Delete address
        $addressList.on('click', '.btn-delete-address', function () {
            const id = $(this).data('id');
            let addresses = JSON.parse(localStorage.getItem('inwza_addresses')) || [];
            addresses = addresses.filter(function (a) { return a.address_id !== id; });
            localStorage.setItem('inwza_addresses', JSON.stringify(addresses));
            renderAddresses();
            showToast('Address deleted');
        });

        // Set default
        $addressList.on('click', '.btn-set-default', function () {
            const id = $(this).data('id');
            const addresses = JSON.parse(localStorage.getItem('inwza_addresses')) || [];
            $.each(addresses, function (i, a) {
                a.is_default = (a.address_id === id);
            });
            localStorage.setItem('inwza_addresses', JSON.stringify(addresses));
            renderAddresses();
            showToast('Default address updated');
        });

        renderAddresses();
    }

    // ========================================================================
    // Order History Page (orderHistory.html)
    // ========================================================================
    const $orderList = $('#order-list');
    if ($orderList.length) {
        // Merge localStorage orders + mock orders
        const userOrders = JSON.parse(localStorage.getItem('inwza_orders')) || [];
        const mockOrders = window.MOCK_ORDERS || [];
        const allOrders = userOrders.concat(mockOrders);

        if (allOrders.length === 0) {
            $orderList.html(
                '<div class="text-center py-5">' +
                '  <i class="bi bi-bag display-1 text-muted mb-3"></i>' +
                '  <h3 class="fw-bold">No orders yet</h3>' +
                '  <p class="text-muted">Start shopping to see your order history.</p>' +
                '  <a href="allProducts.html" class="btn btn-primary rounded-pill px-4 mt-3">Browse Books</a>' +
                '</div>'
            );
            return;
        }

        $.each(allOrders, function (i, order) {
            const date = new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const statusClass = order.status === 'completed' ? 'bg-success' : order.status === 'pending' ? 'bg-warning text-dark' : 'bg-danger';
            const collapseId = 'order-' + order.order_id;

            let itemsHtml = '';
            $.each(order.items || [], function (j, item) {
                itemsHtml +=
                    '<div class="d-flex align-items-center gap-3 mb-2">' +
                    '  <img src="' + imgBase + (item.product_image || 'fiction-01.png') + '" class="rounded" width="40" height="55" style="object-fit:cover;">' +
                    '  <div class="flex-grow-1">' +
                    '    <span class="fw-bold small">' + item.product_name + '</span><br>' +
                    '    <small class="text-muted">' + (item.format || 'Paperback') + ' x ' + item.quantity + '</small>' +
                    '  </div>' +
                    '  <span class="small fw-bold">$' + (item.unit_price * item.quantity).toFixed(2) + '</span>' +
                    '</div>';
            });

            $orderList.append(
                '<div class="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden">' +
                '  <div class="card-body p-4" style="cursor:pointer;" data-bs-toggle="collapse" data-bs-target="#' + collapseId + '">' +
                '    <div class="d-flex justify-content-between align-items-center">' +
                '      <div>' +
                '        <h6 class="fw-bold mb-1">Order #' + order.order_id + '</h6>' +
                '        <small class="text-muted">' + date + '</small>' +
                '      </div>' +
                '      <div class="text-end">' +
                '        <span class="badge ' + statusClass + ' rounded-pill mb-1">' + order.status + '</span><br>' +
                '        <span class="fw-bold">$' + order.total_price.toFixed(2) + '</span>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '  <div class="collapse" id="' + collapseId + '">' +
                '    <div class="card-body pt-0 px-4 pb-4 border-top">' +
                '      <p class="small text-muted mt-3 mb-2">Payment: ' + (order.payment_method || 'N/A') + '</p>' +
                '      ' + itemsHtml +
                '    </div>' +
                '  </div>' +
                '</div>'
            );
        });
    }

    // ========================================================================
    // Account / Profile Page (account.html)
    // ========================================================================
    const $profileForm = $('#profile-form');
    if ($profileForm.length) {
        $profileForm.on('submit', function (e) {
            e.preventDefault();
            showToast('Profile updated successfully!');
        });
    }

    const $passwordForm = $('#password-form');
    if ($passwordForm.length) {
        $passwordForm.on('submit', function (e) {
            e.preventDefault();
            showToast('Password changed successfully!');
        });
    }
});
