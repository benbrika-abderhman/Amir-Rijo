document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. ROMANTIC LOADING SCREEN
     ========================================== */
  const loader        = document.getElementById('loader');
  const loaderBar     = document.getElementById('loader-bar');
  const wrapper       = document.getElementById('main-wrapper');
  const audioContainer = document.getElementById('audio-container');
  const unmuteOverlay = document.getElementById('unmute-overlay');

  // Simulate loading steps (ensures fonts/images are parsed)
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);

      // Step 1 — fade out loader
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';

        // Step 2 — show the unmute / enter overlay
        // This single tap satisfies the browser's user-gesture requirement,
        // so the YouTube player can unmute and play with full sound.
        setTimeout(() => {
          unmuteOverlay.style.display = 'flex';
        }, 300);

      }, 500);
    }
    loaderBar.style.width = `${progress}%`;
  }, 100);

  const bgMusic = document.getElementById('bg-music');
  const audioToggle = document.getElementById('audio-toggle');
  let musicPlaying = false;

  // Wire up the overlay tap/click ─ this is the ONE gesture we need.
  // Setting audio.play() INSIDE a click handler is allowed by all browsers.
  unmuteOverlay.addEventListener('click', () => {
    // 1. Start the music
    bgMusic.play().then(() => {
      musicPlaying = true;
      audioToggle.classList.add('playing');
    }).catch(e => {
      console.log('Audio play failed:', e);
    });

    // 2. Dismiss overlay with a fade
    unmuteOverlay.style.transition = 'opacity 0.6s ease';
    unmuteOverlay.style.opacity = '0';
    setTimeout(() => {
      unmuteOverlay.style.display = 'none';
    }, 600);

    // 3. Show main site + audio button
    wrapper.classList.add('loaded');
    audioContainer.style.display = 'flex';
    document.body.style.overflowY = 'auto';
  });

  // ── Manual play/pause toggle button ─────────────────────────────────────
  audioToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (musicPlaying) {
      // Stop music
      bgMusic.pause();
      musicPlaying = false;
      audioToggle.classList.remove('playing');
    } else {
      // Restart music
      bgMusic.play();
      musicPlaying = true;
      audioToggle.classList.add('playing');
    }
  });

  // Disable scrolling during load + overlay
  document.body.style.overflowY = 'hidden';


  /* ==========================================
     3. REAL-TIME ANNIVERSARY COUNT-UP
     ========================================== */
  // Together since date: December 4, 2025 at 00:00:00 (adjustable)
  const anniversaryDate = new Date('December 4, 2025 00:00:00');

  function updateCountdown() {
    const now = new Date();
    const difference = now.getTime() - anniversaryDate.getTime();

    // Calculations for total time elapsed
    let seconds = Math.floor(difference / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    // Dynamic month/year calculation for accuracy
    let yearsCount = now.getFullYear() - anniversaryDate.getFullYear();
    let monthsCount = now.getMonth() - anniversaryDate.getMonth();
    let daysCount = now.getDate() - anniversaryDate.getDate();

    if (daysCount < 0) {
      // Get days in previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      daysCount += prevMonth.getDate();
      monthsCount--;
    }

    if (monthsCount < 0) {
      monthsCount += 12;
      yearsCount--;
    }

    // Adjust displays
    document.getElementById('count-years').textContent = String(yearsCount).padStart(2, '0');
    document.getElementById('count-months').textContent = String(monthsCount).padStart(2, '0');
    document.getElementById('count-days').textContent = String(daysCount).padStart(2, '0');
    document.getElementById('count-hours').textContent = String(Math.floor(hours % 24)).padStart(2, '0');
    document.getElementById('count-minutes').textContent = String(Math.floor(minutes % 60)).padStart(2, '0');
    document.getElementById('count-seconds').textContent = String(Math.floor(seconds % 60)).padStart(2, '0');
  }

  // Update timer every second
  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ==========================================
     4. HIGH-PERFORMANCE CANVAS PARTICLES
     ========================================== */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let stars = [];
  let petals = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  window.addEventListener('resize', resizeCanvas);

  // Initialize background twinkling stars
  function initStars() {
    stars = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7, // Keep stars in upper sky area
        size: Math.random() * 1.5,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        alpha: Math.random(),
        increasing: Math.random() > 0.5
      });
    }
  }

  // Spark / Ember particles rising up
  class Spark {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // distribute on init
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = 1 + Math.random() * 2.5;
      this.speedY = -(0.5 + Math.random() * 1.5);
      this.speedX = -0.5 + Math.random() * 1.0;
      this.alpha = 0.2 + Math.random() * 0.6;
      this.decay = 0.001 + Math.random() * 0.003;
      // Crimson / Gold colors
      this.color = Math.random() > 0.7 ? '#FF2E93' : '#8B0000';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.alpha -= this.decay;
      if (this.alpha <= 0 || this.y < -10) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Floating Heart particles
  class Heart {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = 8 + Math.random() * 12;
      this.speedY = -(0.4 + Math.random() * 0.8);
      this.speedX = Math.sin(Math.random()) * 0.4;
      this.alpha = 0.15 + Math.random() * 0.35;
      this.decay = 0.001 + Math.random() * 0.002;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.alpha -= this.decay;
      if (this.alpha <= 0 || this.y < -20) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#ff2e63';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#8B0000';
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(this.x, this.y + topCurveHeight);
      // Left curve
      ctx.bezierCurveTo(
        this.x - this.size / 2, this.y - topCurveHeight,
        this.x - this.size, this.y + this.size / 3,
        this.x, this.y + this.size
      );
      // Right curve
      ctx.bezierCurveTo(
        this.x + this.size, this.y + this.size / 3,
        this.x + this.size / 2, this.y - topCurveHeight,
        this.x, this.y + topCurveHeight
      );
      ctx.fill();
      ctx.restore();
    }
  }

  // Falling Rose Petals
  class Petal {
    constructor() {
      this.reset();
      this.y = Math.random() * -canvas.height; // scatter at start
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = 10 + Math.random() * 12;
      this.speedY = 0.8 + Math.random() * 1.2;
      this.speedX = -0.5 + Math.random() * 1.0;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = -0.01 + Math.random() * 0.02;
      this.color = Math.random() > 0.4 ? '#8B0000' : '#120202'; // Red and dark gothic petals
      this.opacity = 0.5 + Math.random() * 0.45;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y / 30) * 0.3; // drift wave
      this.rotation += this.rotationSpeed;
      if (this.y > canvas.height + 20) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#000000';
      
      // Draw a rose petal shape (ellipse with pointed tip)
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.quadraticCurveTo(this.size / 2, -this.size / 2, this.size / 3, this.size / 2);
      ctx.quadraticCurveTo(0, this.size * 0.7, -this.size / 3, this.size / 2);
      ctx.quadraticCurveTo(-this.size / 2, -this.size / 2, 0, -this.size / 2);
      ctx.closePath();
      ctx.fill();

      // Add petal highlight/texture line
      ctx.strokeStyle = '#5c0202';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.lineTo(0, this.size * 0.5);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Setup arrays
  resizeCanvas();
  for (let i = 0; i < 40; i++) particles.push(new Spark());
  for (let i = 0; i < 8; i++) particles.push(new Heart());
  for (let i = 0; i < 20; i++) petals.push(new Petal());

  // Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Stars
    stars.forEach(star => {
      if (star.increasing) {
        star.alpha += star.twinkleSpeed;
        if (star.alpha >= 1) star.increasing = false;
      } else {
        star.alpha -= star.twinkleSpeed;
        if (star.alpha <= 0.1) star.increasing = true;
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Draw rising embers & hearts
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // 3. Draw falling rose petals
    petals.forEach(petal => {
      petal.update();
      petal.draw();
    });

    requestAnimationFrame(animate);
  }
  animate();


  /* ==========================================
     5. LIGHTBOX / MEMORY GALLERY
     ========================================== */
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxCaption = document.getElementById('lightbox-caption');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgPath = card.getAttribute('data-img');
      const captionText = card.getAttribute('data-caption');
      
      lightboxImg.src = imgPath;
      lightboxCaption.textContent = captionText;
      lightbox.classList.add('active');
    });
  });

  // Close Lightbox
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });


  /* ==========================================
     6. MOBILE TAROT FLIP FIX
     ========================================== */
  const reasonCards = document.querySelectorAll('.reason-card');
  reasonCards.forEach(card => {
    // Enable toggling the flipped state on click/tap
    card.addEventListener('click', (e) => {
      // Check if it's flipped already, toggle
      card.classList.toggle('flipped');
    });

    // Handle space/enter key for accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });


  /* ==========================================
     7. BIRTHDAY WISHES & QUOTES CAROUSEL
     ========================================== */
  const slides = document.querySelectorAll('.quote-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let quoteTimer;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startQuoteTimer() {
    quoteTimer = setInterval(nextSlide, 5000);
  }

  function resetQuoteTimer() {
    clearInterval(quoteTimer);
    startQuoteTimer();
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-index'));
      showSlide(targetIndex);
      resetQuoteTimer();
    });
  });

  // Start the carousel
  startQuoteTimer();


  /* ==========================================
     8. INTERACTIVE HEART & SECRET MESSAGE
     ========================================== */
  const secretHeartBtn = document.getElementById('secret-heart-btn');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const secretTypewriter = document.getElementById('secret-typewriter');
  let isMessageRevealed = false;

  const secretMessage = `My Dearest Rijo,

I wanted to hide a beautiful message here where only you could unseal it. If I could give you one single thing in life, I would give you the ability to see yourself through my eyes. Only then would you realize how truly special, breathtakingly beautiful, and incredibly important you are to me.

You are my cozy home, my favorite adventure, my midnight peace, and the love of my life. Loving you is like breathing—effortless, natural, and absolutely vital to my existence.

Happy Birthday, my queen. Today, tomorrow, and for all the lifetimes to come, my heart is yours.

With all my eternal love,
Bewino ❤️`;

  // Function to simulate a rose petal and heart explosion from the button
  function createExplosion(x, y) {
    const burstCount = 45;
    for (let i = 0; i < burstCount; i++) {
      // We spawn temporary canvas elements or create custom floating particles
      // To keep it simple and ultra-performant, we'll spawn canvas Petal/Heart particles
      // centered at (x, y) with high velocity.
      
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      
      if (Math.random() > 0.4) {
        // Spawn a burst Petal
        const p = new Petal();
        p.x = x;
        p.y = y;
        p.speedY = Math.sin(angle) * speed;
        p.speedX = Math.cos(angle) * speed;
        p.opacity = 1.0;
        p.rotationSpeed = -0.1 + Math.random() * 0.2;
        p.size = 8 + Math.random() * 8;
        petals.push(p);
      } else {
        // Spawn a burst Heart
        const h = new Heart();
        h.x = x;
        h.y = y;
        h.speedY = Math.sin(angle) * speed;
        h.speedX = Math.cos(angle) * speed;
        h.alpha = 1.0;
        h.size = 10 + Math.random() * 10;
        particles.push(h);
      }
    }
  }

  // Typewriter Effect
  function typeWriter(text, element, speed = 40) {
    let index = 0;
    element.innerHTML = ''; // Clear existing
    
    // Create cursor
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    cursor.textContent = '❘';
    element.appendChild(cursor);

    function type() {
      if (index < text.length) {
        const char = text.charAt(index);
        
        // Handle newlines nicely by inserting <br>
        if (char === '\n') {
          cursor.insertAdjacentHTML('beforebegin', '<br>');
        } else if (char === '❤️') {
          cursor.insertAdjacentHTML('beforebegin', '<span class="heart-red">❤️</span>');
          index++; // extra character skip for emoji surrogate
        } else {
          cursor.insertAdjacentHTML('beforebegin', char);
        }
        
        index++;
        setTimeout(type, speed);
      } else {
        // Remove cursor at the end
        cursor.remove();
      }
    }
    
    type();
  }

  secretHeartBtn.addEventListener('click', (e) => {
    if (isMessageRevealed) return;
    isMessageRevealed = true;

    // Get click coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Trigger rose petal explosion
    createExplosion(clickX, clickY);

    // Disable the button hover pulse
    secretHeartBtn.style.animation = 'none';
    secretHeartBtn.style.transform = 'scale(0.9)';
    secretHeartBtn.style.opacity = '0.6';
    secretHeartBtn.style.cursor = 'default';

    // Reveal envelope and type letter
    envelopeWrapper.classList.add('visible');
    
    // Smooth scroll down to the letter
    setTimeout(() => {
      envelopeWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Start writing the secret message
      typeWriter(secretMessage, secretTypewriter, 35);
    }, 400);
  });

});
