async function loadPosts() {
  try {
    let res = await fetch("/api/getPosts.php");
    let posts = await res.json();

    const container = document.getElementById("posts");
    container.innerHTML = ""; // Temizle

    posts.forEach((p) => {
      const postDiv = document.createElement("div");
      postDiv.className = "col-md-6 mb-4";

      postDiv.innerHTML = `
                <div class="card p-3 h-100">
                    <div class="card-body">
                        <h3 class="card-title">${p.title}</h3>
                        <p class="card-text">${p.content}</p>
                        <small class="text-muted">${new Date(
                          p.created_at
                        ).toLocaleDateString("de-DE")}</small>
                    </div>
                </div>
            `;
      container.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadPosts);
