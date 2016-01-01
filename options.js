var defaultSetting = {
    jumpTo : "https://www.feedeen.com/d#starred",
    reloadTime : "5",
    reopen : "true",
    pinTab : "true",
    hiddenBar : "false"
}

var getSetting = function(key) {
    return localStorage.getItem(key)
}
var setSetting = function(key, value) {
    localStorage.setItem(key, value)
}
var resetAll = function() {
    for (var item in defaultSetting) {
        setSetting(item, defaultSetting[item]);
    }
}
var reflectStorage = function() {
    if(getSetting('reopen') == 'true') {
        $('input[name=reopen]:eq(0)').prop('checked', true);
    } else {
        $('input[name=reopen]:eq(1)').prop('checked', true);
    }
    if(getSetting('pinTab') == 'true') {
        $('input[name=pinTab]:eq(0)').prop('checked', true);
    } else {
        $('input[name=pinTab]:eq(1)').prop('checked', true);
    }
    $('#jumpTo').attr('value', getSetting('jumpTo'));
    $('#reloadTime').attr('value', getSetting('reloadTime'));
    if(getSetting('hiddenBar') == 'true') {
        $('input[name=hiddenBar]:eq(0)').prop('checked', true);
    } else {
        $('input[name=hiddenBar]:eq(1)').prop('checked', true);
    }
}
var setItemAll = function(obj) {
    for (var item in obj) {
        setSetting(item, obj[item]);
    }
}
$(function(){
    // 初期設定
    if (getSetting('reopen') == null) {
        resetAll();
    }
    // 設定の反映
    reflectStorage();
    // 設定の保存
    $('#put').click(function() {
        var setting = new Object();
        setting.reopen = ($('input[name=reopen]:checked').val() === 'enable') ? true : false;
        setting.pinTab = ($('input[name=pinTab]:checked').val() === 'enable') ? true : false;
        setting.jumpTo = $('#jumpTo').val();
        setting.reloadTime = $('#reloadTime').val();
        setting.hiddenBar = ($('input[name=hiddenBar]:checked').val() === 'enable') ? true : false;
        setItemAll(setting);
        // 結果の表示
        $('#console').text('Saved.')
        setTimeout(function() {$('#console').text('')}, 1000);
    });
    // 設定のリセット
    $('#reset').click(function() {
        resetAll();
        reflectStorage();
        // 結果の表示
        $('#console').text('Resetted.')
        setTimeout(function() {$('#console').text('')}, 1000);
    });
});
