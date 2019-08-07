
function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function sendMessage (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

chrome.contextMenus.create({
    title: 'Fixme',
    contexts: ['selection'],
    onclick: function sendMessage () {
        sendMessageToContentScript({ cmd: 'fixme' });
    }
});

chrome.commands.onCommand.addListener(function sendMessage (command) {
    if (command === 'toggle-further-fixme') {
        sendMessageToContentScript({ cmd: 'fixme' });
    } else if (command === 'toggle-further-clear') {
        sendMessageToContentScript({ cmd: 'clear' });
    }
});
