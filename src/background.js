import { data } from './helpers/mock';

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


// chrome.webRequest.onAuthRequired.addListener((details, callbackFn) => {
//         callbackFn({ authCredentials: {username: data.proxy.login, password: data.proxy.password}});
//     },
//     {urls: ["<all_urls>"]},
//     ['asyncBlocking']
// );

// const config = {
//     mode: "fixed_servers",
//     rules: {
//         singleProxy: {
//             scheme: data.proxy.protocol,
//             host: data.proxy.host,
//             port: Number(data.proxy.port)
//         }
//     }
// };
// chrome.proxy.settings.set({value: config, scope: 'regular'}, function() {});
// chrome.proxy.settings.get({'incognito': false}, function(config) {console.log('proxy config -->', config);});



