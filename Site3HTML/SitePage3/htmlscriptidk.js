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