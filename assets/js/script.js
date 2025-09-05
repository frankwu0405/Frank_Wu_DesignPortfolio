// ======================================================================
// Carousel Functionality
// ======================================================================

const carouselInner = document.querySelector('.carousel-inner');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;
let startX = 0;
let endX = 0;
let autoPlayInterval;

// Function to update the carousel position based on the current index.
// It checks if slides have a width before attempting to update the position.
function updateCarousel() {
    // Ensure slides exist and have a valid width to prevent errors
    if (slides.length > 0 && slides[0].offsetWidth > 0) {
        const offset = -currentIndex * slides[0].offsetWidth;
        carouselInner.style.transform = `translateX(${offset}px)`;
    }
}

// Function to start the automatic carousel slide
function startAutoPlay() {
    // Clear any existing interval to prevent multiple timers
    clearInterval(autoPlayInterval);
    // Set a new interval to advance the carousel every 5 seconds
    autoPlayInterval = setInterval(() => {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0; // Loop back to the first slide
        }
        updateCarousel();
    }, 5000);
}

// Function to stop the automatic carousel slide
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Event listener for the "Next" button
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0; // Loop back to the first slide
        }
        updateCarousel();
        stopAutoPlay(); // Stop auto-play on manual navigation
        startAutoPlay(); // Restart the auto-play timer
    });
}

// Event listener for the "Previous" button
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = slides.length - 1; // Loop back to the last slide
        }
        updateCarousel();
        stopAutoPlay(); // Stop auto-play on manual navigation
        startAutoPlay(); // Restart the auto-play timer
    });
}

// Add touch event listeners for swiping on mobile
if (carouselInner) {
    carouselInner.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carouselInner.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    carouselInner.addEventListener('touchend', () => {
        // Calculate the difference in horizontal position
        const diff = startX - endX;

        // If the swipe is significant enough, change the slide
        if (diff > 50) {
            // Swipe left (next slide)
            currentIndex++;
            if (currentIndex >= slides.length) {
                currentIndex = 0;
            }
        } else if (diff < -50) {
            // Swipe right (previous slide)
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
            }
        }
        updateCarousel();
        stopAutoPlay(); // Stop auto-play on manual navigation
        startAutoPlay(); // Restart the auto-play timer
    });
}

// Ensure the initial carousel position is set and auto-play starts after all images and resources
// have loaded to get the correct slide widths.
window.addEventListener('load', () => {
    updateCarousel();
    startAutoPlay();
});

// Pause auto-play when the mouse is over the carousel
if (carouselInner) {
    carouselInner.addEventListener('mouseenter', stopAutoPlay);
    carouselInner.addEventListener('mouseleave', startAutoPlay);
}


// ======================================================================
// Mobile Menu Functionality
// ======================================================================

// Select the hamburger menu button and the navigation links container
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

// Check if menu elements exist before adding event listeners
if (navToggle && navLinks) {
    // Add a click event listener to the toggle button
    navToggle.addEventListener('click', () => {
        // Toggle the 'show' class to display or hide the mobile menu
        navLinks.classList.toggle('show');
        // Toggle the 'active' class on the button itself for the 'X' icon
        navToggle.classList.toggle('active');
        // Toggle a class on the body to darken the background
        document.body.classList.toggle('menu-open');
    });

    // Close the menu when a navigation link is clicked
    const navLinksList = document.querySelectorAll('.nav-links li a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            // Remove the 'show' class to hide the menu after a link is selected
            navLinks.classList.remove('show');
            // Also remove the active class from the toggle button
            navToggle.classList.remove('active');
            // And remove the class from the body
            document.body.classList.remove('menu-open');
        });
    });

    // Close the menu when the user clicks outside of the menu and the toggle button
    document.addEventListener('click', (event) => {
        // Check if the click was outside of both the toggle button and the menu itself
        if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) {
            // If the menu is currently open, close it
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                // Also remove the active class from the toggle button
                navToggle.classList.remove('active');
                // And remove the class from the body
                document.body.classList.remove('menu-open');
            }
        }
    });
}


// ======================================================================
// Reusable Fade-in-on-scroll Functionality
// ======================================================================

// This function handles the fade-in animations as elements scroll into view
function setupIntersectionObserver() {
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing the element once it has faded in
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Loop through all elements with the 'fade-in' class and observe them
    fadeInElements.forEach(element => {
        observer.observe(element);
    });
}

// ======================================================================
// Parallax Scrolling Effect
// ======================================================================
// This function handles the background parallax effect
function handleParallax() {
    const scrollPosition = window.scrollY;
    // Adjust the '0.1' value to change the speed of the parallax effect
    document.body.style.backgroundPositionY = -scrollPosition * 0.1 + 'px';
}

// Listen for scroll events and call the parallax function
window.addEventListener('scroll', handleParallax);

// ======================================================================
// Logo Click Functionality
// ======================================================================
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', () => {
        // Toggles the 'clicked' class on the logo element
        // This class will make the hover effect "last"
        logo.classList.toggle('clicked');
    });
}

// ======================================================================
// Active Navigation Link Functionality (File-based)
// ======================================================================

