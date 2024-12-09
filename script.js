document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const videoFrame = document.getElementById("main-video");
    const currentTitle = document.getElementById("current-title");
    const slider = document.getElementById("image-container");

    let currentSlide = 0;
    let images = []; // Store image data
    let autoSlideInterval;

    // Load course data (videos)
    fetch("courses.json")
        .then(response => response.json())
        .then(data => {
            setupInitialVideo(data[0].videos[0]); // Play the first video by default
            renderCourses(data);
        })
        .catch(error => console.error("Error loading courses:", error));

    // Load image slideshow data
    fetch("images.json")
        .then(response => response.json())
        .then(imageData => {
            images = imageData;
            renderImageSlideshow(images);
        })
        .catch(error => console.error("Error loading images:", error));

    // Set up the first video
    function setupInitialVideo(video) {
        showLoader(); // Show loader
        const embedLink = video.link.replace("/view", "/preview");
        videoFrame.src = embedLink;
        currentTitle.textContent = video.name;

        // Hide loader when the video is loaded
        videoFrame.onload = () => hideLoader();
    }

    // Render the courses and their videos
    function renderCourses(courses) {
        const container = document.getElementById("course-container");

        courses.forEach(course => {
            const card = document.createElement("div");
            card.classList.add("course-card");

            // Course Title
            const title = document.createElement("h3");
            title.textContent = course.title;

            // Video Links
            const videoList = document.createElement("ul");
            course.videos.forEach(video => {
                const listItem = document.createElement("li");
                const link = document.createElement("button");
                link.textContent = video.name;

                // Update main video player on click
                link.addEventListener("click", () => {
                    setupInitialVideo(video);
                });

                listItem.appendChild(link);
                videoList.appendChild(listItem);
            });

            card.appendChild(title);
            card.appendChild(videoList);
            container.appendChild(card);
        });
    }

    // Render the image slideshow with fade effect
    function renderImageSlideshow(imageData) {
        // Clear any previous images before adding new ones
        slider.innerHTML = '';

        // Add images to the container
        imageData.forEach(image => {
            const img = document.createElement("img");
            img.src = image.fullsize; // Use full-size image for the slideshow
            img.alt = image.name;
            img.classList.add("fade-image");
            slider.appendChild(img);
        });

        // Set the first image as the active slide
        showImage(currentSlide);

        // Enable auto-sliding every 3 seconds (fade-in, fade-out)
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % images.length; // Endless loop
            showImage(currentSlide);
        }, 3000); // Change image every 3 seconds (adjustable)
    }

    // Show the selected image with fade effect
    function showImage(index) {
        const imgs = slider.querySelectorAll(".fade-image");

        imgs.forEach((img, i) => {
            if (i === index) {
                img.style.opacity = 1;  // Fade in
                img.style.transition = "opacity 1s ease-in-out";  // Smooth transition
            } else {
                img.style.opacity = 0;  // Fade out
            }
        });
    }

    // Show loader
    function showLoader() {
        loader.classList.remove("hidden");
    }

    // Hide loader
    function hideLoader() {
        loader.classList.add("hidden");
    }
});
