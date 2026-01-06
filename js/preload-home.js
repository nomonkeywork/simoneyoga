// ========================================
// PRELOAD HOME PAGE
// ========================================
// Cette fonction cache le contenu de la page home jusqu'à ce que
// toutes les images et les shaders WebGL soient complètement chargés

/**
 * Fonction de préchargement de la page home
 * 1. Cache immédiatement le contenu avec .menu-hidden
 * 2. Attend que toutes les images soient chargées
 * 3. Attend que les canvas WebGL soient initialisés
 * 4. Révèle le contenu avec une transition
 */
async function preloadHomePage() {
    console.log('🎬 ========== PRÉCHARGEMENT HOME ==========');
    
    const smoothWrapper = document.querySelector('#smooth-wrapper');
    
    if (!smoothWrapper) {
        console.error('❌ #smooth-wrapper introuvable');
        return;
    }
    
    // ========================================
    // 1. CACHER IMMÉDIATEMENT LE CONTENU
    // ========================================
    console.log('1️⃣ Masquage immédiat du contenu...');
    smoothWrapper.classList.add('menu-hidden');
    // Forcer le style inline pour être sûr (au cas où le CSS tarde à se charger)
    smoothWrapper.style.opacity = '0';
    console.log('   ✅ Contenu caché');
    
    // ========================================
    // 2. ATTENDRE LE CHARGEMENT DES IMAGES
    // ========================================
    console.log('2️⃣ Attente du chargement des images...');
    
    // Récupérer toutes les images de la page
    const images = document.querySelectorAll('img');
    const imageArray = Array.from(images);
    
    console.log(`   → ${imageArray.length} images détectées`);
    
    // Créer des promesses pour chaque image
    const imagePromises = imageArray.map((img, index) => {
        return new Promise((resolve, reject) => {
            // Si l'image est déjà chargée
            if (img.complete && img.naturalHeight !== 0) {
                console.log(`   ✅ Image ${index + 1} déjà chargée`);
                resolve();
            } else {
                // Attendre le chargement
                img.onload = () => {
                    console.log(`   ✅ Image ${index + 1} chargée`);
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`   ⚠️ Erreur chargement image ${index + 1}`);
                    resolve(); // On continue quand même
                };
            }
        });
    });
    
    // Attendre toutes les images
    await Promise.all(imagePromises);
    console.log('   ✅ Toutes les images chargées');
    
    // ========================================
    // 3. ATTENDRE L'INITIALISATION DES CANVAS WEBGL
    // ========================================
    console.log('3️⃣ Attente de l\'initialisation des canvas WebGL...');
    
    // Liste des canvas à vérifier
    const canvasIds = [
        'canvas',
        'philosophy-canvas-1',
        'philosophy-canvas-2',
        'philosophy-canvas-3',
        'canvas-footer'
    ];
    
    // Fonction pour vérifier si un canvas est initialisé
    function isCanvasReady(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.log(`   ⚠️ Canvas #${canvasId} non trouvé`);
            return true; // On considère que c'est OK s'il n'existe pas
        }
        
        // Vérifier si le contexte WebGL existe
        const gl = canvas.getContext('webgl') || 
                   canvas.getContext('webgl2') || 
                   canvas.getContext('experimental-webgl');
        
        if (gl && canvas.width > 1 && canvas.height > 1) {
            console.log(`   ✅ Canvas #${canvasId} initialisé (${canvas.width}x${canvas.height})`);
            return true;
        }
        
        return false;
    }
    
    // Attendre que tous les canvas soient prêts (max 5 secondes)
    const maxAttempts = 50; // 50 x 100ms = 5 secondes max
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        // Vérifier tous les canvas
        const allReady = canvasIds.every(id => isCanvasReady(id));
        
        if (allReady) {
            console.log('   ✅ Tous les canvas WebGL sont prêts');
            break;
        }
        
        // Attendre 100ms avant de revérifier
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (attempts >= maxAttempts) {
        console.warn('   ⚠️ Timeout : certains canvas ne sont pas prêts après 5s');
    }
    
    // ========================================
    // 4. RÉVÉLER LE CONTENU AVEC UNE TRANSITION
    // ========================================
    console.log('4️⃣ Révélation du contenu...');
    
    // Retirer menu-hidden
    smoothWrapper.classList.remove('menu-hidden');
    
    // Animer l'apparition avec GSAP
    gsap.to(smoothWrapper, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
            // Nettoyer le style inline
            smoothWrapper.style.opacity = '';
            console.log('   ✅ Contenu révélé');
        }
    });
    
    console.log('✅ ========== PRÉCHARGEMENT TERMINÉ ==========\n');
}

// ========================================
// MODIFICATION DE initHomePage()
// ========================================
// Ajouter ceci AU TOUT DÉBUT de la fonction initHomePage() dans codes.js :

/*

// AJOUTEZ CECI AU DÉBUT DE initHomePage() :

async function initHomePage() {
    // ✅ PRÉCHARGER AVANT TOUT LE RESTE
    await preloadHomePage();
    
    // ... reste du code existant de initHomePage
    setBodyTheme('default');
    // etc...
}

*/

// ========================================
// NOTES D'IMPLÉMENTATION
// ========================================
/*

ÉTAPE 1 : Ajouter ce fichier dans index.html
------------------------------------------
<script src="js/preload-home.js"></script>

ÉTAPE 2 : Modifier codes.js
---------------------------
Dans la fonction initHomePage() (ligne 74), ajouter TOUT AU DÉBUT :

    // ✅ PRÉCHARGER AVANT TOUT LE RESTE
    await preloadHomePage();

Et modifier la déclaration de la fonction :

    async function initHomePage() {  // ✅ Ajouter "async"
    
ÉTAPE 3 : Modifier barba-init.js si nécessaire
---------------------------------------------
Si initHomePage est appelé depuis barba-init.js, utiliser await :

    case 'home':
        await initHomePage();  // ✅ Attendre la fin du préchargement
        
*/
