export function renderHomePage() {
  const page = document.getElementById("page");
  page.innerHTML = `
  <section class="py-5 text-center container">
<div class="row py-lg-5">
  <div class="col-lg-6 col-md-8 mx-auto">
    <h1 class="fw-light">About this tool</h1>
    <p class="lead text-muted">This is a visual collaboration tool that organizes your projects and workflows into boards</p>
    <p>
      <a href="#" class="btn btn-warning my-2">Log In</a>
      <a href="#" class="btn btn-secondary my-2">Sign Up</a>
    </p>
  </div>
</div>
</section>
<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
<div class="col">
  <div class="card shadow-sm">
    <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>

    <div class="card-body">
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group">
          <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
          <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
        </div>
        <small class="text-muted">9 mins</small>
      </div>
    </div>
  </div>
</div>
<div class="col">
  <div class="card shadow-sm">
    <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>

    <div class="card-body">
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group">
          <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
          <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
        </div>
        <small class="text-muted">9 mins</small>
      </div>
    </div>
  </div>
</div>
</div>
    `;
}
