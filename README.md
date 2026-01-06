# simoneyoga - Offline Clone

This is an offline clone of https://www.anima-cc.com with all assets downloaded locally.

## Quick Start

To view the site offline, you need to run a local web server (required due to browser security restrictions with CSS paths).

### Option 1: Use the provided script
```bash
./server.sh
```
Then open http://localhost:8000/index.html in your browser.

### Option 2: Use Python's built-in server
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000/index.html in your browser.

### Option 3: Use any other local web server
- Node.js: `npx http-server -p 8000`
- PHP: `php -S localhost:8000`
- Or any other local web server

## Why a server is needed

Browsers block relative paths with `../` in CSS when opening HTML files directly (file:// protocol) for security reasons. Using a local web server allows all paths to resolve correctly.

## Features

✅ All CSS files (styles.css, philosophy-mobile.css, responsive.css)  
✅ All JavaScript files (GSAP, Barba, custom scripts)  
✅ All images (visual-*.jpg, icons, photos)  
✅ All videos (screen-interlude-1.mp4)  
✅ All HTML pages (index.html, faq.html, contact.html, etc.)  
✅ Parallax effects  
✅ Mouse pointer effects  
✅ Smooth scrolling  
✅ Page transitions  

## Structure

```
anima/
├── index.html
├── faq.html
├── contact.html
├── confidentialite.html
├── mentions-legales.html
├── css/
│   ├── styles.css
│   ├── philosophy-mobile.css
│   └── responsive.css
├── js/
│   ├── gsap.min.js
│   ├── ScrollTrigger.min.js
│   ├── ScrollSmoother.min.js
│   ├── SplitText.min.js
│   ├── ScrollToPlugin.min.js
│   ├── barba.umd.js
│   └── [custom scripts]
├── images/
│   └── [all images]
└── videos/
    └── screen-interlude-1.mp4
```

## Notes

- Google Tag Manager has been removed/disabled for offline use
- All external CDN links have been replaced with local files
- Google Fonts are still loaded from CDN (will use fallback fonts if offline)


# simoneyoga
