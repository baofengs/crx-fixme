
function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

chrome.contextMenus.create({
    title: 'Fixme',
    contexts: ['selection'],
    onclick: function (params) {
        sendMessageToContentScript({
            cmd: 'fixme',
            value: params.selectionText
        });
    }
});

chrome.commands.onCommand.addListener(function (command) {
    if (command === 'toggle-further-fixme') {
        sendMessageToContentScript({ cmd: 'kbd-fixme' });
    } else if (command === 'toggle-further-clear') {
        sendMessageToContentScript({ cmd: 'kbd-clear' });
    }
});
