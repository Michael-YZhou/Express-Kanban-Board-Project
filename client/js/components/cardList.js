import { renderBoard } from "./board.js";

export function renderCard(boardId,columnId,cardId) {
    const page = document.getElementById("page");
  
    // display the loading text while data is being retrieved and page is renderred
    const paragraph = document.createComment("p");
    paragraph.textContent = "Loading";
    page.replaceChildren(paragraph);
  
    axios.get(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`).then((board) => {
      const card = board.data;
      // console.log(board)
      const cardContainer = document.createElement("div");
      cardContainer.id = "card-container"; 
      // render the header section of the board
            // console.log(board.card);
            const cardInfoContainer = document.createElement('div');
            cardInfoContainer.classList.add('cardsinfo');
            
            const cardTitle = document.createElement("h1");
            cardTitle.textContent = card.card_title;

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
            if(Array.isArray(card.card_comment)){
              for(const comment of card.card_comment){
                const commentName = comment.comment_creator;
                const creatTime = comment.comment_create_time;
                const commentDatil = comment.comment_content;
                commentContent.append(commentName,commentDatil,creatTime)
              }
            }

            const commentForm = document.createElement('form');
            commentForm.innerHTML=`
                <label for='comment'>Give some comments</label>
                <input type='text' name='comment'>
                <input type='submit'>
            `
            cardInfoContainer.append(cardTitle,cardCreator,cardMembers,cardDescription,descriptionForm,commentContent,commentForm);

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
  