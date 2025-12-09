// URL’den id al
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId) {
  document.getElementById("post-detail").innerHTML =
    "<h3>Beitrag nicht gefunden.</h3>";
}

loadPostDetail();

async function loadPostDetail() {
  try {
    const res = await fetch("/api/getPosts.php");
    const posts = await res.json();

    const post = posts.find((p) => p.id == postId);

    if (!post) {
      document.getElementById("post-detail").innerHTML =
        "<h3>Beitrag existiert nicht.</h3>";
      return;
    }

    document.getElementById("post-detail").innerHTML = `
      <img src="${
        post.image_url
      }" style="width:100%; border-radius:15px; margin-bottom:20px;">
      
      <h1 style="color:#935f5f;">${post.title}</h1>
      <p style="color:#777; margin:10px 0;">
        ${new Date(post.created_at).toLocaleDateString("de-DE")}
      </p>
      <div style="font-size:1.6rem; line-height:1.7; color:#444;">
        ${post.content.replace(/\n/g, "<br>")}
      </div>
      
      <a href="blog.html" 
         style="display:block; margin-top:40px; font-weight:600; color:#935f5f;">
         ← Zurück zum Blog
      </a>
    `;
  } catch (e) {
    console.error(e);
  }
}
