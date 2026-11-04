function selectItem(element, itemName, price) {
    document.querySelectorAll('.item-card').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function selectPayment(element) {
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}
