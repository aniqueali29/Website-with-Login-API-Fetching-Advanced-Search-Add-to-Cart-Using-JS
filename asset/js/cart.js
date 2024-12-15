const cartItem = JSON.parse(localStorage.getItem("data")) || [];
let products = [];

(async function () {
  products = await fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => data.products);

  renderCartItem();
})();

const cartTbody = document.getElementById("cart");

function renderCartItem() {
  cartTbody.innerHTML = "";

  if (cartItem.length === 0) {
    cartTbody.innerHTML = "<tr><td colspan='6'>Your cart is empty!</td></tr>";
    return;
  }

  cartItem.forEach((item, index) => {
    let product = products.find((p) => p.id === item.id);

    if (!product) {
      console.error(`Product with ID ${item.id} not found!`);
      return;
    }

    const title = item.title || product.title;
    const price = item.price || product.price;
    const thumbnail = item.thumbnail || product.thumbnail;

    const totalPrice = price * item.quantity;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${thumbnail}" alt="${title}" class="img"></td>
      <td class="title">${title}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" 
          onchange="updateQuantity(${index}, this.value)">
      </td>
      <td>Rs <span>${totalPrice.toFixed(2)}</span></td>
      <td><button onclick="removeItem(${index})">Remove</button></td>
    `;
    cartTbody.appendChild(row);
  });

  document.getElementById("quantity").innerHTML = `(${cartItem.length})`;
}

function updateQuantity(index, newQuantity) {
  if (newQuantity < 1) return;
  cartItem[index].quantity = parseInt(newQuantity, 10);
  localStorage.setItem("data", JSON.stringify(cartItem));
  renderCartItem();
}

function removeItem(index) {
  cartItem.splice(index, 1);
  localStorage.setItem("data", JSON.stringify(cartItem));
  renderCartItem();
  Swal.fire({
    icon: 'success',
    title: 'Item Removed',
    text: 'The item was removed successfully!',
    showConfirmButton: false,
    timer: 1500
  });
}