// Function to highlight the current page in the navigation bar
function highlightCurrentLink() {
    // Get the current page's URL pathname, e.g., '/projects.html'
    let currentPath = window.location.pathname;

    // Handle the case of the root URL ('/') which should be the index page
    if (currentPath === '/') {
        currentPath = 'index.html';
    } else {
        // Extract just the filename from the path
        currentPath = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    }

    // Select all the navigation links
    const links = document.querySelectorAll('.nav-links a');

    // Loop through each link
    links.forEach(link => {
        // Remove the active class from all links first to ensure only one is active
        link.classList.remove('active');

        // Check if the link's href attribute matches the current page's filename
        // The .endsWith() method is flexible for different relative path formats
        const linkHref = link.getAttribute('href');
        if (linkHref.endsWith(currentPath)) {
            // If they match, add the 'active' class to this link
            link.classList.add('active');
        } else if (currentPath.startsWith('project') && (linkHref.endsWith('projects.html') || linkHref.endsWith('index.html#projects'))) {
            // This new logic handles the project pages specifically.
            // If the current URL starts with 'project' (e.g., project1.html)
            // AND the link's href is either 'projects.html' or 'index.html#projects',
            // it will add the active class to the Projects link.
            link.classList.add('active');
        }
    });
}

// ======================================================================
// Back-Link Functionality
// ======================================================================

// Get a reference to the back-link element
const backLinkWrapper = document.querySelector('.back-link-wrapper');

// Store the last known scroll position to detect direction
let lastScrollY = window.scrollY;

// Define a threshold (in pixels) for when the button should first appear
const showThreshold = 50;

// The distance to scroll down before the button is hidden
const hideDelta = 50;

// Function to handle the scroll event
function handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Logic to hide the button on downward scroll past the delta
    if (currentScrollY > lastScrollY + hideDelta) {
        backLinkWrapper.classList.remove('is-visible');
        lastScrollY = currentScrollY; // Reset the last position to the current one
    }
    // Logic to show the button on upward scroll past the threshold
    else if (currentScrollY < lastScrollY - showThreshold) {
        backLinkWrapper.classList.add('is-visible');
        lastScrollY = currentScrollY; // Reset the last position to the current one
    }
}

// Add the scroll event listener to the window
window.addEventListener('scroll', handleScroll);


// ======================================================================
// Main execution on DOMContentLoaded
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Call the function to highlight the correct page on initial load
    highlightCurrentLink();
    // Call the setup for the fade-in effect
    setupIntersectionObserver();
});

// ======================================================================
// Image Modal Functionality (Updated with Zoom and Pan)
// ======================================================================

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close-btn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const clickableImages = document.querySelectorAll('.clickable-image');

// Zoom and pan state variables
let currentZoom = 1;
const zoomStep = 0.2;
const maxZoom = 3;
const minZoom = 0.5;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;
let translateX = 0;
let translateY = 0;

// Function to apply the transform to the modal image
function updateTransform() {
    modalImage.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
}

// Reset the zoom and pan when the modal is closed
function resetModal() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    isPanning = false;
    updateTransform();
}

// Add a click event listener to each image
clickableImages.forEach(image => {
    image.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImage.src = image.src; // Set the modal image source
        resetModal(); // Reset transform for the new image
    });
});

// Close the modal when the close button is clicked
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resetModal();
    });
}

// Close the modal when the user clicks anywhere outside of the image
if (modal) {
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetModal();
        }
    });
}

// Zoom controls
if (zoomInBtn && zoomOutBtn) {
    zoomInBtn.addEventListener('click', () => {
        currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
        updateTransform();
    });

    zoomOutBtn.addEventListener('click', () => {
        currentZoom = Math.max(currentZoom - zoomStep, minZoom);
        updateTransform();
    });
}

// Pan controls for the image
if (modalImage) {
    // Desktop: Mouse pan controls
    // This event listener starts the drag action when the mouse button is pressed down.
    modalImage.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent accidental image drag outside of modal
        isPanning = true;
        startPanX = e.clientX - translateX;
        startPanY = e.clientY - translateY;
        modalImage.style.cursor = 'grabbing';
    });

    // This event listener updates the image position as long as the mouse is moving
    // AND the mouse button is held down (isPanning is true).
    modalImage.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        translateX = e.clientX - startPanX;
        translateY = e.clientY - startPanY;
        updateTransform();
    });

    // This event listener stops the drag action when the mouse button is released.
    modalImage.addEventListener('mouseup', () => {
        isPanning = false;
        modalImage.style.cursor = 'grab';
    });

    // Mobile: Touch pan controls
    // This listener starts the touch drag on the image.
    modalImage.addEventListener('touchstart', (e) => {
        isPanning = true;
        // e.touches[0] gives the first finger's position
        startPanX = e.touches[0].clientX - translateX;
        startPanY = e.touches[0].clientY - translateY;
    });

    // This listener moves the image as the user drags their finger across the screen.
    modalImage.addEventListener('touchmove', (e) => {
        if (!isPanning) return;
        translateX = e.touches[0].clientX - startPanX;
        translateY = e.touches[0].clientY - startPanY;
        updateTransform();
    });

    // This listener stops the touch drag when the user lifts their finger.
    modalImage.addEventListener('touchend', () => {
        isPanning = false;
    });


    // New: Mouse wheel zoom for desktop
    modalImage.addEventListener('wheel', (e) => {
        e.preventDefault(); // Prevent page from scrolling
        // Determine zoom direction based on scroll delta
        const delta = e.deltaY > 0 ? -1 : 1;
        currentZoom = Math.min(Math.max(currentZoom + delta * zoomStep, minZoom), maxZoom);
        updateTransform();
    });
}
