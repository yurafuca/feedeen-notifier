chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method && (request.method === "getUnreads")) {
        //if(typeof document.getElementsByClassName('fd_feed_count')[0] === "undefined") {sendResponse({ 'unreadsCount': '!' });};
        setTimeout(function() {
            var count = document.getElementsByClassName('fd_feed_count')[0].innerText;
            console.log(document.title);
            console.log(document.getElementsByClassName('Dc-Wb')[0].innerText);
            console.log(document.getElementsByClassName('fd_feed_count')[0].innerText);
            console.log(document.getElementsByClassName('fd_feed_title')[0].innerText);
            //var count = $("span.fd_feed_count")[0].text();            
                if (count == '') {
                    sendResponse({ 'unreadsCount': '-' });
                } else {
                    sendResponse({ 'unreadsCount': count });
                }
            }, 10000);
            // reload時は10000ms, create時は500ms程度
        return true; // important!!
    }
});
