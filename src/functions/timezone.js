export function timezone(data) {
    const resolvedOptionsResult = Intl.DateTimeFormat().resolvedOptions();
    Intl.DateTimeFormat.prototype.resolvedOptions = function () {
        const resolvedOptionsData = {
            timeZone: data.timezone.name,
            locale: data.language
        };
        return Object.assign(resolvedOptionsResult, resolvedOptionsData);
    };

    const timezoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = function () {
        return Number(data.timezone.utcOffset);
    };
    // Date.prototype.toString = function () {
    //     return data.timezone.date
    // };
}
