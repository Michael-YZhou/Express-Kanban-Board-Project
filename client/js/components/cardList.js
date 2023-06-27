
export function renderCard(boardId) {
    const page = document.getElementById("page");
  
    // display the loading text while data is being retrieved and page is renderred
    const paragraph = document.createComment("p");
    paragraph.textContent = "Loading";
    page.replaceChildren(paragraph);
  
    axios.get(`/api/boards/${boardId}`).then((board) => {
      board = board.data;
      const cardContainer = document.createElement("div");
      cardContainer.id = "card-container"; 
      // create column elements and append to the columns section
      for (let column of board.kanban_columns) {
        for (let card of column["cards"]) {
      // render the header section of the board
            console.log(board.card);
            const cardInfoContainer = document.createElement('div');
            cardInfoContainer.classList.add('cardsinfo');
            cardInfoContainer.draggable = true;
            
            const cardTitle = document.createElement("h1");
            cardTitle.textContent = card.card_title;

            const cardCreator = document.createElement('p');
            cardCreator.textContent = card.card_creator;

            const cardMembers = document.createElement('p');
            cardMembers.textContent = card.card_members;
            
            const cardDescription = document.createElement('p');
            cardDescription.textContent = card.card_desc;

            const descriptionForm = document.createElement('form');
            descriptionForm.innerHTML = `
                <label for='description'>Description here:</label>
                <input type='text' name='description'>
                <input type='submit'>
            `;

            descriptionForm.addEventListener("submit",(event)=>{
              event.preventDefault();
              const formData = new FormData(descriptionForm);
              const data = {
                card_desc: formData.get('description')
              };
              axios.put(`/api/boards/${boardId}`,data)
              .then(()=>{
                renderCard(boardId);
              })
              .catch((error)=>{
                console.log(error);
              })
            })
            const commentContent = document.createElement('p');
            for(let element of card.card_comment){
                const commentName = element.comment_creator;
                const comment = element.comment_content;
                commentContent.append(commentName,comment)
            };

            const commentForm = document.createElement('form');
            commentForm.innerHTML=`
                <label for='comment'>Give some comments</label>
                <input type='text' name='comment'>
                <input type='submit'>
            `
            cardInfoContainer.append(cardTitle,cardCreator,cardMembers,cardDescription,descriptionForm,commentContent,commentForm);

            const addCardButton = document.createElement('button');
            addCardButton.textContent = 'Add more card';
    
            cardContainer.append(cardInfoContainer,addCardButton)
        }
        // add the column to columns section
        page.replaceChildren(cardContainer);
      }
    });
  }
  