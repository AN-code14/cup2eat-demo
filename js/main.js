const juices = [
  { id: 1, name: "Orange Zest", description: "Sun-bright orange with a lively little citrus kick.", price: 149, image: "assets/juice-01.svg" },
  { id: 2, name: "Watermelon Chill", description: "Cool, juicy watermelon made for slow sunny sips.", price: 159, image: "assets/juice-02.svg" },
  { id: 3, name: "Mango Tango", description: "Big, ripe mango flavour with a smooth finish.", price: 179, image: "assets/juice-03.svg" },
  { id: 4, name: "Sugarcane Splash", description: "Fresh-pressed sugarcane, brightened with a squeeze of lime.", price: 139, image: "assets/juice-04.svg" },
  { id: 5, name: "Pineapple Punch", description: "Sweet-tart pineapple with a proper tropical punch.", price: 169, image: "assets/juice-05.svg" },
  { id: 6, name: "Green Apple Fizz", description: "Crisp green apple flavour with a fresh, tangy snap.", price: 159, image: "assets/juice-06.svg" },
  { id: 7, name: "Pomegranate Pop", description: "Ruby-bright pomegranate, tart, juicy and full of pep.", price: 189, image: "assets/juice-07.svg" },
  { id: 8, name: "Lemon Mint Cooler", description: "Zippy lemon meets cool mint for an easy refresh.", price: 149, image: "assets/juice-08.svg" },
  { id: 9, name: "Mixed Fruit Mania", description: "A happy mix of fruit flavours in one colourful sip.", price: 179, image: "assets/juice-09.svg" },
  { id: 10, name: "Coconut Crush", description: "Cool coconut goodness with a soft, creamy feel.", price: 169, image: "assets/juice-10.svg" }
];

const menuGrid = document.querySelector("#menu-grid");
const bag = new Map();
const bagTrigger = document.querySelector(".bag-trigger");
const bagDrawer = document.querySelector("#bag-drawer");
const drawerScrim = document.querySelector("#drawer-scrim");
const toast = document.querySelector("#toast");
let toastTimer;

function renderMenu() {
  menuGrid.innerHTML = juices.map((juice) => `
    <article class="juice-card">
      <div class="juice-image">
        <!-- PLACEHOLDER: sample illustration; replace with approved ${juice.name} product photography -->
        <img src="${juice.image}" alt="Sample illustration for ${juice.name}" width="140" height="165">
        <span class="art-label">SAMPLE ART</span>
      </div>
      <div class="juice-info">
        <div class="juice-title-line"><h3>${juice.name}</h3><strong>₹${juice.price}</strong></div>
        <p>${juice.description}</p>
        <div class="juice-actions">
          <button class="add-button" type="button" data-add="${juice.id}" aria-label="Add ${juice.name} to bag">Add to Bag</button>
          <button class="order-button" type="button" data-order="${juice.id}" aria-label="Order ${juice.name}">Order</button>
        </div>
      </div>
    </article>`).join("");
}

function itemCount() {
  return Array.from(bag.values()).reduce((sum, item) => sum + item.quantity, 0);
}

