// ========================================
// BARBA.JS - INITIALISATION
// ========================================

console.log('🎬 Barba.js chargé');

// ========================================
// FONCTION DE RÉINITIALISATION DES SCRIPTS
// ========================================
async function reinitScripts(namespace) {
    console.log(`🔄 Réinitialisation pour la page: ${namespace}`);
    ScrollTrigger.getAll().forEach(t => t.kill());
    const bgGradient = document.getElementById('bg-gradient-container');
    // 1. Kill tous les ScrollTriggers existants
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // 2. Détruire ScrollSmoother s'il existe
    if (ScrollSmoother.get()) {
        ScrollSmoother.get().kill();
    }

    // 3. Réinitialiser ScrollSmoother
    let smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        smoothTouch: 0,
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true,
    });

    console.log('✅ ScrollSmoother réinitialisé');

    // ✅ Réinitialiser les fonctions communes
    /* if (typeof initCommons === 'function') {
        initCommons();
    } */

    // ✅ Reset des classes du body avant chaque page
    if (typeof resetBodyClasses === 'function') {
        resetBodyClasses();
    }

    // 4. Réinitialiser les scripts selon la page
    switch (namespace) {
        case 'home':
            console.log('📄 Page HOME détectée');
            // ✅ Réinitialiser les canvas WebGL (avec préchargement intégré)
            if (typeof initHomePage === 'function') {
                await initHomePage(); // ✅ Attendre la fin du préchargement
            }
            if (typeof createFluidCanvas === 'function') {
                //   createFluidCanvas("canvas", "images/Photo_049_plaine-nuit.jpg");
                createFluidCanvas("canvas", "images/djaeknesundet.jpg");
                createFluidCanvas("philosophy-canvas-1", "images/visual-11.jpg");
                createFluidCanvas("philosophy-canvas-2", "images/visual-2.jpg");
                createFluidCanvas("philosophy-canvas-3", "images/visual-3.jpg");
                createFluidCanvas("canvas-footer", "images/visual-footer.jpg");
            }
            // Réinitialiser philosophy section
            if (typeof setupPhilosophySection === 'function') {
                setupPhilosophySection();
            }
            bgGradient.classList.remove('hide');

            // TODO: Réinitialiser codes.js
            break;

        case 'faq':
            console.log('📄 Page FAQ détectée');
            // Réinitialiser les canvas FAQ
            if (typeof initFAQ === 'function') {
                bgGradient.classList.add('hide');
                initFAQ();
                if (typeof createFluidCanvas === 'function') {
                    createFluidCanvas("canvas-footer", "images/visual-footer.jpg");
                }
            }
            break;

        case 'contact':
            console.log('📄 Page CONTACT détectée');
            // TODO: Initialiser les scripts Contact
            if (typeof initContact === 'function') {
                bgGradient.classList.add('hide');
                console.log("post hide")
                initContact();
                if (typeof createFluidCanvas === 'function') {
                    createFluidCanvas("canvas-footer", "images/visual-footer.jpg");
                }
            }
            break;

            case 'confidentialite':
            console.log('📄 Page CONFIDENTIALITÉ détectée');
            // TODO: Initialiser les scripts CONFIDENTIALITÉ
            if (typeof initConfidentialite === 'function') {
                bgGradient.classList.add('hide');
                initConfidentialite();
                if (typeof createFluidCanvas === 'function') {
                    createFluidCanvas("canvas-footer", "images/visual-footer.jpg");
                }
            }
            break;

            case 'ml':
            // TODO: Initialiser les scripts CONFIDENTIALITÉ
            if (typeof initConfidentialite === 'function') {
                bgGradient.classList.add('hide');
                initConfidentialite();
                if (typeof createFluidCanvas === 'function') {
                    createFluidCanvas("canvas-footer", "images/visual-footer.jpg");
                }
            }
            break;
    }

    // 5. Réinitialiser les fonctions communes
    if (typeof remplacerEspaces === 'function') {
        remplacerEspaces();
    }

    // 6. Gérer l'affichage du dégradé selon la page



}


// ========================================
// GESTION DES CLICS SUR LA PAGE ACTUELLE
// ========================================
document.addEventListener('click', function (e) {
    // Vérifier si c'est un lien Barba (pas le burger)
    const link = e.target.closest('a[href]');

    if (!link) return; // Pas un lien

    // Ignorer le burger
    if (link.closest('.nav-hover') || link.classList.contains('nav-hover')) {
        return;
    }

    // Ignorer les liens externes et target="_blank"
    if (link.hasAttribute('target') || (link.href && link.href.includes('apps.apple.com'))) {
        return;
    }

    // Vérifier si on clique sur la page actuelle
    const currentPath = window.location.pathname;
    const linkPath = new URL(link.href, window.location.origin).pathname;

    if (currentPath === linkPath) {

        // Empêcher la navigation
        e.preventDefault();
        e.stopPropagation();



        // Fermer le menu si ouvert
        if (window.menuOpen && typeof window.closeMenu === 'function') {
            window.closeMenu();
        }
    }
}, true); // ✅ true = capture phase (avant Barba)

