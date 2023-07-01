import { renderHeader } from "./components/header.js";
import { renderHomePage } from "./components/home.js";
import { renderBoardList } from "./components/boardList.js";

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

axios
  .get("/api/session")
  .then((response) => {
    renderHeader();
    renderBoardList();
  })
  .catch((error) => {
    renderHeader();
    renderHomePage();
  });
