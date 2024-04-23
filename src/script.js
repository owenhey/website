const moveDiv = document.getElementById('random');
let clickCount = 0;

moveDiv.addEventListener('mouseover', () => {
  const randomX = Math.floor((Math.random() * .8 + .1) * window.innerWidth);
  const randomY = Math.floor((Math.random() * .8 + .1) * window.innerHeight);

  moveDiv.style.left = `${randomX}px`;
  moveDiv.style.top = `${randomY}px`;
});

moveDiv.addEventListener('mousedown', () => {
  clickCount += 1;
  moveDiv.innerHTML = clickCount; 
});

const gradient = document.querySelector('.background-gradient');

let targetX = 50;
let targetY = 50;
let currentX = targetX;
let currentY = targetY;
let velX = 0;
let velY = 0;
const damping = .1;

function updateGradient(x, y) {
  const diffX = x - currentX;
  const diffY = y - currentY;
  
  currentX += diffX * damping;
  currentY += diffY * damping;
  
  gradient.style.background = `radial-gradient(circle at ${currentX}% ${currentY}%, #ffffff44 0%, #ffffff00 40%)`;
}

gradient.addEventListener('mousemove', (event) => {
  const rect = gradient.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const percentX = (x / rect.width) * 100;
  const percentY = (y / rect.height) * 100;
  
  updateGradient(percentX, percentY);
});