gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* function isMobile() {
    // Méthode 1 : Touch + largeur d'écran (la plus fiable)
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    return hasTouch && isSmallScreen;
} */

async function initHomePage() {  // ✅ 1. Ajouter "async"
    const smoothWrapper = document.querySelector('#smooth-wrapper');
    smoothWrapper.style.opacity = '0';
    setTitle(true);
    setFAQNav(false);
    // ✅ 2. PRÉCHARGER AVANT TOUT LE RESTE
    console.log('🎬 Démarrage initHomePage avec préchargement');
    await preloadHomePage();
    console.log('✅ Préchargement terminé, initialisation du reste...');

    // ✅ 3. Tout le code existant reste identique après
    // ✅ Initialiser Granim en premier
    setBodyTheme('default');

    // Créer ScrollSmoother avec des paramètres optimisés
    let smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5, // Durée de l'effet de lissage (plus c'est élevé, plus c'est fluide)
        smoothTouch: 0, // Lissage tactile pour mobile
        effects: true, // Active les effets de déformation (facultatif)
        normalizeScroll: true, // Normalise le scroll entre différents navigateurs
        ignoreMobileResize: true, // Évite les problèmes sur mobile
    });

    // Gérer l'interaction entre le canvas et le scroll
    const canvas = document.getElementById('canvas');

    if (canvas) {
        // Permettre le scroll à travers le canvas sur desktop
        canvas.addEventListener('wheel', function (e) {
            // Laisser passer l'événement wheel pour permettre le scroll
            // Ne pas faire e.preventDefault() ici
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

            // Si le mouvement est plus vertical qu'horizontal, permettre le scroll
            if (deltaY > deltaX && deltaY > 10) {
                // Laisser passer l'événement pour permettre le scroll
                // Ne pas faire e.preventDefault()
            }
        }, { passive: true });
    }

    console.log('ScrollSmoother initialisé avec succès');

    gsap.to("#canvas", {
        opacity: 0, // Diminue l'opacitÃ© Ã  0
        duration: 1,
        ease: "none", // Adoucit l'animation
        scrollTrigger: {
            trigger: ".philosophy", // Ã‰lÃ©ment qui dÃ©clenche le scroll
            start: "top bottom", // DÃ©bute lorsque le haut de l'Ã©lÃ©ment atteint le haut du viewport
            end: "top 25%", // Termine lorsque le bas de l'Ã©lÃ©ment atteint le haut du viewport
            scrub: true, // Synchronise l'animation avec le scroll
            markers: false
        },
    });

    ScrollTrigger.create({
        trigger: ".philosophy",
        start: "top bottom",
        end: "top 25%",
        markers: false,
        onEnter: () => {
            gsap.to(".logo span", {
                opacity: 0,
                duration: 0.3,
            });
        },
        onLeaveBack: () => {
            gsap.to(".logo span", {
                opacity: 1,
                duration: 0.3,
            });
        }
    });




    // Parallaxe : le slogan remonte plus vite que le scroll normal
    gsap.to('.slogan', {
        yPercent: -750, // Remonte de 150% = plus rapide que le scroll normal (-100%)
        ease: "none",
        scrollTrigger: {
            trigger: '.slogan h1',
            start: "bottom bottom", // Démarre quand le bottom du h1 touche le bottom du viewport
            endTrigger: ".philosophy",
            end: "bottom top", // Finit quand le bottom de philosophy sort du viewport
            scrub: true, // Lié au scroll
            markers: false
        }
    });

    // Dans ton DOMContentLoaded, après tes autres SplitText

    const splashDuration = 1

    // Split du h1
    const h1Split = new SplitText('.slogan h1', {
        type: "chars",
        charsClass: "char",
        reduceWhiteSpace: false
    });

    // animation
    gsap.from(h1Split.chars, {
        y: 100,        // Commence 100px plus bas
        opacity: 0,    // Optionnel si tu veux aussi un fade
        duration: splashDuration,
        delay: .75,
        stagger: 0.03, // Décale chaque lettre de 0.03s
        ease: "back.out(1.2)", // Petit rebond à la fin
        scrollTrigger: {
            trigger: '.slogan h1',
            start: "top bottom",
            markers: false
        }
    });

    // Split du h2
    const h2Split = new SplitText('.slogan-2 h2', {
        type: "chars",
        charsClass: "char",
        reduceWhiteSpace: false
    });

    // animation
    gsap.from(h2Split.chars, {
        y: 100,        // Commence 100px plus bas
        opacity: 0,    // Optionnel si tu veux aussi un fade
        duration: splashDuration * 1,
        delay: .75,
        stagger: 0.03, // Décale chaque lettre de 0.03s
        ease: "back.out(1.2)", // Petit rebond à la fin
        scrollTrigger: {
            trigger: '.slogan-2 h2',
            start: "top 80%",
            markers: false
        }
    });

    /* gsap.set(".download-action", {
       opacity:0
   }) */

    gsap.from(".download-action span", {
        y: 25,        // Commence 100px plus bas
        opacity: 0,    // Optionnel si tu veux aussi un fade
        duration: splashDuration,
        delay: 1.25,
        ease: "back.out(1.2)", // Petit rebond à la fin
        scrollTrigger: {
            trigger: '.slogan h1',
            start: "top bottom",
            markers: false
        }
    });

    gsap.from(".download-action p", {
        y: 25,        // Commence 100px plus bas
        opacity: 0,    // Optionnel si tu veux aussi un fade
        duration: splashDuration,
        delay: 1.5,
        ease: "back.out(1.2)", // Petit rebond à la fin
        scrollTrigger: {
            trigger: '.slogan h1',
            start: "top bottom",
            markers: false
        }
    });

    gsap.from(".nav", {
        y: -25,        // Commence 100px plus bas
        opacity: 0,    // Optionnel si tu veux aussi un fade
        duration: splashDuration,
        delay: 1.5,
        ease: "back.out(1.2)", // Petit rebond à la fin
        scrollTrigger: {
            trigger: '.slogan h1',
            start: "top bottom",
            markers: false
        }
    });

    gsap.from(".logo", {
        y: -25,        // Commence 100px plus bas
        opacity: 0,    // Optionnel si tu veux aussi un fade
        duration: splashDuration,
        delay: 1.5,
        ease: "back.out(1.2)", // Petit rebond à la fin
        scrollTrigger: {
            trigger: '.slogan h1',
            start: "top bottom",
            markers: false
        }
    });

    ScrollTrigger.create({
        trigger: ".philosophy",
        start: "top 25%",
        //end: "bottom center",
        onEnter: () => setBodyTheme('vert'),
        onLeaveBack: () => setBodyTheme() // Retire tout
    });


    ScrollTrigger.create({
        trigger: ".app-reel",
        start: "top 25%",
        //end: "bottom center",
        onEnter: () => setBodyTheme('detente'),
        onLeaveBack: () => setBodyTheme('vert') // Retire tout
    });
    console.log("aie")

    ScrollTrigger.create({
        trigger: ".features",
        start: "top 25%",
        //end: "bottom center",
        onEnter: () => setBodyTheme('orange'),
        onLeaveBack: () => setBodyTheme('detente')
    });
    // pin des blocs de texte un par un

    if (isMobile()) {


    } else {
        // Code desktop existant...
        // Texte 1 : apparition + disparition
        // Remplacez vos variables et animations de texte par ceci :



    }




    // splitText 

    // 1. Split en mots ET en lettres
    const text1 = new SplitText('[data-text="1"] p', {
        type: "words,chars", // Double split
        wordsClass: "word",
        charsClass: "char",
        reduceWhiteSpace: false
    });

    const text2 = new SplitText('[data-text="2"] p', {
        type: "words,chars", // Double split
        wordsClass: "word",
        charsClass: "char",
        reduceWhiteSpace: false
    });

    const text3 = new SplitText('[data-text="3"] p', {
        type: "words,chars", // Double split
        wordsClass: "word",
        charsClass: "char",
        reduceWhiteSpace: false
    });


    // APP REEL

    // Pin de la section
    // ========== PARALLAXE RALENTI SUR LES PILLULES ==========
    const speeds = [-50, -70, -40];  // Vitesses différentes pour chaque pillule

    gsap.utils.toArray('.image-bg').forEach((bg, index) => {
        gsap.to(bg, {
            yPercent: speeds[index],  // ✅ Chaque pillule a sa propre vitesse
            ease: "none",  // ✅ Linear pour un scrub fluide
            scrollTrigger: {
                trigger: '.app-reel',
                start: "top bottom",  // ✅ Démarre quand la section ENTRE dans le viewport
                end: "bottom top",    // ✅ Finit quand elle SORT du viewport
                scrub: 1 * (2 + index),  // ✅ Scrub smooth (augmente pour plus de fluidité)
                markers: false
            }
        });

        const canvasId = `reel-canvas-${index + 1}`;

        // Initialiser le shader (fonction à adapter selon ton breathe-distorsion-zoom-class.js)
        createFluidCanvas(canvasId, bg);
    });

    const videoHeight = document.querySelector('.video-reel').offsetHeight * .8;
    gsap.to('.title-reel', {
        scrollTrigger: {
            trigger: '.title-reel',
            start: "top 10%", // Démarre quand le bottom du h1 touche le bottom du viewport
            endTrigger: '.image-bg:last-child',
            end: "bottom bottom+=" + videoHeight,
            scrub: true, // Lié au scroll
            pin: true,
            pinSpacing: false,
            markers: false
        }
    });



    if (isMobile()) {
        gsap.to('.video-reel', {
            scrollTrigger: {
                trigger: '.video-reel',
                start: "top 10%+=130px", // Démarre quand le bottom du h1 touche le bottom du viewport
                endTrigger: '.image-bg:last-child',
                end: "bottom bottom+=" + videoHeight,
                scrub: true, // Lié au scroll
                pin: true,
                pinSpacing: false,
                markers: false
            }
        });
    } else {
        const decalageTitle = 10
        gsap.fromTo('.title-reel',
            {
                xPercent: decalageTitle,  // ✅ Commence hors écran à droite
                //opacity: 0
            },
            {
                xPercent: 0,    // ✅ Arrive à sa position normale
                //opacity: 1,
                duration: 1,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: '.app-reel',
                    start: "top 90%",  // ✅ Démarre quand .app-reel entre dans le viewport
                    endTrigger: '.image-bg:last-child',
                    end: "bottom bottom+=" + videoHeight,
                    scrub: 1,  // ✅ Lié au scroll
                    markers: false
                }
            }
        );
        gsap.to('.video-reel', {
            scrollTrigger: {
                trigger: '.video-reel',
                start: "top 10%+=200px", // Démarre quand le bottom du h1 touche le bottom du viewport
                endTrigger: '.image-bg:last-child',
                end: "bottom bottom+=" + videoHeight,
                scrub: true, // Lié au scroll
                pin: true,
                pinSpacing: false,
                markers: false
            }
        });
    }


    // Gestion vidéo : relance depuis le début au viewport
    const video = document.querySelector('.app-reel video');

    if (video) {
        ScrollTrigger.create({
            trigger: video,
            start: "top bottom",
            end: "bottom top",
            onEnter: () => {
                video.currentTime = 0;  // Retour au début
                video.play();
            },
            onLeave: () => {
                video.pause();
            },
            onEnterBack: () => {
                video.currentTime = 0;  // Retour au début
                video.play();
            },
            onLeaveBack: () => {
                video.pause();
            }
        });
    }


    // Interlude (old)






    gsap.to('.text-interlude', {
        ease: "linear",
        opacity: 1,
        scrollTrigger: {
            trigger: '.interlude',
            start: "top top", // Démarre quand le bottom du h1 touche le bottom du viewport
            scrub: false, // Lié au scroll
            markers: false
        }
    });


    const isLandscape = window.innerWidth > window.innerHeight;

    // animation du cercle qui devient rectangle (avant les screenshots)

    const screenshots = gsap.utils.toArray('.screenshot-item');
    const screenshotDuration = 2000;
    const extraSpace = 100;

    gsap.to('.visual-interlude', {
        ease: "none",
        scrollTrigger: {
            trigger: '.interlude',
            start: "bottom bottom",
            end: () => `+=${(screenshots.length * screenshotDuration) + extraSpace}vh`,  // Finit quand le pin des screenshots commence
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            markers: false
        }
    });

    function animateScreenshots() {

        const masterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.interlude',
                start: "center 10%",
                end: () => `+=${screenshots.length * screenshotDuration}vh`,
                scrub: 1,
                markers: false,
                pin: false,
                pinSpacing: false
            }
        });

        screenshots.forEach((screenshot, index) => {
            const text = screenshot.querySelector('.screenshot-text');

            // Calcul en pourcentage de la timeline totale
            const startPercent = (index / screenshots.length) * 100;  // 0%, 16.6%, 33.3%...
            const appearDuration = 1;  // 8% du temps pour l'apparition
            const middlePercent = startPercent + appearDuration;
            const nextStartPercent = ((index + 1) / screenshots.length) * 100;
            const fadeOutPercent = nextStartPercent - 5;  // Disparaît 5% avant le suivant

            // ANIMATION 1 : Screenshot monte
            masterTimeline.fromTo(screenshot,
                {
                    y: "80vh",
                    scale: 1.08
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    ease: "power2.inOut"
                },
                `${startPercent}%`  // Position en pourcentage
            );

            // ANIMATION 2 : Texte apparaît
            masterTimeline.fromTo(text,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    ease: "power2.out"
                },
                `${middlePercent}%`
            );

            // ANIMATION 3 : Texte disparaît
            if (index < screenshots.length - 1) {
                masterTimeline.to(text,
                    {
                        opacity: 0,
                        y: -20,
                        ease: "power2.in"
                    },
                    `${fadeOutPercent}%`
                );
            }
        });

        return masterTimeline;
    }

    // Appel de la fonction
    animateScreenshots();

    if (isMobile()) {

        const mySubtitles = document.querySelectorAll('.subtitle');
        mySubtitles.forEach((sub) => {
            gsap.set(sub, { opacity: 0 });
            gsap.fromTo(sub, {
                opacity: 0
            }, {
                opacity: 1,
                scrollTrigger: {
                    trigger: sub,
                    start: 'top center',
                    end: 'top 10%',
                    scrub: true,
                },
                ease: "power2.out",
                overwrite: "auto"
            });
        });
        /* gsap.set(benefitsElement, { opacity: 1 });
            gsap.fromTo(benefitsParagraphs, {
                opacity: 0,
                y: 30
            }, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto"
            }); */

        gsap.to('.photo-guide-container', {
            ease: "none",
            scrollTrigger: {
                trigger: '.hero-right',
                start: "top 30%",
                endTrigger: '.features',  // ✅ Même que subtitle 3
                end: "bottom top",          // ✅ Même que subtitle 3
                scrub: true,
                pin: true,
                pinSpacing: true,
                markers: false
            }
        });

        gsap.to('.subtitle:nth-child(1)', {
            ease: "none",
            scrollTrigger: {
                trigger: '.subtitle:nth-child(1) h2',
                start: "top 10%", // Démarre quand le bottom du h1 touche le bottom du viewport
                endTrigger: '.subtitle:nth-child(2)',
                end: "top 50%",
                scrub: true,
                pin: true,
                pinSpacing: false,
                markers: false
            }
        });

        gsap.to('.subtitle:nth-child(2)', {
            ease: "none",
            scrollTrigger: {
                trigger: '.subtitle:nth-child(2) h2',
                start: "top 10%", // Démarre quand le bottom du h1 touche le bottom du viewport
                endTrigger: '.subtitle:nth-child(3)',
                end: "top 50%",
                scrub: true,
                pin: true,
                pinSpacing: false,
                markers: false
            }
        });

        gsap.to('.subtitle:nth-child(3)', {
            ease: "none",
            scrollTrigger: {
                trigger: '.subtitle:nth-child(3) h2',
                start: "top 10%", // Démarre quand le bottom du h1 touche le bottom du viewport
                endTrigger: '.hero-left',
                end: "bottom top",
                scrub: true,
                pin: true,
                pinSpacing: false,
                markers: false
            }
        });
    } else {
        gsap.to('.photo-guide-container', {
            ease: "none",
            scrollTrigger: {
                trigger: '.hero-right',
                start: "top top",
                endTrigger: '.features',  // ✅ Même que subtitle 3
                end: "bottom top",          // ✅ Même que subtitle 3
                scrub: true,
                pin: true,
                pinSpacing: true,
                //markers: true
            }
        });

        gsap.to('.subtitle:nth-child(1)', {
            ease: "none",
            scrollTrigger: {
                trigger: '.subtitle:nth-child(1) h2',
                start: "center center", // Démarre quand le bottom du h1 touche le bottom du viewport
                endTrigger: '.subtitle:nth-child(2)',
                end: "top bottom",
                scrub: true,
                pin: false,
                pinSpacing: false,
                markers: false
            }
        });

        gsap.to('.subtitle:nth-child(2)', {
            ease: "none",
            scrollTrigger: {
                trigger: '.subtitle:nth-child(2) h2',
                start: "center center", // Démarre quand le bottom du h1 touche le bottom du viewport
                endTrigger: '.subtitle:nth-child(3)',
                end: "top bottom",
                scrub: true,
                pin: false,
                pinSpacing: false,
                markers: false
            }
        });

        gsap.to('.subtitle:nth-child(3)', {
            ease: "none",
            scrollTrigger: {
                trigger: '.subtitle:nth-child(3) h2',
                start: "center center", // Démarre quand le bottom du h1 touche le bottom du viewport
                endTrigger: '.hero-left',
                end: "bottom top",
                scrub: true,
                pin: false,
                pinSpacing: false,
                markers: false
            }
        });
    }









    // Alternative plus élégante avec une fonction réutilisable :
    // ========== NOUVELLE VERSION : animations directes (pas de timeline en pause) ==========
    function animateTextBenefits(subtitleIndex, benefitsIndex, nextSubtitleSelector) {
        const benefitsElement = `[data-benefits="${benefitsIndex}"]`;
        const benefitsParagraphs = `${benefitsElement} p`;

        // État initial : caché
        gsap.set(benefitsElement, { opacity: 1 });
        gsap.set(benefitsParagraphs, { opacity: 0, y: 30 });

        // ===================================
        // 1. APPARITION (scrub sur 80vh)
        // ===================================
        gsap.timeline({
            scrollTrigger: {
                trigger: `.subtitle:nth-child(${subtitleIndex}) h2`,
                start: "center 60%",
                end: "+=100vh",
                scrub: 1,
                onUpdate: () => {
                    console.log("et voilà " + benefitsElement)
                },
                markers: false
            }
        })
            .to(benefitsParagraphs, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                ease: "power2.out"
            });

        console.log(`✅ Apparition scrub benefits ${benefitsIndex}`);

        // ===================================
        // 2. DISPARITION (si prochain titre existe)
        // ===================================
        if (nextSubtitleSelector) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: nextSubtitleSelector,
                    start: "top 80%",
                    end: "top 60%",
                    scrub: 1,
                    markers: false
                }
            })
                .to(benefitsParagraphs, {
                    opacity: 0,
                    y: -20,
                    stagger: 0.1,
                    ease: "power2.in"
                });

            console.log(`❌ Disparition scrub benefits ${benefitsIndex} avant ${nextSubtitleSelector}`);
        }
    }


    // Utilisation
    animateTextBenefits(1, 1, '.subtitle:nth-child(2)');
    animateTextBenefits(2, 2, '.subtitle:nth-child(3)');
    animateTextBenefits(3, 3, null);  // Pas de disparition pour le dernier



    // ✅ FONCTION COMPLÈTE DE DÉTECTION
    function initializeBenefitsState() {
        setTimeout(() => {
            const subtitles = [
                { index: 1, element: document.querySelector('.subtitle:nth-child(1) h2'), benefits: '[data-benefits="1"]' },
                { index: 2, element: document.querySelector('.subtitle:nth-child(2) h2'), benefits: '[data-benefits="2"]' },
                { index: 3, element: document.querySelector('.subtitle:nth-child(3) h2'), benefits: '[data-benefits="3"]' }
            ];

            const viewportTriggerPoint = window.innerHeight * 0.6; // "center 60%"
            let activeBenefits = null;

            // Parcourir tous les subtitles pour trouver celui qui est actif
            for (let i = subtitles.length - 1; i >= 0; i--) {
                const { element, benefits } = subtitles[i];

                if (element) {
                    const rect = element.getBoundingClientRect();

                    // Si ce subtitle est passé (au-dessus ou au niveau du trigger point)
                    if (rect.top <= viewportTriggerPoint) {
                        activeBenefits = benefits;
                        break; // On prend le dernier passé (le plus bas sur la page)
                    }
                }
            }

            // Masquer tous les benefits d'abord
            /* gsap.set('.text-benefits', { opacity: 0 });
            gsap.set('.text-benefits p', { opacity: 0, y: 30 }); */

            // Afficher uniquement celui qui devrait être visible
            /* if (activeBenefits) {
                const benefitsParagraphs = `${activeBenefits} p`;
                gsap.set(activeBenefits, { opacity: 1 });
                gsap.set(benefitsParagraphs, { opacity: 1, y: 0 });

                console.log('✅ Benefits initial:', activeBenefits);
            } else {
                console.log('⚠️ Aucun benefits actif au chargement (normal si en haut de page)');
            } */

            ScrollTrigger.refresh();
        }, 200);
    }

    // Appeler la fonction
    initializeBenefitsState();
    // Image 2 arrive plus lentement
    gsap.fromTo('.stack-image[data-slide="2"]',
        {
            x: '100%'
        },
        {
            x: '0%',
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: '.subtitle:nth-child(2) h2',
                start: "top bottom", // Commence plus tôt
                end: "center center", // Ou même "bottom center" pour encore plus lent
                scrub: 1.5, // Augmente le lissage pour plus de fluidité
                markers: false
            }
        }
    );

    // Image 3 arrive plus lentement
    gsap.fromTo('.stack-image[data-slide="3"]',
        {
            x: '100%'
        },
        {
            x: '0%',
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: '.subtitle:nth-child(3) h2',
                start: "top bottom", // Commence plus tôt
                end: "center center", // Ou "bottom center"
                scrub: 1.5,
                markers: false
            }
        }
    );




    ScrollTrigger.create({
        trigger: ".faq",
        start: "top 25%",
        //end: "bottom center",
        onEnter: () => {
            setBodyTheme('light');
            gsap.to('.svg-path', {
                strokeDashoffset: 0,
                duration: 4,
                ease: "linear",
                stagger: 0.3
            });


        },
        onLeaveBack: () => {
            setBodyTheme('orange');
            gsap.to('.svg-path', {
                strokeDashoffset: 300,
                duration: 2,
                ease: "linear",
            });

        }
    });





    // Ajoutez ce code après la création de ScrollSmoother et avant les animations de parallax

    // Fonction pour ajuster la hauteur
    function adjustParallaxContainerHeight() {
        const philosophy = document.querySelector('.text-container');
        const parallaxContainer = document.querySelector('.parallax-container');

        if (philosophy && parallaxContainer) {
            // Récupère la hauteur calculée de philosophy
            const philosophyHeight = philosophy.scrollHeight;

            // Applique cette hauteur au parallax-container
            parallaxContainer.style.height = philosophyHeight * 0.75 + 'px';

            console.log('Philosophy height:', philosophyHeight);
            console.log('Parallax container adjusted to:', philosophyHeight);
        }
    }

    // Appel initial
    adjustParallaxContainerHeight();

    // Recalcul lors du redimensionnement
    window.addEventListener('resize', adjustParallaxContainerHeight);

    // Recalcul après que toutes les animations soient chargées
    ScrollTrigger.addEventListener("refresh", adjustParallaxContainerHeight);

    // Forcer un refresh après un court délai pour s'assurer que tout est chargé
    setTimeout(() => {
        adjustParallaxContainerHeight();
        ScrollTrigger.refresh();
    }, 100);

    // Variable pour tracker le thème actuel
    let currentTheme = 'default';

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

    // Initialisation (au chargement)
    document.addEventListener('DOMContentLoaded', () => {
        // Active le layer par défaut
        document.querySelector('.bg-gradient-layer[data-theme="default"]').classList.add('active');
    });

    // philosophy textBox 

    function setupPhilosophyBlocks({
        pinDistance = "200%",
        topOffset = "top top",
        fadeOutAt = 0.6              // <<< déclenche le fadeOut à 60% du pin
    } = {}) {
        const blocks = gsap.utils.toArray(".philosophy .text-block");

        blocks.forEach((block) => {
            const p = block.querySelector("p");
            if (!p) return;

            // 1) Split en mots, puis en lettres mot par mot
            const splitWords = new SplitText(p, { type: "words" });
            const words = splitWords.words;

            // Important : chaque mot devient un "bloc" non cassé (wrap entre les mots seulement)
            gsap.set(words, { display: "inline-block" });

            // Split chars pour chaque mot, puis on aplatit en une seule liste de chars
            const charSplits = words.map(w => new SplitText(w, { type: "chars" }));
            const chars = charSplits.flatMap(cs => cs.chars);

            gsap.set(block, { autoAlpha: 0 });
            gsap.set(chars, { autoAlpha: 0.12 });

            const tlIn = gsap.timeline({ paused: true })
                .to(block, { autoAlpha: 1, duration: 0.4, ease: "power2.out" })
                .to(chars, {
                    autoAlpha: 1,
                    duration: 0.7,
                    ease: "power2.out",
                    stagger: { each: 0.02, from: "start" }
                }, "<");

            const tlOut = gsap.timeline({ paused: true })
                .to(chars, {
                    autoAlpha: 0.06,
                    duration: 0.45,
                    ease: "power2.inOut",
                    stagger: { each: 0.01, from: "end" }
                })
                .to(block, { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, "-=0.2");

            let didOut = false;

            ScrollTrigger.create({
                trigger: block,
                start: topOffset,
                end: "+=" + pinDistance,
                pin: true,
                pinSpacing: true,
                scrub: false,
                anticipatePin: 1,

                onEnter: () => {
                    didOut = false;
                    tlOut.pause(0);
                    tlIn.restart(true);
                },
                onEnterBack: () => {
                    // on remonte: revenir à l’état lisible
                    tlOut.pause(0);
                    didOut = false;
                    tlIn.play();
                },

                // >>> Déclenchement anticipé du fadeOut pendant le pin
                onUpdate: (self) => {
                    if (!didOut && self.progress >= fadeOutAt) {
                        tlOut.restart(true);
                        didOut = true;
                    }
                    // Si l’utilisateur remonte avant le seuil, on “dé-déclenche”
                    if (didOut && self.direction < 0 && self.progress < fadeOutAt - 0.05) {
                        tlOut.pause(0);
                        didOut = false;
                    }
                },

                // Sécurité si on atteint la fin sans avoir encore lancé tlOut
                onLeave: () => {
                    if (!didOut) tlOut.restart(true);
                },
                onLeaveBack: () => {
                    tlOut.pause(0);
                    didOut = false;
                }
            });
        });
    }


    // ========== FAQ CIRCLES MOUSE FOLLOW (Desktop only) ==========

    if (!isMobile()) {
        const faqSection = document.querySelector('.faq');
        const circles = gsap.utils.toArray('.circle');

        // Paramètres de sensibilité
        const moveStrength = 15; // Plus c'est bas, plus le mouvement est subtil

        faqSection.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            circles.forEach((circle) => {
                // Position du centre du cercle
                const rect = circle.getBoundingClientRect();
                const circleCenterX = rect.left + rect.width / 2;
                const circleCenterY = rect.top + rect.height / 2;

                // Distance entre la souris et le cercle
                const deltaX = mouseX - circleCenterX;
                const deltaY = mouseY - circleCenterY;

                // Mouvement proportionnel à la distance (divisé pour être subtil)
                const moveX = deltaX / moveStrength;
                const moveY = deltaY / moveStrength;

                // animation fluide avec GSAP
                gsap.to(circle, {
                    x: moveX,
                    y: moveY,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
        });

        // Reset quand la souris quitte la section
        faqSection.addEventListener('mouseleave', () => {
            gsap.to(circles, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "power2.out"
            });
        });
    }

    if (!isMobile()) {
        const faqBoxes = gsap.utils.toArray('.faq-box');

        const tiltStrength = 2;
        const translateStrength = 10;

        faqBoxes.forEach((box) => {
            gsap.set(box, {
                transformStyle: "preserve-3d",
                transformPerspective: 1000
            });

            // Créer un overlay pour l'effet de lumière
            const shine = document.createElement('div');
            shine.className = 'box-shine';
            shine.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 80%);
            opacity: 0;
            pointer-events: none;
            mix-blend-mode: overlay;
        `;
            box.appendChild(shine);

            box.addEventListener('mousemove', (e) => {
                const rect = box.getBoundingClientRect();
                const boxCenterX = rect.left + rect.width / 2;
                const boxCenterY = rect.top + rect.height / 2;

                const mouseX = (e.clientX - boxCenterX) / (rect.width / 2);
                const mouseY = (e.clientY - boxCenterY) / (rect.height / 2);

                const rotateY = mouseX * tiltStrength;
                const rotateX = -mouseY * tiltStrength;
                const translateX = mouseX * translateStrength;
                const translateY = mouseY * translateStrength;

                // Position du reflet lumineux (en pourcentage)
                const shineX = ((mouseX + 1) / 2) * 100;
                const shineY = ((mouseY + 1) / 2) * 100;

                // Animer la box
                gsap.to(box, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    x: translateX,
                    y: translateY,
                    duration: 0.5,
                    ease: "power2.out",
                    transformOrigin: "center center"
                });

                // Animer le reflet
                gsap.to(shine, {
                    opacity: 0.4,
                    background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                    duration: 0.3
                });
            });

            box.addEventListener('mouseleave', () => {
                gsap.to(box, {
                    rotateX: 0,
                    rotateY: 0,
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });

                gsap.to(shine, {
                    opacity: 0,
                    duration: 0.5
                });
            });
        });
    }
}



// ✅ N'appeler initHomePage QUE sur la page home
document.addEventListener('DOMContentLoaded', function () {
    const isHomePage = document.querySelector('[data-barba-namespace="home"]');

    if (isHomePage && typeof initHomePage === 'function') {
        console.log('🏠 Chargement initial : page home détectée, appel de initHomePage()');
        initHomePage();
    } else {
        console.log('📄 Chargement initial : pas sur la home, skip initHomePage()');
    }
});