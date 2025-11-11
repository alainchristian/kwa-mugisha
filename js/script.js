/**
 * Kwa Mugisha Grocery Shop - Enhanced JavaScript
 * Language switching, product filtering, animations
 */

// Current language state
let currentLang = "en";

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // Language Switching System
  // ==========================================
  function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll(
      ".lang-btn, .mobile-lang-btn"
    );

    langButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const lang =
          this.id === "lang-rw" || this.dataset.lang === "rw" ? "en" : "en";
        switchLanguage(lang);
      });
    });

    // Load saved language preference (default to English)
    const savedLang = localStorage.getItem("preferredLang") || "en";
    switchLanguage(savedLang);
  }

  function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("preferredLang", lang);

    // Update all elements with data-rw and data-en attributes
    const elements = document.querySelectorAll("[data-rw][data-en]");
    elements.forEach((el) => {
      const text = lang === "rw" ? el.dataset.rw : el.dataset.en;
      if (el.tagName === "INPUT") {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });

    // Update language button states
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelectorAll(".mobile-lang-btn").forEach((btn) => {
      btn.classList.remove("active");
      btn.classList.remove("bg-green-600", "text-white");
      btn.classList.add("bg-gray-200", "text-gray-700");
    });

    if (lang === "rw") {
      document.getElementById("lang-rw")?.classList.add("active");
      document.querySelectorAll('[data-lang="rw"]').forEach((btn) => {
        btn.classList.add("active", "bg-green-600", "text-white");
        btn.classList.remove("bg-gray-200", "text-gray-700");
      });
    } else {
      document.getElementById("lang-en")?.classList.add("active");
      document.querySelectorAll('[data-lang="en"]').forEach((btn) => {
        btn.classList.add("active", "bg-green-600", "text-white");
        btn.classList.remove("bg-gray-200", "text-gray-700");
      });
    }

    // Update search placeholder
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
      searchBar.placeholder =
        lang === "rw"
          ? searchBar.dataset.placeholderRw || "Shakisha..."
          : searchBar.dataset.placeholderEn || "Search products...";
    }
  }

  // ==========================================
  // Mobile Menu Toggle
  // ==========================================
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");

      const icon = this.querySelector("i");
      if (mobileMenu.classList.contains("hidden")) {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      } else {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      }
    });
  }

  // ==========================================
  // Product Filtering System
  // ==========================================
  function initProductFiltering() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const products = document.querySelectorAll(".product-card");
    const searchBar = document.getElementById("search-bar");
    const productCount = document.getElementById("product-count");
    const noResults = document.getElementById("no-results");

    let currentCategory = "all";
    let currentSearchTerm = "";

    // Category filter
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Update active state
        filterButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        currentCategory = this.dataset.category;
        filterProducts();
      });
    });

    // Search filter
    if (searchBar) {
      searchBar.addEventListener("input", function (e) {
        currentSearchTerm = e.target.value.toLowerCase();
        filterProducts();
      });
    }

    function filterProducts() {
      let visibleCount = 0;

      products.forEach((product) => {
        const category = product.dataset.category;
        const nameRw = product.dataset.nameRw?.toLowerCase() || "";
        const nameEn = product.dataset.nameEn?.toLowerCase() || "";
        const name = product.dataset.name?.toLowerCase() || "";

        const categoryMatch =
          currentCategory === "all" || category === currentCategory;
        const searchMatch =
          currentSearchTerm === "" ||
          nameRw.includes(currentSearchTerm) ||
          nameEn.includes(currentSearchTerm) ||
          name.includes(currentSearchTerm);

        if (categoryMatch && searchMatch) {
          product.style.display = "block";
          setTimeout(() => {
            product.style.opacity = "1";
            product.style.transform = "translateY(0)";
          }, visibleCount * 50);
          visibleCount++;
        } else {
          product.style.opacity = "0";
          product.style.transform = "translateY(20px)";
          setTimeout(() => {
            product.style.display = "none";
          }, 300);
        }
      });

      // Update count
      if (productCount) {
        productCount.textContent = visibleCount;
      }

      // Show/hide no results message
      if (noResults) {
        if (visibleCount === 0) {
          noResults.classList.remove("hidden");
        } else {
          noResults.classList.add("hidden");
        }
      }
    }

    // Initial filter
    filterProducts();
  }

  // ==========================================
  // Smooth Scroll
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href !== "") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // ==========================================
  // Contact Form
  // ==========================================
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const contactInfo = document.getElementById("contact-info").value.trim();
      const message = document.getElementById("message").value.trim();

      if (name === "" || contactInfo === "" || message === "") {
        const alertMsg =
          currentLang === "rw"
            ? "Uzuza amakuru yose / Please fill in all fields"
            : "Please fill in all fields / Uzuza amakuru yose";
        alert(alertMsg);
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^(\+?25)?[0-9]{9,10}$/;

      if (!emailRegex.test(contactInfo) && !phoneRegex.test(contactInfo)) {
        const alertMsg =
          currentLang === "rw"
            ? "Injiza email cyangwa telefoni nziza / Please enter a valid email or phone"
            : "Please enter a valid email or phone / Injiza email cyangwa telefoni nziza";
        alert(alertMsg);
        return false;
      }

      const successMsg =
        currentLang === "rw"
          ? "Murakoze! Ubutumwa bwawe bwakiriwe. Tuzakuvugisha vuba.\n\nNote: This form is not yet functional. Please call 0788 899 899."
          : "Thank you! Your message has been received. We will contact you soon.\n\nNote: This form is not yet functional. Please call 0788 899 899.";

      alert(successMsg);
      contactForm.reset();
    });
  }

  // ==========================================
  // Scroll Animations
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".feature-card, .product-card, .product-category-card-home, .testimonial-card"
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  // ==========================================
  // Add to Cart (Placeholder)
  // ==========================================
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const productCard = this.closest(".product-card");
      const productName = productCard.querySelector("h4").textContent;

      // Visual feedback
      this.innerHTML = '<i class="fas fa-check"></i>';
      this.style.background = "linear-gradient(135deg, #10b981, #059669)";

      const msg =
        currentLang === "rw"
          ? `${productName} byerekanwe!\n\nKuri order, akira: 0788 899 899\n\nE-commerce izaza vuba!`
          : `${productName} noted!\n\nFor orders, call: 0788 899 899\n\nE-commerce coming soon!`;

      setTimeout(() => {
        alert(msg);
        this.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        this.style.background = "";
      }, 500);
    });
  });

  // ==========================================
  // Sticky Navigation Effect
  // ==========================================
  const nav = document.querySelector("nav");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      nav.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
      nav.style.padding = "12px 0";
    } else {
      nav.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
      nav.style.padding = "16px 0";
    }

    lastScroll = currentScroll;
  });

  // ==========================================
  // Back to Top Button
  // ==========================================
  function createBackToTopButton() {
    const button = document.createElement("button");
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = "back-to-top";
    button.setAttribute("aria-label", "Back to top");

    document.body.appendChild(button);

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
      } else {
        button.style.display = "none";
      }
    });

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  createBackToTopButton();

  // ==========================================
  // WhatsApp Integration
  // ==========================================
  document.querySelectorAll('a[href*="whatsapp"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      if (!this.getAttribute("href").includes("wa.me")) {
        e.preventDefault();
        const msg =
          currentLang === "rw"
            ? "Muraho! Ndashaka kubaza..."
            : "Hello! I would like to ask...";
        window.open(
          `https://wa.me/250788899899?text=${encodeURIComponent(msg)}`,
          "_blank"
        );
      }
    });
  });

  // ==========================================
  // Initialize All Systems
  // ==========================================
  initLanguageSwitcher();
  initProductFiltering();

  // ==========================================
  // Console Message
  // ==========================================
  console.log(
    "%c Kwa Mugisha Grocery Shop ",
    "background: #059669; color: white; font-size: 20px; padding: 10px; border-radius: 5px;"
  );
  console.log(
    "%c Ihahire neza kuri macye | Shop well at affordable prices ",
    "color: #059669; font-size: 14px; font-weight: bold;"
  );
  console.log("✅ Language switching enabled");
  console.log("✅ Product filtering active");
  console.log("✅ All features loaded successfully!");
});

// ==========================================
// Future Enhancement: Shopping Cart
// ==========================================
class ShoppingCart {
  constructor() {
    this.items = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    const saved = localStorage.getItem("kwaMugishaCart");
    if (saved) {
      this.items = JSON.parse(saved);
    }
  }

  saveToStorage() {
    localStorage.setItem("kwaMugishaCart", JSON.stringify(this.items));
  }

  addItem(product) {
    const existing = this.items.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.saveToStorage();
    this.updateUI();
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveToStorage();
    this.updateUI();
  }

  getTotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  updateUI() {
    // Update cart badge
    console.log(
      `Cart updated: ${this.getItemCount()} items, ${this.getTotal()} RWF`
    );
    // This can be enhanced with actual UI updates
  }

  clear() {
    this.items = [];
    this.saveToStorage();
    this.updateUI();
  }
}

// Initialize cart (for future use)
// const cart = new ShoppingCart();

// ==========================================
// PWA Service Worker (Future Enhancement)
// ==========================================
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}
*/
