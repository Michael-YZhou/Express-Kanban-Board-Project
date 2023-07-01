import { renderHeader } from "./components/header.js";
// import { renderChallengeList } from "./components/challengeList.js";
import { renderHomePage } from "./components/home.js";

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

renderHeader();
// renderChallengeList();
renderHomePage();
