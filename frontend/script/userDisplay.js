import { createElement } from "./domUtils.js";
import { calculateTimeInfo } from "../charts/TimeTracker.js";
import { analyseZzleGame } from "../charts/GameAnalysis.js";
import { showNotification } from "./notifications.js";

export function display(data, gameData) {
    const userInfoContainer = document.getElementById("userInfoContainer");
    if (!userInfoContainer) {
        console.error("userInfoContainer element not found");
        return;
    }

    if (userInfoContainer._currentTimerDiv?.cleanup) {
        userInfoContainer._currentTimerDiv.cleanup();
    }

    userInfoContainer.innerHTML = "";

    const userInfoDiv = createElement("div", "userInfo");
    const header = createElement("h2", "userInfoHeader", "User Information");
    userInfoDiv.appendChild(header);

    // Check if the user data structure contains valid information and display it.
    if (data && data.data && data.data.user && data.data.user[0]) {
        userInfoDiv.appendChild(displayInfo(data.data.user[0], gameData));
        const timerDiv = displayAccountAge(data.data.user[0]);
        userInfoDiv.appendChild(timerDiv);
        // Store reference to timer div for cleanup
        userInfoContainer._currentTimerDiv = timerDiv;
    } else {
        console.warn("User data is incomplete or missing.");
    }

    userInfoContainer.appendChild(userInfoDiv);
}

function createMemoryButton(gameData = []) {
    const buttonContainer = createElement("div", "memoryButtonContainer");
    buttonContainer.style.textAlign = "center";
    buttonContainer.style.marginTop = "20px";

    const memoryButton = createElement("button", "memoryButton", "🤔 Do you remember?");
    memoryButton.onclick = () => {
        try {
            console.log("Raw game data:", gameData); 
            const allGames = (gameData || []).flatMap(session => session.games || []);
            console.log("Processed games:", allGames);
            if (allGames.length === 0) {
                showNotification("No game data available yet!");
                return;
            }
            analyseZzleGame(allGames);
        } catch (error) {
            console.error("Error processing game data:", error);
            showNotification("Couldn't load game data. Please try again later.");
        }
    };

    buttonContainer.appendChild(memoryButton);
    return buttonContainer;
}

export function displayInfo(user, gameData = []) {
    console.log("displayInfo() gameData:",gameData);
    const infoDiv = createElement("div", "infoDiv");
    infoDiv.appendChild(createElement("div", "userData", "Username: " + user.login));
    infoDiv.appendChild(createElement("div", "userData", "First name: " + user.attrs.firstName));
    infoDiv.appendChild(createElement("div", "userData", "Last name: " + user.attrs.lastName));
    infoDiv.appendChild(createElement("div", "userData", "E-mail: " + user.attrs.email));
    infoDiv.appendChild(createElement("div", "userData", "Phone number: " + user.attrs.tel));
    infoDiv.appendChild(createElement("div", "userData", "Address: " + 
        user.attrs.addressStreet + ", " + 
        user.attrs.addressCity + ", " + 
        user.attrs.country ));
       

    infoDiv.appendChild(createMemoryButton(gameData));
    return infoDiv;
}

export function displayAccountAge(data) {
    const timerDiv = createElement("div", "timerDiv");
    timerDiv.style.marginTop = "16px";

    const header = createElement("h3", "timeHeader", "Account Age");
    timerDiv.appendChild(header);

    const timerContainer = createElement("div", "timer");
    
    const timeDisplay = createElement("div", "counterDiv");
    timerContainer.appendChild(timeDisplay);
    timerDiv.appendChild(timerContainer);
    
    const updateTimer = () => {
        const accountInfo = calculateTimeInfo(data.createdAt);
        const { days, hours, minutes, seconds } = accountInfo.timeElapsed;
        
        const liveTimer = createElement("div", "timeCounter", 
            `${days} days, ${hours}h ${minutes}m ${seconds}s`);
        
        timeDisplay.innerHTML = '';
        timeDisplay.appendChild(liveTimer);
    };
    
    updateTimer();
    
    const timerId = setInterval(updateTimer, 1000);
    
    timerDiv.cleanup = () => clearInterval(timerId);
    
    return timerDiv;
}