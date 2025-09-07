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

  categoriesEl.innerHTML = categories.map(cat => `
    <li>
      <button onclick="loadTrees('${cat.category_name}')" 
        class="w-full text-left px-3 py-2 rounded hover:bg-green-100">
        ${cat.category_name}
      </button>
    </li>
  `).join("");
}




    // Load trees of a category
    async function loadTrees(category) {
      const res = await fetch(`https://openapi.programming-hero.com/api/plants?category=${category}`);
      const data = await res.json();
      const trees = data.plants;

      cardsEl.innerHTML = trees.map(tree => `
        <div class="card bg-white shadow rounded-lg">
          <figure><img src="${tree.image}" alt="${tree.name}" class="h-40 w-full object-cover"/></figure>
          <div class="card-body p-4">
            <h2 onclick="openModal('${tree.name}','${tree.image}','${tree.description}','${tree.category}','${tree.price}')" 
                class="card-title cursor-pointer text-green-700 hover:underline">${tree.name}</h2>
            <p class="text-sm text-slate-600">${tree.description.slice(0,80)}...</p>
            <p class="text-sm"><span class="badge badge-outline">${tree.category}</span></p>
            <p class="font-semibold">৳${tree.price}</p>
            <button onclick="addToCart('${tree.name}',${tree.price})" 
              class="btn btn-sm bg-green-600 text-white w-full">Add to Cart</button>
          </div>
        </div>
      `).join("");
    }

    // Add to Cart
    function addToCart(name, price) {
      cart.push({name, price});
      renderCart();
    }

    function renderCart() {
      cartItemsEl.innerHTML = cart.map(item => `
        <li class="flex justify-between">
          <span>${item.name}</span> 
          <span>৳${item.price}</span>
        </li>
      `).join("");

      let total = cart.reduce((sum, item) => sum + item.price, 0);
      cartTotalEl.textContent = "৳" + total;
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
    loadTrees("All Trees"); // 