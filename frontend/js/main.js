// load header/footer into index.html
async function loadComponent(path, id){
  const resp = await fetch(path);
  const text = await resp.text();
  document.getElementById(id).innerHTML = text;
}

loadComponent('components/header.html', 'header-placeholder');
loadComponent('components/footer.html', 'footer-placeholder');

// fetch product from backend
const API_BASE = '/api';

async function fetchProduct(){
  const res = await fetch(API_BASE + '/product');
  const prod = await res.json();
  return prod;
}

function renderProduct(p){
  const card = document.getElementById('product-card');
  card.innerHTML = `
    <div class="title">${p.title}</div>
    <div class="desc">${p.short}</div>
    <div class="price">₹${p.price}</div>
    <div class="meta">Weight: ${p.weight}</div>
  `;
  const img = document.getElementById('product-image');
  if(p.image) img.src = p.image;
}

async function init(){
  try{
    const prod = await fetchProduct();
    renderProduct(prod);
  }catch(err){
    console.error(err);
    document.getElementById('product-card').innerText = 'Failed to load product.';
  }
}

init();

// checkout button (simple flow: create order -> show success)
document.addEventListener('click', async (e)=>{
  if(e.target.id === 'buy-now'){
    const prod = await fetchProduct();
    const order = {
      productId: prod._id,
      name: prod.title,
      price: prod.price,
      buyer: {
        name: prompt('Your name'),
        contact: prompt('Phone or email')
      }
    };
    const res = await fetch(API_BASE + '/order', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(order)
    });
    const data = await res.json();
    if(data.ok) alert('Order placed! Order ID: ' + data.orderId);
    else alert('Order failed');
  }
});
