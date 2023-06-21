import { renderSignUpForm } from "../signUp.js";
import MockAdapter from "axios-mock-adapter";
import { waitFor, fireEvent } from "@testing-library/dom";
import axios from "axios";

test("sign up form correctly rendered", () => {
    // Arrange
    document.body.innerHTML = "<section id='page'></section>";

    // Act
    renderSignUpForm();

    // Assert
    const heading = document.getElementsByTagName("h1")[0];
    expect(heading.textContent).toBe("Signup");
    const loginForm = document.getElementsByTagName("form")[0];
    const labels = loginForm.getElementsByTagName("label");
    expect(labels.length).toBe(3);
    expect(labels[0].textContent).toBe("Name:");
    expect(labels[1].textContent).toBe("Email: ");
    expect(labels[2].textContent).toBe("Password: ");
});

test("sign up form calls API to create user when submit button clicked", () => {
    // Arrange
    window.axios = axios;
    document.body.innerHTML = "<section id='page'></section>";
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost("api/users").reply(200);
    const mockChallengesResponse = [
        {
            "_id": "6483221386be014d11b90d71",
            "name": "Human Harbour Bridge",
            "description": "Make a human bridge and take a photo with the Sydney Harbour Bridge in the background.",
            "address": "1 Bennelong Point, Sydney NSW 2000"
        }
    ];
    mockAxios.onGet("/api/challenges").reply(200, mockChallengesResponse);

    // Act
    renderSignUpForm();
    waitFor(() => {
        const heading = document.getElementsByTagName("h1")[0];
        expect(heading.textContent).toBe("Signup");
    }).then(() => {  
        document.getElementsByTagName("input")[0].value = "testname";
        document.getElementsByTagName("input")[1].value = "test@mail.com";
        document.getElementsByTagName("input")[2].value = "testpwd";

        const submitButton = document.getElementsByTagName("input")[3];
        fireEvent.click(submitButton);

        // Assert
        expect(mockAxios.history.post.length).toBe(1);
        expect(mockAxios.history.post[0].data).toBe("{\"name\":\"testname\",\"email\":\"test@mail.com\",\"password\":\"testpwd\"}");
    });
});