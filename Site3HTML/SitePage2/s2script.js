console.log("meow");

document.addEventListener("DOMContentLoaded", function() {
    const images = Array.from(document.querySelectorAll('.slowImage'));
    let current = 0;

    function revealImage(img, callback) {
        img.style.visibility = "visible"; // Show the image just before animating
        let reveal = 0;
        const total = img.naturalHeight || img.height || 300;
        img.style.clipPath = `inset(0 0 ${total}px 0)`;

        const interval = setInterval(() => {
            reveal += 10;
            if (reveal >= total) {
                img.style.clipPath = 'none';
                clearInterval(interval);
                if (callback) callback();
            } else {
                img.style.clipPath = `inset(0 0 ${total - reveal}px 0)`;
            }
        }, 50);
    }

    function animateNextImage() {
        if (current < images.length) {
            const img = images[current];
            if (img.complete) {
                revealImage(img, () => {
                    current++;
                    animateNextImage();
                });
            } else {
                img.onload = () => {
                    revealImage(img, () => {
                        current++;
                        animateNextImage();
                    });
                };
            }
        }
    }

    animateNextImage();
});