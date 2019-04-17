chrome.storage.sync.remove(['currentComputerData', 'activeComputer']);
chrome.browserAction.setBadgeText({ text: 'OFF' });

let data = {};

chrome.storage.onChanged.addListener(changes => {
    if ('currentComputerData' in changes) {
        data = changes.currentComputerData.newValue;
        init();
    }
});

function init() {
    // setProxy();
    setHeaders();
}


function setHeaders() {
    chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            for (let i = 0; i < details.requestHeaders.length; i++) {
                if (details.requestHeaders[i].name === 'User-Agent') {
                    details.requestHeaders[i].value = data.navigator.userAgent;
                } else if (details.requestHeaders[i].name === 'Accept-Language') {
                    details.requestHeaders[i].value = data.navigator.headerLanguages;
                }
                console.log(details.requestHeaders)
            }
            return {requestHeaders: details.requestHeaders};
        },
        {urls: ['<all_urls>']},
        ['blocking', 'requestHeaders']
    );
}
function setProxy() {
    chrome.webRequest.onAuthRequired.addListener((details, callbackFn) => {
            callbackFn({ authCredentials: {username: data.proxy.username, password: data.proxy.password}});
        },
        {urls: ["<all_urls>"]},
        ['asyncBlocking']
    );

    const config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: data.proxy.protocol,
                host: data.proxy.ip,
                port: Number(data.proxy.port)
            }
        }
    };
    chrome.proxy.settings.set({value: config, scope: 'regular'}, function() {});
    chrome.proxy.settings.get({'incognito': false}, function(config) {console.log('proxy config -->', config);});
}


