import { renderBoardList } from "./boardList.js";

export function renderAddBoardForm() {
  let name;
  let email;
  const heading = document.createElement("h1");
  axios
    .get("/api/session")
    .then((response) => {
      name = response.data.name;
      email = response.data.email;

      heading.textContent = `Add board, ${name}`;
    })
    .catch((error) => {
      name = "there is an error";
    });
  const page = document.getElementById("page");
  const addBoardFormContainer = document.createElement("div");
  addBoardFormContainer.innerHTML = `
  <section class="vh-100" style="background-color: #eee;">
  <div class="container h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-lg-12 col-xl-11">
        <div class="card text-black" style="border-radius: 25px;">
          <div class="card-body p-md-5">
            <div class="row justify-content-center">
              <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Create Board</p>
                <form class="mx-1 mx-md-4" id="create-board-form">
                  <div class="d-flex flex-row align-items-center mb-4">
                    <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                    <div class="form-outline flex-fill mb-0">
                      <label class="form-label" for="title">Board Title</label>
                      <input type="text" name="title" class="form-control" required />
                      
                    </div>
                  </div>

                  <div class="d-flex flex-row align-items-center mb-4">
                    <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div class="form-outline flex-fill mb-0">
                      <label class="form-label" for="description">Description</label>
                      <input type="text" name="description" class="form-control" required />
                    </div>
                  </div>
                  
                  <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="submit" class="btn btn-warning btn-lg">Create</button>
                  </div>
                </form>
              </div>
              <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                <img src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  class="img-fluid" alt="Sample image">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</section>
  
  `;

  const form = addBoardFormContainer.querySelector("#create-board-form");

  const errorMsg = document.createElement("p");
  errorMsg.id = "error-msg";
  page.replaceChildren(addBoardFormContainer, errorMsg);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleString();

    const data = {
      kanban_title: formData.get("title"),
      kanban_creator: name,
      kanban_members: [name],
      kanban_desc: formData.get("description"),
      column_id: 1,
      card_id: 1,
      comment_id: 0,
      kanban_columns: [
        {
          column_id: 0,
          column_title: "Column 1",
          // each column contains multiple cards/tasks
          cards: [
            {
              card_id: 0,
              card_title: "Card Title 1",
              card_desc: "More detail about this card..",
              card_creator: name,
              card_members: [name],
              card_comment: [
                {
                  comment_creator: name,
                  comment_create_time: formattedTime,
                  comment_content: "create this card as a default card at",
                },
              ],
            },
          ],
        },
      ],
    };

    axios
      .post("/api/boards", data)
      .then((_) => {
        renderBoardList();
      })
      .catch((error) => {
        errorMsg.textContent = "unknown error";
        console.log(error);
        // error.response === 400 ? "invalid field(s)" : "unknown error";
      });
  });
}
