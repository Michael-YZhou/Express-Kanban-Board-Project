import { renderLoginForm } from "./login.js";
import { renderSignUpForm } from "./signUp.js";

export function renderHomePage() {
  const page = document.getElementById("page");
  page.innerHTML = `

  <div class="container my-5">
    <div class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
      <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">
        <h1 class="display-4 fw-bold lh-1">Kanbanify</h1>
        <p class="lead">Optimize performance by incorporating a visual project management tool into your workflow. Kanbanify is a Single Page Application (SPA) that allows users to create kanban boards, including adding and removing columns, and managing individual cards within each column. The application is built using MongoDB, Express.js, Node.js, and Bootstrap.</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
          <button type="button" class="btn btn-warning btn-lg px-4 me-md-2 fw-bold" id ="home-signup">Sign Up</button>
          <button type="button" class="btn btn-secondary btn-lg px-4" id="home-login">Log In</button>
        </div>
      </div>
      <div class="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
          <img class="rounded-lg-3" src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"  width="750">
      </div>
    </div>
  </div>

    `;
  document
    .querySelector("#home-signup")
    .addEventListener("click", () => renderSignUpForm());
  document
    .querySelector("#home-login")
    .addEventListener("click", () => renderLoginForm());
}
