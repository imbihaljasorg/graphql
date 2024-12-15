import { initLoginPage, auth } from "../../login/login.js";
import { createHeader } from "./uiComponents.js";
import { displayGraphs } from "./categoriesDisplay.js";
import { display } from "./userDisplay.js";
import { setupLogout } from "./domUtils.js";
import { showErrorNotification, showNotification } from "./notifications.js";
import { fetchGameResults, fetchUserData } from "../../backend/api.js";

let username = "";

document.addEventListener("DOMContentLoaded", async () => {
    await init();
});

async function init() {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") {
        initLoginPage(auth);
    } else {
        const JWToken = localStorage.getItem("JWToken");
        username = localStorage.getItem("username");
        initApp(JWToken, username);
    }
}

export async function initApp(JWToken, username) {
    toggleElementVisibility("loginDiv", false);
    toggleElementVisibility("app", true);

    try {
        const [userData, gameData] = await Promise.all([
            fetchUserData(JWToken),
            fetchGameResults(JWToken)
        ]);

        createHeader(userData.data.user[0]);
        display(userData, gameData || []);
        displayGraphs(JWToken);

        showNotification(`Welcome back, ${username}!`);
    } catch (error) {
        console.error("Error initializing app:", error);
        handleError(error);
    }

    setupLogout();
}

export function formatXP(bits, decimals = 2) {
    if (!+bits) return "0 Bits"; // Handle invalid or zero input
    const bit = 1000; // Define conversion factor
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bits", "KiB", "MiB", "GiB"];
    const i = Math.floor(Math.log(bits) / Math.log(bit));

    return `${parseFloat((bits / Math.pow(bit, i)).toFixed(dm))} ${sizes[i]}`;
}

function handleError(error) {
    if (error.response) {
        // Server responded with an error status code
        showErrorNotification(`Error: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.message) {
        // General network or runtime error
        showErrorNotification(`Error: ${error.message}`);
    } else {
        showErrorNotification("Unknown error occurred. Please try again.");
    }
}

function toggleElementVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = isVisible ? "block" : "none";
    } else {
        console.warn(`Element with ID '${elementId}' not found.`);
    }
}
