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
    showFlag();
  })
  .catch(error => {
    console.error('Error reading file:', error);
});

function showFlag(){
  // const randomIndex = 132;
  const randomIndex = Math.floor(Math.random()*parsedData.length);
  const flagData = parsedData[randomIndex];

  const flagSvg = document.getElementById('flag-svg');
  flagSvg.setAttribute('xlink:href', flagData.Flag_image_url);

  const countryName = document.getElementById('country-name');
  countryName.textContent = flagData.Country;
}

const nextFlagButton = document.getElementById('next-flag-button');
nextFlagButton.addEventListener("click", ()=>{
  showFlag();
})