let circles = [
    10, 30, 50
];

let areas = circles.map(radius => Math.floor(Math.PI * radius * radius));
console.log(areas);