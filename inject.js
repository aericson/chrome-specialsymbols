
if (!chrome.runtime.onMessage.hasListeners()) {
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var element = $(document.activeElement);
    var cursorPos = element.prop('selectionStart');
    var v = element.val();
    var textBefore = v.substring(0,  cursorPos );
    var textAfter  = v.substring( cursorPos, v.length );
    element.val( textBefore+ request.character +textAfter );
    element.prop('selectionStart', cursorPos + request.character.length);
    element.prop('selectionEnd', cursorPos + request.character.length);
    sendResponse();
  });
}
