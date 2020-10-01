export function navigator(data) {
    Object.defineProperties(Navigator.prototype, {
        userAgent: {
            value: data.userAgent
        },
        vendor: {
            value: data.browserName === 'chrome' ? 'Google Inc.' : '' // empty string for firefox
        },
        appVersion: {
            value: data.userAgent.replace('Mozilla/', '')
        },
        platform: {
            value: data.platform
        },
        hardwareConcurrency: {
            value: data.hardwareConcurrency
        },
        deviceMemory: {
            value: data.deviceMemory
        },
        language: { value: data.language },
        languages: { value: data.languages },
        doNotTrack: { value: data.doNotTrack },
    });
}
