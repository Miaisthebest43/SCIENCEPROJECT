document.addEventListener('DOMContentLoaded', () => {
    // --- 0. PRESENTATION SCRIPT FOR NOTES ---
    const presentationScript = [
        "Did you know a molecule smaller than a dust speck dictates your entire existence? We are Group 4, and today we are unlocking the code of Nucleic Acids.",
        "As you can see, the monomer is a nucleotide, made of a sugar, phosphate, and base. The polymer is DNA or RNA. They are built from CHONP elements, notably Phosphorus. This forms the iconic double helix structure held together by hydrogen bonds.",
        "Moving to Slide 3, how does this structure dictate function? The double helix safely stores genetic information. Weak hydrogen bonds allow the DNA to unzip for replication. RNA then reads this code to synthesize proteins, passing traits to offspring.",
        "On Slide 4, our case study is Sickle Cell Anemia. A single structural mutation, just one base change in the DNA, replaces Glutamic acid with Valine. This tiny change alters the hemoglobin protein, causing red blood cells to sickle and clog vessels.",
        "To summarize: Nucleic acids are CHONP polymers built from nucleotides. DNA stores data while RNA builds proteins. Tiny structural changes alter biological function. Now, let's test your knowledge: Which element is unique to nucleic acids? A, B, C, or D? The answer is C, Phosphorus! Thank you."
    ];

    // --- 1. PRELOADER & TYPEWRITER ---
    const preloader = document.getElementById('preloader');
    setTimeout(() => { 
        preloader.classList.add('hidden'); 
        setTimeout(typeWriter, 400); 
    }, 1200);

    const typewriterElement = document.getElementById('typewriter');
    const text = "How does a molecule smaller than a dust speck dictate your entire existence?";
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typewriterElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 40);
        }
    }

    // --- 2. INTERACTIVE PARTICLE BACKGROUND ---
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 200 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x; mouse.y = e.y;
        const glow = document.getElementById('cursorGlow');
        if(glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    function initParticles() {
        particles = [];
        const count = Math.min((canvas.width * canvas.height) / 12000, 150);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                color: Math.random() > 0.5 ? '#00f3ff' : '#ff007f'
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            p.x += p.speedX; p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.fill();

            // Mouse repulsion
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                p.x -= dx * force * 0.05;
                p.y -= dy * force * 0.05;
            }

            // Molecular connections
            for (let j = index + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dist = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 - (dist/800)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animateParticles);
    }

    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    initParticles(); 
    animateParticles();

    // --- 3. SCROLL ANIMATIONS & PROGRESS ---
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        document.getElementById('scrollProgress').style.width = scrolled + '%';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

    // --- 4. 3D TILT EFFECT ---
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // --- 5. PRESENTATION & SLIDE DECK LOGIC ---
    const overlay = document.getElementById('presentationOverlay');
    const openBtns = [document.getElementById('openPresentation'), document.getElementById('openPresentationHero')];
    const closeBtn = document.getElementById('closePresentation');
    const speakerNotes = document.getElementById('speakerNotes');
    const notesBtn = document.getElementById('notesBtn');
    const audioBtn = document.getElementById('audioBtn');
    const notesText = document.getElementById('notesText');
    const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

    if (!speechSupported) {
        audioBtn.disabled = true;
        audioBtn.title = 'Speech narration is not supported in this browser.';
    }
    
    openBtns.forEach(btn => btn.addEventListener('click', () => { overlay.classList.add('active'); resetPresentation(); }));
    closeBtn.addEventListener('click', () => { 
        overlay.classList.remove('active'); 
        speakerNotes.classList.remove('active');
        stopAudio();
        if (document.fullscreenElement) document.exitFullscreen(); 
    });
    notesBtn.addEventListener('click', () => { speakerNotes.classList.toggle('active'); });

    const slides = overlay.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCounter = document.getElementById('currentSlideNum');
    const progressFill = document.getElementById('progressFill');
    const timerDisplay = document.getElementById('timer');
    const timerContainer = document.getElementById('timer-container');

    let currentSlide = 0; 
    const totalSlides = slides.length; 
    let timeLeft = 180; 
    let timerInterval;
    let isAutoPlaying = false;
    let speechToken = 0;
    let speechTimeout;

    function updateUI() {
        slideCounter.textContent = String(currentSlide + 1).padStart(2, '0');
        progressFill.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
        prevBtn.disabled = currentSlide === 0; 
        nextBtn.disabled = currentSlide === totalSlides - 1;
        slides.forEach((slide, index) => slide.classList.toggle('active', index === currentSlide));
        notesText.textContent = presentationScript[currentSlide];
        if (isAutoPlaying) speakSlide(currentSlide);
    }

    function nextSlide() { if (currentSlide < totalSlides - 1) { currentSlide++; updateUI(); } }
    function prevSlide() { if (currentSlide > 0) { currentSlide--; updateUI(); } }

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
        else if (e.key === 'ArrowLeft') { prevSlide(); }
        else if (e.key === 'Escape') { closeBtn.click(); }
    });

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    function stopAudio() {
        isAutoPlaying = false;
        speechToken++;
        clearTimeout(speechTimeout);
        if (speechSupported) window.speechSynthesis.cancel();
        audioBtn.textContent = '▶ AUTO-PLAY';
        audioBtn.classList.remove('playing');
    }

    function speakSlide(index) {
        if (!speechSupported) return;
        window.speechSynthesis.cancel();
        const token = ++speechToken;
        const utterance = new SpeechSynthesisUtterance(presentationScript[index]);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.onend = () => {
            if (!isAutoPlaying || token !== speechToken) return;
            if (currentSlide < totalSlides - 1) {
                speechTimeout = setTimeout(() => {
                    if (isAutoPlaying && token === speechToken) nextSlide();
                }, 800);
            } else {
                stopAudio();
            }
        };
        utterance.onerror = () => {
            if (token === speechToken) stopAudio();
        };
        window.speechSynthesis.speak(utterance);
    }

    audioBtn.addEventListener('click', () => {
        if (isAutoPlaying) {
            stopAudio();
            return;
        }
        isAutoPlaying = true;
        audioBtn.textContent = '⏸ PAUSE';
        audioBtn.classList.add('playing');
        speakSlide(currentSlide);
    });

    // --- 6. TIMER LOGIC ---
    function startTimer() {
        clearInterval(timerInterval); 
        timerDisplay.classList.remove('warning'); 
        timerDisplay.style.color = '#00f3ff';
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) { 
                clearInterval(timerInterval); 
                timerDisplay.textContent = "00:00"; 
                timerDisplay.classList.add('warning'); 
                return; 
            }
            timeLeft--; 
            const minutes = Math.floor(timeLeft / 60); 
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            if (timeLeft <= 30) timerDisplay.classList.add('warning');
        }, 1000);
    }

    function resetPresentation() { 
        currentSlide = 0; 
        timeLeft = 180; 
        stopAudio();
        updateUI(); 
        startTimer(); 
    }
    
    timerContainer.addEventListener('click', () => { timeLeft = 180; startTimer(); });
});