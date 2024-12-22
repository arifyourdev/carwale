var openButton = document.getElementById("openButton");
var hiddenButton = document.getElementById("hiddenButton")
openButton.addEventListener('click',function(){
    hiddenButton.style.display = 'block'
    openButton.style.display = "none"
})

// Handle size selection
const sizeButtons = document.querySelectorAll('.size-button');

sizeButtons.forEach(button => {

    button.addEventListener('click', function () {
        // Deselect previously selected size
        sizeButtons.forEach(btn => btn.setAttribute('data-selected', 'false'));
        sizeButtons.forEach(btn => btn.classList.remove('border-red-600', 'bg-red-100'));

        // Select the clicked size
        button.setAttribute('data-selected', 'true');
        button.classList.add('border-red-600', 'bg-red-100');

        // Update the selected size input
        document.getElementById('selected-size').value = button.getAttribute('data-size');
    });
});


document.getElementById('addToCart').addEventListener('click', function (e) {
    e.preventDefault();

    const selectedSize = document.getElementById('selected-size').value;

    if (!selectedSize) {
        alert('Please select a size before adding to cart.');
        return;
    }

    let productData = {
        product_id: document.querySelector('input[name="product_id"]').value,
        product_name: document.querySelector('input[name="product_name"]').value,
        product_price: document.querySelector('input[name="product_price"]').value,
        quantity: document.querySelector('input[name="quantity"]').value,
        product_size: selectedSize,
        product_image: document.querySelector('input[name="product_image"]').value,
     };
    console.log(productData)

    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product added to cart!');
            window.location.href ='/cu-cart'
        } else {
            alert('Failed to add product to cart.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

 
 


