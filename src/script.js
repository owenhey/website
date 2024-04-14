const moveDiv = document.getElementById('random');

moveDiv.addEventListener('mouseover', () => {
  const randomX = Math.floor((Math.random() * .8 + .1) * window.innerWidth);
  const randomY = Math.floor((Math.random() * .8 + .1) * window.innerHeight);

  moveDiv.style.left = `${randomX}px`;
  moveDiv.style.top = `${randomY}px`;
  console.log("hello");
});