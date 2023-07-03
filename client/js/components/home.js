import { renderAddBoardForm } from "./addBoard.js";
import { renderBoardList } from "./boardList.js";
import { renderLoginForm } from "./login.js";
import { logout } from "./logout.js";
import { renderSignUpForm } from "./signUp.js";
import { renderBoard } from "./board.js";
import { renderUserProfile } from "./userProfile.js";

export function renderHomePage() {
  const page = document.getElementById("page");
  page.innerHTML = `

  <div class="container my-5">
    <div class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
      <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">
        <h1 class="display-4 fw-bold lh-1">Kanbanify</h1>
        <p class="lead">Optimize performance by incorporating a visual project management tool into your workflow</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
          <button type="button" class="btn btn-warning btn-lg px-4 me-md-2 fw-bold" id ="home-signup">Sign Up</button>
          <button type="button" class="btn btn-secondary btn-lg px-4" id="home-login">Log In</button>
        </div>
      </div>
      <div class="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
          <img class="rounded-lg-3" src="bootstrap-docs.png" alt="" width="720">
      </div>
    </div>
  </div>

  <section class="py-5 text-center container">
<div class="row py-lg-5">
  <div class="col-lg-6 col-md-8 mx-auto">
    <h1 class="fw-light">Kanbanify</h1>
    <h2 class="fw-light">About this tool</h2>
    <p class="lead text-muted">Optimize performance by incorporating a visual project management tool into your workflow.
    </p>
    <p>
    <button type="button" class="btn btn-warning btn-lg btn-block" id="home-login">Log In </button>
    <button type="button" class="btn btn-secondary btn-lg btn-block" id ="home-signup">Sign Up </button>
    </p>
  </div>
</div>
</section>

    `;
  document
    .querySelector("#home-signup")
    .addEventListener("click", () => renderSignUpForm());
  document
    .querySelector("#home-login")
    .addEventListener("click", () => renderLoginForm());
}
