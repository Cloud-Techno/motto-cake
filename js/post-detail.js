const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId) {
  document.getElementById("post-detail").innerHTML =
    "<h2>Beitrag nicht gefunden.</h2>";
}

async function loadPostDetail() {
  try {
    let res = await fetch(`/api/getPost.php?id=${postId}`);
    let post = await res.json();

    if (!post || post.error) {
      document.getElementById("post-detail").innerHTML =
        "<h2>Beitrag nicht gefunden.</h2>";
      return;
    }

    document.getElementById("post-detail").innerHTML = `
            <article class="post-detail-article">
                <h1>${post.title}</h1>
                <p class="text-muted">
                    ${new Date(post.created_at).toLocaleDateString("de-DE")}
                </p>

                <img src="${post.image_url}" class="post-detail-img">

                <div class="post-detail-content">
                    ${post.content}
                </div>

                // <a href="/blog.html" class="btn btn-secondary mt-4">← Zurück</a>
            </article>
        `;
  } catch (err) {
    document.getElementById("post-detail").innerHTML =
      "<h2>Fehler beim Laden des Beitrags.</h2>";
  }
}

loadPostDetail();
