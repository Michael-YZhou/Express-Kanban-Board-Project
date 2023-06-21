import { renderLoginForm } from "../login.js";

test("login form correctly rendered", () => {
    // Arrange
    document.body.innerHTML = "<section id='page'></section>";

    // Act
    renderLoginForm();

    // Assert
    const heading = document.getElementsByTagName("h1")[0];
    expect(heading.textContent).toBe("Login");
    const loginForm = document.getElementsByTagName("form")[0];
    const labels = loginForm.getElementsByTagName("label");
    expect(labels.length).toBe(2);
    expect(labels[0].textContent).toBe("Email: ");
    expect(labels[1].textContent).toBe("Password: ");
});