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

    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Désactiver le bouton de soumission pour éviter les doubles soumissions
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';
        
        // Collecter les données du formulaire
        const formData = new FormData(leadForm);
        const leadData = Object.fromEntries(formData.entries());

        // Envoi vers Google Sheets
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
            // Afficher la confirmation
            document.getElementById('form-section').classList.add('hidden');
            const confirmationSection = document.getElementById('confirmation-section');
            confirmationSection.classList.remove('hidden');
            confirmationSection.scrollIntoView({ behavior: 'smooth' });
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
}); 