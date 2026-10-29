
let cart = JSON.parse(localStorage.getItem('bnf_cart')) || [];

function saveCart() {
  localStorage.setItem('bnf_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  alert('পণ্যটি কার্টে সফলভাবে যোগ করা হয়েছে!');
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) badge.innerText = count;
}

function openCart() {
  document.getElementById('cartModal').style.display = 'flex';
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const totalElement = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#64748b; margin-top:20px;">আপনার কার্ট খালি রয়েছে।</p>';
    totalElement.innerText = '৳০';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
        <div>
          <h4 style="font-size:14px;">${item.name}</h4>
          <p style="font-size:13px; color:#0f766e;">৳${item.price} × ${item.qty}</p>
        </div>
        <div>
          <button onclick="changeQty(${index}, 1)" style="padding:2px 6px;">+</button>
          <span style="margin:0 5px;">${item.qty}</span>
          <button onclick="changeQty(${index}, -1)" style="padding:2px 6px;">-</button>
          <button onclick="removeItem(${index})" style="color:red; border:none; background:none; margin-left:10px; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  totalElement.innerText = `৳${total}`;
}

function changeQty(index, amount) {
  cart[index].qty += amount;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCartItems();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartItems();
}

function proceedCheckout() {
  if (cart.length === 0) {
    alert('কার্টে কোনো পণ্য নেই!');
    return;
  }

  const name = prompt('আপনার পূর্ণ নাম লিখুন:');
  const phone = prompt('আপনার মোবাইল নম্বর লিখুন (যেমন: 018XXXXXXXX):');
  const address = prompt('আপনার পূর্ণাঙ্গ ঠিকানা ও এলাকা লিখুন:');

  if (!name || !phone || !address) {
    alert('অর্ডার সম্পন্ন করতে সকল তথ্য দেওয়া বাধ্যতামূলক!');
    return;
  }

  const secCode = Math.floor(1000 + Math.random() * 9000);
  let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  let msg = `*👑 নতুন অর্ডার - Barakah Nur Fashion*\n`;
  msg += `*সিকিউরিটি কোড:* #${secCode}\n`;
  msg += `---------------------------\n`;
  cart.forEach(i => {
    msg += `• ${i.name} (${i.qty} টি) - ৳${i.price * i.qty}\n`;
  });
  msg += `---------------------------\n`;
  msg += `*সর্বমোট বিল:* ৳${total} (Cash on Delivery)\n`;
  msg += `*গ্রাহকের নাম:* ${name}\n`;
  msg += `*ফোন:* ${phone}\n`;
  msg += `*ঠিকানা:* ${address}\n`;

  const waUrl = `https://wa.me/8801812418091?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');

  cart = [];
  saveCart();
  closeCart();
  alert(`আপনার অর্ডার সফলভাবে প্রসেস হয়েছে! সিকিউরিটি কোড: #${secCode}`);
}

updateCartCount();
