let parsedData;

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

fetch('flags.csv')
  .then(response => response.text())
  .then(data => {
    parsedData = parseCSV(data);
  })
  .catch(error => {
    console.error('Error reading file:', error);
});

const numberInput = document.querySelector('.flags-number');
const flagList = [];

function showRandomFlag(element){
  // const randomIndex = 132;
  const randomIndex = Math.floor(Math.random()*parsedData.length);
  const flagData = parsedData[randomIndex];

  const flagSvg = element.querySelector('#flag-svg');
  flagSvg.setAttribute('xlink:href', flagData.Flag_image_url);

  const countryName = element.querySelector('#country-name');
  countryName.textContent = flagData.Country;
}

const nextFlagButton = document.getElementById('next-flag-button');
nextFlagButton.addEventListener("click", ()=>{
  const numFlagsToShow = numberInput.value;
  // Set them hidden or not
  for (let i = 0; i < flagList.length; i++) {
    const shouldShow = i < numFlagsToShow;
    if(shouldShow){
      flagList[i].style.display = 'flex';
      showRandomFlag(flagList[i]);
    }
    else{
      flagList[i].style.display = 'none';
    }
  }
})


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

const baseFlag = document.querySelector('.flag-container');
const parent = document.querySelector('.flags');

flagList.push(baseFlag);

// Create copies of the base element and append them to the parent
for (let i = 0; i < 7; i++) {
  const copy = baseFlag.cloneNode(true);
  parent.appendChild(copy);
  flagList.push(copy);
}