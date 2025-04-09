document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("currentUser");
    const storyName = window.location.pathname.split("/").pop();

    if (username && storyName) {
        fetch("http://localhost:5000/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, story: storyName })
        }).catch(err => console.error("Failed to save progress:", err));
    }
});
