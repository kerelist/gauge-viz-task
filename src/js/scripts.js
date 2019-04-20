'use strict';

//URL
var url = 'https://widgister.herokuapp.com/challenge/frontend';

//constants
const meterStart = -0.25;
// amount of "turn" capacity the guage has for the CSS "transform: rotate" property
const meterTotal = 0.5;

//DOM Nodes
var value = document.getElementById('m-value'),
    min = document.getElementById('m-min'),
    max = document.getElementById('m-max'),
    retry = document.getElementById('retry'),
    srText = document.getElementById('sr-text'),
    loading = document.getElementById('loading'),
    impossible = document.getElementById('impossible'),
    meter = document.getElementById('meter');

//hold result data
var results = {};


//handle errors
//this didn't get completed, see README
var handleError = (error) => {
  console.log(error)
  if (error === `The server is on fire`) {
    console.log('help');
  }
}

//initial data handler, assign results to object
var handleData = (data) => {
  results.min = data.min ? data.min : '';
  results.max = data.max ? data.max : '';
  results.value = handleFormat(data);

  inputData(results, data);
}

//format the value if formatting data provided
var handleFormat = (data) => {
  let result;

  //if no data, don't format & give user message
  if (!data.value) {
    return `There is no value available.`
  } else {
    result = data.value;
  }

  //if no format or unit, or no unit, or format isn't currency, return value as-is
  if ((!data.format && !data.unit) || !data.unit || data.format !== 'currency') {
    return result;
  }

  //otherwise convert to currency format & return
  let number = new Intl.NumberFormat('en-UK',{ style: 'currency', currency: data.unit }).format(data.value);
  result = number;

  return result;
}

//input data into gauge & placeholders
var inputData = (results, data) => {

  //remove loading; if we're this far we have valid data
  loading.style.visibility = "hidden";

  //insert numbers into placeholders
  min.innerHTML = results.min;
  max.innerHTML = results.max;
  value.innerHTML = results.value;

  //add info to screenreader alert text
  srText.innerHTML = `The value is ${results.value} with a min of ${results.min} and a max of ${results.max}`;

  //if the numbers are impossible, warn user & don't bother animating
  if (data.max < data.min || data.value < data.min || data.value > data.max) {
    impossible.style.display = 'block';
    srText.innerHTML = `The value is ${results.value} with a min of ${results.min} and a max of ${results.max}. These results are impossible.`
  } else {
    //otherwise animate meter
    animateMeter(data);
  }

  //activate retry button
  activateButton();
  //activate screenreader alert
  srText.classList.add('sr-only');
}

//animate the meter
var animateMeter = (data) => {
  //if any of these data points missing, it won't work. don't bother & return
  if (!data.max || !data.min || !data.value) {
    return;
  }

  //figure out how much CSS "turn" to add to original transform:rotate property
  let meterRange = data.max - data.min;
  let valFraction = (data.value - data.min) / meterRange;
  let addToMeter = valFraction * meterTotal;
  let newMeter = meterStart + addToMeter;

  meter.style.transform = `rotate(${newMeter}turn)`;
}

//activate retry button to clicks
var activateButton = () => {
  retry.classList.add('active');
  retry.addEventListener('click', getData);
}

//deactivate while data is loading
var deactivateButton = () => {
  if (retry.classList.contains('active')) {
    retry.classList.remove('active');
  }
  if (retry.removeEventListener('click', getData));
}

//reset gauge (except the meter so the animation doesn't go flying - the fetch is normally too fast to see proper meter reset)
var reset = () => {
  deactivateButton();
  if (srText.classList.contains('sr-only')) {
    srText.classList.remove('sr-only');
  }
  loading.style.visibility = 'visible';
  impossible.style.display = 'none';
}

//fetch data
var getData = () => {
  reset();
  fetch(url).then((response) => {
    return response.json();
  })
  .then(data => handleData(data))
  .catch(error => handleError(error));
}

//initial page load
getData();
