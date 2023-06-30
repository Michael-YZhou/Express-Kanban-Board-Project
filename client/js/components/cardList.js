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
      // render the header section of the board
            // console.log(board.card);
            const cardInfoContainer = document.createElement('div');
            cardInfoContainer.classList.add('cardsinfo');
            
            const cardTitle = document.createElement("h1");
            cardTitle.textContent = card.card_title;

            const titleForm = document.createElement('form');
            titleForm.innerHTML = `
                  <label for='title'>Change the title here:</label>
                  <input type='text' name='title'>
                  <input type='submit'>
              `;

            titleForm.addEventListener("submit", (event) => {
              event.preventDefault();
              const formData = new FormData(titleForm);
              const title = formData.get('title');
            
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
            });
            const cardCreator = document.createElement('p');
            cardCreator.textContent = card.card_creator;

            const cardMembers = document.createElement('p');
            cardMembers.textContent = card.card_members;
            
            const cardDescription = document.createElement('p');
            cardDescription.textContent = card.card_desc;

            const errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            
            const descriptionForm = document.createElement('form');
            descriptionForm.innerHTML = `
                <label for='description'>Description here:</label>
                <input type='text' name='description'>
                <input type='submit'>
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
                    editButton.classList.add('edit-button');
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
                        <button type="submit">Save</button>
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
                  deleteButton.classList.add('delete-button');
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
            
            const commentForm = document.createElement('form');
            commentForm.innerHTML=`
                <label for='comment'>Give some comments</label>
                <input type='text' name='comment'>
                <input type='submit'>
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
            cardInfoContainer.append(cardTitle,titleForm,cardCreator,cardMembers,cardDescription,descriptionForm,commentContent,commentForm);

            const deleteCardButton = document.createElement('button');
            deleteCardButton.textContent = 'Delete the card';
            deleteCardButton.addEventListener(('click'),()=>{
              axios.delete(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`).then((_)=>{
                renderBoard(boardId);
              })
            })

    
            cardContainer.append(cardInfoContainer,deleteCardButton)
        
        // add the column to columns section
        page.replaceChildren(cardContainer);

    });
  }
  