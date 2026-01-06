function remplacerEspaces() {
    'use strict';

    const motsACible = ['de', 'le', 'la', 'un', 'une', 'les', 'des', 'au', 'y', 'aux', 'je', 'tu', 'qui', 'que', 'en', 'tes', 'ton', 'ou', 'à', 'a', 'et', 'ta', 'ce', 'il', 'par', 'me', 'ces', 'ne', 'ni'];

    const patternMots = new RegExp(`(?<![a-zàâäéèêëïîôùûüÿæœç])(${motsACible.join('|')})\\s`, 'gi');
    const patternChiffres = /(\d+)\s/g;
    const patternPonctuation = /\s([?!:;])/g;
    const patternTiret = /\-/g;  // ✅ AJOUTER

    const elements = document.querySelectorAll('p, h1, h2, h3, h4');

    elements.forEach(element => {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
        const nodesToUpdate = [];
        let node;

        while (node = walker.nextNode()) {
            if (patternMots.test(node.textContent) ||
                patternChiffres.test(node.textContent) ||
                patternPonctuation.test(node.textContent) ||
                patternTiret.test(node.textContent)) {  // ✅ AJOUTER
                nodesToUpdate.push(node);
            }
            patternMots.lastIndex = 0;
            patternChiffres.lastIndex = 0;
            patternPonctuation.lastIndex = 0;
            patternTiret.lastIndex = 0;  // ✅ AJOUTER
        }

        nodesToUpdate.forEach(node => {
            let texte = node.textContent;
            texte = texte.replace(patternMots, '$1\u00A0');
            texte = texte.replace(patternChiffres, '$1\u00A0');
            texte = texte.replace(patternPonctuation, '\u00A0$1');
            texte = texte.replace(patternTiret, '\u2011');  // ✅ AJOUTER
            node.textContent = texte;
        });
    });
}

// Exposer globalement
window.remplacerEspaces = remplacerEspaces;

// Exécuter au chargement initial
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', remplacerEspaces);
} else {
    remplacerEspaces();
}

// Appel initial au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkOrientation);
} else {
    checkOrientation();
}

// ========================================
// RESET DES CLASSES DU BODY
// ========================================
function resetBodyClasses() {
    console.log('🔄 Reset des classes du body');

    // Liste de toutes les classes possibles du body
    const allBodyClasses = ['default', 'detente', 'energy', 'vert', 'orange', 'light'];

    // Retirer toutes les classes
    allBodyClasses.forEach(cls => document.body.classList.remove(cls));

    // Réappliquer 'default'
    document.body.classList.add('default');

    console.log('✅ Body réinitialisé avec classe "default"');
}

// Exposer globalement
window.resetBodyClasses = resetBodyClasses;

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function isMobile() {
    // Méthode 1 : Touch + largeur d'écran (la plus fiable)
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    return hasTouch && isSmallScreen;
}

function setTitle(bool) {

    const myTitles = document.querySelectorAll('.title');
    myTitles.forEach(title => {
        if (bool === false) {
            console.log("Hide title");
            title.classList.add('hide');
        } else {
            console.log("Show title");
            title.classList.remove('hide');
        }
    })
}

const myFAQNav = document.querySelector('.mobile-nav-select');
function setFAQNav(bool) {

    if (bool === false) {
        console.log("Hide myFAQNav");
        myFAQNav.classList.add('hide');
    } else {
        console.log("Show myFAQNav");
        myFAQNav.classList.remove('hide');
    }


}

// ✅ Exposer globalement
window.setTitle = setTitle;
window.setFAQNav = setFAQNav;

window.menuOpen = false;  // ✅ Variable globale via window

function setBodyTheme(theme) {
    document.body.className = theme;
    console.log("Thème appliqué :", theme);
    const allLayers = gsap.utils.toArray('.bg-gradient-layer');
    const targetLayer = document.querySelector(`.bg-gradient-layer[data-theme="${theme}"]`);

    if (!targetLayer) return;

    // Fade out tous les autres layers
    allLayers.forEach(layer => {
        if (layer !== targetLayer) {
            gsap.to(layer, {
                opacity: 0,
                duration: 1.2,
                ease: 'power2.inOut'
            });
        }
    });

    // Fade in le layer cible
    gsap.to(targetLayer, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.inOut'
    });
}

// ✅ Exposer globalement
window.setBodyTheme = setBodyTheme;

