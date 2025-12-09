async function loadPosts() {
  const container = document.getElementById("posts");
  const loadingSpinner = document.querySelector(".loading-spinner");

  loadingSpinner.style.display = "block";
  container.innerHTML = "";

  try {
    let res = await fetch("/api/getPosts.php");
    let posts = await res.json();

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

            <a href="/post-detail.html?id=${p.id}" class="blog-read-more">
              Mehr lesen →
            </a>
          </div>
        </article>
      `;

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

document.addEventListener("DOMContentLoaded", loadPosts);
