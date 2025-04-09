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

    loadContinueReading();
    loadOtherSections();

    setTimeout(() => {
        bindThumbnailClickHandlers();
        bindInfoIconHandlers();
    }, 100);

    if (storyName.endsWith(".html") && username && storyName !== "index.html") {
        fetch("http://localhost:5000/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, story: storyName })
        }).catch(err => console.error("Failed to save progress:", err));

        let finishedSent = false;

        window.addEventListener("scroll", () => {
            if (finishedSent) return;
            const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10;

            if (atBottom) {
                finishedSent = true;
                markStoryAsFinished(username, storyName);
            }
        });

        const markBtn = document.getElementById("markAsReadBtn");
        if (markBtn) {
            markBtn.addEventListener("click", () => {
                if (finishedSent) return;
                finishedSent = true;
                markStoryAsFinished(username, storyName, markBtn);
            });
        }
    }
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

            const username = localStorage.getItem("currentUser");

            if (username) {
                fetch("http://localhost:5000/progress", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, story })
                })
                .then(() => {
                    window.location.href = story;
                })
                .catch(err => {
                    console.error("Progress update failed:", err);
                    window.location.href = story;
                });
            } else {
                window.location.href = story;
            }
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
                    appendStoryToContainer(container, story);
                });
            }
        })
        .catch(err => console.error("Failed to load continue reading:", err));
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
                        <span class="info-icon">ℹ️</span>
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

function appendStoryToContainer(container, story) {
    fetch(`metadata/${story.replace(".html", ".json")}`)
        .then(res => res.json())
        .then(meta => {
            const wrapper = document.createElement("div");
            wrapper.className = "thumbnail-wrapper";

            wrapper.innerHTML = `
                <a href="${story}" class="story-thumbnail" data-story="${story}">
                    <div class="thumbnail">
                        <img src="thumbnails/${story.replace('.html', '.jpg')}" onerror="this.onerror=null;this.src='thumbnails/${story.replace('.html', '.png')}'" alt="${meta.title || story}">
                    </div>
                </a>
                <span class="info-icon">i</span>
            `;

            container.appendChild(wrapper);
        })
        .catch(err => console.error(`Missing metadata for ${story}`, err));
}

function markStoryAsFinished(user, story, buttonRef = null) {
    fetch("http://localhost:5000/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, story: story })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && buttonRef) {
            buttonRef.textContent = "Marked as Read";
            buttonRef.disabled = true;
        }
    })
    .catch(err => console.error("Failed to mark as finished:", err));
}
