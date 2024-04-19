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