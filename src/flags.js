let parsedData;
const numberInput = document.querySelector('.flags-number');
const flagList = [];
let gameMode = 0; // 0 for pick flag, 1 for pick name
let correctIndex;

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j];
    }

    result.push(obj);
  }

  return result;
}

function checkAnswer(chosenIndex) {
  const responseText = document.getElementById('flags-response-text');
  responseText.style.display = 'block';
  if (chosenIndex === correctIndex) {
    responseText.innerHTML = "Correct!";
    generateQuestion();
  } else {
    responseText.innerHTML = "That's not correct";
  }
}

function generateElements(){
  const baseFlag = document.querySelector('.flag-container');
  const parent = document.querySelector('.flags');
  baseFlag.setAttribute('data-index', '0');

  flagList.push(baseFlag);

  // Create copies of the base element and append them to the parent
  for (let i = 1; i < 8; i++) {
    const copy = baseFlag.cloneNode(true);
    copy.setAttribute('data-index', i.toString());
    parent.appendChild(copy);
    flagList.push(copy);
  }
}

function setupChooseButtons() {
  const chooseButtons = document.querySelectorAll('#flags-choose-button');
  chooseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const flagContainer = this.closest('.flag-container');
      const chosenIndex = parseInt(flagContainer.getAttribute('data-index'));
      checkAnswer(chosenIndex);
    });
  });
}

function generateQuestion() {
  const numFlags = parseInt(numberInput.value);
  const uniqueFlags = getUniqueFlags(numFlags);

  // Set the flags to be displayed
  for (let i = 0; i < flagList.length; i++) {
    const shouldShow = i < numFlags;
    if (shouldShow) {
      flagList[i].style.display = 'flex';
      showFlag(flagList[i], uniqueFlags[i]);
    } else {
      flagList[i].style.display = 'none';
    }
  }

  // Choose a random flag to ask the question about
  correctIndex = Math.floor(Math.random() * numFlags);
  const questionFlag = uniqueFlags[correctIndex];
  
  const questionText = document.getElementById('flags-question-text');
  if(gameMode === 0){
    questionText.innerHTML = 'Which flag is ' + questionFlag.Country + '?';
  }
  else{
    
  }
}

function getUniqueFlags(numFlags) {
  const uniqueFlags = [];
  const usedIndexes = new Set();

  while (uniqueFlags.length < numFlags) {
    const randomIndex = Math.floor(Math.random() * parsedData.length);
    if (!usedIndexes.has(randomIndex)) {
      uniqueFlags.push(parsedData[randomIndex]);
      usedIndexes.add(randomIndex);
    }
  }

  return uniqueFlags;
}


{ // Actually fetch it
  fetch('flags.csv')
  .then(response => response.text())
  .then(data => {
    parsedData = parseCSV(data);
    generateQuestion();
  })
  .catch(error => {
    console.error('Error reading file:', error);
});
}

function setupNumberInput(){
  numberInput.addEventListener('input', function() {
    if(this.value === ''){
      this.value = '';
      return;
    }
    if(this.value === 'e' || this.value === 'E'){
      this.value = '';
      return;
    }
    const enteredValue = parseInt(this.value);
    const clampedValue = Math.min(Math.max(enteredValue, 2), 8);
    numberInput.value = clampedValue;
  });
}

function showFlag(element, flagData){
  const flagSvg = element.querySelector('#flag-svg');
  flagSvg.setAttribute('src', flagData.Flag_image_url);

  const countryName = element.querySelector('#country-name');
  countryName.textContent = flagData.Country;

  if(gameMode === 0){
    countryName.style.display = 'none';
    flagSvg.style.display = 'block';
  }
  else{
    countryName.style.display = 'block';
    flagSvg.style.display = 'none';
  }
}

const flagGameMode = document.getElementById('flags-game-mode');
flagGameMode.addEventListener("click", ()=>{
  if(gameMode === 0){
    gameMode = 1;
    flagGameMode.innerText = "Name Mode";
  }
  else {
    gameMode = 0;
    flagGameMode.innerText = "Flag Mode";
  }
})


setupNumberInput();
generateElements();
setupChooseButtons();