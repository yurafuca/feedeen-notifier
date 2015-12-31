// TODO:
// リロード間隔の設定
// タブを閉じることを許すか
// ボタンをクリックした時のジャンプ先
// 要素の監視 <- unreadsが変わったタイミングでonUpdateされるらしいから必要ないかもしれない

var feedeenTab = null;
var lastUnreads = 0;
chrome.alarms.create("reload", {periodInMinutes: 1} );
chrome.browserAction.setBadgeBackgroundColor({ color: "#498AF4"});
reflectUnreadCount('+');

chrome.browserAction.onClicked.addListener(function(tab) {
  run();
});

function run() {
    if (feedeenTab != null) {
        chrome.tabs.remove(feedeenTab.id, function(tab) {});
    }
    createFeedeenTab();
}

function createFeedeenTab() {
    chrome.tabs.create({url: "https://www.feedeen.com/d#starred"}, function(tab) {
        feedeenTab = $.extend(true, {}, tab);
        chrome.tabs.update(feedeenTab.id, {pinned: true})
    });
}

function reflectUnreadCount(unreads) {
    //console.log('unreads:' + unreads);
    chrome.browserAction.setBadgeText({text: String(unreads)});
}

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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tabId == feedeenTab.id) {
        if (tab.status == "complete") {
            //console.log("created tab's id: " + feedeenTab.id);
            getUnreadCount(feedeenTab);
        }
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    if (feedeenTab != null) {
        if (tabId == feedeenTab.id) {
            createFeedeenTab();
        }
    }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
     if ( alarm.name == "reload" ) {
          if (feedeenTab != null) {
              chrome.tabs.update(feedeenTab.id, {url: "https://www.feedeen.com/d#starred"}, function() {});
          }
     }
});

chrome.notifications.onClicked.addListener(function (notificationId) {
    if (notificationId == 'newItem') {
        chrome.notifications.clear(notificationId, function() {});
        run();
    }
});
