import { renderHeader } from "./header.js";
// import { renderChallengeList } from "./challengeList.js";
import { renderHomePage } from "./home.js";

export function logout() {
  axios.delete("/api/session").then((_) => {
    renderHeader();
    renderHomePage();
  });
}
