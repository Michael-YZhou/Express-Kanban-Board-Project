let name;
let email;
let allUsers = [];

export function renderAddBoardForm() {
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

  const form = document.createElement("form");
  form.innerHTML = `
        <label for="title">Title:</label>
        <input type="text" name="title">
        <label for="description">Description: </label>
        <input type="text" name="description">
        <input type="submit">
    `;
  const errorMsg = document.createElement("p");
  errorMsg.id = "error-msg";
  page.replaceChildren(heading, form, errorMsg);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const data = {
      kanban_title: formData.get("title"),
      kanban_creator: name,
      kanban_members: [name],
      kanban_desc: formData.get("description"),
      columns_id: 0,
      kanban_columns: [
        //   {
        //     column_id: 1,
        //     column_title: "To-Do",
        //     cards: [
        //       {
        //         card_id: 1,
        //         card_title: "Task Name 1",
        //         card_desc: "",
        //         card_creator: name,
        //         card_members: [],
        //       },
        //     ],
        //   },
        //   {
        //     column_id: 2,
        //     column_title: "In Progress",
        //     cards: [
        //       {
        //         card_id: 1,
        //         card_title: "Task Name 2",
        //         card_desc: "",
        //         card_creator: name,
        //         card_members: [],
        //       },
        //     ],
        //   },
        //   {
        //     column_id: 3,
        //     column_title: "For Review",
        //     cards: [
        //       {
        //         card_id: 1,
        //         card_title: "Task Name 1",
        //         card_desc: "",
        //         card_creator: name,
        //         card_members: [],
        //       },
        //     ],
        //   },
      ],
    };

    axios
      .post("/api/boards", data)
      .then((_) => {
        renderBoardList();
      })
      .catch((error) => {
        errorMsg.textContent =
          error.response.status == 400 ? "invalid field(s)" : "unknown error";
      });
  });
}
