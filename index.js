const categoriesEl = document.getElementById("categories");
const cardsEl = document.getElementById("cards");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
let cart = [];


// Load categories
async function loadCategories() {
  const res = await fetch('https://openapi.programming-hero.com/api/categories');
  const data = await res.json();
  const categories = data.categories;

  categoriesEl.innerHTML = categories.map(cat => 
    `<li>
       <button 
         onclick="loadTrees('${cat.id}', false, this)" 
         class="category-btn w-full text-left px-3 py-2 rounded hover:bg-green-700 hover:text-white">
         ${cat.category_name}  
       </button>
     </li>`
  ).join("");
}


// Load trees of a category
async function loadTrees(categoryId, isRandom = false, btn = null) {
  const url = categoryId === "All Trees" 
    ? `https://openapi.programming-hero.com/api/plants`
    : `https://openapi.programming-hero.com/api/category/${categoryId}`;
  
  const res = await fetch(url);
  const data = await res.json();
  let trees = data.plants || data.data;  

  // Randomly first 6 trees showing
  if (isRandom && trees.length > 6) {
    trees = trees.sort(() => 0.5 - Math.random()).slice(0, 6);
  }

  // Active button highlight 
  document.querySelectorAll(".category-btn").forEach(b => {
    b.classList.remove("bg-green-700", "text-white");
  });
  if (btn) {
    btn.classList.add("bg-green-700", "text-white");
  }

  // Render cards create
  cardsEl.innerHTML = trees.map(tree => `
    <div class="card bg-white shadow rounded-lg">
      <figure><img src="${tree.image}" alt="${tree.name}" class="h-40 w-full  object-cover"/></figure>
      <div class="card-body p-4">
        <h2 onclick="openModal('${tree.name}','${tree.image}','${tree.description}','${tree.category}','${tree.price}')" 
            class="card-title cursor-pointer text-[#1F2937] hover:underline">${tree.name}</h2>
        <p class="text-sm text-slate-600">${tree.description.slice(0,80)}...</p>
        
        <div class="flex justify-between items-center mt-2">
          <span class="px-2 py-1 rounded-xl bg-green-200 text-sm">${tree.category}</span>
          <span class="font-semibold">৳${tree.price}</span>
        </div>

        <button onclick="addToCart('${tree.name}',${tree.price})" 
          class="btn btn-sm bg-green-700 text-white w-full rounded-2xl mt-3">Add to Cart</button>
      </div>
    </div>
  `).join("");
}



// Add to Cart
// function addToCart(name, price) {
//   cart.push({id: Date.now(), name, price}); 
//   renderCart();
// }


// Add to Cart


let pendingItem = null; 

function addToCart(name, price) {

  pendingItem = { id: Date.now(), name, price };


  document.getElementById("cartModalMsg").textContent = 
    `${name} has been added to the cart. Click OK to confirm.`;


  document.getElementById("cartModal").showModal();
}


document.getElementById("confirmAddBtn").addEventListener("click", () => {
  if (pendingItem) {
    cart.push(pendingItem); 
    renderCart(); 
    pendingItem = null; 
  }
});



// Render Cart create
function renderCart() {
  cartItemsEl.innerHTML = cart.map(item => `
    <div class="flex justify-between items-center bg-white shadow-md rounded-lg p-3 mb-2">
      <div>
        <h4 class="font-semibold text-green-700">${item.name}</h4>
        <p class="text-sm text-gray-500">৳${item.price}</p>
      </div>
      <button onclick="removeFromCart(${item.id})" 
        class="text-red-500 cursor-pointer font-bold text-lg ">❌</button>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalEl.textContent = "৳" + total;
}

// Remove from Cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}




// Modal open
function openModal(name,img,desc,cat,price) {
  document.getElementById("modalTitle").textContent = name;
  document.getElementById("modalImg").src = img;
  document.getElementById("modalDesc").textContent = desc;
  document.getElementById("modalCategory").textContent = cat;
  document.getElementById("modalPrice").textContent = "৳" + price;
  treeModal.showModal();
}

// Load default
loadCategories();
loadTrees("All Trees", true); 