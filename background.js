var feedeenTab = null;
var lastUnreads = 0;
var emptyMessage = 'open';
var unreadsObserver = null;

$(function(){
    // バッジの色を変更
    chrome.browserAction.setBadgeBackgroundColor({ color: "#498AF4"});
    // タブが開かれていない旨をバッジに表示
    reflectUnreadCount(emptyMessage);
    
});

chrome.browserAction.onClicked.addListener(function(tab) {
  run();
});

// タブを開き直す
function run() {
    if (feedeenTab != null) {
        chrome.tabs.remove(feedeenTab.id, function(tab) {});
    }
    createFeedeenTab();
}

// タブを生成する
function createFeedeenTab() {
    chrome.tabs.create({url: getSetting('jumpTo')}, function(tab) {
        feedeenTab = $.extend(true, {}, tab);
        // 監視
        unreadsObserver = new MutationObserver(getUnreadCount);
        chrome.tabs.sendMessage(tab.id, {method: "getCounter"}, function(response) {
            console.log(chrome.runtime.lastError);
            var config = { attributes: true, childList: true, characterData: true };
            unreadsObserver.observe(response.counter, config);
            unreadsObserver.observe();
        });
        // タブを自動的に固定する
        if (getSetting('pinTab') == 'true') {
            chrome.tabs.update(feedeenTab.id, {pinned: true})
        }
    });
}

function reflectUnreadCount(unreads) {
    chrome.browserAction.setBadgeText({text: String(unreads)});
}

// 未読数を取得し反映する．未読数が増加した場合通知を出す．
function getUnreadCount(tab) {
    chrome.tabs.sendMessage(tab.id, {method: "getUnreads"}, function(response) {
        if (chrome.runtime.lastError) {
            // connection failed :(
            reflectUnreadCount('err');
        } else {
            // successed :)
            if (response.unreadsCount == 0) {
                reflectUnreadCount('');
            } else {
                reflectUnreadCount(response.unreadsCount);
            }
            // show notification
            var diff = response.unreadsCount - lastUnreads;
            lastUnreads = response.unreadsCount;
            if (diff > 0) {
                chrome.notifications.create(
                'newItem',{   
                    type: 'basic', 
                    iconUrl: '96.png', 
                    title: 'New feeds', 
                    message: 'You have ' + diff + ' new feeds.',
                    priority: 0},
                function() { /* Error checking goes here */} 
                );
            }
        }
  });
}
/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // タブが更新されたら未読数を取得し直す
    if (tabId == feedeenTab.id) {
        if (tab.status == "complete") {
            getUnreadCount(feedeenTab);
        }
    }
});
*/
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    // タブを開き直す設定が有効の場合タブを開き直す
    if (feedeenTab != null) {
        if (tabId == feedeenTab.id) {
            if (getSetting('reopen') == 'true')
                createFeedeenTab();
            else {
                feedeenTab = null;
                reflectUnreadCount(emptyMessage);
            }
        }
    }
});

chrome.notifications.onClicked.addListener(function (notificationId) {
    // 通知をクリックしたら feedeen を開く
    if (notificationId == 'newItem') {
        chrome.notifications.clear(notificationId, function() {});
        run();
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // content_script へ設定を渡す
    if (request.method && (request.method === "getSetting")) {
        if (request.item == 'hiddenBar') {
            sendResponse({ 'value': getSetting('hiddenBar')});
        }
        return true; // necessary for settimeout.
    }
});
