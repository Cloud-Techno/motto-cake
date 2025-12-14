$(document).ready(function () {
  // Navbar toggle
  $(".fa-bars").click(function () {
    $(this).toggleClass("fa-times");
    $(".navbar").toggleClass("nav-toggle");
  });

  // Header scroll effect
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

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cakeForm");
    const thanks = document.getElementById("thanks");

    // robust handler: named so we can call it from capturing listener
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

      // include sender name in the email subject so received mail shows who sent it
      const senderName = (form.querySelector("#kf-name")?.value || "").trim();
      // Use requested subject format: "Neue Bestellung — <Name>" (or "Neue Bestellung" when name empty)
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

      // Debug: log subject and final FormData contents to help diagnose issues
      console.log("[contact] sending subject:", subject);
      const formData = new FormData(form);
      // Also log the _subject value as included in FormData for verification
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
            // Personalize thank-you message when name is provided
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

    // attach normal listener
    form.addEventListener("submit", handleFormSubmit);

    // capturing listener to stop other handlers or default navigation
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
});
