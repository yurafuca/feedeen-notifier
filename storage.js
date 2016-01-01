function saveChanges(value) {
    // Get a value saved in a form.
    var theValue = value;
    // Check that there's some code there.
    if (!theValue) {
        console.log('Error: No value specified');
        return;
    }
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'value': theValue}, function() {
      // Notify that we saved.
        console.log('Settings saved');
    });
}
