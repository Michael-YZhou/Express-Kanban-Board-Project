export function renderUsagePage() {
  const page = document.getElementById("page");
  const usageContainer = document.createElement("div");
  usageContainer.innerHTML = `
    <h1>Kanbanify</h1>
    <div class="alert alert-warning" role="alert">
      <h2>Overview</h2>
      <p>Kanbanify is a Single Page Application (SPA) that allows users to create kanban boards, including adding and
        removing columns, and managing individual cards within each column. The application is built using MongoDB,
        Express.js, Node.js, and Bootstrap.</p>
    </div>
    `;
  page.replaceChildren(usageContainer);
}
