document.addEventListener("DOMContentLoaded", () => {
    console.log("Stories Collection Loaded!");

    const username = localStorage.getItem("currentUser");
    const storyName = window.location.pathname.split("/").pop();

    const searchInput = document.getElementById("storySearch");
    if (searchInput) {
        searchInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                searchStory();
            }
        });
    }

    const closeBtn = document.querySelector(".close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            const panel = document.getElementById("infoPanel");
            panel.classList.remove("show");
            panel.classList.add("hidden");
        });
    }

    // Handle Start Reading button click to update Continue Reading section
    const startButton = document.querySelector("button.start-reading");
    if (startButton) {
        startButton.addEventListener("click", () => {
            const storyTitle = document.title || "Untitled Story";
            const storyPath = window.location.pathname;
            const storyPage = storyPath.substring(storyPath.lastIndexOf("/") + 1);
            const thumbnail = "thumbnails/" + storyPage.replace(".html", ".jpg");

            const storyData = {
                title: storyTitle,
                url: storyPage,
                thumbnail: thumbnail
            };

            let continueReading = JSON.parse(localStorage.getItem("continueReading")) || [];

            // Prevent duplicates
            continueReading = continueReading.filter(story => story.url !== storyData.url);
            continueReading.unshift(storyData);

            localStorage.setItem("continueReading", JSON.stringify(continueReading));
        });
    }

    loadOtherSections();

    setTimeout(() => {
        bindThumbnailClickHandlers();
        bindInfoIconHandlers();
    }, 100);
});

function bindThumbnailClickHandlers() {
    document.querySelectorAll("a.story-thumbnail").forEach(link => {
        link.addEventListener("click", function (e) {
            const isInfoIconClick = e.target.classList.contains("info-icon");
            if (isInfoIconClick) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            const story = this.getAttribute("href") || this.getAttribute("data-story");
            if (!story || story === "index.html") return;

            e.preventDefault();
            console.log("Thumbnail clicked:", story);

            window.location.href = story;
        });
    });
}

function bindInfoIconHandlers() {
    document.querySelectorAll(".info-icon").forEach(icon => {
        icon.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const wrapper = icon.closest(".thumbnail-wrapper");
            if (!wrapper) return;

            const storyLink = wrapper.querySelector("a.story-thumbnail");
            if (!storyLink) return;

            const storyName = storyLink.getAttribute("data-story") || storyLink.getAttribute("href");

            fetch(`metadata/${storyName.replace(".html", ".json")}`)
                .then(res => res.json())
                .then(meta => {
                    document.getElementById("infoTitle").innerText = meta.title || "Untitled";
                    document.getElementById("infoAuthor").innerText = meta.author || "Unknown Author";
                    document.getElementById("infoDescription").innerText = meta.description || "No description available.";

                    const panel = document.getElementById("infoPanel");
                    panel.classList.remove("hidden");
                    panel.classList.add("show");
                })
                .catch(err => {
                    console.error("Metadata fetch failed:", err);
                });
        });
    });
}

function searchStory() {
    let input = document.getElementById("storySearch").value.toLowerCase();
    let stories = document.querySelectorAll(".story-thumbnail");

    stories.forEach(story => {
        let title = story.querySelector(".story-title")?.innerText.toLowerCase();
        if (title.includes(input)) {
            story.style.display = "block";
        } else {
            story.style.display = "none";
        }
    });
}

function loadOtherSections() {
    document.querySelectorAll(".story-section").forEach(section => {
        const container = section.querySelector(".story-content");
        if (!container) return;

        container.querySelectorAll(".thumbnail-wrapper").forEach(wrapper => {
            const link = wrapper.querySelector("a.story-thumbnail");
            if (!link) return;

            const story = link.getAttribute("data-story") || link.getAttribute("href");
            if (!story) return;

            fetch(`metadata/${story.replace(".html", ".json")}`)
                .then(res => res.json())
                .then(meta => {
                    wrapper.innerHTML = `
                        <a href="${story}" class="story-thumbnail" data-story="${story}">
                            <div class="thumbnail">
                                <img src="thumbnails/${story.replace('.html', '.jpg')}" onerror="this.onerror=null;this.src='thumbnails/${story.replace('.html', '.png')}'" alt="${meta.title || story}">
                            </div>
                        </a>
                        <span class="info-icon">i</span>
                    `;
                })
                .catch(err => console.error("Failed to load metadata for", story, err));
        });

        setTimeout(() => {
            bindThumbnailClickHandlers();
            bindInfoIconHandlers();
        }, 100);
    });
}
