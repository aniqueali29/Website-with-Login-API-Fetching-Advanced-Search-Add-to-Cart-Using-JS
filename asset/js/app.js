let products = [];
const cartItem = JSON.parse(localStorage.getItem("data")) || [];

(async function () {
  products = await fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => data.products);

  renderProducts(products);
})();

function renderProducts(productList) {
  let html = "";

  productList.forEach((product) => {
    const discountPrice = (product.price * product.discountPercentage) / 100;
    const discountedPrice = product.price - discountPrice;

    const iconBackgroundColor = discountPrice <= 10 ? "red" : "orange";

    html += `
      <div class="item">
        <div class="icon" style="background-color: ${iconBackgroundColor};">
          ${product.discountPercentage.toFixed(1)}%
        </div>
        <div class="item-img">
          <img src="${product.thumbnail}" alt="${product.title}" width="100%">
        </div>
        <div class="item-content">
          <h1>${product.title}</h1>
          <p>${product.description}</p>
          <h4>Price: <span>${discountedPrice.toFixed(2)}</span> Rs</h4>
          <div class="item-link">
            <button onClick="addToCart(${product.id})" class="btn">
              <i class="fa-brands fa-opencart"></i> Add To Cart
            </button>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("products-container").innerHTML = html;
  updateCartQuantity();
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingProduct = cartItem.find((item) => item.id === productId);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cartItem.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
    });
  }

  localStorage.setItem("data", JSON.stringify(cartItem));
  updateCartQuantity();

  Swal.fire({
    icon: 'success',
    title: 'Product Added',
    text: 'Product added to cart successfully!',
    showConfirmButton: false,
    timer: 1500
  });

}

function updateCartQuantity() {
  const quantityElement = document.getElementById("quantity");
  if (quantityElement) {
    quantityElement.innerHTML = `(${cartItem.length})`;
  }
}

function searchProducts() {
  const searchValue = document.getElementById("search-input").value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchValue)
  );
  renderProducts(filteredProducts);
}
