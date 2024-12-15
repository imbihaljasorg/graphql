// frontend/charts/TimeTracker.js
export function calculateTimeInfo(createdAt) {
    const now = new Date();
    const dayZero = new Date(createdAt);
    
    const oneDayMs = 1000 * 60 * 60 * 24;
    const totalDays = Math.floor((now - dayZero) / oneDayMs);
    
    // Calculate the precise time components
    const timeElapsed = now - dayZero;
    const days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);
    
    return {
        totalDays,
        timeElapsed: {
            days,
            hours,
            minutes,
            seconds
        },
        creationDate: dayZero
    };
}