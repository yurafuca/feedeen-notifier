chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method && (request.method === "getUnreads")) {
        //if(typeof document.getElementsByClassName('fd_feed_count')[0] === "undefined") {sendResponse({ 'unreadsCount': '!' });};
        setTimeout(function() {
            var counter = document.getElementsByClassName('fd_feed_count')[0];
            var count = counter.innerText;
            
            console.log(document.title);
            console.log(document.getElementsByClassName('Dc-Wb')[0].innerText);
            console.log(counter.innerText);
            console.log(counter.innerText);
            
            if (counter.getAttribute('style') == 'display: none;') {
                sendResponse({ 'unreadsCount': 0 });
            } else {
                if (count == '') {
                    sendResponse({ 'unreadsCount': 0 });
                } else {
                    sendResponse({ 'unreadsCount': count });
                }
            }
        }, 10000); // reload時は10000ms, create時は500ms程度
        return true; // important!!
    }
});