function checkOrientation() {
    const overlay = document.getElementById('orientation-overlay') || createOrientationOverlay();
    
    // Utiliser la PLUS PETITE dimension pour identifier le type d'appareil
    const smallestDimension = Math.min(window.innerWidth, window.innerHeight);
    const isMobileDevice = smallestDimension <= 768;
    const isTabletDevice = smallestDimension > 768 && smallestDimension <= 1024;
    const isPortrait = window.innerHeight > window.innerWidth;

    console.log('=== CHECK ORIENTATION ===');
    console.log('Smallest:', smallestDimension);
    console.log('isMobile:', isMobileDevice, 'isTablet:', isTabletDevice, 'isPortrait:', isPortrait);

    // Mobile paysage OU iPad portrait → bloquer
    if ((isMobileDevice && !isPortrait) || (isTabletDevice && isPortrait)) {
        console.log('→ BLOCKING');
        overlay.classList.add('active');
    } else {
        console.log('→ ALLOWING');
        overlay.classList.remove('active');
    }
}

function createOrientationOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'orientation-overlay';
    overlay.innerHTML = `
        <div class="orientation-content">
        <p><img src="images/rotate.svg" alt="Rotation" width="64" /></p>
        <p>Tourne ton appareil pour une meilleure expérience 🙈</p>
    </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
window.checkOrientation = checkOrientation;

// ========================================
// FONCTION D'INITIALISATION COMMUNE
// ========================================
function initCommons() {

    checkOrientation();

    console.log("------- début initCommons() -------");

    // ✅ Initialiser Granim en premier
    setBodyTheme('default');

    // Créer ScrollSmoother avec des paramètres optimisés
    let smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        smoothTouch: 0,
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true,
    });

    // Gérer l'interaction entre le canvas et le scroll
    const canvas = document.getElementById('canvas');

    if (canvas) {
        // Permettre le scroll à travers le canvas sur desktop
        canvas.addEventListener('wheel', function (e) {
            // Laisser passer l'événement wheel pour permettre le scroll
        });

        // Gérer le touch sur mobile pour permettre le scroll vertical
        let touchStartY = 0;
        let touchStartX = 0;

        canvas.addEventListener('touchstart', function (e) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        canvas.addEventListener('touchmove', function (e) {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = Math.abs(touchY - touchStartY);
            const deltaX = Math.abs(touchX - touchStartX);

            if (deltaY > deltaX && deltaY > 10) {
                // Laisser passer l'événement pour permettre le scroll
            }
        }, { passive: true });
    }

    console.log('ScrollSmoother initialisé avec succès');

    // ========================================
    // ✅ DÉCLARER TOUS LES ÉLÉMENTS DOM
    // ========================================
    const navHover = document.querySelector('.nav-hover');
    const line2 = document.querySelector('.line');
    const burger = document.querySelector('.nav-hover');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuRectTop = document.querySelector('.menu-rect-top');
    const menuRectBottomLeft = document.querySelector('.menu-rect-bottom-left');
    const menuRectBottomRight = document.querySelector('.menu-rect-bottom-right');
    const menuCircleOrange = document.querySelector('.menu-circle-orange');
    const menuItems = document.querySelectorAll('.menu-content li');
    const smoothWrapper = document.querySelector('#smooth-wrapper');

    window.menuOpen = false;

    // ========================================
    // ✅ DÉFINIR LES FONCTIONS (dans l'ordre logique)
    // ========================================

    function toggleLine(isHover) {
        gsap.to(line2, {
            attr: {
                x1: isHover ? 3 : 11,
                x2: isHover ? 27 : 19
            },
            duration: isHover ? 0.3 : 0.5,
            ease: "power2.inOut"
        });
    }

    function openMenu() {
        window.menuOpen = true;
        menuOverlay.classList.add('active');

        if (ScrollSmoother.get()) {
            ScrollSmoother.get().paused(true);
        }

        // ✅ Récupérer smoothWrapper dynamiquement
        const smoothWrapper = document.querySelector('#smooth-wrapper');
        if (smoothWrapper) {
            smoothWrapper.classList.add('menu-hidden');
        }

        const tl = gsap.timeline();

        // Phase 1 : Rectangles arrivent (simultanés)
        tl.to([menuRectTop, menuRectBottomLeft, menuRectBottomRight], {
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }, 0);

        // Phase 2 : Cercle orange grossit depuis le centre
        if (!isMobile()) {
            tl.fromTo(menuCircleOrange,
                {
                    width: 0,
                    height: 0,
                    marginLeft: 0,
                    marginTop: 0
                },
                {
                    width: '70vh',
                    height: '70vh',
                    marginLeft: '-35vh',
                    marginTop: '-35vh',
                    duration: 0.4,
                    ease: "power2.inOut"
                },
                0.35
            );
        } else {
            console.log("isMobile")
            tl.fromTo(menuCircleOrange,
                {
                    width: 0,
                    height: 0,
                    marginLeft: 0,
                    marginTop: 0
                },
                {
                    width: '80vw',
                    height: '80vw',
                    marginLeft: '-40vw',
                    marginTop: '-40vw',
                    duration: 0.4,
                    ease: "power2.inOut"
                },
                0.35
            );
        }

        // Phase 3 : Textes slide up
        const menuLinks = document.querySelectorAll('.menu-content li a');

        tl.to(menuLinks, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.1");
    }

    function closeMenuStep1() {
        console.log('🟠 Étape 1 : Disparition du cercle orange');
        window.menuOpen = false;

        const menuLinks = document.querySelectorAll('.menu-content li a');
        const tl = gsap.timeline();

        // 1. Textes slide down
        tl.to(menuLinks, {
            y: -100,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.in"
        });

        // 2. Cercle orange rétrécit
        tl.to(menuCircleOrange, {
            width: 0,
            height: 0,
            marginLeft: 0,
            marginTop: 0,
            duration: 0.4,
            ease: "power2.inOut"
        }, "-=0.2");

        console.log('✅ Cercle disparu, rectangles encore visibles');
    }

    function closeMenuStep2(keepHidden = false) {
        console.log('🟦 Étape 2 : Disparition des rectangles');

        const tl = gsap.timeline({
            onComplete: () => {
                menuOverlay.classList.remove('active');

                if (ScrollSmoother.get()) {
                    ScrollSmoother.get().paused(false);
                }

                // ✅ Récupérer smoothWrapper dynamiquement
                const smoothWrapper = document.querySelector('#smooth-wrapper');
                if (smoothWrapper && !keepHidden) {
                    smoothWrapper.classList.remove('menu-hidden');
                }

                gsap.set([menuRectTop, menuRectBottomLeft, menuRectBottomRight], {
                    x: 0,
                    y: 0,
                    rotationX: 0,
                    rotationY: 0
                });

                if (!isMobile()) {
                    gsap.set(menuRectTop, { y: '-100%' });
                    gsap.set([menuRectBottomLeft, menuRectBottomRight], { y: '100%' });
                } else {
                    gsap.set(menuRectTop, { y: '-100%' });
                    gsap.set(menuRectBottomRight, { y: '100%' });
                }

                console.log('✅ Rectangles disparus, menu complètement fermé');
            }
        });

        tl.to(menuRectTop, {
            y: '-100%',
            duration: 0.5,
            ease: "power2.in"
        });

        tl.to([menuRectBottomLeft, menuRectBottomRight], {
            y: '100%',
            duration: 0.5,
            ease: "power2.in"
        }, "-=0.5");

        const menuLinks = document.querySelectorAll('.menu-content li a');
        tl.set(menuLinks, {
            y: '100%'
        });
    }

    function showRectanglesTransition() {
        console.log('🟦 Transition : Apparition des rectangles');

        menuOverlay.classList.add('active');

        if (ScrollSmoother.get()) {
            ScrollSmoother.get().paused(true);
        }

        gsap.set(menuRectTop, { y: '-100%' });
        if (!isMobile()) {
            gsap.set([menuRectBottomLeft, menuRectBottomRight], { y: '100%' });
        } else {
            gsap.set(menuRectBottomRight, { y: '100%' });
        }

        const tl = gsap.timeline();

        tl.to([menuRectTop, menuRectBottomLeft, menuRectBottomRight], {
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }, 0);

        console.log('✅ Rectangles affichés');
        return tl;
    }

    function hideRectanglesTransition() {
        console.log('🟦 Transition : Disparition des rectangles');

        const tl = gsap.timeline({
            onComplete: () => {
                menuOverlay.classList.remove('active');

                if (ScrollSmoother.get()) {
                    ScrollSmoother.get().paused(false);
                }

                gsap.set([menuRectTop, menuRectBottomLeft, menuRectBottomRight], {
                    x: 0,
                    y: 0,
                    rotationX: 0,
                    rotationY: 0
                });

                if (!isMobile()) {
                    gsap.set(menuRectTop, { y: '-100%' });
                    gsap.set([menuRectBottomLeft, menuRectBottomRight], { y: '100%' });
                } else {
                    gsap.set(menuRectTop, { y: '-100%' });
                    gsap.set(menuRectBottomRight, { y: '100%' });
                }

                console.log('✅ Rectangles disparus');
            }
        });

        tl.to(menuRectTop, {
            y: '-100%',
            duration: 0.5,
            ease: "power2.in"
        });

        tl.to([menuRectBottomLeft, menuRectBottomRight], {
            y: '100%',
            duration: 0.5,
            ease: "power2.in"
        }, "-=0.5");

        return tl;
    }

    function closeMenu(keepHidden = false) {
        window.menuOpen = false;

        const tl = gsap.timeline({
            onComplete: () => {
                menuOverlay.classList.remove('active');

                if (ScrollSmoother.get()) {
                    ScrollSmoother.get().paused(false);
                }

                // ✅ Récupérer smoothWrapper dynamiquement
                const smoothWrapper = document.querySelector('#smooth-wrapper');
                if (smoothWrapper && !keepHidden) {
                    smoothWrapper.classList.remove('menu-hidden');
                }

                gsap.set([menuRectTop, menuRectBottomLeft, menuRectBottomRight], {
                    x: 0,
                    y: 0,
                    rotationX: 0,
                    rotationY: 0
                });

                if (!isMobile()) {
                    gsap.set(menuRectTop, { y: '-100%' });
                    gsap.set([menuRectBottomLeft, menuRectBottomRight], { y: '100%' });
                } else {
                    gsap.set(menuRectTop, { y: '-100%' });
                    gsap.set(menuRectBottomRight, { y: '100%' });
                }
            }
        });

        const menuLinks = document.querySelectorAll('.menu-content li a');

        tl.to(menuLinks, {
            y: -100,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.in"
        });

        tl.to(menuCircleOrange, {
            width: 0,
            height: 0,
            marginLeft: 0,
            marginTop: 0,
            duration: 0.4,
            ease: "power2.inOut"
        }, "-=0.2");

        tl.to(menuRectTop, {
            y: '-100%',
            duration: 0.5,
            ease: "power2.in"
        }, "-=0.3");

        tl.to([menuRectBottomLeft, menuRectBottomRight], {
            y: '100%',
            duration: 0.5,
            ease: "power2.in"
        }, "-=0.5");

        tl.set(menuLinks, {
            y: '100%'
        });
    }

    // ========================================
    // ✅ PARALLAXE 3D (DESKTOP UNIQUEMENT)
    // ========================================
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        if (!window.menuOpen || isMobile()) return;

        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(menuRectTop, {
            x: mouseX * 4,
            y: mouseY * 4,
            rotationY: mouseX * 1,
            rotationX: -mouseY * 1,
            duration: 0.5,
            ease: "power2.out"
        });

        gsap.to(menuRectBottomLeft, {
            x: mouseX * 6,
            y: mouseY * 6,
            rotationY: mouseX * 1.5,
            rotationX: -mouseY * 1.5,
            duration: 0.5,
            ease: "power2.out"
        });

        gsap.to(menuRectBottomRight, {
            x: mouseX * 6,
            y: mouseY * 6,
            rotationY: mouseX * 1.5,
            rotationX: -mouseY * 1.5,
            duration: 0.5,
            ease: "power2.out"
        });

        gsap.to(menuCircleOrange, {
            x: mouseX * 8 + 'px',
            y: mouseY * 8 + 'px',
            rotationY: mouseX * 2,
            rotationX: -mouseY * 2,
            duration: 0.5,
            ease: "power2.out",
            transformOrigin: "center center"
        });
    });

    // ========================================
    // ✅ EVENT LISTENERS
    // ========================================
    if (navHover) {
        navHover.addEventListener('mouseenter', () => toggleLine(true));
        navHover.addEventListener('mouseleave', () => toggleLine(false));
    }

    if (burger) {
        burger.addEventListener('click', (e) => {
            e.preventDefault();
            if (!window.menuOpen) {
                openMenu();
            } else {
                closeMenu();
            }
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay ||
                e.target.classList.contains('menu-rectangles') ||
                e.target.classList.contains('menu-rect') ||
                e.target.classList.contains('menu-close')) {
                closeMenu();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.menuOpen) {
            closeMenu();
        }
    });

    // ========================================
    // ✅ EXPOSER LES FONCTIONS GLOBALEMENT
    // ========================================
    window.closeMenuStep1 = closeMenuStep1;
    window.closeMenuStep2 = closeMenuStep2;
    window.showRectanglesTransition = showRectanglesTransition;
    window.hideRectanglesTransition = hideRectanglesTransition;
    window.closeMenu = closeMenu;

    // ========================================
    // ✅ LOADER DE TRANSITION (VANILLA JS)
    // ========================================
    const pageLoader = document.getElementById('page-loader');
    const loaderIcon = document.getElementById('loader-icon');

    if (loaderIcon && !isMobile()) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;

        // Écouter les mouvements de souris
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // animation smooth avec lerp (interpolation linéaire)
        function animate() {
            // Lerp pour un mouvement fluide (0.1 = vitesse, plus bas = plus lent)
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;

            // Appliquer la position
            loaderIcon.style.left = currentX + 'px';
            loaderIcon.style.top = currentY + 'px';

            requestAnimationFrame(animate);
        }

        animate();
    }

    window.showLoader = () => {
        if (pageLoader) pageLoader.classList.add('active');
    };

    window.hideLoader = () => {
        if (pageLoader) pageLoader.classList.remove('active');
    };

    console.log("------- fin initCommons() -------");
}

// ✅ Exposer globalement
window.initCommons = initCommons;

// ✅ Appeler au chargement initial
document.addEventListener('DOMContentLoaded', initCommons);
