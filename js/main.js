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
    // $(".fa-bars").removeClass("fa-times");
    // $(".navbar").removeClass("nav-toggle");

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

$(document).ready(function () {

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cakeForm");

    function handleFormSubmit(e) {
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
            // ✅ BAŞARILI → thanks.html'e git
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
    }

    form.addEventListener("submit", handleFormSubmit);
  });

});
//posts added for homepage 

async function loadLatestPosts() {
  const container = document.getElementById("latest-posts");
  const loadingSpinner = container.querySelector(".loading-spinner");
  loadingSpinner.style.display = "block";
  container.innerHTML = "";

  try {
    const res = await fetch("/api/getPosts.php");
    const posts = await res.json();

    loadingSpinner.style.display = "none";

    if (!posts || posts.length === 0) {
      container.innerHTML = `<div class="col-12 text-center py-5">
        <h3 class="text-muted">Zurzeit sind keine Blog-Beiträge verfügbar.</h3>
      </div>`;
      return;
    }

    // Letzte 4 Beiträge auswählen
    const lastPosts = posts.slice(0, 4); 
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    lastPosts.forEach((p) => {
      const postDiv = document.createElement("div");
      postDiv.className = "col-lg-3 col-md-6 mb-5";

      const summary =
        p.content.length > 100 ? p.content.substring(0, 100) + "..." : p.content;

      postDiv.innerHTML = `
        <article class="blog-card shadow-sm">
          <div class="blog-card-img-wrapper">
            <img loading="lazy" src="${p.image_url}" class="blog-card-img" alt="${p.title}">
          </div>
          <div class="blog-card-body">
            <h3 class="blog-card-title">${p.title}</h3>
            <p class="blog-card-text">${summary}</p>
            <div class="blog-meta">
              <small>${new Date(p.created_at).toLocaleDateString("de-DE", dateOptions)}</small>
            </div>
            <a href="/post-detail.html?id=${p.id}" class="blog-read-more">Mehr lesen →</a>
          </div>
        </article>
      `;

      container.appendChild(postDiv);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="col-12 text-center py-5">
      <h3 class="text-danger">Fehler beim Laden der Beiträge.</h3>
    </div>`;
  }
}

// Aufrufen, wenn die Seite geladen ist
if (document.getElementById("latest-posts")) {
  loadLatestPosts();
}

});
  /*
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cakeForm");
    const thanks = document.getElementById("thanks");

 
    function handleFormSubmit(e) {
      if (e) {
        try {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        } catch (err) {}
      }

      const submitBtn = form.querySelector('[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : null;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Senden...";
      }

      const senderName = (form.querySelector("#kf-name")?.value || "").trim();
     
      const subject = senderName
        ? `Neue Bestellung — ${senderName}`
        : "Neue Bestellung";
      let subjInput = form.querySelector('input[name="_subject"]');
      if (subjInput) {
        subjInput.value = subject;
      } else {
        subjInput = document.createElement("input");
        subjInput.type = "hidden";
        subjInput.name = "_subject";
        subjInput.value = subject;
        form.appendChild(subjInput);
      }

      console.log("[contact] sending subject:", subject);
      const formData = new FormData(form);
      try {
        console.log("[contact] FormData _subject:", formData.get("_subject"));
      } catch (err) {
        console.warn("[contact] unable to read FormData for debug");
      }

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json().catch(() => ({ success: false })))
        .then((data) => {
          if (data && data.success) {
            form.reset();

            fetch("thanks.html")
              .then((r) => r.text())
              .then((html) => {
                const overlay = document.createElement("div");
                overlay.id = "thanks-overlay";
                overlay.style.position = "fixed";
                overlay.style.top = "0";
                overlay.style.left = "0";
                overlay.style.width = "100%";
                overlay.style.height = "100%";
                overlay.style.background = "rgba(0,0,0,0.6)";
                overlay.style.display = "flex";
                overlay.style.alignItems = "center";
                overlay.style.justifyContent = "center";
                overlay.style.zIndex = "9999";
                overlay.innerHTML = html;
                document.body.appendChild(overlay);

                const close = overlay.querySelector(".close-thanks");
                if (close) {
                  close.addEventListener("click", function (ev) {
                    ev.preventDefault();
                    if (overlay.parentNode)
                      overlay.parentNode.removeChild(overlay);
                  });
                }
              })
              .catch((err) => {
                console.warn(
                  "Could not load thanks.html, falling back to inline message",
                  err
                );
                if (senderName) {
                  thanks.innerText = `Vielen Dank, ${senderName}! Ihre Nachricht wurde erfolgreich gesendet.`;
                } else {
                  thanks.innerText =
                    "Vielen Dank — Ihre Nachricht wurde erfolgreich gesendet!";
                }
                thanks.style.display = "block";
                document
                  .querySelector("#kf-form-section")
                  .scrollIntoView({ behavior: "smooth" });
              });
          } else {
            console.error("Form submit response", data);
            alert(
              "Fehler beim Senden des Formulars. Bitte versuchen Sie es später erneut."
            );
          }
        })
        .catch((error) => {
          console.error("Form gönderimi hatası:", error);
          alert("Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.");
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            if (originalBtnText) submitBtn.innerHTML = originalBtnText;
          }
        });
    }

    form.addEventListener("submit", handleFormSubmit);

    document.addEventListener(
      "submit",
      function (e) {
        if (e.target === form) {
          try {
            e.preventDefault();
            e.stopImmediatePropagation();
          } catch (err) {}
          handleFormSubmit(e);
        }
      },
      true
    );
  });
  */

