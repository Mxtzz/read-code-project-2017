# gradient-string

[![Build Status](https://travis-ci.org/bokub/gradient-string.svg?branch=master)](https://travis-ci.org/bokub/gradient-string)
[![npm](https://img.shields.io/npm/v/gradient-string.svg)](https://www.npmjs.com/package/gradient-string)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

> Beautiful gradients in terminal stdout
> 终端输出漂亮的渐变色

[![gradient-string](http://bit.ly/2tlmSgL)](http://bit.ly/2tlhNFv)


## Install 安装

```
$ npm install --save gradient-string
```

## Usage 用法

```javascript
const gradient = require('gradient-string');

console.log(gradient('cyan', 'pink')('Hello world!'));
```

### Initialize a gradient 初始化一个渐变色

```javascript
// Using varargs 使用参数
let coolGradient = gradient('red', 'green', 'blue');

// Using array 使用数组
let coolGradient = gradient(['#FF0000', '#00FF00', '#0000FF']);
```

The colors are parsed with TinyColor, [multiple formats are accepted](https://github.com/bgrins/TinyColor/blob/master/README.md#accepted-string-input). <br>
颜色用TinyColor进行解析，可以用多种格式。

```javascript
let coolGradient = gradient([
  tinycolor('#FFBB65'),       // tinycolor object
  {r: 0, g: 255, b: 0},       // RGB object
  {h: 240, s: 1, v: 1, a: 1}, // HSVa object
  'rgb(120, 120, 0)',         // RGB CSS string
  'gold'                      // named color 命名颜色
]);
```

### Use a gradient 使用渐变色

```javascript
let coolString = coolGradient('This is a fancy string!');
console.log(coolString);
```

## Built-in gradients 内置的渐变色

### Usage 用法

```javascript
const gradient = require('gradient-string');

// Use the rainbow gradient 使用彩虹式的渐变
console.log(gradient.rainbow('I love gradient-strings!'))
```

### Available built-in gradients 可用的内置渐变色

[![Built-in gradients](http://bit.ly/2uFygrL)](http://bit.ly/2ufX07r)

## Multi line gradients 多行渐变色

In some cases, you may want to apply the same horizontal gradient on each line of a long text (or a piece of ASCII art).<br>
在某些情况下，你可能希望在长文本(或者是一段ASCII码艺术)的每一行上应用相同的水平渐变。

You can use the `multiline()` method of a gradient to ensure that the colors are vertically aligned.<br>
你可以使用`multiline()`方法来确保颜色是垂直对齐的。

```javascript
const gradient = require('gradient-string');

// Use the same gradient on every line 在每一行使用相同的渐变色
let duck = gradient('orange', 'yellow').multiline([
    "  __",
    "<(o )___",
    " ( ._> /",
    "  `---'",
].join('\n'));
console.log(duck);

// Works with aliases 使用别名
gradient.atlas.multiline('Multi line\nstring');

// Works with advanced options 使用高级选项
gradient('cyan', 'pink').multiline('Multi line\nstring', {interpolation: 'hsv'});
```

## Advanced gradients 渐变色进阶

<details>
  <summary>
    There are also more advanced options for gradient customization, such as custom color stops, or choice of color interpolation
	对于自定义渐变色，还有许多高级选项，比如自定义颜色停止位置，或选择颜色插值。
  </summary>
  
### Custom color stops 自定义颜色停止点

By default, the gradient color stops are distributed equidistantly.<br>
默认情况下，渐变色的止点是均匀分布的。

You can specify the position of each color stop (between `0` and `1`), using the following syntax:<br>
您可以使用以下语法指定每个颜色停止的位置(介于`0`和`1`之间):


```javascript
let coolGradient = gradient([
  {color: '#d8e0de', pos: 0},
  {color: '#255B53', pos: 0.8},
  {color: '#000000', pos: 1}
]);
```

### Color interpolation 颜色插值

When using a gradient, you can actually add a second parameter to choose how the colors will be generated.<br>
在使用渐变时，你可以添加第二个参数来选择如何生成颜色。

Here is the full gradient API:<br>
这是完整的渐变色接口：

#### myGradient(text, [options])

##### text
Type: `string` 类型：`string`<br>
String you want to color. 键入你想变色的字符串

##### options
Type: `Object` 类型：`Object`<br>

###### interpolation
Type: `string`<br>
The gradient can be generated using RGB or HSV interpolation. HSV usually produces brighter colors.
`interpolation` can be set to `rgb` for RGB interpolation, or`hsv` for HSV interpolation.<br>
Defaults to `rgb`. Case insentitive <br>
过渡色可以用RGB或HSV插值生成。HSV通常产生比较亮的颜色。插值用RGB插值可以设置为`rgb`，用HSV插值可以设置为`hsv`。默认是`rgb`。不区分大小写。（原文作者insentitive可能笔误，应为insensitive）

###### hsvSpin
Type: `string` 类型：`string`<br>
Used only in the case of HSV interpolation. 仅在HSV插值情况下使用<br>
Because hue can be considered as a circle, there are two ways to go from a color to another color.<br>
`hsvSpin` can be either `short` or `long`, depending on if you want to take the shortest or the longest way between two colors.<br>
Defaults to `short`. Case insensitive <br>
因为色相可以被看作是一个圆，从一种颜色到另一种颜色有两种方法。
hsvSpin或长或短，这取决于你想要在两种颜色之间选择最短还是最长的方式。
默认为空。不分大小写。

#### Example 示例
##### Code 代码
```javascript
const redToGreen = gradient('red', 'green');
const str = '■'.repeat(48);

// Standard RGB gradient 标准RGB梯度
console.log(redToGreen(str)); 

// Short HSV gradient: red -> yellow -> green
// 短HSV梯度：红 -> 黄 -> 绿
console.log(redToGreen(str, {interpolation: 'hsv'}));

// Long HSV gradient: red -> magenta 品红 -> blue -> cyan蓝绿 -> green
// 长HSV梯度：红 -> 品红 -> 蓝 -> 蓝绿 -> 绿色
console.log(redToGreen(str, {interpolation: 'hsv', hsvSpin: 'long'}));
```
##### Result 结果
![Example result](http://i.imgur.com/plQAN2Q.png)

</details>

## Dependencies 相关

- [tinygradient](https://github.com/mistic100/tinygradient) - Generate gradients 过渡实现 
- [chalk](https://github.com/chalk/chalk) - Output colored text to terminal 输出彩色文本到终端


## License

MIT © [Boris K](https://github.com/bokub)
