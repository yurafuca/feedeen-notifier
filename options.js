// 標準値
var default_jumpTo = "https://www.feedeen.com/d#starred";
var default_reloadTime = "5";
var default_reopen = "true"

var getItem = function(key) {
    return localStorage.getItem(key)
}
var setItem = function(key, value) {
    localStorage.setItem(key, value)
}
var resetAll = function() {
    setItem('reopen', default_reopen);
    setItem('jumpTo', default_jumpTo);
    setItem('reloadTime', default_reloadTime);
}
var reflectStorage = function() {
    if(getItem('reopen') == 'true') {
        $('input[name=reopen]:eq(0)').prop('checked', true);
    } else {
        $('input[name=reopen]:eq(1)').prop('checked', true);
    }
    //$('input[name=reopen]').val(getItem('reopen'));
    $('#jumpTo').attr('value', getItem('jumpTo'));
    $('#reloadTime').attr('value', getItem('reloadTime'));
}
$(function(){
    // 初期設定
    if (getItem('reopen') == null) {
        resetAll();
    }
    // 設定の反映
    reflectStorage();
    // オプションデータの更新
    $('#put').click(function() {
        var reopen;
        if ($('input[name=reopen]:checked').val() === 'enable') {
            reopen = true;
        } else {
            reopen = false;
        }
        var jumpTo = $('#jumpTo').val();
        var reloadTime = $('#reloadTime').val();
        
                console.log(reopen);
        console.log(jumpTo);
        console.log(reloadTime);
        
        setItem('reopen', reopen);
        setItem('jumpTo', jumpTo);
        setItem('reloadTime', reloadTime);
        
        console.log(getItem('reopen'));
        console.log(getItem('jumpTo'));
        console.log(getItem('reloadTime'));
        
        alert("Update OK");
    });
    // オプションデータの更新
    $('#reset').click(function() {
        resetAll();
        reflectStorage();
    });
});
