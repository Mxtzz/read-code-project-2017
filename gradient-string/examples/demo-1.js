const gradient = require('gradient-string');

let duck1 = gradient('orange', 'yellow').multiline([
    "  __",
    "<(o )___",
    " ( ._> / ",
    "  `---'",
    ].join('\n'));
console.log(duck1);

console.log(gradient('cyan', 'red','white').multiline([
    "  __           __        ",
    "<(o )___     <(o )___    ",
    " ( ._> /      ( ._> /   ",
    "  `---'        `---'  ",
    "---------------------",
    "  __         ",
    "<(o )___         ",
    " ( ._> /           ",
    "  `---'          ",
    ].join('\n')));
gradient.atlas.multiline('Multi line\nstring');

gradient('cyan', 'pink').multiline('Multi line\nstring', {interpolation:'hsv'});
