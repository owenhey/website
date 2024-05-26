const gradient = document.querySelector('.background-gradient');

let currentX = 50;
let currentY = 50;
let actualX = 0;
let actualY = 0;
let velX = 0;
let velY = 0;
let movedMouse = false;

const damping = .05;

function logCurrentTime() {
  if(movedMouse == false){
    requestAnimationFrame(logCurrentTime);
    return;
  }
  updateGradient(actualX, actualY);
  
  requestAnimationFrame(logCurrentTime);
}

requestAnimationFrame(logCurrentTime);

function updateGradient(x, y) {
  const diffX = x - currentX;
  const diffY = y - currentY;
  
  currentX += diffX * damping;
  currentY += diffY * damping;
  
  gradient.style.background = `radial-gradient(circle at ${currentX}% ${currentY}%, #ffffff 0%, #ffffff00 80%)`;
}

gradient.addEventListener('mousemove', (event) => {
  movedMouse = true;
  const rect = gradient.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const percentX = (x / rect.width) * 100;
  const percentY = (y / rect.height) * 100;
  actualX = percentX;
  actualY = percentY;
});