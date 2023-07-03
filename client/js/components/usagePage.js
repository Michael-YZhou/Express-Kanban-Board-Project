export function renderUsagePage() {
  const page = document.getElementById("page");
  const usageContainer = document.createElement("div");
  usageContainer.innerHTML = `
<div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="alert alert-warning" role="alert">
            <h1>Overview</h1>
            <p>Kanbanify is a Single Page Application (SPA) that allows users to create kanban boards, including adding and
                removing columns, and managing individual cards within each column. The application is built using MongoDB,
                Express.js, Node.js, and Bootstrap.</p>
        </div>
    
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="alert alert-secondary" role="alert">
            <h2>Create a Kanban Board</h2>
            <p>On the dashboard, you can create a new kanban board by clicking on "Create Board". Provide a title and a description for your board, and then click "Create" to proceed.</p>
            </div>
        </div>

        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="alert alert-warning" role="alert">
                <h2>Add Columns</h2>
                <p>You will be redirected to the board view, where you can add columns (called lists) by selecting "Add List" on the "Menu" drop down button.</p>
            </div>
        </div>

        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="alert alert-secondary" role="alert">
                <h2>Move Columns</h2>
                <p>Columns can be easily moved by selecting the dropdown button and clicking on "Move List" and selecting the new position</p>
            </div>
        </div>

        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="alert alert-warning" role="alert">
                <h2>Add Cards</h2>
                <p>To add cards within a column, click on the column header and then click on the "Add Card" button on the dropdown.</p>
            </div>
        </div>

    </div>
</div>
    `;
  page.replaceChildren(usageContainer);
}
