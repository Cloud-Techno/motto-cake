
  // Load Latest Blog Posts for Home Page
  loadLatestPosts();
});

async function loadLatestPosts() {
  const container = document.getElementById("home-posts");
  if (!container) return;

  try {
    const res = await fetch("/api/getPosts.php");
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
