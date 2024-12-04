const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductDescription = document.querySelector('#update-description');
const updateProductPrice = document.querySelector('#update-price');

const API_URL = 'http://localhost:3000/products';

// Function to fetch all products from the server
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Falha ao buscar produtos');
    const products = await response.json();
    
    productList.innerHTML = '';
    products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${product.name}</strong>  R$${Math.abs(parseFloat(product.price)).toFixed(2)}<br>
        <em>${product.description}</em>
        <div>
          <button onclick="deleteProduct(${product.id})">Excluir</button>
          <button onclick="prepareUpdateProduct(${product.id}, '${product.name}', '${product.description}', ${product.price})">Atualizar</button>
        </div>
      `;
      productList.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

function prepareUpdateProduct(id, name, description, price) {
  updateProductId.value = id;
  updateProductName.value = name;
  updateProductDescription.value = description;
  updateProductPrice.value = price;
}

async function addProduct(name, description, price) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
    
  });
  await fetchProducts();
  productList.appendChild(li);
  return response.json();
}

async function updateProduct(event) {
  event.preventDefault();
  const id = updateProductId.value;
  const name = updateProductName.value.trim();
  const description = updateProductDescription.value.trim();
  const price = parseFloat(updateProductPrice.value);

  if (name && description && !isNaN(price)) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price })
      });
      if (!response.ok) throw new Error('Falha ao atualizar produto');
      await fetchProducts(); // Recarrega a lista de produtos
      updateProductForm.reset();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  } else {
    alert('Por favor, preencha todos os campos corretamente.');
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Falha ao excluir produto');
    await fetchProducts();
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
  }
}

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value.trim();
  const description = addProductForm.elements['description'].value.trim();
  const price = parseFloat(addProductForm.elements['price'].value);

  if (name && description && !isNaN(price)) {
    try {
      await addProduct(name, description, price);
      addProductForm.reset();
      await fetchProducts();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  } else {
    alert('Por favor, preencha todos os campos corretamente.');
  }
});

// Fetch all products on page load
fetchProducts();

// Event listener for Update Product form submit button
updateProductForm.addEventListener('submit', updateProduct);