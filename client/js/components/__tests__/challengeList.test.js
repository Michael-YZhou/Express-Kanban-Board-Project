import { renderChallengeList } from "../challengeList";
import MockAdapter from "axios-mock-adapter";
import { waitFor, fireEvent } from "@testing-library/dom";
import axios from "axios";

test("challenge list correctly rendered", () => {
    // Arrange
    window.axios = axios;
    document.body.innerHTML = "<section id='page'></section>";
    const mockAxios = new MockAdapter(axios);
    const mockResponse = [
        {
            "_id": "6483221386be014d11b90d71",
            "name": "Human Harbour Bridge",
            "description": "Make a human bridge and take a photo with the Sydney Harbour Bridge in the background.",
            "address": "1 Bennelong Point, Sydney NSW 2000"
        },
        {
            "_id": "6483221386be014d11b90d72",
            "name": "Botanic Gardens",
            "description": "Take a photo of the weirdest looking plant you can find in the Royal Botanic Gardens.",
            "address": "4A Macquarie St, Sydney NSW 2000"
        }
    ];
    mockAxios.onGet("/api/challenges").reply(200, mockResponse);
  
    // Act
    renderChallengeList();

    // Assert
    return waitFor(() => {
        const challengeHeadings = document.getElementsByTagName("h2");
        expect(challengeHeadings.length).toBe(2);
    }).then(() => {  
        const challengeHeadings = document.getElementsByTagName("h2");
        expect(challengeHeadings[0].textContent).toBe("Human Harbour Bridge");
        expect(challengeHeadings[0].nextSibling.textContent).toBe("Make a human bridge and take a photo with the Sydney Harbour Bridge in the background.");
        expect(challengeHeadings[1].textContent).toBe("Botanic Gardens");
    });
});

test("challenge edit buttons render edit form with prepopulated values when clicked", () => {
    // Arrange
    window.axios = axios;
    document.body.innerHTML = "<section id='page'></section>";
    const mockAxios = new MockAdapter(axios);

    const mockChallengesResponse = [
        {
            "_id": "6483221386be014d11b90d71",
            "name": "Human Harbour Bridge",
            "description": "Make a human bridge and take a photo with the Sydney Harbour Bridge in the background.",
            "address": "1 Bennelong Point, Sydney NSW 2000"
        },
        {
            "_id": "6483221386be014d11b90d72",
            "name": "Botanic Gardens",
            "description": "Take a photo of the weirdest looking plant you can find in the Royal Botanic Gardens.",
            "address": "4A Macquarie St, Sydney NSW 2000"
        }
    ];
    mockAxios.onGet("/api/challenges").reply(200, mockChallengesResponse);
    // need to mock session as only authenticated users can click Edit button
    mockAxios.onGet("/api/session").reply(200);
  
    // Act
    renderChallengeList();
    waitFor(() => {
        const challengeHeadings = document.getElementsByTagName("h2");
        expect(challengeHeadings.length).toBe(2);
    }).then(() => {  
        const editButton = document.getElementById("edit-challenge-6483221386be014d11b90d71").getElementsByTagName("button")[0];
        fireEvent.click(editButton);
    });

    // Assert  
    return waitFor(() => {
        const editForms = document.getElementsByTagName("form");
        expect(editForms.length).toBe(1);
    }).then(() => {  
        const editForm = document.getElementsByTagName("form")[0];
        const labels = editForm.getElementsByTagName("label");
        expect(labels.length).toBe(3);
        expect(labels[0].textContent).toBe("Name:");
        const inputs = editForm.getElementsByTagName("input");
        expect(inputs.length).toBe(4); 
        expect(inputs[0].value).toBe("Human Harbour Bridge");
    });
});

test("challenge delete buttons trigger an API call to delete the challenge when clicked", () => {
    // Arrange
    window.axios = axios;
    document.body.innerHTML = "<section id='page'></section>";
    const mockAxios = new MockAdapter(axios);

    const mockChallengesResponse = [
        {
            "_id": "6483221386be014d11b90d71",
            "name": "Human Harbour Bridge",
            "description": "Make a human bridge and take a photo with the Sydney Harbour Bridge in the background.",
            "address": "1 Bennelong Point, Sydney NSW 2000"
        },
        {
            "_id": "6483221386be014d11b90d72",
            "name": "Botanic Gardens",
            "description": "Take a photo of the weirdest looking plant you can find in the Royal Botanic Gardens.",
            "address": "4A Macquarie St, Sydney NSW 2000"
        }
    ];
    mockAxios.onGet("/api/challenges").reply(200, mockChallengesResponse);
    mockAxios.onDelete(new RegExp("api/challenges/*")).reply(200);
    // need to mock session as only authenticated users can click Delete button
    mockAxios.onGet("/api/session").reply(200);
  
    // Act
    renderChallengeList();
    waitFor(() => {
        const challengeHeadings = document.getElementsByTagName("h2");
        expect(challengeHeadings.length).toBe(2);
    }).then(() => {  
        const deleteButton = document.getElementsByTagName("button")[0];
        fireEvent.click(deleteButton);
        // Assert
        expect(mockAxios.history.delete.length).toBe(1);
        expect(mockAxios.history.delete[0].url).toBe("api/challenges/6483221386be014d11b90d71");
    });
});