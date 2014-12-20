// Copyright (c) 2014 André Ericson <de.ericson@gmail.com>

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

function click(e) {
  console.log("clicked");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {file: "jquery-1.11.2.min.js"}, function(){
        chrome.tabs.executeScript(tabs[0].id, {file: "inject.js"}, function(){
            chrome.tabs.sendMessage(tabs[0].id, {character: e.target.textContent},
             function(){
              console.log("done");
              window.close();
            });
        });
    });
  });
}


document.addEventListener('DOMContentLoaded', function () {
  // kittenGenerator.requestKittens();
  for (var i = 0; i < symbols.length; ++i) {
    var elem = $('<button type="button">');
    elem.addClass("btn btn-default");
    elem.text(symbols[i]);
    elem.on('click', click);
    $('body').append(elem);
  }
});


