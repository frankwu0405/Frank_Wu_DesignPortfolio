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
    // The veil of blur that comes down behind the open menu (styled in the mobile section of style.css)
    const navVeil = document.createElement('div');
    navVeil.className = 'nav-veil';
    navVeil.setAttribute('aria-hidden', 'true');
    document.querySelector('.navbar').after(navVeil);

    /* Phones: while the menu is open the page (and the footer under it) steps back, scaled about the middle of the
       screen. Anything inside it that is fixed to the screen would jump once its parent is scaled, so it is pinned
       where it stands for as long as the menu is open. <html> carries 'nav-hold' from opening until the page is back,
       so scroll-driven scenes can hold still meanwhile (scaled, the page would look to them like a scroll) */
    const recedeEls = [document.querySelector('main'), document.querySelector('body > .footer')].filter(Boolean);
    const PIN = ['position', 'top', 'left', 'width', 'height'];
    let pinned = [], unpinTimer = 0;
    const recede = () => {
        if (innerWidth > 768 || !recedeEls.length) return;
        clearTimeout(unpinTimer);
        document.documentElement.classList.add('nav-hold');
        if (!pinned.length) {
            const mr = recedeEls[0].getBoundingClientRect();
            pinned = [...recedeEls[0].querySelectorAll('*')].filter((el) => getComputedStyle(el).position === 'fixed').map((el) => {
                const r = el.getBoundingClientRect(), prev = PIN.map((k) => el.style[k]);
                Object.assign(el.style, { position: 'absolute', top: `${r.top - mr.top}px`, left: `${r.left - mr.left}px`, width: `${r.width}px`, height: `${r.height}px` });
                return [el, prev];
            });
        }
        recedeEls.forEach((el) => {
            const r = el.getBoundingClientRect();
            el.style.transformOrigin = `${innerWidth / 2 - r.left}px ${innerHeight / 2 - r.top}px`;
            el.classList.add('nav-recede');
        });
    };
    const comeForward = () => {
        recedeEls.forEach((el) => el.classList.remove('nav-recede'));
        clearTimeout(unpinTimer);
        unpinTimer = setTimeout(() => {
            pinned.forEach(([el, prev]) => PIN.forEach((k, i) => { el.style[k] = prev[i]; }));
            pinned = [];
            recedeEls.forEach((el) => { el.style.transformOrigin = ''; });
            document.documentElement.classList.remove('nav-hold');
        }, 750);
    };

    // Open or close the menu: the links, the button's cross, the veil (via body.menu-open) and the page behind
    const setMenu = (open) => {
        if (open === navLinks.classList.contains('show')) return;
        navLinks.classList.toggle('show', open);
        navToggle.classList.toggle('active', open);
        document.body.classList.toggle('menu-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        if (open) recede(); else comeForward();
    };
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('show')));

    // Close the menu when a navigation link is clicked
    navLinks.querySelectorAll('li a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

    // Close it on a tap outside the links: the open menu covers the screen, so that is its own empty space
    document.addEventListener('click', (event) => {
        if (navToggle.contains(event.target)) return;
        if (!navLinks.contains(event.target) || event.target === navLinks) setMenu(false);
    });

    // The page stays put under the open menu, and Escape closes it
    navLinks.addEventListener('touchmove', (event) => { if (navLinks.classList.contains('show')) event.preventDefault(); }, { passive: false });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinks.classList.contains('show')) { setMenu(false); navToggle.focus(); }
    });
}

// ======================================================================
// FIX: Controlled Scroll Position Management (Fixes Drift, Keeps Memory)
// ======================================================================

function manageScrollPosition() {
    // 1. Check if a scroll position was saved (meaning the page was reloaded)
    const savedScrollY = sessionStorage.getItem('scrollpos');

    if (savedScrollY) {
        // IMPORTANT: Restore the scroll position immediately.
        // The slight delay (setTimeout) can sometimes be necessary to let
        // the browser's *own* scroll restoration complete its initial (incorrect)
        // action before we override it with the correct, saved value.
        window.scrollTo(0, savedScrollY);
        
        // Clear the saved position after use
        sessionStorage.removeItem('scrollpos');
    }
}

// 2. Save the current scroll position before the page unloads (on navigation or reload)
// Use 'beforeunload' for robustness across different browser actions.
window.addEventListener('beforeunload', () => {
    // The browser's native scroll restoration for history navigation (back/forward)
    // is usually accurate, so we only save the scroll position when we suspect
    // a manual action (like a refresh) might cause the drift issue.
    
    // We only save the scroll Y position.
    sessionStorage.setItem('scrollpos', window.scrollY);
});


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
// Folder Links When Opened From Disk
// ======================================================================

// Pages live at folder/index.html and link to "folder/". A server answers a folder
// with its index.html; a file opened straight from disk has no server, so the links
// name the file themselves there. The live site keeps its clean addresses.
if (location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (/^([a-z]+:|#)/i.test(href)) return;   // external, mailto:, tel:, in-page
        a.setAttribute('href', href.replace(/^([^?#]*\/)(?=[?#]|$)/, '$1index.html'));
    });
}

// ======================================================================
// Active Navigation Link Functionality (Folder-based)
// ======================================================================

// Function to highlight the current page in the navigation bar
function highlightCurrentLink() {
    // A folder and its index.html are the same page
    const folder = (path) => path.replace(/index\.html$/, '');
    const here = folder(location.pathname);

    // The case-study pages sit under the Projects tab
    const inProjects = /\/(project\d+|nitori)\/$/.test(here);

    document.querySelectorAll('.nav-links a').forEach(link => {
        const target = folder(new URL(link.getAttribute('href'), location.href).pathname);
        link.classList.toggle('active', target === here || (inProjects && target.endsWith('/projects/')));
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
    if (!backLinkWrapper) return; // pages without a back link
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
if (!cards.length) return; // pages without the carousel
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

// Blur reveal: headings (and anything marked data-blur) come into focus word by
// word as they scroll into view. Plain h2s only, so case-study cards built from
// h2.card-title / h2.card-description stay still. Long lines are paced to land
// within about a second.
(() => {
    const root = document.documentElement;
    window.__blurReady = true;
    if (!root.classList.contains('js-blur')) return;
    const targets = document.querySelectorAll('main h1, main h2:not([class]), [data-blur]');
    targets.forEach((el) => {
        // Inside a flex or grid layout, word pieces can change how the heading
        // wraps, so those headings come into focus as one line instead.
        const parentDisplay = getComputedStyle(el.parentElement).display;
        if (/flex|grid/.test(parentDisplay)) { el.classList.add('bw-whole'); return; }
        const words = [];
        const walk = (node) => {
            [...node.childNodes].forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach((part) => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                        const w = document.createElement('span');
                        w.className = 'bw';
                        w.textContent = part;
                        words.push(w);
                        frag.appendChild(w);
                    });
                    child.replaceWith(frag);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    walk(child);
                }
            });
        };
        walk(el);
        const step = Math.min(55, 900 / Math.max(words.length, 1));
        words.forEach((w, i) => w.style.setProperty('--d', `${Math.round(i * step)}ms`));
    });
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('is-focused'); io.unobserve(e.target); }
        });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((el) => io.observe(el));
    // Backup for headings inside clipped containers: reveal anything that has
    // reached the screen once scrolling settles.
    let t;
    const sweep = () => targets.forEach((el) => {
        if (!el.classList.contains('is-focused') && el.getClientRects().length && el.getBoundingClientRect().top < innerHeight) {
            el.classList.add('is-focused'); io.unobserve(el);
        }
    });
    addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(sweep, 150); }, { passive: true });
})();
