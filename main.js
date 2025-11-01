async function load(path,id){
  const r = await fetch(path)
  document.getElementById(id).innerHTML = await r.text()
}
load("components/header.html","header-placeholder")
load("components/footer.html","footer-placeholder")

async function getProduct(){
  const r = await fetch("/api/product")
  return r.json()
}
async function init(){
  const p = await getProduct()
  document.getElementById("product-display").innerHTML =
  `<h3>${p.title}</h3>
   <p>${p.short}</p>
   <h2>₹${p.price}</h2>`;
}
init()

document.getElementById("buy-now").onclick = async()=>{
  const p = await getProduct()
  const order = {
    productId:p._id,
    name:p.title,
    price:p.price,
    buyer:{
      name:prompt("Your Name"),
      contact:prompt("Phone / Email")
    }
  }
  const r = await fetch("/api/order",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(order)
  })
  const d = await r.json()
  alert("Order ID: "+d.orderId)
}
