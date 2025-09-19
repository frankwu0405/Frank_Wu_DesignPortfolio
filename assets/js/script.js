class Carousel {
    constructor(element) {
        // Find all elements within this specific carousel instance
        this.element = element;
        this.carouselInner = this.element.querySelector('.carousel-inner');
        this.slides = this.element.querySelectorAll('.carousel-slide');
        this.prevBtn = this.element.querySelector('.prev-btn');
        this.nextBtn = this.element.querySelector('.next-btn');

        // State variables specific to this carousel
        this.currentIndex = 0;
        this.startX = 0;
        this.endX = 0;
        this.autoPlayInterval = null;

        // Bind methods to the class instance to maintain `this` context
        this.updateCarousel = this.updateCarousel.bind(this);
        this.startAutoPlay = this.startAutoPlay.bind(this);
        this.stopAutoPlay = this.stopAutoPlay.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        // Initialize the carousel
        this.addEventListeners();
        this.updateCarousel(); // Set initial position
        this.startAutoPlay(); // Start auto-play
    }

    // Method to update the carousel position
    updateCarousel() {
        if (this.slides.length > 0 && this.slides[0].offsetWidth > 0) {
            const offset = -this.currentIndex * this.slides[0].offsetWidth;
            this.carouselInner.style.transform = `translateX(${offset}px)`;
        }
    }

    // Method to start autoplay for this instance
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.currentIndex++;
            if (this.currentIndex >= this.slides.length) {
                this.currentIndex = 0;
            }
            this.updateCarousel();
        }, 4000);
    }

    // Method to stop autoplay for this instance
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    // Event handler for the next button
    handleNextClick() {
        this.currentIndex++;
        if (this.currentIndex >= this.slides.length) {
            this.currentIndex = 0;
        }
        this.updateCarousel();
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    // Event handler for the previous button
    handlePrevClick() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.slides.length - 1;
        }
        this.updateCarousel();
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    // Touch event handlers for mobile swiping
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        this.endX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        const diff = this.startX - this.endX;
        if (diff > 50) { // Swipe left (next slide)
            this.currentIndex++;
        } else if (diff < -50) { // Swipe right (previous slide)
            this.currentIndex--;
        }
        if (this.currentIndex >= this.slides.length) {
            this.currentIndex = 0;
        }
        if (this.currentIndex < 0) {
            this.currentIndex = this.slides.length - 1;
        }
        this.updateCarousel();
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    // Mouse event handlers for pausing on hover
    handleMouseEnter() {
        this.stopAutoPlay();
    }

    handleMouseLeave() {
        this.startAutoPlay();
    }

    // Register all event listeners
    addEventListeners() {
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', this.handleNextClick);
        }
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', this.handlePrevClick);
        }
        if (this.carouselInner) {
            this.carouselInner.addEventListener('touchstart', this.handleTouchStart);
            this.carouselInner.addEventListener('touchmove', this.handleTouchMove);
            this.carouselInner.addEventListener('touchend', this.handleTouchEnd);
            this.carouselInner.addEventListener('mouseenter', this.handleMouseEnter);
            this.carouselInner.addEventListener('mouseleave', this.handleMouseLeave);
        }
    }
}

// Initialize all carousels on the page once the window has loaded
window.addEventListener('load', () => {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carouselElement => {
        new Carousel(carouselElement);
    });
});

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

// Toggles the parallax effect on or off by adding/removing the scroll listener.
function toggleParallax(enable) {
    if (enable) {
        window.addEventListener('scroll', handleParallax);
    } else {
        window.removeEventListener('scroll', handleParallax);
    }
}

// Listen for scroll events and call the parallax function on initial load
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
// Modal Image Zoom Functionality
// ======================================================================

// Get all the gallery images on the page
const galleryImages = document.querySelectorAll('.gallery-image');

// Get the modal, modal content image, close button, and new zoom buttons
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close-btn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');

// Variables for pan and zoom
let scale = 1;
let translateX = 0;
let translateY = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;

// Function to update the transform property of the image
function updateTransform() {
    modalImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    modalImage.style.cursor = scale > 1 ? 'grab' : 'default';
}

// Function to open the modal
if (galleryImages) {
    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            // Reset zoom and pan when a new image is opened
            scale = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();
        });
    });
}

