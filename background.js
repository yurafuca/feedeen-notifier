var feedeenTab = null;
chrome.alarms.create("reload", {periodInMinutes: 1} );


chrome.alarms.onAlarm.addListener(function(alarm) {
     if ( alarm.name == "reload" ) {
          if (feedeenTab != null) {
              chrome.tabs.update(feedeenTab.id, {url: "https://www.feedeen.com/d#starred"});
              console.log("ok");
          }
     }
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

chrome.browserAction.onClicked.addListener(function(tab) {
  run();
});

// feedeenが閉じられたとき
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    if (tabId == feedeenTab.id) {
        createFeedeenTab();
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tabId == feedeenTab.id) {
        if (tab.status == "complete") {
            //console.log("created tab's id: " + feedeenTab.id);
            getUnreadCount(feedeenTab);
        }
    }
});

function reflectUnreadCount(unreads) {
    //console.log('unreads:' + unreads);
    chrome.browserAction.setBadgeText({text: String(unreads)});
}

function getUnreadCount(tab) {
    chrome.tabs.sendMessage(tab.id, {method: "getUnreads"}, function(response) {
        if (chrome.runtime.lastError) {
            //console.log(chrome.runtime.lastError.message);
            reflectUnreadCount('err');
        } else {
            // successed :)
            //console.log('response.unreadsCount:' + response.unreadsCount);
            reflectUnreadCount(response.unreadsCount);
        }
  });
}
