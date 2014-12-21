// Copyright (c) 2014 André Ericson <de.ericson@gmail.com>

var COLUMN_CELLS = 15;

// http://symbolcodes.tlt.psu.edu/accents/codealt.html
var symbols = [
    // Accents: Grave
    'À', 'È', 'Ì', 'Ò', 'Ù',
    'à', 'è', 'ì', 'ò', 'ù',
    // Accents: Acute    
    'Á', 'É', 'Í', 'Ó', 'Ú', 'Ý',
    'á', 'é', 'í', 'ó', 'ú', 'ý',
    // Accents: Circumflex
    'Â', 'Ê', 'Î', 'Ô', 'Û', 
    'â', 'ê', 'î', 'ô', 'û', 
    // Accents: Tilde
    'Ã', 'Ñ', 'Õ',
    'ã', 'ñ', 'õ',
    // Accents: Umlaut
    'Ä', 'Ë', 'Ï', 'Ö', 'Ü', 'Ÿ',
    'ä', 'ë', 'ï', 'ö', 'ü', 'ÿ',
    // Other foreign Characters
    '¡', '¿', 'Ç', 'ç', 'Œ', 'œ',
    'ß', 'º', 'ª', 'Ø', 'ø', 'Å',
    'å', 'Æ', 'æ', 'Þ', 'þ', 'Ð',
    'ð', '«', '»', '‹', '›', 'Š',
    'š', 'Ž', 'ž',
    // Currency symbols
    '¢', '£', '€', '¥', 'ƒ', '¤',
    '÷', '°', '¬', '±', 'µ', '‰',
    // Fractions
    '¼', '½', '¾',
    // Other punctuation
    '©', '®', '™', '•', '§', '†',
    '‡', '–', '—', '¶',

];

// Analytics

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-57897440-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function trackClick(e) {
  _gaq.push(['_trackEvent', e.target.textContent, 'clicked']);
}

function fakeClick(e) {
  _gaq.push(['_trackEvent', e.target.textContent, 'fakeClicked']);
}

// end Analytics

function click(e) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {file: "jquery-1.11.2.min.js"}, function(){
        chrome.tabs.executeScript(tabs[0].id, {file: "inject.js"}, function(){
            chrome.tabs.sendMessage(tabs[0].id, {character: e.target.textContent},
             function(){
              window.close();
            });
        });
    });
  });
}

function fakeClick(line, column) {
  line--; column--;
  var fake_event = { 'target': {}};
  fake_event.target.textContent = symbols[line * COLUMN_CELLS + column];
  fakeClick(fake_event);
  click(fake_event);
}

function createBtn(symbol) {
    var elem = $('<button type="button">');
    elem.addClass("btn btn-default");
    elem.text(symbol);
    elem.on('click', click);
    elem.on('click', trackClick);
    return elem;
}

var query = '';
var lines = [];
var searching = 'lines';
var lineChoice = 0;
var columnChoice = 0;

function resetFilter() {
  query = '';
  lines = [];
  searching = 'lines';
  lineChoice = 0;
  columnChoice = 0;
  $('#mainTable').find('*').removeClass("active");
  $('#mainTable').find('*').removeClass("hide");
}

function matchQuery(query, str) {
  if (query.trim() === '')
    return true;
  if (query[query.length - 1] === ' ') {
    return query.trim() === str;
  }
  return str.indexOf(query) === 0;
}

function searchAndMarkActiveLine(line) {
  var matches = 0;
  line.each(function (i, elem) {
    if (i === 0)
      return;
    elem = $(elem);
    if (matchQuery(query, elem.find('th').first().text())) {
      elem.addClass("active");
      elem.removeClass("hide");
      matches++;
    } else {
      elem.removeClass("active");
      elem.addClass("hide");
    }
  });
  return matches;
}

function searchAndMarkActiveColumn(line) {
  var matches = 0;
  line.each(function (i, elem) {
    $(elem).children().each(function (j, elem) {
      elem = $(elem);
      if (matchQuery(query, String(j))) {
        if (i === 0) {
          // matches will repeat on other lines
          matches++;
        }
        elem.addClass("active");
        elem.removeClass("hide");
      } else {
        elem.removeClass("active");
        elem.addClass("hide");
      }
    });
  });
  return matches;
}


function shiva(key){
  query += key;
  if (query.trim() === '')
    query = '';
  var matches = 0;
  if (searching === 'lines') {
    matches = searchAndMarkActiveLine($('tr'));
    if (matches === 1) {
      searching = 'columns';
      lineChoice = parseInt(query);
      query = '';
    }
  } else if (searching == 'columns') {
    matches = searchAndMarkActiveColumn($('tr'));
    if (matches == 1) {
      searching = 'none';
      columnChoice = parseInt(query);
      fakeClick(lineChoice, columnChoice);
      query = '';
    }
  }
}

var listener;

document.addEventListener('DOMContentLoaded', function () {
  // kittenGenerator.requestKittens();
  var table = $('#mainTable');
  var row = $("<tr>");
  row.append($("<th>"));
  for (var i = 1; i <= COLUMN_CELLS; i++) {
    row.append($("<th>").text(i));
  }

  for (i = 0; i < symbols.length; i++) {
    if (i % COLUMN_CELLS === 0){
        lines.push(String(i+1));
        table.append(row);
        row = $("<tr>");
        row.append($("<th>").text(i/COLUMN_CELLS + 1));
    }
    row.append($("<td>").append(createBtn(symbols[i])));
  }
  table.append(row);

  listener = new window.keypress.Listener();
  $(['1', '2', '3', '4', '5', '6', '7', '8', '9',
     '0', 'space']).each(function(i, elem) {
    listener.register_combo({
      "keys": elem,
      "on_keydown": function(){
        if (elem === 'space')
          return shiva(' ');
        shiva(elem);
      },
    });
  });
  listener.register_combo({
    "keys": 'backspace',
    "prevent_default": true,
    "on_keydown": function(){
      resetFilter();
    },
  });
});


