async function loadPosts() {
  const container = document.getElementById("posts");
  const loadingSpinner = document.querySelector(".loading-spinner");

  // Yükleme animasyonunu göster
  if (loadingSpinner) {
    loadingSpinner.style.display = "block";
  }
  container.innerHTML = ""; // Önceki içeriği temizle

  try {
    let res = await fetch("/api/getPosts.php");

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    let posts = await res.json();

    // Yükleme animasyonunu gizle
    if (loadingSpinner) {
      loadingSpinner.style.display = "none";
    }

    if (posts.length === 0) {
      container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3 class="text-muted">Aktuell sind keine Blog-Beiträge verfügbar.</h3>
                <p>Schauen Sie später noch einmal vorbei!</p>
            </div>
        `;
      return;
    }

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    posts.forEach((p) => {
      const postDiv = document.createElement("div");
      // Yeni CSS ile uyumlu Bootstrap 4/5 ızgara sınıfı
      postDiv.className = "col-lg-4 col-md-6 mb-5";

      // Postun içeriğini kısa bir özetle sınırla (isteğe bağlı, API'niz tam içerik gönderiyorsa)
      const summaryContent =
        p.content.substring(0, 150) + (p.content.length > 150 ? "..." : "");

      postDiv.innerHTML = `
        <div class="card p-0 h-100 shadow-sm border-0">
          ${
            p.image_url
              ? `<img src="${p.image_url}" class="card-img-top" alt="${p.title}">`
              : ""
          }
          <div class="card-body d-flex flex-column">
            <h3 class="card-title">${p.title}</h3>
            <p class="card-text">${summaryContent}</p>
            <div class="mt-auto pt-2">
                <small class="text-muted">Veröffentlicht am: ${new Date(
                  p.created_at
                ).toLocaleDateString("de-DE", dateOptions)}</small>
            </div>
            <a href="post-detail.html?id=${
              p.id
            }" class="btn btn-sm mt-3" style="background-color: #e5bfbf; color: #fff;">Mehr lesen</a>
          </div>
        </div>
      `;

      container.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
    // Hata durumunda yükleme animasyonunu gizle ve kullanıcıya bilgi ver
    if (loadingSpinner) {
      loadingSpinner.style.display = "none";
    }
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <h3 class="text-danger">Fehler beim Laden der Blog-Beiträge.</h3>
            <p>Bitte versuchen Sie es später erneut. (Details: ${error.message})</p>
        </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadPosts);
