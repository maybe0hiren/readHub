document.addEventListener("DOMContentLoaded", () => {
    console.log("Stories Collection Loaded!");

    document.getElementById("storySearch").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchStory();
        }
    });

    loadContinueReading();
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

document.querySelectorAll(".info-icon").forEach(icon => {
    icon.addEventListener("click", (e) => {
        e.preventDefault();

        const wrapper = icon.closest(".thumbnail-wrapper");

        const title = wrapper.querySelector(".story-title")?.innerText || "Untitled";
        const author = wrapper.querySelector(".story-author")?.innerText || "Unknown Author";
        const description = wrapper.querySelector(".story-description")?.innerText || "No description available.";

        document.getElementById("infoTitle").innerText = title;
        document.getElementById("infoAuthor").innerText = "Author: " + author;
        document.getElementById("infoDescription").innerText = description;

        const panel = document.getElementById("infoPanel");
        panel.classList.remove("hidden");
        panel.classList.add("show");
    });
});

// Close button to hide the panel
document.querySelector(".close-btn").addEventListener("click", () => {
    const panel = document.getElementById("infoPanel");
    panel.classList.remove("show");
    panel.classList.add("hidden");
});

function loadContinueReading() {
    const username = localStorage.getItem("currentUser");
    const section = document.getElementById("continueReadingSection");

    if (!username || !section) return;

    fetch(`http://localhost:5000/progress?username=${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && Array.isArray(data.progress)) {
                const container = section.querySelector("#continueReadingContent");
                container.innerHTML = "";

                if (data.progress.length > 0) {
                    section.style.display = "block";
                }

                data.progress.forEach(story => {
                    const thumb = document.createElement("div");
                    thumb.className = "story-thumbnail";
                    thumb.innerHTML = `
                        <a href="${story}">
                            <img src="thumbnails/${story.replace('.html', '.jpg')}" alt="${story}">
                            <p>${story.replace('.html', '')}</p>
                        </a>
                    `;
                    container.appendChild(thumb);
                });
            }
        })
        .catch(err => console.error("Failed to load continue reading:", err));
}
