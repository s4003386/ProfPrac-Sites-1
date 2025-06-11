console.log("Girl help me");

const images = [
  "Illustration1.png",
  "Illustration2.png",
  "Illustration3.png"
];

let idx = 0;
const target = document.querySelector('.content_site3');

setInterval(() => {
  idx = (idx + 1) % images.length;
  console.log('set', images[idx]);
  target.style.backgroundImage = `url('${images[idx]}')`;
}, 1000); 



document.addEventListener("DOMContentLoaded", function() {
    const neoImages = [
        "/Site3HTML/SitePage3/NeoEmote/neoemote1.png",
        "/Site3HTML/SitePage3/NeoEmote/neoemote2.png",
        "/Site3HTML/SitePage3/NeoEmote/neoemote3.png",
        "/Site3HTML/SitePage3/NeoEmote/neoemote4.png",
        "/Site3HTML/SitePage3/NeoEmote/neoemote5.png",
    ];
    let current = 0;
    const neoImg = document.querySelector('.NeoImage');
    if (!neoImg) return;

    neoImg.addEventListener('click', function() {
        current = (current + 1) % neoImages.length;
        neoImg.src = neoImages[current];
    });
});