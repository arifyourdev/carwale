var openButton = document.getElementById("openButton");
var hiddenButton = document.getElementById("hiddenButton")
openButton.addEventListener('click',function(){
    hiddenButton.style.display = 'block'
    openButton.style.display = "none"
})

document.getElementById('addToCart').addEventListener('click', function (e) {
    e.preventDefault();
    let productData = {
        product_id: document.querySelector('input[name="product_id"]').value,
        product_name: document.querySelector('input[name="product_name"]').value,
        product_price: document.querySelector('input[name="product_price"]').value,
        quantity: document.querySelector('input[name="quantity"]').value,
        product_image: document.querySelector('input[name="product_image"]').value
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

 
 