function renderBag() {
  const count = itemCount();
  document.querySelector(".bag-count").textContent = count;
  bagTrigger.setAttribute("aria-label", `Open shopping bag, ${count} ${count === 1 ? "item" : "items"}`);
  document.querySelector(".drawer-count").textContent = ` (${count})`;
  document.querySelector(".empty-bag").classList.toggle("visible", bag.size === 0);
  document.querySelector("#bag-items").innerHTML = Array.from(bag.values()).map((item) => `
    <div class="bag-row">
      <strong>${item.name}</strong><span>₹${item.price * item.quantity}</span>
      <div class="bag-controls">
        <button type="button" data-quantity="${item.id}" data-change="-1" aria-label="Remove one ${item.name}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-quantity="${item.id}" data-change="1" aria-label="Add one ${item.name}">+</button>
        <button class="remove-item" type="button" data-remove="${item.id}" aria-label="Remove ${item.name} from bag">Remove</button>
      </div>
    </div>`).join("");
  const total = Array.from(bag.values()).reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector("#bag-total").textContent = total;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function setBagOpen(open) {
  bagDrawer.classList.toggle("is-open", open);
  drawerScrim.classList.toggle("is-open", open);
  bagDrawer.setAttribute("aria-hidden", String(!open));
  bagTrigger.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("no-scroll", open);
  if (open) bagDrawer.querySelector(".icon-close").focus();
  else bagTrigger.focus();
}

function openOrder(id) {
  const juice = juices.find((item) => item.id === Number(id));
  if (!juice) return;
  document.querySelector("#order-juice-name").textContent = juice.name;
  document.querySelector("#order-juice-detail").textContent = `One ${juice.name} · ₹${juice.price}`;
  document.querySelector("#order-feedback").textContent = "";
  document.querySelector("#order-form").dataset.juiceId = String(juice.id);
  document.querySelector("#order-modal").showModal();
  document.querySelector("#order-name").focus();
}

menuGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const orderButton = event.target.closest("[data-order]");
  if (addButton) {
    const juice = juices.find((item) => item.id === Number(addButton.dataset.add));
    if (!juice) return;
    const current = bag.get(juice.id);
    bag.set(juice.id, { ...juice, quantity: current ? current.quantity + 1 : 1 });
    renderBag();
    showToast(`${juice.name} added to your bag.`);
  }
  if (orderButton) openOrder(orderButton.dataset.order);
});

document.querySelector("#bag-items").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) {
    const id = Number(quantityButton.dataset.quantity);
    const item = bag.get(id);
    if (!item) return;
    const quantity = item.quantity + Number(quantityButton.dataset.change);
    if (quantity < 1) bag.delete(id);
    else bag.set(id, { ...item, quantity });
  }
  if (removeButton) bag.delete(Number(removeButton.dataset.remove));
  renderBag();
});

bagTrigger.addEventListener("click", () => setBagOpen(true));
document.querySelector(".bag-drawer .icon-close").addEventListener("click", () => setBagOpen(false));
drawerScrim.addEventListener("click", () => setBagOpen(false));
document.querySelector(".bag-checkout").addEventListener("click", () => {
  if (bag.size === 0) {
    showToast("Your bag is empty. Pick a juice to get started.");
    return;
  }
  const firstItem = bag.values().next().value;
  setBagOpen(false);
  openOrder(firstItem.id);
});

document.querySelector("#order-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const juice = juices.find((item) => item.id === Number(form.dataset.juiceId));
  document.querySelector("#order-feedback").textContent = `Thanks! Your ${juice.name} order is a demo. We’ll be in touch soon.`;
  form.reset();
});

document.querySelectorAll("[data-open-login]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".nav-panel").classList.remove("is-open");
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
    document.querySelector("#login-feedback").textContent = "";
    document.querySelector("#login-modal").showModal();
    document.querySelector("#login-email").focus();
  });
});
document.querySelector("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#login-feedback").textContent = "Demo only — account sign-in isn’t connected yet.";
});

document.querySelectorAll("[data-policy]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const terms = link.dataset.policy === "terms";
    document.querySelector("#policy-title").textContent = terms ? "Terms & Conditions" : "Refund Policy";
    document.querySelector("#policy-copy").textContent = terms
      ? "Sample terms: Cup2Eat demo prices and product details are for presentation only. Final products, availability and terms will be confirmed before launch."
      : "Sample refund policy: Please contact our team about an order concern. This demo policy is placeholder text; the final policy will be published before launch.";
    document.querySelector("#policy-modal").showModal();
  });
});

document.querySelectorAll(".modal-close").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});
document.querySelectorAll("dialog.modal").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (document.activeElement === dialog) return;
    if (dialog.id === "login-modal") document.querySelector("[data-open-login]").focus();
    else if (dialog.id === "order-modal") document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  document.querySelector("#contact-feedback").textContent = "Thanks for your note! This demo form isn’t connected yet.";
});

const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  document.querySelector(".nav-panel").classList.toggle("is-open", open);
});
document.querySelectorAll(".nav-panel a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-panel").classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".nav-link[href^='#']").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-30% 0px -60% 0px" });
document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

document.querySelector("#current-year").textContent = new Date().getFullYear();
renderMenu();
renderBag();
