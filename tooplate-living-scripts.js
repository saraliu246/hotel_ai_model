/* JavaScript Document
Tooplate 2150 Living Parallax
https://www.tooplate.com/view/2150-living-parallax
*/

const slider = document.getElementById("slider"),
      slides = document.querySelectorAll(".slide"),
      dots = document.querySelectorAll(".dot"),
      prevBtn = document.querySelector(".nav-arrow.prev"),
      nextBtn = document.querySelector(".nav-arrow.next"),
      menuToggle = document.getElementById("menuToggle"),
      mainNav = document.getElementById("mainNav");

let autoPlayInterval, progressInterval, progressStart,
    currentSlide = 0, isAnimating = false,
    mouseX = 0, mouseY = 0,
    isPausedByUser = false,
    slideDuration = 3000, // 🔹 每張預設 3 秒
    currentDuration = 3;  // 🔹 與 UI 顯示同步

function updateParallax() {
    const bg = slides[currentSlide].querySelector(".background-layer"),
          shapes = document.querySelectorAll(".parallax-shape");

    if (bg) bg.style.transform = `translate(${20*mouseX}px, ${20*mouseY}px)`;
    shapes.forEach((shape, index) => {
        if(shape.style.transform && shape.style.transform.includes("rotate")) return;
        const factor = 15*(index+1);
        shape.style.transform = `translate(${mouseX*factor}px, ${mouseY*factor}px)`;
    });
}

function getTransitionDuration() {
    return currentDuration <= 3 ? 300 : 700;
}

function showSlide(index) {
    if(isAnimating) return;
    isAnimating = true;
    const t = getTransitionDuration();

    document.documentElement.style.setProperty("--slide-transition-duration", t+"ms");

    slides.forEach(s => { s.classList.remove("active","prev"); });
    dots.forEach(d => { d.classList.remove("active"); });

    if(currentSlide !== index) slides[currentSlide].classList.add("prev");

    slides[currentSlide = index].classList.add("active");
    dots[currentSlide].classList.add("active");

    updateParallax();

    setTimeout(()=>{ isAnimating = false; }, t);
}

function nextSlide() {
    showSlide((currentSlide+1) % slides.length);
}

function prevSlide() {
    showSlide((currentSlide+slides.length) % slides.length);
}

function startAutoPlay() {
    clearInterval(autoPlayInterval);
    stopProgressBar();
    if(!isPausedByUser) {
        startProgressBar();
        autoPlayInterval = setInterval(()=>{
            nextSlide();
            stopProgressBar();
            startProgressBar();
        }, slideDuration);
    }
}

function startProgressBar() {
    const bar = document.getElementById("progressBar");
    if(!bar) return;

    bar.style.width = "0%";
    progressStart = Date.now();
    clearInterval(progressInterval);

    function update() {
        const elapsed = Date.now() - progressStart;
        const percent = Math.min(elapsed / slideDuration, 1) * 100;
        bar.style.width = percent + "%";
        if(percent >= 100) bar.style.width = "100%";
    }

    progressInterval = setInterval(update, 50);
    update();
}

function stopProgressBar() {
    clearInterval(progressInterval);
    const bar = document.getElementById("progressBar");
    if(bar) bar.style.width = "0%";
}

function openOverlay(id) {
    const overlay = document.getElementById(id+"Overlay");
    overlay.classList.add("active");
    clearInterval(autoPlayInterval);

    const content = overlay.querySelector(".overlay-content");
    if(content) setTimeout(()=>{
        const scrollInd = content.querySelector(".scroll-indicator");
        if(scrollInd && content.scrollHeight>content.clientHeight){
            scrollInd.classList.add("show");
            content.classList.add("has-scroll");
        }
    },100);
}

function closeOverlay(id) {
    document.getElementById(id+"Overlay").classList.remove("active");
    if(!isPausedByUser) startAutoPlay();
}

function handleSubmit(e) {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    e.target.reset();
    closeOverlay("contact");
}

