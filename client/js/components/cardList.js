import { renderBoard } from "./board.js";


let commentId;

export function renderCard(boardId,columnId,cardId) {
    const page = document.getElementById("page");
  
    // display the loading text while data is being retrieved and page is renderred
    const paragraph = document.createComment("p");
    paragraph.textContent = "Loading";
    page.replaceChildren(paragraph);
  
    axios.get(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`).then((board) => {
      const card = board.data;
      console.log(board)
      const cardContainer = document.createElement("div");
      cardContainer.id = "card-container"; 
      cardContainer.classList.add('card');
      cardContainer.style.width = '36rem';
      cardContainer.style.height = '36rem';
      // render the header section of the board
            // console.log(board.card);
            const cardInfoContainer = document.createElement('div');
            cardInfoContainer.classList.add('cardsinfo');
            // cardInfoContainer.classList.add('card');
            // cardInfoContainer.style.width = '36rem';
            // cardInfoContainer.style.height = '36rem';




            //TODO add some padding and margin to make them looks better!!!!
            const cardTitle = document.createElement("input");
            cardTitle.value = card.card_title;
            cardTitle.name = 'title';
            cardTitle.style.border = '0px';
            cardTitle.style.width = '100%';
            cardTitle.style.fontSize = '30px';
            cardTitle.style.padding = '10px';
            cardTitle.style.fontStyle = 'border';
            cardTitle.addEventListener('focus',()=>{
              console.log('focus');
            })
            cardTitle.addEventListener('keypress',(event)=>{
              if(event.key.toLowerCase() == 'enter'){
                // console.log('saving new title'+event.target.value)
                event.preventDefault();
                const title = event.target.value;
              
                // 判断输入内容是否为空
                if (title.trim() === '') {
                  // 输入内容为空，执行相应操作（例如显示错误消息）
                  errorMessage.textContent = 'Title is empty';
                  titleForm.appendChild(errorMessage);
                  return;
                }
              
                const data = {
                  card_title: title
                };
              
                axios.put(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`, data)
                  .then(() => {
                    renderCard(boardId, columnId, cardId);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                }
            })
            cardTitle.addEventListener('blur',()=>{
              console.log('blur');
            })
            // const titleForm = document.createElement('form');
            // titleForm.innerHTML = `
            //       <div class="form-floating">
            //         <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea" style="width:350px;" required></textarea>
            //         <label for="floatingTextarea">Change Title</label>
            //         <button type='submit' class="btn btn-primary btn-sm">Save</button>
            //       </div>
            //   `;

            // titleForm.addEventListener("submit", (event) => {
            //   event.preventDefault();
            //   const formData = new FormData(titleForm);
            //   const title = formData.get('title');
            
            //   // 判断输入内容是否为空
            //   if (title.trim() === '') {
            //     // 输入内容为空，执行相应操作（例如显示错误消息）
            //     errorMessage.textContent = 'Title is empty';
            //     titleForm.appendChild(errorMessage);
            //     return;
            //   }
            
            //   const data = {
            //     card_title: title
            //   };
            
            //   axios.put(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`, data)
            //     .then(() => {
            //       renderCard(boardId, columnId, cardId);
            //     })
            //     .catch((error) => {
            //       console.log(error);
            //     });
            // });
            const cardCreator = document.createElement('p');
            cardCreator.textContent = `Card creator:${card.card_creator}`;


            const cardMembersContainer = document.createElement('div');
            cardMembersContainer.style.display='flex';

            const cardMembers = document.createElement('p');
            cardMembers.textContent = `Member:${card.card_members}`;
            
            const cardAddMembersButton = document.createElement('button');
            cardAddMembersButton.classList.add('btn', 'btn-primary', 'btn-sm');
            cardAddMembersButton.style.width = '25px';
            cardAddMembersButton.style.height = '20px';
            cardAddMembersButton.textContent = '+';
            cardAddMembersButton.style.display = 'flex';
            cardAddMembersButton.style.alignItems = 'center';
            cardAddMembersButton.style.justifyContent = 'center';
            cardAddMembersButton.style.margin = '2px';
            cardMembersContainer.append(cardMembers,cardAddMembersButton);

            const descriptionContainer = document.createElement('div');
            const cardDescription = document.createElement('p');
            cardDescription.textContent = `Description:`;
            cardDescription.style.fontSize = '20px';
            cardDescription.style.margin = '2px';
            const errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            
            const descriptionForm = document.createElement('form');
            descriptionForm.innerHTML = `
                <div class="form-floating">
                    <textarea class="form-control" name="description" placeholder="Leave a comment here" id="floatingTextarea" style="width:550px;"></textarea>
                    <label for="floatingTextarea">${card.card_desc}</label>
                    <button type='submit' class="btn btn-primary btn-sm" id="cancel-button"> Save </button>
                </div>
            `;

            descriptionForm.addEventListener("submit", (event) => {
              event.preventDefault();
              const formData = new FormData(descriptionForm);
              const description = formData.get('description');
            
              // 判断输入内容是否为空
              if (description.trim() === '') {
                // 输入内容为空，执行相应操作（例如显示错误消息）
                errorMessage.textContent = 'Description is empty';
                descriptionForm.appendChild(errorMessage);
                return;
              }
            
              const data = {
                card_desc: description
              };
            
              axios.put(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`, data)
                .then(() => {
                  renderCard(boardId, columnId, cardId);
                })
                .catch((error) => {
                  console.log(error);
                });
            });

            descriptionContainer.append(cardDescription,descriptionForm);
            

            const commentContainer = document.createElement('div');
            
            const commentContent = document.createElement('p');
            console.log(card.card_comment);
            
            if (Array.isArray(card.card_comment)) {
              for (const comment of card.card_comment) {
                const commentName = comment.comment_creator;
                const createTime = comment.comment_create_time;
                const commentDetail = comment.comment_content;
            
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
            
                // 添加评论内容
                const commentInfo = document.createElement('span');
                commentInfo.textContent = `${commentName}: ${commentDetail} ${createTime}`;
            
                commentElement.appendChild(commentInfo);
    
                  // 判断是否存在 comment_id，并添加编辑和删除按钮
                  if ('comment_id' in comment) {
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('btn','btn-warning','btn-sm');
                    commentId = comment.comment_id
                    console.log(commentId);
                    // 绑定编辑按钮的事件处理程序
                    editButton.addEventListener('click', () => {
                      commentId = comment.comment_id
                      console.log(commentId);
                      const commentForm = document.createElement('form');
                      commentForm.innerHTML = `
                        <label for="edit-comment">Edit Comment:</label>
                        <input type="text" name="edit-comment" required>
                        <button type="submit" class="btn btn-primary btn-sm">Save</button>
                        <button type="button"  class="btn btn-primary btn-sm" id="cancel-button">Cancel</button>
                      `;

                      // 绑定表单的提交事件处理程序
                      commentForm.addEventListener('submit', (event) => {
                        event.preventDefault();
                        commentId = comment.comment_id
                        console.log(commentId);
                        const formData = new FormData(commentForm);
                        const editedComment = formData.get('edit-comment');

                        // 调用更新函数，传递相关参数和编辑后的评论内容
                        updateComment(boardId, columnId, cardId, commentId, editedComment);

                        // 移除表单元素
                        commentElement.removeChild(commentForm);
                      });

                        // 获取取消按钮元素
                        const cancelButton = commentForm.querySelector('#cancel-button');

                        // 绑定取消按钮的点击事件处理程序
                        cancelButton.addEventListener('click', () => {
                          // 移除表单元素
                          commentElement.removeChild(commentForm);
                        });


                      // 将表单添加到评论元素中
                      commentElement.appendChild(commentForm);
                    });

                  // 更新评论的函数
                  function updateComment(boardId, columnId, cardId, commentId, editedComment) {
                    // 构建要发送的数据对象
                    const data = {
                      comment_content: editedComment
                    };

                    // 发送 Axios PUT 请求
                    axios.put(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}/comments/${commentId}`, data)
                      .then(() => {
                        renderCard(boardId,columnId,cardId); // 处理成功响应
                      })
                      .catch((error) => {
                        console.log(error); // 处理错误
                      });
                  }

            
                  const deleteButton = document.createElement('button');
                  deleteButton.textContent = 'Delete';
                  deleteButton.classList.add('btn','btn-danger','btn-sm');
                  // 绑定删除按钮的事件处理程序
                  deleteButton.addEventListener('click',()=>{
                    commentId = comment.comment_id
                    console.log(commentId);
                    axios.delete(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}/comments/${commentId}`).then((_)=>{
                      renderCard(boardId,columnId,cardId);
                    })
                  }),
                  commentElement.appendChild(editButton);
                  commentElement.appendChild(deleteButton);
                }
            
                commentContent.appendChild(commentElement);
              }
            }
            // const commentDiv = document.createElement('div');
            // commentDiv.classList.add("form-floating");
            // const textArea =document.createElement('textarea')
            const commentForm = document.createElement('form');
            commentForm.innerHTML=`
                <div class="form-floating">
                  <textarea class="form-control" name="comment" placeholder="Leave a comment here" id="floatingTextarea2" style="width:550px;height: 100px"></textarea>
                  <label for="floatingTextarea2">Comments</label>
                  <button type='submit' class="btn btn-primary btn-sm">Save</button>
                </div>
            `
            commentForm.addEventListener('submit',(e)=>{
              e.preventDefault();
              const formData = new FormData(commentForm);
              const comment = formData.get('comment');
              const currentTime = new Date();
              const formattedTime = currentTime.toLocaleString();
              const data ={
                  comment_create_time: formattedTime,
                  comment_content: comment
              }
              axios.post(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`, data).then((_)=>{
                renderCard(boardId,columnId,cardId)
              })
            })
            cardInfoContainer.append(cardTitle,cardCreator,cardMembersContainer,descriptionContainer,commentContent,commentForm);
            
            const buttonGroup = document.createElement('div');
            buttonGroup.style.display = 'flex';
            buttonGroup.style.flexDirection = 'spacebetween';
            const deleteCardButton = document.createElement('button');
            deleteCardButton.classList.add("btn", "btn-danger");
            deleteCardButton.textContent = 'Delete the card';
            deleteCardButton.addEventListener(('click'),()=>{
              axios.delete(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`).then((_)=>{
                renderBoard(boardId);
              })
            })

            const backToColumnButton = document.createElement('button');
            backToColumnButton.textContent = 'Go back';
            backToColumnButton.classList.add("btn","btn-success")
            backToColumnButton.addEventListener(('click'),()=>{
              axios.get(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`).then((_)=>{
                renderBoard(boardId);
              })
            })
            buttonGroup.append(deleteCardButton,backToColumnButton);
            cardContainer.append(cardInfoContainer,buttonGroup);
        
        // add the column to columns section
        page.replaceChildren(cardContainer);

    });
  }
  