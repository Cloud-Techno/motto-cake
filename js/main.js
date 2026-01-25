$(document).ready(function () {
  // Navbar toggle
  $(".fa-bars").click(function () {
    $(this).toggleClass("fa-times");
    $(".navbar").toggleClass("nav-toggle");
  });
  // Close mobile menu when clicking a nav link
  $(".navbar a").on("click", function () {
    $(".navbar").removeClass("nav-toggle");
    $(".fa-bars").removeClass("fa-times");
  });
  // Header scroll effect
  $(window).on("load scroll", function () {
    if ($(window).scrollTop() > 35) {
      $(".header").css({
        background: "#e5bfbf",
        "box-shadow": "0 .2rem .5rem rgba(0,0,0,.4)",
      });
    } else {
      $(".header").css({ background: "none", "box-shadow": "none" });
    }
  });

  // Counter animations
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

  // Price calculator: live update of base/extras/total
  function updatePriceCalculator() {
    var $baseField = $("#basePrice");
    var $extrasField = $("#extrasPrice");
    var $grandField = $("#grandTotal");

    var selected = $('input[name="size"]:checked').val();
    if (!selected) {
      $baseField.text("—");
      $extrasField.text("CHF 0");
      $grandField.text("—");
      return;
    }

    if (selected === "ask") {
      $baseField.text("Preis anfragen");
      $extrasField.text("—");
      $grandField.text("Bitte anfragen");
      return;
    }

    var base = parseFloat(selected) || 0;
    var extras = 0;
    $('input[name="extra"]:checked').each(function () {
      extras += parseFloat($(this).val()) || 0;
    });

    $baseField.text("CHF " + base.toFixed(2));
    $extrasField.text("CHF " + extras.toFixed(2));
    $grandField.text("CHF " + (base + extras).toFixed(2));
  }

  $(document).on(
    "change",
    'input[name="size"], input[name="extra"]',
    function () {
      updatePriceCalculator();
    }
  );

  // Pre-fill contact form message and scroll to form
  $("#addToContact").on("click", function (e) {
    e.preventDefault();
    var sizeLabel = $('input[name="size"]:checked').data("label") || "";
    var extrasArr = [];
    $('input[name="extra"]:checked').each(function () {
      extrasArr.push($(this).data("name") || $(this).parent().text().trim());
    });
    var grand = $("#grandTotal").text() || "";
    var msg = "";
    if (
      sizeLabel === "20+ Personen" ||
      $('input[name="size"]:checked').val() === "ask"
    ) {
      msg = "Anfrage für 20+ Personen. Bitte kalkulieren.";
    } else {
      msg =
        "Bestellung\nPersonenzahl: " +
        sizeLabel +
        "\nExtras: " +
        (extrasArr.join(", ") || "Keine") +
        "\nPreis: " +
        grand;
    }
    var $msgField = $("#kf-message");
    if ($msgField.length) $msgField.val(msg);
    $("html, body").animate(
      { scrollTop: $("#kf-form-section").offset().top - 20 },
      600
    );
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
  // Close mobile menu when clicking outside
  $(document).on("click", function (e) {
    const $menu = $(".navbar");
    const $menuBtn = $(".fa-bars");

    // Menü kapalıysa hiçbir şey yapma
    if (!$menu.hasClass("nav-toggle")) return;

    // Menü veya hamburger ikonuna tıklandı mı?
    const clickedInsideMenu =
      $(e.target).closest(".navbar").length > 0 ||
      $(e.target).closest(".fa-bars").length > 0;

    // Dışarı tıklandıysa kapat
    if (!clickedInsideMenu) {
      $menu.removeClass("nav-toggle");
      $menuBtn.removeClass("fa-times");
    }
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

  // Fallback: if jQuery effects (slideUp/slideDown) are not available (for example when using the
  // slim jQuery build), attach a plain JS accordion handler so the plus signs work.
  if (
    typeof jQuery === "undefined" ||
    typeof jQuery.fn === "undefined" ||
    typeof jQuery.fn.slideDown !== "function"
  ) {
    document.querySelectorAll(".accordion-header").forEach(function (header) {
      header.addEventListener("click", function () {
        var body = this.nextElementSibling;
        var isOpen = body && window.getComputedStyle(body).display !== "none";
        if (isOpen) {
          body.style.display = "none";
          var sp = this.querySelector("span");
          if (sp) sp.textContent = "+";
        } else {
          // close others
          document
            .querySelectorAll(".accordion .accordion-body")
            .forEach(function (b) {
              b.style.display = "none";
            });
          document
            .querySelectorAll(".accordion .accordion-header span")
            .forEach(function (s) {
              s.textContent = "+";
            });
          if (body) body.style.display = "block";
          var sp = this.querySelector("span");
          if (sp) sp.textContent = "-";
        }
      });
    });
  }

  // Handle cake form submit via AJAX
  const form = document.getElementById("cakeForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.innerText;

      submitBtn.disabled = true;
      submitBtn.innerText = "Senden...";

      // subject ayarla
      const senderName = (form.querySelector("#kf-name")?.value || "").trim();
      const subject = senderName
        ? `Neue Bestellung — ${senderName}`
        : "Neue Bestellung";

      let subjInput = form.querySelector('input[name="_subject"]');
      if (!subjInput) {
        subjInput = document.createElement("input");
        subjInput.type = "hidden";
        subjInput.name = "_subject";
        form.appendChild(subjInput);
      }
      subjInput.value = subject;

      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            window.location.href = "thanks.html";
          } else {
            alert("Fehler beim Senden des Formulars.");
          }
        })
        .catch(() => {
          alert("Formular konnte nicht gesendet werden.");
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        });
    });
  }

  // Load Latest Blog Posts for Home Page
  loadLatestPosts();
});

async function loadLatestPosts() {
  const container = document.getElementById("home-posts");
  if (!container) return;

  try {
    const res = await fetch("api/getPosts.php");
    let posts = await res.json();

    if (!posts || posts.length === 0) {
      container.innerHTML = '<p class="text-center">Keine aktuellen Blogbeiträge gefunden.</p>';
      return;
    }

    // Sort by date (descending) and take latest 3
    posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const latestPosts = posts.slice(0, 3);

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    container.innerHTML = latestPosts.map(p => {
      const summary = p.content.length > 120
        ? p.content.substring(0, 120).replace(/<[^>]*>?/gm, '') + "..."
        : p.content.replace(/<[^>]*>?/gm, '');

      return `
        <article class="blog-card">
          <div class="blog-card-img-wrapper">
            <img loading="lazy" src="${p.image_url}" class="blog-card-img" alt="${p.title}">
          </div>
          <div class="blog-card-body">
            <div class="blog-meta">
              <small>${new Date(p.created_at).toLocaleDateString("de-DE", dateOptions)}</small>
            </div>
            <h3 class="blog-card-title">${p.title}</h3>
            <p class="blog-card-text">${summary}</p>
            <a href="/post-detail.html?id=${p.id}" class="blog-read-more">Mehr lesen →</a>
          </div>
        </article>`;
    }).join('');
  } catch (err) {
    console.error("Error loading blog posts:", err);
    container.innerHTML = '<p class="text-center text-danger">Fehler beim Laden der Beiträge.</p>';
  }
}
