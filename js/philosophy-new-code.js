// ========== PHILOSOPHY SECTION - NOUVEAU CODE ==========

function setupPhilosophySection() {
    const textBlocks = gsap.utils.toArray(".philosophy .text-block");

    const images = [
        'images/visual-11.jpg',
        'images/visual-2.jpg',
        'images/visual-3.jpg'
    ];

    images.forEach((imgPath, index) => {
        const canvasId = `philosophy-canvas-${index + 1}`;

        // Initialiser le shader (fonction à adapter selon ton breathe-distorsion-zoom-class.js)
        createFluidCanvas(canvasId, imgPath);
    });


    textBlocks.forEach((block, index) => {
        const p = block.querySelector("p");
        if (!p) return;

        // Split en mots puis en lettres
        const splitWords = new SplitText(p, { type: "words" });
        const words = splitWords.words;
        gsap.set(words, { display: "inline-block" });

        const charSplits = words.map(w => new SplitText(w, { type: "chars" }));
        const chars = charSplits.flatMap(cs => cs.chars);
        const autoAlpha = 0.02
        // État initial
        gsap.set(chars, { autoAlpha: autoAlpha });

        const splitD = 1.8;
        const splitS = 1;
        // animation d'apparition
        if (!isMobile()) {
            gsap.fromTo(chars,
                { autoAlpha:autoAlpha },
                {
                    autoAlpha: 1,
                    duration: splitD,
                    ease: "power2.inOut",
                    stagger: { each: .03, from: "start" },
                    scrollTrigger: {
                        trigger: block,
                        start: "center 80%",
                        end: "center center",
                        scrub: splitS,
                        markers: false
                    }
                }
            );
        } else {
            gsap.fromTo(chars,
                { autoAlpha: autoAlpha },
                {
                    autoAlpha: 1,
                    duration: splitD,
                    ease: "power2.inOut",
                    stagger: { each: 0.05, from: "start" },
                    scrollTrigger: {
                        trigger: block,
                        start: "top 25%",
                        end: "top 30%",
                        scrub: splitS * 4,
                        markers: false
                    }
                }
            );

            gsap.to(p, {
                scrollTrigger: {
                    trigger: p,
                    start: 'top 10%',
                    end: '+=300px',
                    pin: true,
                    pinSpacing: false,
                    scrub: true,
                    markers: false
                }
            })
        }

    });

    // 2. Pin du conteneur right (desktop seulement)
    if (!isMobile()) {
        gsap.to('.philosophy-right', {
            scrollTrigger: {
                trigger: '.philosophy',
                start: "top top",
                end: "bottom bottom-=100",
                pin: '.philosophy-right',
                pinSpacing: false,
                markers: false
            }
        });
    } else {
      
        const safeAreaTop = getComputedStyle(document.documentElement).getPropertyValue('--sat');
        //document.querySelector('.download-action h4').innerHTML = "Safe area top: " + safeAreaTop

        
        console.log("safeAreaTop", safeAreaTop)
        //document.querySelector('.download-action h4').innerHTML = safeAreaTop
        gsap.to('.philosophy-right', {
            scrollTrigger: {
                trigger: '.philosophy',
                start: "top 50%", //start: "top top-=100",
                end: "bottom bottom-=200",
                pin: '.philosophy-right',
                pinSpacing: false,
                markers: false
            }
        });
    }

    // 3. animation de zoom des photos
    const photos = gsap.utils.toArray('.zoom-photo');

    const lastPhoto = document.querySelector('.text-block:last-of-type');
    console.log("lastPhoto:", lastPhoto);  // null = sélecteur incorrect


    if (!isMobile()) {
        gsap.to('.photo-zoom-container', {
            borderBottomLeftRadius: "100px",
            scrollTrigger: {
                trigger: lastPhoto,
                start: "center center",
                end: "center top",
                scrub: 1,
                markers: false
            }
        })
    }




    photos.forEach((photo, index) => {
        const canvasId = `philosophy-canvas-${index + 1}`;

        const textBlock = document.querySelector(`[data-text="${index + 1}"]`);
        const finalClipPath = isMobile()
            ? "inset(0% 0% 0% 0% round 0px 0px 50px 50px)" // Mobile
            : "inset(0% 0% 0% 0%)"; // Desktop

        if (!isMobile()) {
            gsap.to(photo, {
                opacity: 1,
                clipPath: "circle(40% at center)",
                borderRadius: "0px",
                /* duration: 1, */
                ease: "power1.in",
                scrollTrigger: {
                    trigger: textBlock,
                    start: "top 95%",
                    end: "center 60%",
                    scrub: 1,
                    markers: false
                },
            })
        } else {
            gsap.to(photo, {
                opacity: 1,
                clipPath: "circle(40% at center)",
                borderRadius: "0px",
                /* duration: 1, */
                ease: "power1.in",
                scrollTrigger: {
                    trigger: textBlock,
                    start: "top 95%",
                    end: "center 75%",
                    scrub: 1,
                    markers: false
                },
            })
        }




    });
}



setupPhilosophySection();  // Fonction desktop existante

