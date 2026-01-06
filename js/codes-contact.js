
// Attendre que le DOM soit chargé
function initContact() {
    console.log("🔄 Initialisation Contact");
    setTitle(false);
    setFAQNav(false);
    // ✅ Vérifier qu'on est bien sur la page Contact
    const qrContainer = document.querySelector('.qr-container');
    const qrContactContainer = document.querySelector('div[data-barba-namespace="contact"]');
    if (!qrContactContainer) {
        console.log('⚠️ Pas sur la page Contact, skip initContact()');
        return; // Sortir de la fonction si pas sur Contact
    }

    console.log("Contact")

    createFluidCanvas("contact-fluid", "images/photo-contact.jpg");


    const qrYPos = qrContainer.offsetTop;



    if (!isMobile()) {
        gsap.to('.questions-nav', {
            //opacity: 0,
            scrollTrigger: {
                trigger: '.questions-nav',
                start: `top 150px`, // Start dès que l'élément est à sa position

                pin: true,
                pinSpacing: false,
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
        /* gsap.to('.mobile-nav-select', {
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
        }); */
        /* .mobile-nav-select */
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

    /*  ------------------ Contact --------------------- */
    // Système d'accordéon Contact
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
    const mobileSelect = document.getElementById('Contact-mobile-select');

    if (mobileSelect) {
        // Au changement du select : scroll vers la section
        mobileSelect.addEventListener('change', (e) => {
            const index = parseInt(e.target.value);
            if (sections[index]) {
                gsap.to(window, {
                    duration: 0.8,
                    scrollTo: {
                        y: sections[index],
                        offsetY: 250
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



    /* CODE FORMULAIRE */

    console.log("📧 Initialisation du formulaire de contact");

    const form = document.getElementById('contact-form');

    if (!form) {
        console.log('⚠️ Formulaire de contact non trouvé');
        return;
    }

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageTextarea = document.getElementById('message');
    const submitBtn = form.querySelector('.btn-submit');
    const formFeedback = document.getElementById('form-feedback');
    const rgpdCheckbox = document.getElementById('rgpd');

    // ========================================
    // VALIDATION EMAIL
    // ========================================
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ========================================
    // AFFICHER UNE ERREUR
    // ========================================
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        formGroup.classList.add('error');
        errorElement.textContent = message;

        // animation shake
        input.style.animation = 'none';
        setTimeout(() => {
            input.style.animation = '';
        }, 10);
    }

    // ========================================
    // MASQUER UNE ERREUR
    // ========================================
    function hideError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        formGroup.classList.remove('error');
        errorElement.textContent = '';
    }

    // ========================================
    // VALIDER UN CHAMP
    // ========================================
    function validateField(input) {
        const value = input.value.trim();

        // Champ vide
        if (value === '') {
            showError(input, 'Ce champ est obligatoire');
            return false;
        }

        // Validation spécifique pour l'email
        if (input.type === 'email' && !isValidEmail(value)) {
            showError(input, 'Adresse e-mail invalide');
            return false;
        }

        // Validation spécifique pour le prénom (minimum 2 caractères)
        if (input.id === 'name' && value.length < 2) {
            showError(input, 'Le prénom doit contenir au moins 2 caractères');
            return false;
        }

        // Validation spécifique pour le message (minimum 10 caractères)
        if (input.id === 'message' && value.length < 2) {
            showError(input, 'Le message doit contenir au moins 2 caractères');
            return false;
        }

        hideError(input);
        return true;
    }

    // ========================================
    // VALIDER TOUT LE FORMULAIRE
    // ========================================
    function validateForm() {
        let isValid = true;
        if (!validateField(nameInput)) isValid = false;
        if (!validateField(emailInput)) isValid = false;
        if (!validateField(messageTextarea)) isValid = false;

        // Validation de la checkbox RGPD
        // Validation de la checkbox RGPD
        if (!rgpdCheckbox.checked) {
            const checkboxGroup = rgpdCheckbox.closest('.checkbox-rgpd');
            checkboxGroup.classList.add('error');

            // animation shake
            checkboxGroup.style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                checkboxGroup.style.animation = '';
            }, 300);

            // Scroll vers la checkbox
            /* gsap.to(window, {
                duration: 0.6,
                scrollTo: {
                    y: checkboxGroup,
                    offsetY: 150
                },
                ease: "power2.inOut"
            }); */

            isValid = false;
        }

        return isValid;
    }

    // ========================================
    // AFFICHER UN MESSAGE DE FEEDBACK
    // ========================================
    function showFeedback(message, type) {
        formFeedback.textContent = message;
        formFeedback.className = 'form-feedback show ' + type;

        // Masquer après 5 secondes
        setTimeout(() => {
            formFeedback.classList.remove('show');
        }, 5000);
    }

    // ========================================
    // EVENT LISTENERS - VALIDATION EN TEMPS RÉEL
    // ========================================

    // Validation à la saisie (blur = quand on quitte le champ)
    nameInput.addEventListener('blur', () => {
        if (nameInput.value.trim() !== '') {
            validateField(nameInput);
        }
    });

    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim() !== '') {
            validateField(emailInput);
        }
    });

    messageTextarea.addEventListener('blur', () => {
        if (messageTextarea.value.trim() !== '') {
            validateField(messageTextarea);
        }
    });

    // Masquer l'erreur pendant la saisie
    nameInput.addEventListener('input', () => {
        if (nameInput.closest('.form-group').classList.contains('error')) {
            hideError(nameInput);
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.closest('.form-group').classList.contains('error')) {
            hideError(emailInput);
        }
    });

    messageTextarea.addEventListener('input', () => {
        if (messageTextarea.closest('.form-group').classList.contains('error')) {
            hideError(messageTextarea);
        }
    });

    // Retirer l'erreur RGPD au check
    rgpdCheckbox.addEventListener('change', () => {
        if (rgpdCheckbox.checked) {
            const checkboxGroup = rgpdCheckbox.closest('.checkbox-group');
            checkboxGroup.classList.remove('error');
        }
    });

    // ========================================
    // GESTION DU FOCUS - ANIMATIONS
    // ========================================
    const allInputs = [nameInput, emailInput, messageTextarea];

    allInputs.forEach(input => {
        // animation au focus
        /* input.addEventListener('focus', (e) => {
            gsap.to(e.target, {
                scale: 1.01,
                duration: 0.3,
                ease: 'power2.out'
            });
        }); */

        // animation au blur
        input.addEventListener('blur', (e) => {
            gsap.to(e.target, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // ========================================
    // SOUMISSION DU FORMULAIRE
    // ========================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('📬 Tentative d\'envoi du formulaire');

        // Validation
        if (!validateForm()) {
            console.log('❌ Formulaire invalide');
            showFeedback('Il manque des champs obligatoire à compléter avant d\'envoyer 🙈', 'error');

            // Scroll vers la première erreur
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                gsap.to(window, {
                    duration: 0.6,
                    scrollTo: {
                        y: firstError,
                        offsetY: 150
                    },
                    ease: "power2.inOut"
                });
            }

            return;
        }

        // Désactiver le bouton pendant l'envoi
        submitBtn.disabled = true;
        submitBtn.classList.add('sending');
        submitBtn.textContent = 'Envoi en cours...';

        // Récupérer les données du formulaire
        const formData = new FormData(form);

        try {
            // ✅ ICI : Appel au fichier PHP (à créer plus tard)
            const response = await fetch('send-email-smtp.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                console.log('✅ Email envoyé avec succès');
                showFeedback('✨ Message envoyé avec succès ! Je te répondrai très vite.', 'success');

                // Réinitialiser le formulaire
                form.reset();

                // animation de succès
                gsap.fromTo(form,
                    { opacity: 1 },
                    {
                        opacity: 0.5,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1,
                        onComplete: () => {
                            gsap.set(form, { opacity: 1 });
                        }
                    }
                );
            } else {
                console.log('❌ Erreur lors de l\'envoi');
                showFeedback(result.message || 'Une erreur s\'est produite. Réessaie plus tard.', 'error');
            }
        } catch (error) {
            console.error('❌ Erreur réseau:', error);
            showFeedback('Erreur de connexion. Vérifie ta connexion internet.', 'error');
        } finally {
            // Réactiver le bouton
            submitBtn.disabled = false;
            submitBtn.classList.remove('sending');
            submitBtn.textContent = 'Envoyer';
        }
    });

    // ========================================
    // ANIMATION DE LA CHECKBOX
    // ========================================
    const checkbox = document.getElementById('newsletter');
    const checkboxCustom = document.querySelector('.checkbox-custom');

    if (checkbox && checkboxCustom) {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                gsap.fromTo(checkboxCustom,
                    { scale: 1 },
                    {
                        scale: 1.2,
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.out'
                    }
                );
            }
        });
    }

    console.log('✅ Formulaire de contact initialisé');


}

// ✅ Appeler au chargement initial de la page Contact uniquement
document.addEventListener('DOMContentLoaded', function () {
    const isContactPage = document.querySelector('[data-barba-namespace="contact"]');
    if (isContactPage && typeof initContact === 'function') {
        console.log('❓ Chargement initial : page Contact détectée, appel de initContact()');
        initContact();
    } else {
        console.log('📄 Chargement initial : pas sur la Contact, skip initContact()');
    }
});


