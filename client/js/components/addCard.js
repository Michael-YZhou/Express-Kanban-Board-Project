
import { renderBoard } from "./board.js";

let name;
let email;
let column;
let columnTitle;

export function renderAddCardForm(boardId, columnId) {
  console.log(columnId);
  const heading = document.createElement("h1");

  Promise.all([
    axios.get("/api/session"),
    axios.get(`/api/boards/${boardId}`)
  ])
    .then(([sessionResponse, boardResponse]) => {
      // 处理会话响应
      name = sessionResponse.data.name;
      email = sessionResponse.data.email;

      // 处理列响应
      column = boardResponse.data.kanban_columns.find((column)=>{
        return column.column_id == columnId
      });
      columnTitle = column.column_title;
      console.log(columnTitle)
      heading.textContent = `Please add card, ${name}`;

      // 进一步操作和渲染表单的代码
      const page = document.getElementById("page");
      // 进一步操作和渲染表单的代码
  
      const form = document.createElement("form");
      form.innerHTML = `
            <label for="title">Title:</label>
            <input type="text" name="title" required>
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
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleString();
        const comment = {
          comment_creator: name,
          comment_create_time: formattedTime,
          comment_content: ` created this card to ${columnTitle}`, // 添加其他评论相关的内容
        };
        const data = {
          card_title: formData.get("title"),
          card_creator: name,
          card_members: [name],
          card_desc: formData.get("description"),
          card_comment: [comment]
        };
        console.log(data);
        axios
          .post(`/api/boards/${boardId}/columns/${columnId}`, data)
          .then((_) => {
            renderBoard(boardId)
          })
          .catch((error) => {
            errorMsg.textContent =
              error.response.status == 400 ? "invalid field(s)" : "unknown error";
          });
      });
    })
    .catch((error) => {
      // 处理任何错误
      name = "there is an error";
    });
  }   
