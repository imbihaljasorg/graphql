import { showNotification } from "../script/notifications.js";

export function analyseZzleGame(games) {
    try {
        const zzleGame = games.find(game => game.name === 'zzle');
        
        if (!zzleGame) {
            showNotification("No zzle game data found!");
            return;
        }

        const startedAt = new Date(zzleGame.started_at);
        const results = zzleGame.results;
        const maxAttempts = Math.max(...results.map(r => r.attempts));
        const levelsWithMaxAttempts = results
            .filter(r => r.attempts === maxAttempts)
            .map(r => r.level);

        let firstLine = `In the zzle game that you started at ${startedAt.toLocaleString()}, `;
        firstLine += `you completed ${results.length} levels.\n\n`;

        let secondLine = '';
        if (levelsWithMaxAttempts.length === 1) {
            secondLine = `It took you ${maxAttempts} attempts to pass level ${levelsWithMaxAttempts[0]}.`;
        } else if (levelsWithMaxAttempts.length === results.length) {
            secondLine = `All levels took ${maxAttempts} attempts to complete.`;
        } else {
            secondLine = `${levelsWithMaxAttempts.length} levels took ${maxAttempts} attempts each to complete `;
            secondLine += `(levels: ${levelsWithMaxAttempts.join(', ')}).`;
        }

        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        document.body.appendChild(overlay);

        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.style.display = 'flex';

        const popupContent = document.createElement('div');
        popupContent.className = 'popup-content';

        const firstLineElem = document.createElement('p');
        firstLineElem.textContent = firstLine;
        firstLineElem.style.marginBottom = '1rem';

        const secondLineElem = document.createElement('p');
        secondLineElem.textContent = secondLine;

        popupContent.appendChild(firstLineElem);
        popupContent.appendChild(secondLineElem);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.onclick = () => {
            popup.remove();
            overlay.remove();
        };

        popupContent.appendChild(closeButton);
        popup.appendChild(popupContent);
        document.body.appendChild(popup);

        popup.onclick = (event) => {
            if (event.target === popup) {
                popup.remove();
                overlay.remove();
            }
        };

    } catch (error) {
        console.error("Error analyzing zzle game:", error);
        showNotification("Error analyzing game data");
    }
}