function moveShapeToRandomPosition(el) {
    el.style.top = 10 + Math.random()*60 + "%";
    el.style.left = 5 + Math.random()*80 + "%";
    el.style.bottom = "auto";
    el.style.right = "auto";

    const rotate = 360*Math.random();
    el.style.transform = `rotate(${rotate}deg)`;
    setTimeout(()=>{ el.style.transform = ""; }, 800);
}

function autoMoveShapes() {
    document.querySelectorAll(".parallax-shape").forEach((el,i)=>{
        setTimeout(()=>{ moveShapeToRandomPosition(el); }, i*2000);
    });
}

function handleScrollIndicator(el) {
    const scrollInd = el.querySelector(".scroll-indicator");
    if(!scrollInd) return;

    function update() {
        const scrollable = el.scrollHeight > el.clientHeight;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight-10;
        if(scrollable && !atBottom) scrollInd.classList.add("show");
        else scrollInd.classList.remove("show");

        if(scrollable && !atBottom) el.classList.add("has-scroll");
        else el.classList.remove("has-scroll");
    }

    setTimeout(update,100);
    el.addEventListener("scroll", update);
}

// ------------------------
// Event Listeners
// ------------------------
menuToggle.addEventListener("click", ()=>{
    menuToggle.classList.toggle("active");
    mainNav.classList.toggle("active");
});

document.querySelectorAll("nav a").forEach(a=>{
    a.addEventListener("click", ()=>{
        if(window.innerWidth <= 768){
            menuToggle.classList.remove("active");
            mainNav.classList.remove("active");
        }
    });
});

slider.addEventListener("mousemove", e=>{
    const rect = slider.getBoundingClientRect();
    mouseX = (e.clientX - rect.left)/rect.width - 0.5;
    mouseY = (e.clientY - rect.top)/rect.height - 0.5;
    updateParallax();
});

nextBtn.addEventListener("click", ()=>{
    clearInterval(autoPlayInterval);
    nextSlide();
    if(!isPausedByUser) startAutoPlay();
});

prevBtn.addEventListener("click", ()=>{
    clearInterval(autoPlayInterval);
    prevSlide();
    if(!isPausedByUser) startAutoPlay();
});

dots.forEach(dot=>{
    dot.addEventListener("click", ()=>{
        clearInterval(autoPlayInterval);
        showSlide(parseInt(dot.getAttribute("data-slide")));
        if(!isPausedByUser) startAutoPlay();
    });
});

document.addEventListener("keydown", e=>{
    if(e.key === "ArrowLeft") { clearInterval(autoPlayInterval); prevSlide(); if(!isPausedByUser) startAutoPlay(); }
    if(e.key === "ArrowRight") { clearInterval(autoPlayInterval); nextSlide(); if(!isPausedByUser) startAutoPlay(); }
    if(e.key.toLowerCase() === "h") uiToggleBtn.click();
});

document.querySelectorAll(".overlay").forEach(overlay=>{
    overlay.addEventListener("click", e=>{
        if(e.target===overlay){ overlay.classList.remove("active"); if(!isPausedByUser) startAutoPlay(); }
    });
});

document.addEventListener("keydown", e=>{
    if(e.key === "Escape"){
        document.querySelectorAll(".overlay").forEach(o=>o.classList.remove("active"));
        if(!isPausedByUser) startAutoPlay();
    }
});

// ------------------------
// Fullscreen
// ------------------------
const fullscreenBtn = document.getElementById("fullscreenBtn"),
      expandIcon = '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
      collapseIcon = '<svg viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>';

