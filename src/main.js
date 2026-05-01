import AOS from 'aos';
import 'aos/dist/aos.css';
import '@phosphor-icons/web/bold';
import '@phosphor-icons/web/regular';

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
});

function updateIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.replace('ph-moon', 'ph-sun');
    } else {
        if (themeIcon.classList.contains('ph-sun')) {
            themeIcon.classList.replace('ph-sun', 'ph-moon');
        }
    }
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('ph-list');
    icon.classList.toggle('ph-x');
});

// Custom Cursor Particle
const cursor = document.createElement('div');
cursor.classList.add('cursor-particle');
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Lower factor for a more "floaty" bubble feel
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, #theme-toggle, .project-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// CV Management Logic
const cvUpload = document.getElementById('cv-upload');
const btnUpload = document.getElementById('btn-upload');
const btnDownload = document.getElementById('btn-download');
const cvStatus = document.getElementById('cv-status');

function initCV() {
    const savedCV = localStorage.getItem('user_cv');
    const fileName = localStorage.getItem('user_cv_name');
    
    if (savedCV && fileName) {
        cvStatus.textContent = `Ready: ${fileName}`;
        btnDownload.style.display = 'flex';
        btnUpload.innerHTML = '<i class="ph-bold ph-arrows-clockwise"></i> Replace';
    }
}

btnUpload.addEventListener('click', () => cvUpload.click());

cvUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 4MB for localStorage safety)
    if (file.size > 4 * 1024 * 1024) {
        alert('File is too large. Please select a file under 4MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const base64String = event.target.result;
        localStorage.setItem('user_cv', base64String);
        localStorage.setItem('user_cv_name', file.name);
        
        cvStatus.textContent = `Ready: ${file.name}`;
        btnDownload.style.display = 'flex';
        btnUpload.innerHTML = '<i class="ph-bold ph-arrows-clockwise"></i> Replace';
        
        // Visual feedback
        const card = document.querySelector('.cv-card');
        card.style.borderColor = 'var(--accent-color)';
        setTimeout(() => card.style.borderColor = '', 1000);
    };
    reader.readAsDataURL(file);
});

btnDownload.addEventListener('click', () => {
    const base64String = localStorage.getItem('user_cv');
    const fileName = localStorage.getItem('user_cv_name');
    
    if (base64String && fileName) {
        const link = document.createElement('a');
        link.href = base64String;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

// Initialize on load
initCV();
