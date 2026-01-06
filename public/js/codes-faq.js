/* 
function isMobile() {
    // Méthode 1 : Touch + largeur d'écran (la plus fiable)
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    return hasTouch && isSmallScreen;
} */
// Attendre que le DOM soit chargé
function initFAQ() {
    console.log("🔄 Initialisation FAQ");
    setTitle(false);
    setFAQNav(true);
    // ✅ Vérifier qu'on est bien sur la page FAQ
    const qrContainer = document.querySelector('.qr-container');
    const qrContactContainer = document.querySelector('div[data-barba-namespace="faq"]');
    if (!qrContactContainer) {
        console.log('⚠️ Pas sur la page FAQ, skip initFAQ()');
        return; // Sortir de la fonction si pas sur FAQ
    }

    console.log("FAQ")

    createFluidCanvas("faq-fluid", "images/visual-11.jpg");
    
    const qrYPos = qrContainer.offsetTop;
    const qnContainer = document.querySelector('.questions-nav');
    const qnYPos = qrContainer.offsetTop;

   



    if (!isMobile()) {
        gsap.to('.questions-nav', {
            //opacity: 0,
            scrollTrigger: {
                trigger: '.questions-nav',
                start: `top 150px`, // Start dès que l'élément est à sa position

                pin: true,
                markers: false
            }
        });
        gsap.to('.visual-header', {
            scrollTrigger: {
                trigger: '.visual-header',
                start: 'top top+=150px',
                end: '+=5000px',
                pin: true,
                pinSpacing: false
            }
        });

        gsap.to('.visual-header', {
            clipPath: 'circle(0%)',
            ease: 'Power2.inOut',
            scrollTrigger: {
                trigger: '.title-header',
                start: `top top`, // Start dès que l'élément est à sa position
                end: `+=200`, // 100px plus tard
                scrub: 2,
                markers: false
            }
        });
    } else {

        gsap.to('.visual-header', {
            scrollTrigger: {
                trigger: '.visual-header',
                start: 'top top+=225px',
                end: '+=5000px',
                pin: true,
                pinSpacing: false
            }
        });
        gsap.to('.visual-header', {
            clipPath: 'circle(0%)',
            ease: 'Power2.inOut',
            scrollTrigger: {
                trigger: '.qr-container',
                start: `top top+=${qrYPos}`, // Start dès que l'élément est à sa position
                end: `+=200`, // 100px plus tard
                scrub: 2,
                markers: false
            }
        });
        gsap.to('.logo span', {
            opacity: 0,
            ease: 'Power2.inOut',
            scrollTrigger: {
                trigger: '.title-header',
                start: `top top-=20px`, // Start dès que l'élément est à sa position
                end: `+=50px`,
                duration: 0.5,
                scrub: true,
                markers: false
            }
        });
        gsap.to('.mobile-nav-select', {
            opacity: 1,
            ease: 'Power2.inOut',
            scrollTrigger: {
                trigger: '.title-header',
                start: `top top-=150px`, // Start dès que l'élément est à sa position
                end: `+=100px`,
                duration: 0.5,
                scrub: true,
                markers: false
            }
        });
    }


    /* ------------------- NAV --------------------- */

    // Gestion des liens de navigation + hover
    const navItems = document.querySelectorAll('.questions-nav li');
    const sections = document.querySelectorAll('.qr-container h2');
    let currentActiveIndex = 0;

    // Classes de couleur par section
    const bodyClasses = ['default', 'detente', 'energy'];

    // Fonction pour changer la classe du body
    function changeBodyClass(index) {
        // Retirer toutes les classes de couleur
        bodyClasses.forEach(cls => document.body.classList.remove(cls));
        // Ajouter la classe correspondante
        if (bodyClasses[index]) {
            document.body.classList.add(bodyClasses[index]);
        }
    }

    // 1. Créer les liens au clic
    navItems.forEach((item, index) => {
        item.style.cursor = 'pointer';

        item.addEventListener('click', () => {
            if (sections[index]) {
                gsap.to(window, {
                    duration: 0.8,
                    scrollTo: {
                        y: sections[index],
                        offsetY: 200
                    },
                    ease: "power2.inOut"
                });
            }
        });

        item.addEventListener('mouseenter', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            if (navItems[currentActiveIndex]) {
                navItems[currentActiveIndex].classList.add('active');
            }
        });
    });

    // Gestion du changement d'onglet actif selon le scroll
    sections.forEach((section, index) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top top+=250px',
            end: () => {
                if (index === sections.length - 1) {
                    return 'bottom top+=250px';
                }
                const nextSection = sections[index + 1];
                return `top+=${nextSection.offsetTop - section.offsetTop} top+=250px`;
            },
            onEnter: () => {
                currentActiveIndex = index;
                changeBodyClass(index); // Changer la couleur du body
                navItems.forEach(item => item.classList.remove('active'));
                if (navItems[index]) {
                    navItems[index].classList.add('active');
                }
            },
            onEnterBack: () => {
                currentActiveIndex = index;
                changeBodyClass(index); // Changer la couleur du body
                navItems.forEach(item => item.classList.remove('active'));
                if (navItems[index]) {
                    navItems[index].classList.add('active');
                }
            },
            markers: false
        });
    });

    // Initialiser avec la première couleur au chargement
    changeBodyClass(0);

    /*  ------------------ FAQ --------------------- */
    // Système d'accordéon FAQ
    const allQR = document.querySelectorAll('.qr');
    const expRotation = 0.002;
    allQR.forEach(qr => {
        const question = qr.querySelector('.question');
        const reponse = qr.querySelector('.reponse');
        const expander = qr.querySelector('.expander');

        // Au clic sur la question
        question.addEventListener('click', () => {
            const isActive = qr.classList.contains('active');

            // Trouver le QR actuellement ouvert (s'il y en a un)
            const currentlyActive = document.querySelector('.qr.active');

            if (currentlyActive && currentlyActive !== qr) {
                // Retirer la classe active de l'ancien QR
                currentlyActive.classList.remove('active');

                // Fermer l'ancienne réponse
                const oldReponse = currentlyActive.querySelector('.reponse');
                const oldExpander = currentlyActive.querySelector('.expander');

                gsap.to(oldReponse, {
                    height: 0,
                    opacity: 0,
                    marginBottom: 0,
                    duration: 0.4,
                    ease: "power2.inOut",
                    onComplete: () => {
                        oldReponse.classList.remove('active');
                        oldReponse.style.height = '';
                    }
                });
                gsap.to(oldExpander, {
                    rotation: 0,
                    duration: 0.4,
                    ease: "power2.inOut"
                });
            }

            if (!isActive) {
                // Ajouter la classe active au nouveau QR
                qr.classList.add('active');

                // Ouvrir la nouvelle réponse
                reponse.classList.add('active');
                reponse.style.height = 'auto';
                const autoHeight = reponse.offsetHeight;
                reponse.style.height = '0';

                gsap.to(reponse, {
                    height: autoHeight,
                    opacity: 1,
                    marginBottom: '1em',
                    duration: 0.4,
                    ease: "power2.inOut",
                    onComplete: () => {
                        reponse.style.height = 'auto';
                    }
                });

                gsap.to(expander, {
                    rotation: 180,
                    duration: expRotation,
                    ease: "power2.inOut"
                });
            } else {
                // Retirer la classe active si on clique sur la question déjà ouverte
                qr.classList.remove('active');

                // Fermer la réponse
                gsap.to(reponse, {
                    height: 0,
                    opacity: 0,
                    marginBottom: 0,
                    duration: 0.4,
                    ease: "power2.inOut",
                    onComplete: () => {
                        reponse.classList.remove('active');
                        reponse.style.height = '';
                    }
                });

                gsap.to(expander, {
                    rotation: 0,
                    duration: expRotation,
                    ease: "power2.inOut"
                });
            }
        });

        // Cursor pointer au hover
        question.style.cursor = 'pointer';
    });


    // Menu déroulant mobile
    const mobileSelect = document.getElementById('faq-mobile-select');

    if (mobileSelect) {
        // Au changement du select : scroll vers la section
        mobileSelect.addEventListener('change', (e) => {
            const index = parseInt(e.target.value);
            if (sections[index]) {
                gsap.to(window, {
                    duration: 0.8,
                    scrollTo: {
                        y: sections[index],
                        offsetY: 150
                    },
                    ease: "power2.inOut"
                });
            }
        });

        // Mettre à jour le select selon le scroll (dans la fonction ScrollTrigger existante)
        sections.forEach((section, index) => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top top+=250px',
                end: () => {
                    if (index === sections.length - 1) {
                        return 'bottom top+=250px';
                    }
                    const nextSection = sections[index + 1];
                    return `top+=${nextSection.offsetTop - section.offsetTop} top+=250px`;
                },
                onEnter: () => {
                    currentActiveIndex = index;
                    changeBodyClass(index);
                    navItems.forEach(item => item.classList.remove('active'));
                    if (navItems[index]) {
                        navItems[index].classList.add('active');
                    }
                    // Mettre à jour le select mobile
                    if (mobileSelect) {
                        mobileSelect.value = index;
                    }
                },
                onEnterBack: () => {
                    currentActiveIndex = index;
                    changeBodyClass(index);
                    navItems.forEach(item => item.classList.remove('active'));
                    if (navItems[index]) {
                        navItems[index].classList.add('active');
                    }
                    // Mettre à jour le select mobile
                    if (mobileSelect) {
                        mobileSelect.value = index;
                    }
                },
                markers: false
            });
        });
    }

}

// ✅ Appeler au chargement initial de la page FAQ uniquement
document.addEventListener('DOMContentLoaded', function() {
    const isFAQPage = document.querySelector('[data-barba-namespace="faq"]');
    if (isFAQPage && typeof initFAQ === 'function') {
        console.log('❓ Chargement initial : page FAQ détectée, appel de initFAQ()');
        initFAQ();
    } else {
        console.log('📄 Chargement initial : pas sur la FAQ, skip initFAQ()');
    }
});