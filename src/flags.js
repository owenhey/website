let allFlagData;
let gameMode = 0; // 0 for pick flag, 1 for pick name
let correctIndex;
let questionFlagElement;

const flagList = [];
let answerMap = [];
let streak = 0;

const numberInput = document.querySelector('.flags-number');
const streakText = document.querySelector('.flags-streak-text');

// Allow scrolling on this page
document.body.style.overflow = 'scroll';
document.querySelector('.main-content').style.height = 'auto';
document.querySelector('.main-content').style.minHeight = '135vh';

// Goes through flags.csv and grabs all the flag data from it
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

{ // This actually fetches the CSV, is a stalling call
  fetch('flags.csv')
  .then(response => response.text())
  .then(data => {
    allFlagData = parseCSV(data);
    generateQuestion(); // Generate the first question when finished
  })
  .catch(error => {
    console.error('Error reading file:', error);
});
}

// Creates the 8 flag possiblities as well as the "question flag"
function generateElements(){
  const baseFlag = document.querySelector('.flag-container');
  const parent = document.querySelector('.flag-answers');
  baseFlag.setAttribute('data-index', '0');

  flagList.push(baseFlag);

  // Create the 8 answer copies
  for (let i = 1; i < 8; i++) {
    const copy = baseFlag.cloneNode(true);
    copy.setAttribute('data-index', i.toString());
    parent.appendChild(copy);
    flagList.push(copy);
  }

  // Create the base copy
  questionFlagElement = baseFlag.cloneNode(true);
  document.getElementById('flag-question-container').appendChild(questionFlagElement);
  questionFlagElement.style.display = 'none';
  // Remove the text and button
  questionFlagElement.querySelector('.country-name').remove();
  questionFlagElement.querySelector('.button').remove();
}

// Called when a guess is chosen
function checkAnswer(chosenIndex) {
  const responseText = document.getElementById('flags-response-text');
  responseText.style.display = 'block';
  if (chosenIndex === correctIndex) {
    responseText.innerHTML = "Correct!";
    generateQuestion();
    streak++;
  } else {
    console.log(answerMap);
    responseText.innerHTML = "Wrong, that's " + answerMap[chosenIndex].Country;
    streak = 0;
  }
  streakText.innerHTML = "Streak: " + streak;
}

// Adds listeners to all the answer buttons
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

// Generates random flags and then selects one to be the correct answer
function generateQuestion() {
  const numFlags = parseInt(numberInput.value);
  answerMap = getUniqueFlags(numFlags);

  // Set the flags to be displayed
  for (let i = 0; i < flagList.length; i++) {
    const shouldShow = i < numFlags;
    if (shouldShow) {
      flagList[i].style.display = 'flex';
      showFlag(flagList[i], answerMap[i]);
    } else {
      flagList[i].style.display = 'none';
    }
  }

  // Choose a random flag to ask the question about
  correctIndex = Math.floor(Math.random() * numFlags);
  const questionFlag = answerMap[correctIndex];
  
  const questionText = document.getElementById('flags-question-text');
  if(gameMode === 0){
    questionText.textContent = 'Which flag is ' + questionFlag.Country + '?';
    questionFlagElement.style.display = 'none';
  }
  else{
    questionText.textContent = 'Which state is';
    questionFlagElement.style.display = 'block';
    const questionFlagSvg = questionFlagElement.querySelector('#flag-svg');
    questionFlagSvg.setAttribute('src', questionFlag.Flag_image_url);
  }
}

// Grabs a list of unique flags, no duplicates allowed
function getUniqueFlags(numFlags) {
  const uniqueFlags = [];
  const usedIndexes = new Set();

  while (uniqueFlags.length < numFlags) {
    const randomIndex = Math.floor(Math.random() * allFlagData.length);
    if (!usedIndexes.has(randomIndex)) {
      uniqueFlags.push(allFlagData[randomIndex]);
      usedIndexes.add(randomIndex);
    }
  }

  return uniqueFlags;
}

// Just makes sure the number input only allows 2-8
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

// Displays a flag in a given flag element
function showFlag(element, flagData){
  const flagSvg = element.querySelector('#flag-svg');
  flagSvg.setAttribute('src', flagData.Flag_image_url);

  const countryName = element.querySelector('#country-name');
  countryName.textContent = flagData.Country;

  if(gameMode === 0){ // Meaning have to click on a flag
    countryName.style.display = 'none';
    flagSvg.style.display = 'block';
  }
  else{ // Meaning have to click on a name
    countryName.style.display = 'block';
    flagSvg.style.display = 'none';
  }
}

// Setup the game mode button
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

// Actually call all the methods for setup
setupNumberInput();
generateElements();
setupChooseButtons();