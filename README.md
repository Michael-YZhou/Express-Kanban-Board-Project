# Kanbanify

## Overview

Kanbanify is a Single Page Application (SPA) that allows users to create kanban boards, including adding and removing columns, and managing individual cards within each column. The application is built using MongoDB, Express.js, Node.js, and Bootstrap.

## Features

- **User Accounts:** Users can create their own accounts to securely save and access their kanban boards.

- **Kanban Board Creation:** Users can create their own kanban boards to organize tasks and workflows.

- **Column Management:** Users can add and remove columns within a kanban board to customize their workflow.

- **Card Management:** Users can create, edit, move and delete individual cards within each column to track and manage their tasks.

### Future Features

The following features are planned for future development:

- **Board Members:** Users will be able to invite other members to collaborate on their boards. Members will be able to contribute to the board's progress.

- **Live Updating:** The application will utilize web sockets to provide real-time updates to all connected users, allowing them to see changes made by other members without refreshing the page.

- **Card Color Customization:** Users will have the ability to change the color of individual cards to match their preferences or to indicate priority or status.

## Technologies Used

The following technologies were used to build this application:

- **MongoDB:** A NoSQL database used to store and retrieve kanban board data, columns, and cards.

- **Express.js:** A web application framework for Node.js used to handle routing and server-side logic.

- **Node.js:** A JavaScript runtime environment used for server-side development.

- **Bootstrap:** A popular CSS framework used for building responsive and visually appealing user interfaces.

## Installation

## Installation

To run this application locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your/repository.git`

2. Install dependencies: `npm install`

3. Set up MongoDB: Ensure you have MongoDB installed and running on your local machine. Update the database connection configuration in `config.js` if necessary.

4. Start the server: `node server.js`

5. Open your browser and navigate to `http://localhost:3000` to access the application.

## Usage

## Usage

Once the application is running, follow these steps to use Kanbanify:

1. On the homepage, you can create a new account by clicking on "Sign Up" and providing the required details. If you already have an account, you can proceed to log in.

2. After logging in, you will be taken to your dashboard.

3. On the dashboard, you can create a new kanban board by clicking on "Create Board". Provide a title and a description for your board, and then click "Create" to proceed.

4. You will be redirected to the board view, where you can add columns (called lists) by selecting "Add List" on the "Menu" drop down button.

5. Columns can be easily moved by selecting the dropdown button and clicking on "Move List" and selecting the new position

6. To add cards within a column, click on the column header and then click on the "Add Card" button on the dropdown.

7. Edit, delete cards by clicking on the "Edit" and "Delete" buttons.

8. Move cards between columns by cliking on "Move" and adding the card to a new column

9. To remove a column, click on the column header dropdown and then click on the "Remove Column" button.

## Contributing

This app was made by Eddie, Andreina and Yang.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and use the code for your own purposes.