fullscreenBtn.addEventListener("click", ()=>{
    if(window.innerWidth <= 768){
        menuToggle.classList.remove("active");
        mainNav.classList.remove("active");
    }

    if(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement){
        if(document.exitFullscreen) document.exitFullscreen();
        else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if(document.msExitFullscreen) document.msExitFullscreen();
        fullscreenBtn.classList.remove("active");
        fullscreenBtn.innerHTML = expandIcon;
    } else {
        if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
        else if(document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen();
        else if(document.documentElement.mozRequestFullScreen) document.documentElement.mozRequestFullScreen();
        else if(document.documentElement.msRequestFullscreen) document.documentElement.msRequestFullscreen();
        fullscreenBtn.classList.add("active");
        fullscreenBtn.innerHTML = collapseIcon;
    }
});

document.addEventListener("fullscreenchange", ()=>{ if(!document.fullscreenElement) { fullscreenBtn.classList.remove("active"); fullscreenBtn.innerHTML = expandIcon; } });
document.addEventListener("webkitfullscreenchange", ()=>{ if(!document.webkitFullscreenElement) { fullscreenBtn.classList.remove("active"); fullscreenBtn.innerHTML = expandIcon; } });
document.addEventListener("mozfullscreenchange", ()=>{ if(!document.mozFullScreenElement) { fullscreenBtn.classList.remove("active"); fullscreenBtn.innerHTML = expandIcon; } });

// ------------------------
// Play/Pause
// ------------------------
const playPauseBtn = document.getElementById("playPauseBtn"),
      playIcon = '<svg viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg>',
      pauseIcon = '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';

playPauseBtn.innerHTML = pauseIcon;

playPauseBtn.addEventListener("click", e=>{
    e.stopPropagation();
    if(isPausedByUser){
        isPausedByUser = false;
        startAutoPlay();
        playPauseBtn.innerHTML = pauseIcon;
        playPauseBtn.classList.remove("paused");
    } else {
        isPausedByUser = true;
        clearInterval(autoPlayInterval);
        stopProgressBar();
        playPauseBtn.innerHTML = playIcon;
        playPauseBtn.classList.add("paused");
    }
});

// ------------------------
// Duration Controls
// ------------------------
const decreaseBtn = document.getElementById("decreaseDuration"),
      increaseBtn = document.getElementById("increaseDuration"),
      durationDisplay = document.getElementById("durationDisplay");

function updateDuration(e){
    currentDuration = Math.max(1, Math.min(9, e));
    slideDuration = 1000 * currentDuration;
    durationDisplay.innerHTML = currentDuration + "<span>s</span>";
    const t = getTransitionDuration();
    document.documentElement.style.setProperty("--slide-transition-duration", t+"ms");
    if(!isPausedByUser) startAutoPlay();
}

decreaseBtn.addEventListener("click", e=>{
    e.stopPropagation();
    updateDuration(currentDuration-1);
});

increaseBtn.addEventListener("click", e=>{
    e.stopPropagation();
    updateDuration(currentDuration+1);
});

document.documentElement.style.setProperty("--slide-transition-duration","700ms");

// ------------------------
// UI Toggle
// ------------------------
let uiVisible = true;
const uiToggleBtn = document.getElementById("uiToggleBtn"),
      eyeIcon = document.getElementById("eyeIcon"),
      eyeOpenPath = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
      eyeClosedPath = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';

uiToggleBtn.addEventListener("click", e=>{
    e.preventDefault();
    e.stopPropagation();
    const elements = document.querySelectorAll(".ui-element");
    if(uiVisible){
        elements.forEach(el=>el.classList.add("hidden"));
        uiVisible = false;
        uiToggleBtn.classList.add("ui-hidden");
        eyeIcon.innerHTML = eyeClosedPath;
        uiToggleBtn.title = "Show UI Elements (Press H)";
    } else {
        elements.forEach(el=>el.classList.remove("hidden"));
        uiVisible = true;
        uiToggleBtn.classList.remove("ui-hidden");
        eyeIcon.innerHTML = eyeOpenPath;
        uiToggleBtn.title = "Hide UI Elements (Press H)";
    }
});

// ------------------------
// Initialize
// ------------------------
startAutoPlay();
updateParallax();
if(window.innerWidth <= 768) slider.removeEventListener("mousemove", updateParallax);
document.querySelectorAll(".parallax-shape").forEach(el=>{
    el.addEventListener("click", function(e){ e.stopPropagation(); moveShapeToRandomPosition(this); });
});
setInterval(autoMoveShapes,15000);
setTimeout(autoMoveShapes,5000);
document.querySelectorAll(".overlay-content").forEach(el=>handleScrollIndicator(el));