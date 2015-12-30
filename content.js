chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method && (request.method === "getUnreads")) {
        //if(typeof document.getElementsByClassName('fd_feed_count')[0] === "undefined") {sendResponse({ 'unreadsCount': '!' });};
        setTimeout(function() {
            var count = document.getElementsByClassName('fd_feed_count')[0].innerText;
            if (count == '') {
                sendResponse({ 'unreadsCount': '-' });
            } else {
                sendResponse({ 'unreadsCount': count });
            }
            }, 200);
        return true; // important!!
    }
});
