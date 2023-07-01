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
  <section class="py-5 text-center container">
<div class="row py-lg-5">
  <div class="col-lg-6 col-md-8 mx-auto">
    <h1 class="fw-light">Kanbanify</h1>
    <h2 class="fw-light">About this tool</h2>
    <p class="lead text-muted">Optimize team performance by incorporating a visual project management tool into your workflow.
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
