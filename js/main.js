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

  // Contact Form – AJAX Submit ve Teşekkür Mesajı
  // $("#cakeForm").on("submit", function(e){
  //     e.preventDefault();
  //     const form = $(this);
  //     const formData = form.serialize();

  //     $.ajax({
  //         url: form.attr("action"),
  //         method: "POST",
  //         data: formData,
  //         success: function(){
  //             form[0].reset();
  //             $("#thanks").fadeIn();
  //             $('html, body').animate({ scrollTop: $("#kf-form-section").offset().top }, 500);
  //         },
  //         error: function(){
  //             alert("Nachricht konnte nicht gesendet werden.");
  //         }
  //     });
  // });

  // $(document).ready(function(){
  //   if(window.location.hash === "#kf-form-section"){
  //     $("#thanks").fadeIn();
  //     $('html, body').animate({ scrollTop: $("#kf-form-section").offset().top }, 500);
  //   }
  // });

  // main.js - Korrigierter Kontaktformular-Handler
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cakeForm");
    const thanks = document.getElementById("thanks");

    if (form && thanks) {
      form.addEventListener("submit", function (e) {
        e.preventDefault(); // Wichtig: Verhindert das Standard-Senden des Formulars

        // Form verilerini al
        const formData = new FormData(form);

        // FormSubmit.co'ya asenkron olarak gönder (AJAX modu)
        fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        })
          .then((response) => {
            // Prüfen, ob die HTTP-Antwort in Ordnung ist (Status 200-299)
            if (!response.ok) {
              throw new Error("Netzwerkfehler oder HTTP-Status nicht 2xx");
            }
            // Die Antwort von FormSubmit als JSON parsen
            return response.json();
          })
          .then((data) => {
            // Nach erfolgreichem JSON-Parsing
            if (data.success === "true") {
              // Erfolgslogik
              form.style.display = "none"; // Formular ausblenden
              thanks.style.display = "block"; // Dankesnachricht anzeigen
              thanks.scrollIntoView({ behavior: "smooth" }); // Zum Dankestext scrollen
            } else {
              // Fehler im JSON-Body (obwohl bei FormSubmit.co unwahrscheinlich)
              alert(
                "Nachricht konnte nicht gesendet werden. (Server-Antwortfehler)"
              );
            }
          })
          .catch((error) => {
            // Wird bei Netzwerkfehlern oder Fehlern im 'then' Block erreicht
            console.error("Form gönderimi hatası:", error);
            alert("Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.");
          });
      });
    }
  });
  // ... (Rest der main.js)
});
