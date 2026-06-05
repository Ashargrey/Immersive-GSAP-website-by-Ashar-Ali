const canvas = document.querySelector("#frame");
const context = canvas.getContext("2d");

gsap.registerPlugin(ScrollTrigger);

const frames = {
    currentIndex: 0,
    maxIndex: 382
};

let images = [];
let loadedImages = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function preLoader() {
    for (let i = 0; i < frames.maxIndex; i++) {
        const img = new Image();
        const num = (i + 1).toString().padStart(4, "0");

        img.src = `./Images/frame_${num}.jpeg`;

        img.onload = () => {
            loadedImages++;

            if (loadedImages === frames.maxIndex) {
                loadImage(0);
                startAnimation();
            }
        };

        images.push(img);
    }
}

function loadImage(index) {
    if (index < 0 || index >= images.length) return;

    const img = images[index];
    if (!img) return;

    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const scale = Math.max(scaleX, scaleY);

    const newWidth = img.width * scale;
    const newHeight = img.height * scale;

    const offsetX = (canvas.width - newWidth) / 2;
    const offsetY = (canvas.height - newHeight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
}

function startAnimation() {
    gsap.timeline({
        scrollTrigger: {
            trigger: ".container",
            start: "top top",
            end: "+=3000", // scroll length
            scrub: 1,
            pin: ".canvas-container", // canvas ko freeze karega
        }
    })
    .to(frames, {
        currentIndex: frames.maxIndex - 1,
        ease: "none",
        onUpdate: () => {
            loadImage(Math.floor(frames.currentIndex));
        }
    });
}

preLoader();