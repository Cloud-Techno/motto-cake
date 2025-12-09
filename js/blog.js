// HEADER ve NAVBAR
$(document).ready(function () {
  // Navbar toggle
  $(".fa-bars").click(function () {
    $(this).toggleClass("fa-times");
    $(".navbar").toggleClass("nav-toggle");
  });

  $(window).on("load scroll", function () {
    $(".fa-bars").removeClass("fa-times");
    $(".navbar").removeClass("nav-toggle");

    if ($(window).scrollTop() > 35) {
      $(".header").css({
        background: "#e5bfbf",
        "box-shadow": "0 .2rem .5rem rgba(0,0,0,.4)",
      });
    } else {
      $(".header").css({ background: "none", "box-shadow": "none" });
    }
  });

  // Counter
  const counters = document.querySelectorAll(".counter");
  const speed = 120;
  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const inc = target / speed;
      if (count < target) {
        counter.innerText = count + inc;
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });

  // Owl carousels
  $(".clients-carousel").owlCarousel({
    autoplay: true,
    autoplayTimeout: 1500,
    dots: true,
    loop: true,
    responsive: { 0: { items: 2 }, 768: { items: 4 }, 900: { items: 6 } },
  });

  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      768: { items: 3 },
      992: { items: 4 },
    },
  });

  // Back to top
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) $(".back-to-top").fadeIn("slow");
    else $(".back-to-top").fadeOut("slow");
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Accordion
  $(".accordion-header").click(function () {
    const $body = $(this).next(".accordion-body");
    const isOpen = $body.is(":visible");
    if (isOpen) {
      $body.slideUp(500);
      $(this).children("span").text("+");
    } else {
      $(".accordion .accordion-body").slideUp(500);
      $(".accordion .accordion-header span").text("+");
      $body.slideDown(500);
      $(this).children("span").text("-");
    }
  });
});

// POSTLARI YÜKLE (Sadece bir kez)
if (!window.hasRunLoadPosts) {
  window.hasRunLoadPosts = true;
  loadPosts();
}

async function loadPosts() {
  const container = document.getElementById("posts");
  const loadingSpinner = document.querySelector(".loading-spinner");

  loadingSpinner.style.display = "block";
  container.innerHTML = "";

  try {
    const res = await fetch("/api/getPosts.php");
    const posts = await res.json();
    loadingSpinner.style.display = "none";

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <h3 class="text-muted">Derzeit sind keine Blog-Beiträge verfügbar.</h3>
          <p>Bitte besuchen Sie uns später erneut.</p>
        </div>`;
      return;
    }

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    posts.forEach((p) => {
      const postDiv = document.createElement("div");
      postDiv.className = "col-lg-4 col-md-6 mb-5";

      const summary =
        p.content.length > 180
          ? p.content.substring(0, 180) + "..."
          : p.content;

      postDiv.innerHTML = `
        <article class="blog-card shadow-sm">
          <div class="blog-card-img-wrapper">
            <img loading="lazy" src="${
              p.image_url
            }" class="blog-card-img" alt="${p.title}">
          </div>
          <div class="blog-card-body">
            <h3 class="blog-card-title">${p.title}</h3>
            <p class="blog-card-text">${summary}</p>
            <div class="blog-meta">
              <small>${new Date(p.created_at).toLocaleDateString(
                "de-DE",
                dateOptions
              )}</small>
            </div>
            <a href="/post-detail.html?id=${
              p.id
            }" class="blog-read-more">Mehr lesen →</a>
          </div>
        </article>`;
      container.appendChild(postDiv);
    });
  } catch (err) {
    console.error(err);
    loadingSpinner.style.display = "none";
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <h3 class="text-danger">Fehler beim Laden der Beiträge.</h3>
        <p>Versuchen Sie es später erneut.</p>
      </div>`;
  }
}
