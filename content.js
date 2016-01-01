chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // observer用
    if (request.method && (request.method === "getCounter")) {
        setTimeout(function() {
            var counter = document.getElementsByClassName('fd_feed_count')[0];
            sendResponse({ 'counter': counter });
        }, 5000);
        return true;
    }
    // ページが更新された場合未読数を取得し直す
    if (request.method && (request.method === "getUnreads")) {
        alert('test');
        // プログレスバーを非表示にする
        chrome.runtime.sendMessage({method: "getSetting", item: "hiddenBar"}, function(response) {
            if (response.value === 'true') {
                $('.Dc-we-Kb').css('visibility', 'hidden');
            } else {
                $('.Dc-we-Kb').css('visibility', 'vissible');
            }
        });
        // 未読数を取得する
        setTimeout(function() {
            var counter = document.getElementsByClassName('fd_feed_count')[0];
            var count = counter.innerText;
            if (counter.getAttribute('style') == 'display: none;') {
                sendResponse({ 'unreadsCount': 0 });
            } else {
                if (count == '') {
                    sendResponse({ 'unreadsCount': 0 });
                } else {
                    sendResponse({ 'unreadsCount': count });
                }
            }
        }, 1000); // reload時は10000ms, create時は500ms程度
        return true; // necessary for settimeout.
    }
});

