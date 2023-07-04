import { renderHeader } from "./header.js";
import { renderBoardList } from "./boardList.js";
import { renderSignUpForm } from "./signUp.js";
export function renderLoginForm() {
  const page = document.getElementById("page");
  const loginDiv = document.createElement("div");
  loginDiv.innerHTML = `
  <section class="h-100" style="background-color: #eee;">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-xl-10">
        <div class="card rounded-3 text-black">
          <div class="row g-0">
            <div class="col-lg-6">
              <div class="card-body p-md-5 mx-md-4">
                <div class="text-center">
                  <h1>Log In</h1>
                </div>

                <form id="login-form-el">
                  <p>Please login to your account</p>
                  <div class="form-outline mb-4">
                    <input type="email"  class="form-control" placeholder="Email address" name="email" />
                    <label class="form-label" for="username">Username</label>
                  </div>

                  <div class="form-outline mb-4">
                    <input type="password" name="password" class="form-control" />
                    <label class="form-label" for="form2Example22">Password</label>
                  </div>


                  <div class="form-outline mb-4">
                  <label class="form-label text-danger" id="error-msg-login" for="error"></label>
                </div>
                <div class="d-flex align-items-center justify-content-center pb-4">
                  <button type="submit" class="btn btn-outline-success">Log In</button>  
                </div>

                  <div class="d-flex align-items-center justify-content-center pb-4"> 
                  <p class="mb-0 me-2">Don't have an account?</p>
                    <button type="button" class="btn btn-outline-success" id="sign-up-redirect">Create new</button>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-lg-6 d-flex align-items-center" style="background-image: url('../img/logo-removebg-preview.png'); background-size: 450px 520px; background-repeat: no-repeat;">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    `;

  page.replaceChildren(loginDiv);
  document
    .getElementById("sign-up-redirect")
    .addEventListener("click", (event) => {
      renderSignUpForm();
    });
  const form = document.getElementById("login-form-el");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    axios
      .post("/api/session", data)
      .then((_) => {
        renderHeader();
        renderBoardList();
      })
      .catch((error) => {
        let errorMsg = document.getElementById("error-msg-login");
        errorMsg.textContent = error.response.data.message;
      });
  });
}
