document.addEventListener("DOMContentLoaded", () => {
    console.log("Stories Collection Loaded!");

    document.getElementById("storySearch").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchStory();
        }
    });
});

function searchStory() {
    let input = document.getElementById("storySearch").value.toLowerCase();
    let stories = document.querySelectorAll(".story-thumbnail");

    stories.forEach(story => {
        let title = story.querySelector("p").innerText.toLowerCase();
        if (title.includes(input)) {
            story.style.display = "block";
        } else {
            story.style.display = "none";
        }
    });
}