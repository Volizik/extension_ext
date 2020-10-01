export function canvas(data) {
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
        let dataUrl = toDataURL.call(this, ...arguments);
        return dataUrl + data.canvas.salt;
    };
}
