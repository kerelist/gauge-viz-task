'use strict';

//URL
var url = 'https://widgister.herokuapp.com/challenge/frontend';

//DOM Nodes
var value = document.getElementById('m-value'),
    min = document.getElementById('m-min'),
    max = document.getElementById('m-max'),
    format = document.getElementById('m-format'),
    unit = document.getElementById('m-unit');

//state holders
var isLoading = true,
    hasResults = false;

fetch(url).then(response => response.json()).then((data) => {
  console.log(data);
})
