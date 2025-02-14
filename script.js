document.addEventListener('DOMContentLoaded', function() {
    // Variables pour le slider
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    
    // Variables pour le jeu
    const startButton = document.getElementById('start-game');
    const gameSection = document.getElementById('game-section');
    const formSection = document.getElementById('form-section');
    const confirmationSection = document.getElementById('confirmation-section');
    const questions = document.querySelectorAll('.question');
    
    // Messages d'erreur
    const errorMessages = [
        "Hey … on sait que tu veux en savoir plus ! Reviens en arrière et réponds 'Oui'.",
        "Oups ! Mauvaise réponse… Tu es sûr ? Essaie encore !",
        "On sait que tu es curieux(se)… Fais nous plaisir et clique sur 'Oui' !"
    ];

    // Fonction pour le slider
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Auto slider
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    // Event listeners pour les boutons du slider
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

    // Démarrer le jeu
    startButton.addEventListener('click', () => {
        document.getElementById('slider-section').classList.add('hidden');
        gameSection.classList.remove('hidden');
        questions[0].classList.remove('hidden');
    });

    // Gestion des questions
    questions.forEach((question, index) => {
        const yesBtn = question.querySelector('.yes-btn');
        const noBtn = question.querySelector('.no-btn');
        const errorMessage = question.querySelector('.error-message');

        yesBtn.addEventListener('click', () => {
            question.classList.add('hidden');
            if (index < questions.length - 1) {
                questions[index + 1].classList.remove('hidden');
            } else {
                gameSection.classList.add('hidden');
                formSection.classList.remove('hidden');
            }
        });

        noBtn.addEventListener('click', () => {
            errorMessage.textContent = errorMessages[index];
        });
    });

    // Gestion du formulaire
    const leadForm = document.getElementById('lead-form');
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyYWeB1kC4u5l0uHEb-6-_eQbpq3-_en_gPUujMTjmf1NlXmANEoFWIA_1Pj6ulA1IN/exec'; // Remplacez par l'URL copiée à l'étape 3

    // Validation en temps réel du téléphone
    const phoneInput = leadForm.querySelector('input[name="telephone"]');
    phoneInput.addEventListener('input', function(e) {
        const phoneNumber = e.target.value.replace(/\s/g, '');
        const isValid = /^(?:(?:\+|00)33|0)[1-9](?:[\s.-]*\d{2}){4}$/.test(phoneNumber);
        
        if (!isValid) {
            this.setCustomValidity('Veuillez entrer un numéro de téléphone français valide');
        } else {
            this.setCustomValidity('');
        }
    });

    // Validation en temps réel de l'email
    const emailInput = leadForm.querySelector('input[name="email"]');
    emailInput.addEventListener('input', function(e) {
        const email = e.target.value.toLowerCase();
        const isValid = /[a-z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|fr)$/.test(email);
        
        if (!isValid) {
            this.setCustomValidity('Veuillez entrer une adresse email valide (gmail, yahoo, outlook ou hotmail)');
        } else {
            this.setCustomValidity('');
        }
    });

    // Gestion du formulaire
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Vérification supplémentaire de la validité
        if (!this.checkValidity()) {
            return;
        }

        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';
        
        const formData = new FormData(leadForm);
        const leadData = Object.fromEntries(formData.entries());

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData)
        })
        .then(() => {
            navigateToSection('confirmation');
        })
        .catch(error => {
            console.error('Erreur!', error);
            alert('Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.');
            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer et tenter ma chance !';
        });
    });

    // Gestion des modales
    const legalLink = document.querySelector('.legal-link');
    const privacyLink = document.querySelector('.privacy-link');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    legalLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('legal-modal').classList.remove('hidden');
    });

    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('privacy-modal').classList.remove('hidden');
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    });

    const sections = {
        slider: document.getElementById('slider-section'),
        game: document.getElementById('game-section'),
        form: document.getElementById('form-section'),
        confirmation: document.getElementById('confirmation-section')
    };
    
    const homeLink = document.getElementById('home-link');
    const backButton = document.getElementById('back-button');
    let currentSection = 'slider';

    // Fonction pour réinitialiser le formulaire et les questions
    function resetAll() {
        // Réinitialiser le formulaire
        leadForm.reset();
        
        // Réinitialiser les questions
        const questions = document.querySelectorAll('.question');
        questions.forEach((question, index) => {
            question.classList.add('hidden');
            if (index === 0) question.classList.remove('hidden');
            const errorMessage = question.querySelector('.error-message');
            if (errorMessage) errorMessage.textContent = '';
        });
        
        // Réinitialiser le bouton de soumission
        const submitButton = leadForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer et tenter ma chance !';
        }
    }

    // Fonction pour naviguer vers une section avec gestion de l'historique
    function navigateToSection(sectionName, addToHistory = true) {
        // Cacher toutes les sections
        Object.values(sections).forEach(section => section.classList.add('hidden'));
        
        // Afficher la section demandée
        sections[sectionName].classList.remove('hidden');
        
        // Gérer le bouton retour
        if (sectionName === 'slider') {
            backButton.classList.add('hidden');
        } else {
            backButton.classList.remove('hidden');
        }
        
        currentSection = sectionName;

        // Mettre à jour l'URL et l'historique
        if (addToHistory) {
            const url = new URL(window.location);
            url.searchParams.set('section', sectionName);
            window.history.pushState({ section: sectionName }, '', url);
        }
    }

    // Gestionnaire pour le logo (retour à l'accueil avec réinitialisation)
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        resetAll();
        navigateToSection('slider');
    });

    // Gestionnaire pour le bouton retour du navigateur
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.section) {
            navigateToSection(e.state.section, false);
        } else {
            navigateToSection('slider', false);
        }
    });

    // Initialisation de l'historique pour la première page
    window.history.replaceState({ section: 'slider' }, '', window.location.href);

    // Gestionnaire pour le bouton retour personnalisé
    backButton.addEventListener('click', function() {
        window.history.back();
    });

    // Gestionnaire pour le début du jeu
    document.getElementById('start-game').addEventListener('click', function() {
        navigateToSection('game');
    });
}); 