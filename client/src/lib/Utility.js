export function ConvertToHTML(elements) {
    let html = '';
    elements.map((element) => {
        return (
            html += element.outerHTML);
    })

    return html;
}

export function Abs(num) {
    return num > 0 ? num : -num;
}

export function Normalize(num) {
    while(Abs(num) > 1) num *= 0.1;
    return num;
}

export function GetRects(targets) {
    return (
        Object.keys(targets).map((key) => {
            return targets[key].getBoundingClientRect();
        })
    );
}

export function IsOverlap(lhs, rhs) {
    return (
        lhs.left < rhs.right && lhs.top < rhs.bottom  && 
        lhs.right > rhs.left && lhs.bottom > rhs.top 
    );  
}

export function IsContaining(lhs, rhs) {
    return (
        lhs.left <= rhs.left &&
        rhs.left <= lhs.left + lhs.width - rhs.width &&
        lhs.top <= rhs.top &&
        rhs.top <= lhs.top + lhs.height - rhs.height
    );
}

export function IsLeftButton(event) {
    const button = event.buttons || event.which || event.button;
    return button === 1;
}

export function Pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

export function NumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function Simplification(str) {
    return str.toLowerCase().replace(/ /gi, '');
}