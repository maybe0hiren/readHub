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

function saveReadingProgress(storyId, title, thumbnail, position) {
    localStorage.setItem("continueReading", JSON.stringify({
        storyId: storyId,
        title: title,
        thumbnail: thumbnail,
        position: position
    }));
}

function loadContinueReading() {
    let savedStory = JSON.parse(localStorage.getItem("continueReading"));
    if (savedStory) {
        let section = document.getElementById("continueReadingSection");
        section.innerHTML = `<div class='continue-story' onclick='resumeStory()'>
                                <img src='${savedStory.thumbnail}' alt='${savedStory.title}'>
                                <p>${savedStory.title}</p>
                            </div>`;
    }
}

function resumeStory() {
    let savedStory = JSON.parse(localStorage.getItem("continueReading"));
    if (savedStory) {
        window.location.href = `/story/${savedStory.storyId}`;
        setTimeout(() => {
            window.scrollTo(0, savedStory.position);
        }, 500);
    }
}

function trackReadingProgress() {
    let storyId = document.getElementById("storyId").value; // Hidden input or other method to get ID
    let title = document.querySelector("h1").innerText; // Assuming the title is inside <h1>
    let thumbnail = document.querySelector(".story-thumbnail img").src;
    let position = window.scrollY; // Current scroll position

    saveReadingProgress(storyId, title, thumbnail, position);
}
