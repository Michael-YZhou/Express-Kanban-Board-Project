import { renderAddChallengeForm } from "../addChallenge";

test("add challenge form correctly rendered", () => {
    // Arrange
    document.body.innerHTML = "<section id='page'></section>";

    // Act
    renderAddChallengeForm();

    // Assert
    const heading = document.getElementsByTagName("h1")[0];
    expect(heading.textContent).toBe("Add challenge");
    const addChallengeForm = document.getElementsByTagName("form")[0];
    const labels = addChallengeForm.getElementsByTagName("label");
    expect(labels.length).toBe(3);
    expect(labels[0].textContent).toBe("Name:");
    expect(addChallengeForm.getElementsByTagName("input").length).toBe(4);
});