/* ==========================================================
   ARTSPACE. — script.js (JavaScript vanilla + Bootstrap 5)
   1. Modal detail karya
   2. Validasi form + modal konfirmasi + simulasi kirim
   3. Navbar: tutup menu mobile & penanda menu aktif
   4. Animasi muncul saat scroll
   5. Tahun otomatis di footer
   ========================================================== */

document.documentElement.classList.add("js");

/* ---------- 1. Modal detail karya ---------- */
const artModal = document.getElementById("artModal");

// Saat modal akan tampil, isi konten dari atribut data-* tombol yang diklik
artModal.addEventListener("show.bs.modal", function (event) {
  const trigger = event.relatedTarget;
  if (!trigger) return;

  const img = document.getElementById("artModalImg");
  img.src = trigger.dataset.img;
  img.alt = trigger.dataset.title + " — " + trigger.dataset.desc;

  document.getElementById("artModalTitle").textContent = trigger.dataset.title;
  document.getElementById("artModalLabel").textContent = trigger.dataset.label;
  document.getElementById("artModalDesc").textContent = trigger.dataset.desc;
});

/* ---------- 2. Form kontak ---------- */
const form = document.getElementById("contactForm");
const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formAlert = document.getElementById("formAlert");
const confirmModalEl = document.getElementById("confirmModal");
const confirmModal = bootstrap.Modal.getOrCreateInstance(confirmModalEl);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Tandai satu input valid / tidak valid (memakai class Bootstrap)
function setState(input, isValid) {
  input.classList.toggle("is-invalid", !isValid);
  input.classList.toggle("is-valid", isValid);
  return isValid;
}

// Cek semua field; mengembalikan true bila semuanya valid
function validateForm() {
  const okName = setState(nameInput, nameInput.value.trim() !== "");
  const okEmail = setState(emailInput, emailPattern.test(emailInput.value.trim()));
  const okMessage = setState(messageInput, messageInput.value.trim() !== "");
  return okName && okEmail && okMessage;
}

// Validasi langsung saat pengguna mengetik, setelah field pernah ditandai
[nameInput, emailInput, messageInput].forEach(function (input) {
  input.addEventListener("input", function () {
    if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) {
      validateForm();
    }
  });
});

// Tombol "Send Message" → validasi dulu, lalu tampilkan modal konfirmasi
form.addEventListener("submit", function (event) {
  event.preventDefault(); // cegah reload halaman & pengiriman langsung
  formAlert.innerHTML = "";

  if (validateForm()) {
    confirmModal.show();
  } else {
    // fokus ke field pertama yang bermasalah
    form.querySelector(".is-invalid").focus();
  }
});

// Tombol "Ya, Kirim" → simulasi kirim (tanpa backend)
document.getElementById("confirmSendBtn").addEventListener("click", function () {
  confirmModal.hide();

  formAlert.innerHTML =
    '<div class="alert alert-success alert-dismissible fade show mb-4" role="status" lang="id">' +
    "<strong>Berhasil (simulasi).</strong> Terima kasih! Pesan Anda telah diproses. " +
    "Catatan: website ini tidak memakai backend, jadi pesan tidak benar-benar dikirim." +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Tutup"></button>' +
    "</div>";

  form.reset();
  form.querySelectorAll(".is-valid, .is-invalid").forEach(function (el) {
    el.classList.remove("is-valid", "is-invalid");
  });
});

/* ---------- 3. Navbar ---------- */
// Tutup menu hamburger setelah salah satu menu diklik (mobile)
const navMenu = document.getElementById("navMenu");
document.querySelectorAll("#navMenu .nav-link").forEach(function (link) {
  link.addEventListener("click", function () {
    if (navMenu.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
    }
  });
});

// Tandai menu aktif sesuai section yang sedang terlihat
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("#navMenu .nav-link");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach(function (section) { navObserver.observe(section); });
}

/* ---------- 4. Animasi muncul saat scroll ---------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach(function (item) { revealObserver.observe(item); });
} else {
  // Browser lama: langsung tampilkan semua
  revealItems.forEach(function (item) { item.classList.add("is-visible"); });
}

/* ---------- 5. Tahun footer ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