// Function to close the modal
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Close the modal if the user clicks outside of the image
if (modal) {
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// NEW: Zoom in and Zoom out button functionality
if (zoomInBtn && zoomOutBtn) {
    // Zoom In Button
    zoomInBtn.addEventListener('click', () => {
        scale = Math.min(scale + 0.2, 5); // Max zoom level is 3
        updateTransform();
    });

    // Zoom Out Button
    zoomOutBtn.addEventListener('click', () => {
        scale = Math.max(scale - 0.2, 1); // Min zoom level is 1
        // Reset pan if scaled back to original size
        if (scale === 1) {
            translateX = 0;
            translateY = 0;
        }
        updateTransform();
    });
}

// ======================================================================
// Panning Logic (Mouse and Touch)
// ======================================================================

// These functions will handle the mouse and touch events
// They are defined here so we can add and remove them from listeners.
let handleMouseMove = (e) => {
    // This is the key change: prevent default browser drag behavior
    e.preventDefault();
    // Only pan if the flag is true
    if (!isPanning) return;
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    translateX += deltaX;
    translateY += deltaY;
    lastX = e.clientX;
    lastY = e.clientY;
    updateTransform();
};

let handleMouseUp = () => {
    // Reset the panning flag and remove the listeners
    isPanning = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    if (scale > 1) {
        modalImage.style.cursor = 'grab';
    }
};

let handleTouchMove = (e) => {
    // Prevent default touch behavior
    e.preventDefault();
    // Only pan if isPanning is true and there's one touch
    if (!isPanning || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastX;
    const deltaY = e.touches[0].clientY - lastY;
    translateX += deltaX;
    translateY += deltaY;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    updateTransform();
};

let handleTouchEnd = () => {
    isPanning = false;
};

// Mouse pan controls for desktop
if (modalImage) {
    modalImage.addEventListener('mousedown', (e) => {
        // Prevent default behavior to stop browser from initiating a native drag
        e.preventDefault();
        // Only allow panning if the image is zoomed in
        if (scale > 1) {
            isPanning = true;
            lastX = e.clientX;
            lastY = e.clientY;
            modalImage.style.cursor = 'grabbing';
            // Attach the event listeners to the window to capture events even if the mouse leaves the image
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
    });
}

// Mobile: Touch pan controls
if (modalImage) {
    modalImage.addEventListener('touchstart', (e) => {
        // Prevent default behavior to stop browser from initiating a native touch-based drag
        e.preventDefault();
        // Only allow panning if the image is zoomed in and there's only one touch (not pinch)
        if (scale > 1 && e.touches.length === 1) {
            isPanning = true;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
            // Attach the event listeners to the window for consistency
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }
    });
}

// ======================================================================
// Key Points Carousel Functionality
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
const cards = document.querySelectorAll('.key-point-card');
const container = document.querySelector('.key-point-carousel-container'); // This was missing
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dotsContainer = document.getElementById('dots-container');
let currentIndex = 0;
let autoPlayInterval;

// Function to show a specific card
function showCard(index) {
    cards.forEach(card => card.classList.remove('active'));
    cards[index].classList.add('active');
    updateDots(index);
}

// Function to update the dots
function updateDots(index) {
    const dots = dotsContainer.querySelectorAll('.key-point-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

// Function to start the automatic carousel slide
function startAutoPlay() {
    // Clear any existing interval to prevent multiple timers
    clearInterval(autoPlayInterval);
    // Set a new interval to advance the carousel every 5 seconds
    autoPlayInterval = setInterval(() => {
        currentIndex++;
        if (currentIndex >= cards.length) {
            currentIndex = 0; // Loop back to the first slide
        }
        showCard(currentIndex);
    }, 4000);
}

// Function to stop the automatic carousel slide
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}


// Create dots dynamically
for (let i = 0; i < cards.length; i++) {
    const dot = document.createElement('div');
    dot.classList.add('key-point-dot');
    dot.addEventListener('click', () => {
        stopAutoPlay();
        currentIndex = i;
        showCard(currentIndex);
        setTimeout(startAutoPlay, 5000); // Resume autoplay after a delay
    });
    dotsContainer.appendChild(dot);
}

// Add event listeners for navigation buttons
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
        showCard(currentIndex);
        setTimeout(startAutoPlay, 5000); // Resume autoplay after a delay
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
        showCard(currentIndex);
        setTimeout(startAutoPlay, 5000); // Resume autoplay after a delay
    });
}

// Add event listeners for hover to pause/resume
if (container) {
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);
}


// Initial state
showCard(currentIndex);
startAutoPlay();
});

// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(`${targetTab}-content`).classList.add('active');
    });
});