// ========================================
// INITIALISATION BARBA
// ========================================
barba.init({
    // Configuration du debug
    debug: true, // ✅ Affiche les logs dans la console

    // Empêcher la transition sur certains liens
    prevent: ({ el, href }) => {
        // Ne pas intercepter les liens externes
        if (el.href && el.href.includes('apps.apple.com')) {
            return true;
        }

        // Ne pas intercepter les liens avec target="_blank"
        if (el.hasAttribute('target')) {
            return true;
        }

        // Ne pas intercepter le burger
        if (el.closest('.nav-hover') || el.classList.contains('nav-hover')) {
            return false;
        }

        return false;
    },

    // ========================================
    // TRANSITIONS
    // ========================================
    transitions: [{
        name: 'default-transition',

        // ====================================
        // BEFORE LEAVE : Avant de quitter (pour fermer le menu)
        // ====================================
        async beforeLeave(data) {

            // ✅ Afficher le loader
            if (typeof window.showLoader === 'function') {
                window.showLoader();
            }


    

            const smoothWrapper = data.current.container.querySelector('#smooth-wrapper');
            if (smoothWrapper && !smoothWrapper.classList.contains('menu-hidden')) {
                smoothWrapper.classList.add('menu-hidden');
            }

            // ========================================
            // CAS 1 : Menu burger ouvert
            // ========================================
            if (window.menuOpen === true) {

                // Fermer le menu EN GARDANT LE CONTENU CACHÉ
                if (typeof window.closeMenuStep1 === 'function') {
                    window.closeMenuStep1();
                }

                // Attendre que l'animation de fermeture soit terminée (1s)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Vérifier que smooth-wrapper a bien la classe menu-hidden
                const smoothWrapper = data.current.container.querySelector('#smooth-wrapper');
                if (smoothWrapper && smoothWrapper.classList.contains('menu-hidden')) {
                }

                // Attendre 500ms supplémentaires avant de lancer la transition
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            // ========================================
            // CAS 2 : Lien normal (hors menu burger)
            // ========================================
            else {

                // Afficher les rectangles
                if (typeof window.showRectanglesTransition === 'function') {
                    window.showRectanglesTransition();
                }

                // Attendre que les rectangles soient affichés
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Reset des classes du body
            if (typeof resetBodyClasses === 'function') {
                resetBodyClasses();
            }
        },

        // ====================================
        // LEAVE : Quand on quitte la page
        // ====================================
        leave(data) {

            // animation de sortie simple (fade out)
            return gsap.to(data.current.container, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut'
            });
        },

        // ====================================
        // ENTER : Quand on arrive sur la nouvelle page
        // ====================================
        enter(data) {

            // ✅ Forcer le scroll en haut (compatible ScrollSmoother)
            window.scrollTo(0, 0);

            // Si ScrollSmoother existe, l'utiliser aussi
            const smoother = ScrollSmoother.get();
            if (smoother) {
                smoother.scrollTop(0);
            }

            // animation d'entrée simple (fade in)
            /* return gsap.fromTo(data.next.container,
                {
                    opacity: 0
                },
                {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.inOut'
                }
            ); */
            const smoothWrapper = data.next.container.querySelector('#smooth-wrapper');
            if (smoothWrapper && !smoothWrapper.classList.contains('menu-hidden')) {
                smoothWrapper.classList.add('menu-hidden');
            }
        },

        // ====================================
        // AFTER : Après l'animation d'entrée
        // ====================================
        async after(data) {

            // ========================================
            // FERMETURE DU MENU OU DES RECTANGLES
            // ========================================

            const menuOverlay = document.querySelector('.menu-overlay');

            // Si menu-overlay est actif, on doit fermer quelque chose
            if (menuOverlay && menuOverlay.classList.contains('active')) {

                // Cas 1 : Menu burger (cercle déjà disparu, il reste les rectangles)
                if (window.menuOpen === false && typeof window.closeMenuStep2 === 'function') {
                    window.closeMenuStep2(false);
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                // Cas 2 : Transition rectangles (navigation normale)
                else if (typeof window.hideRectanglesTransition === 'function') {
                    window.hideRectanglesTransition();
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            // ✅ Retirer la classe menu-hidden si elle est présente
            const smoothWrapper = data.next.container.querySelector('#smooth-wrapper');
            if (smoothWrapper && smoothWrapper.classList.contains('menu-hidden')) {
                smoothWrapper.classList.remove('menu-hidden');
            }

            // Réinitialiser tous les scripts
            await reinitScripts(data.next.namespace);

            if (typeof window.hideLoader === 'function') {
                window.hideLoader();
            }
        }
    }],

    // ========================================
    // VIEWS (événements globaux)
    // ========================================
    views: [{
        namespace: 'home',
        beforeEnter() {
            console.log('🏠 Préparation page HOME');
        }
    }, {
        namespace: 'faq',
        beforeEnter() {
            console.log('❓ Préparation page FAQ');
        }
    }, {
        namespace: 'contact',
        beforeEnter() {
            console.log('📧 Préparation page CONTACT');
        }
    }, {
        namespace: 'confidentialite',
        beforeEnter() {
            console.log('📧 Préparation page CONFIDENTIALITÉ');
        }
    }, {
        namespace: 'ml',
        beforeEnter() {
            console.log('📧 Préparation page MENTIONS LÉGALES');
        }
    }]
});


