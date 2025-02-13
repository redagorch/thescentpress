document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const startButton = document.getElementById('startButton');
    const sections = {
        banner: document.getElementById('banner'),
        quiz: document.getElementById('quiz'),
        form: document.getElementById('form'),
        confirmation: document.getElementById('confirmation')
    };
    
    const questions = Array.from(document.querySelectorAll('.question-container'));
    let currentQuestion = 0;

    // Start Game
    startButton.addEventListener('click', () => {
        sections.banner.classList.add('hidden');
        sections.quiz.classList.remove('hidden');
        showQuestion(currentQuestion);
    });

    // Handle Quiz Navigation
    function showQuestion(index) {
        questions.forEach(q => q.classList.add('hidden'));
        questions[index].classList.remove('hidden');
    }

    // Handle Yes/No Buttons
    document.querySelectorAll('.yes-btn').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(true));
    });

    document.querySelectorAll('.no-btn').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(false));
    });

    function handleAnswer(isYes) {
        if (!isYes) {
            showFunnyMessage();
            return;
        }

        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion(currentQuestion);
        } else {
            sections.quiz.classList.add('hidden');
            sections.form.classList.remove('hidden');
        }
    }

    function showFunnyMessage() {
        const messages = [
            "Vraiment ? Vous allez rater cette expérience olfactive unique ! 😜",
            "Oh non ! Laissez-vous tenter par l'aventure ! ✨",
            "Êtes-vous sûr(e) ? C'est une occasion en or ! 🌟"
        ];
        alert(messages[Math.floor(Math.random() * messages.length)]);
    }

    // Handle Form Submission
    const leadForm = document.getElementById('leadForm');
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(leadForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your backend
        console.log('Form data:', data);
        
        // Save to localStorage for demo purposes
        saveToLocalStorage(data);
        
        // Show confirmation
        sections.form.classList.add('hidden');
        sections.confirmation.classList.remove('hidden');
    });

    function saveToLocalStorage(data) {
        const leads = JSON.parse(localStorage.getItem('leads') || '[]');
        leads.push({...data, timestamp: new Date().toISOString()});
        localStorage.setItem('leads', JSON.stringify(leads));
    }

    // Social Share Buttons
    document.querySelectorAll('.share-button').forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent("J'ai découvert ma fragrance idéale !");
            
            let shareUrl = '';
            if (platform === 'facebook') {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            } else if (platform === 'twitter') {
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
}); 