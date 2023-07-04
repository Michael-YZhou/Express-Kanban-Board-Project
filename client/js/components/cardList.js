import { renderBoard } from "./board.js";

let commentId;

export function renderCard(boardId, columnId, cardId) {
  const page = document.getElementById("page");
  const cardInfoPage = document.createElement("div");
  cardInfoPage.classList.add(
    "row",
    "justify-content-center",
    "align-items-center"
  );
  // display the loading text while data is being retrieved and page is renderred
  const paragraph = document.createComment("p");
  paragraph.textContent = "Loading";
  page.replaceChildren(paragraph);
  //Use Promise all to get the data from database.
  Promise.all([
    axios.get(`/api/session`),
    axios.get(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`),
  ]).then(([session, board]) => {
    const sessionName = session.data.name;
    const sessionEmail = session.data.name;

    const card = board.data;
    // console.log(board)
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card");
    //Css for cardContainer
    cardContainer.id = "card-container";
    cardContainer.style.width = "36rem";
    cardContainer.style.height = "100%";
    // render the header section of the board
    const cardInfoContainer = document.createElement("div");
    cardInfoContainer.classList.add("cardsinfo");

    //Use input element to set up focus and blur
    const cardTitle = document.createElement("input");
    cardTitle.value = card.card_title;
    cardTitle.name = "title";
    //Css for cardTitle
    cardTitle.required = true;
    cardTitle.style.border = "0px";
    cardTitle.style.width = "100%";
    cardTitle.style.fontSize = "30px";
    cardTitle.style.padding = "10px";
    cardTitle.style.fontStyle = "border";
    //Css end
    //Using focus and keypress to change the card title
    cardTitle.addEventListener("focus", () => {
      console.log("focus");
    });
    cardTitle.addEventListener("keypress", (event) => {
      if (event.key.toLowerCase() == "enter") {
        // console.log('saving new title'+event.target.value)
        event.preventDefault();
        const title = event.target.value;

        const data = {
          card_title: title,
        };

        axios
          .put(
            `/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`,
            data
          )
          .then(() => {
            renderCard(boardId, columnId, cardId);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
    cardTitle.addEventListener("blur", (event) => {
      event.preventDefault();
      const title = event.target.value;

      const data = {
        card_title: title,
      };

      axios
        .put(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`, data)
        .then(() => {
          renderCard(boardId, columnId, cardId);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    const cardCreator = document.createElement("p");
    cardCreator.textContent = `Card creator:${card.card_creator}`;

    const cardMembersContainer = document.createElement("div");
    cardMembersContainer.style.display = "flex";

    const cardMembers = document.createElement("p");
    cardMembers.textContent = `Member:${card.card_members}`;

    const cardAddMembersButton = document.createElement("button");
    cardAddMembersButton.classList.add("btn", "btn-outline-primary", "btn-sm");
    cardAddMembersButton.style.width = "25px";
    cardAddMembersButton.style.height = "20px";
    cardAddMembersButton.textContent = "+";
    cardAddMembersButton.style.display = "flex";
    cardAddMembersButton.style.alignItems = "center";
    cardAddMembersButton.style.justifyContent = "center";
    cardAddMembersButton.style.margin = "2px";
    // cardAddMembersButton.addEventListener('click',()=>{
    //   const addMembersform = document.createElement('form');
    //   addMembersform.innerHTML = `
    //     <label for="addmember">Add more members by Emails:</label>
    //     <input type="email" name="addmember" required>
    //     <button type="submit" class="btn btn-outline-primary btn-sm">Save</button>
    //     <button type="button"  class="btn btn-outline-secondary btn-sm" id="cancel-button">Cancel</button>
    // `;
    // })
    cardMembersContainer.append(cardMembers, cardAddMembersButton);

    const descriptionContainer = document.createElement("div");
    const cardDescription = document.createElement("p");
    cardDescription.textContent = `Description:`;
    cardDescription.style.fontSize = "20px";
    cardDescription.style.margin = "2px";

    const descriptionForm = document.createElement("form");
    descriptionForm.innerHTML = `
                <div class="form-floating">
                    <textarea class="form-control" name="description" placeholder="Leave a comment here" id="floatingTextarea" style="width:550px;"></textarea>
                    <label for="floatingTextarea">${card.card_desc}</label>
                    <button style="margin: 4px;" type='submit' class="btn btn-outline-primary btn-sm" id="cancel-button"> Save </button>
                </div>
            `;

    descriptionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(descriptionForm);
      const description = formData.get("description");
      let data;
      //Check if description is empty or not
      if (description.trim() === "") {
        // input is empty return 'Add a more detailed description'
          data = {
          card_desc: card.card_desc,
        }
      }else{//or return input value
           data = {
            card_desc: description,
          }
        axios
          .put(
            `/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`,
            data
          )
          .then(() => {
            renderCard(boardId, columnId, cardId);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });

    descriptionContainer.append(cardDescription, descriptionForm);
  

    const commentContainer = document.createElement("div");

    const commentContent = document.createElement("p");
    console.log(card.card_comment);

    if (Array.isArray(card.card_comment)) {
      for (const comment of card.card_comment) {
        const commentName = comment.comment_creator;
        const createTime = comment.comment_create_time;
        const commentDetail = comment.comment_content;

        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");

        // Comment info section
        const commentInfo = document.createElement("span");
        commentInfo.textContent = `${commentName}: ${commentDetail} ${createTime}`;

        commentElement.appendChild(commentInfo);

        // To determine is a comment or a log if it is comment you will have some Edit and delete buttons also a border
        if ("comment_id" in comment) {
          commentElement.style.border = "1px solid black";
          commentElement.style.minHeight = "40px";
          commentElement.style.marginBottom = "5px";
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.classList.add("btn", "btn-outline-warning", "btn-sm");
          editButton.style.margin = "4px";
          commentId = comment.comment_id;
          console.log(commentId);
          // Edit button work function
          editButton.addEventListener("click", () => {
            commentId = comment.comment_id;
            console.log(commentId);
            const commentForm = document.createElement("form");
            commentForm.innerHTML = `
                        <label for="edit-comment">Edit Comment:</label>
                        <input type="text" name="edit-comment" required>
                        <button type="submit" class="btn btn-outline-primary btn-sm">Save</button>
                        <button type="button"  class="btn btn-outline-secondary btn-sm" id="cancel-button">Cancel</button>
                      `;

            //Save changed comment function
            commentForm.addEventListener("submit", (event) => {
              event.preventDefault();
              commentId = comment.comment_id;
              console.log(commentId);
              const formData = new FormData(commentForm);
              const editedComment = formData.get("edit-comment");

              // update the edited comments
              updateComment(
                boardId,
                columnId,
                cardId,
                commentId,
                editedComment
              );

              // after sumbit remove the edit comments sections
              commentElement.removeChild(commentForm);
            });

            // cancel button
            const cancelButton = commentForm.querySelector("#cancel-button");

            // if you dont wanna change the comment it will closed the form
            cancelButton.addEventListener("click", () => {
              commentElement.removeChild(commentForm);
            });

            //commentform append to the body
            commentElement.appendChild(commentForm);
          });

          // update the comment
          function updateComment(
            boardId,
            columnId,
            cardId,
            commentId,
            editedComment
          ) {
            // send the data
            const data = {
              comment_content: editedComment,
            };

            axios
              .put(
                `/api/boards/${boardId}/columns/${columnId}/cards/${cardId}/comments/${commentId}`,
                data
              )
              .then(() => {
                renderCard(boardId, columnId, cardId); //return to renderCard page
              })
              .catch((error) => {
                console.log(error); //handle error
              });
          }

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.style.margin = "4px";
          deleteButton.classList.add("btn", "btn-outline-danger", "btn-sm");
          // delete button for delete comment
          deleteButton.addEventListener("click", () => {
            commentId = comment.comment_id;
            console.log(commentId);
            axios
              .delete(
                `/api/boards/${boardId}/columns/${columnId}/cards/${cardId}/comments/${commentId}`
              )
              .then((_) => {
                renderCard(boardId, columnId, cardId);
              });
          }),
            commentElement.appendChild(editButton);
          commentElement.appendChild(deleteButton);
        }

        commentContent.appendChild(commentElement);
      }
    }

    const commentForm = document.createElement("form");
    commentForm.innerHTML = `
                <div class="form-floating">
                  <textarea class="form-control" name="comment" placeholder="Leave a comment here" id="floatingTextarea2" style="width:550px;height: 100px"></textarea>
                  <label for="floatingTextarea2">Comments</label>
                  <button style="margin: 4px;" type='submit' class="btn btn-outline-primary btn-sm">Save</button>
                </div>
            `;
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(commentForm);
      const comment = formData.get("comment");
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleString();
      const data = {
        comment_create_time: formattedTime,
        comment_content: comment,
      };
      axios
        .post(
          `/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`,
          data
        )
        .then((_) => {
          renderCard(boardId, columnId, cardId);
        });
    });
    cardInfoContainer.append(
      cardTitle,
      cardCreator,
      cardMembersContainer,
      descriptionContainer,
      commentContent,
      commentForm
    );

    const buttonGroup = document.createElement("div");
    buttonGroup.style.display = "flex";
    const deleteCardButton = document.createElement("button");
    deleteCardButton.classList.add("btn", "btn-outline-danger");
    deleteCardButton.style.margin = "4px";
    deleteCardButton.textContent = "Delete card";
    deleteCardButton.addEventListener("click", () => {
      axios
        .delete(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`)
        .then((_) => {
          renderBoard(boardId);
        });
    });

    const backToColumnButton = document.createElement("button");
    backToColumnButton.textContent = "Go back";
    backToColumnButton.style.margin = "4px";
    backToColumnButton.classList.add("btn", "btn-outline-success");
    backToColumnButton.addEventListener("click", () => {
      axios
        .get(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`)
        .then((_) => {
          renderBoard(boardId);
        });
    });
    buttonGroup.append(deleteCardButton, backToColumnButton);
    cardContainer.append(cardInfoContainer, buttonGroup);

    // add the cards to columns section
    page.appendChild(cardInfoPage);
    cardInfoPage.replaceChildren(cardContainer);
  });
}
