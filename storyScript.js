document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startReadingBtn");
    const markButton = document.getElementById("markAsReadBtn");

    if (startButton) {
        startButton.addEventListener("click", () => {
            alert("Reading started!");
        });
    }

    if (markButton) {
        markButton.addEventListener("click", () => {
            markButton.textContent = "Marked as Read";
            markButton.disabled = true;
            markButton.style.opacity = "0.6";
            alert("You've marked this story as read!");
        });
    }
});

