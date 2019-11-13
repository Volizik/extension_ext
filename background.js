const data = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36.0 (KHTML, like Gecko) Chrome/73.0.3683.0 Safari/537.36.0',
    browserName: 'chrome',
    platform: 'Win32',
    hardwareConcurrency: 4,
    deviceMemory: 12,
    language: 'be',
    languages: ["be", "ru", "en-US", "en", "it"],
    languagesHeader: 'be;q=0.9,ru;q=0.8,en-US;q=0.7,en;q=0.6,it;q=0.5',
    doNotTrack: "0",
    screen: {
        width: 1024,
        height: 768,
    },
    webGL: {
        unmaskedVendor: 'X.Org',
        unmaskedRenderer: 'AMD SUMO (DRM 2.50.0 / 4.13.0-45-generic, LLVM 6.0.0)',
        salt: 0.001
    },
    canvas: {
        salt: 'q',
    },
    timezone: {
        name: 'Europe/Minsk',
        utcOffset: -180
    },
    proxy: {
        login: '',
        password: '',
        host: '217.21.54.173',
        port: 4145,
        protocol: 'socks4'
    }
};

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        for (let i = 0; i < details.requestHeaders.length; i++) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                details.requestHeaders[i].value = data.userAgent;
            }
            if (details.requestHeaders[i].name === 'Accept-Language') {
                details.requestHeaders[i].value = data.languagesHeader;
            }
            if (details.requestHeaders[i].name === 'Cookie') {
                details.requestHeaders[i].value = '';
            }
        }
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ['<all_urls>']},
    ['blocking', 'requestHeaders', 'extraHeaders']
);


chrome.webRequest.onAuthRequired.addListener((details, callbackFn) => {
        callbackFn({ authCredentials: {username: data.proxy.login, password: data.proxy.password}});
    },
    {urls: ["<all_urls>"]},
    ['asyncBlocking']
);

const config = {
    mode: "fixed_servers",
    rules: {
        singleProxy: {
            scheme: data.proxy.protocol,
            host: data.proxy.host,
            port: Number(data.proxy.port)
        }
    }
};
chrome.proxy.settings.set({value: config, scope: 'regular'}, function() {});
chrome.proxy.settings.get({'incognito': false}, function(config) {console.log('proxy config -->', config);});



