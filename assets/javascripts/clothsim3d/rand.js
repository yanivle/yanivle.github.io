export function Range(a, b) {
    let max = b;
    let min = a;
    if (b == undefined) {
        min = 0;
        max = a;
    }
    return min + Math.random() * (max - min);
}
export function Choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}
export function generateGUID() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
