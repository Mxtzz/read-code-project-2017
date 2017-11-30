'use strict'; // 严格模式 ES6
//需要安装两个模块 chalk tinygradient
const chalk = require('chalk'); //输出彩色文本到终端 模块
const tinygradient = require('tinygradient');//过渡的实现 模块

const forbiddenChars = /\s/g; //正则表达式 匹配全局空白字符

function InitGradient() {
	const grad = tinygradient.apply(this, arguments);//将函数的属性与方法进行拷贝，主要是实现类的继承
	const ret = (str, opts) => applyGradient(str ? str.toString() : '', grad, opts);
	ret.multiline = (str, opts) => multilineGradient(str ? str.toString() : '', grad, opts);
	return ret;
}
	
const getColors = (gradient, options, count) => options.interpolation.toLowerCase() === 'hsv' ?
	gradient.hsv(count, options.hsvSpin.toLowerCase()) : gradient.rgb(count);
	//toLowerCase() 将字符串转换为小写
	//getColors 获得颜色，不区分大小写

function applyGradient(str, gradient, opts) {
	const options = validateOptions(opts);//先判断options
	const colorsCount = Math.max(str.replace(forbiddenChars, '').length, gradient.stops.length);
	//Math.max() 返回最大值
	//str.replace(forbiddenChars, '') 用''取代无法显示的字符
	const colors = getColors(gradient, options, colorsCount);
	let result = '';
	for (const s of str) {
		result += s.match(forbiddenChars) ? s : chalk.hex(colors.shift().toHex())(s);
	}	//match()在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
		//shift()把数组的第一个元素从其中删除，并返回第一个元素的值。
	return result;
}

function multilineGradient(str, gradient, opts) {
	const options = validateOptions(opts);
	const lines = str.split('\n');//split()方法用于把一个字符串分割成字符串数组。
	//以最长的字符串为颜色基准			// concat() 连接数组
	const maxLength = Math.max.apply(null, lines.map(l => l.length).concat([gradient.stops.length]));
	const colors = getColors(gradient, options, maxLength);
	const results = [];
	for (const line of lines) {
		const lineColors = colors.slice(0);//slice()从已有的数组中返回选定的元素。
		let lineResult = '';
		for (const l of line) {
			lineResult += chalk.hex(lineColors.shift().toHex())(l);
		}
		results.push(lineResult);//添加lineResult到results //push()向数组的末尾添加一个或多个元素,并返回新的长度。
	}
	return results.join('\n');//join()把数组中的所有元素放入一个字符串，通过指定元素分割。
}

function validateOptions(opts) {
	//Object.assign()方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象
	const options = Object.assign({interpolation: 'rgb', hsvSpin: 'short'}, opts);

	//TypeError（类型错误） 对象用来表示 值的类型 非 预期类型时 发生的错误。
	if (opts !== undefined && typeof opts !== 'object') {
		throw new TypeError(`Expected \`options\` to be an \`object\`, got \`${typeof opts}\``);
	}	//'option'的预期类型是'object',获取'opts'的类型.
		//Expected 'options' to be an 'object', got '${typeof opts}'

	if (typeof options.interpolation !== 'string') {
		throw new TypeError(`Expected \`options.interpolation\` to be a \`string\`, got \`${typeof options.interpolation}\``);
	}	//'option.interpolation'的预期类型是'string',获取'options.interpolation'的类型.

	if (options.interpolation.toLowerCase() === 'hsv' && typeof options.hsvSpin !== 'string') {
		throw new TypeError(`Expected \`options.hsvSpin\` to be a \`string\`, got \`${typeof options.hsvSpin}\``);
	}	//'options.hsvSpin'的预期类型是'string',获取'options.hsvSpin'的类型.
	return options;
}

// built-in gradients 内置的几种样式
const aliases = {
	atlas: {colors: ['#feac5e', '#c779d0', '#4bc0c8'], options: {}},
	cristal: {colors: ['#bdfff3', '#4ac29a'], options: {}},
	teen: {colors: ['#77a1d3', '#79cbca', '#e684ae'], options: {}},
	mind: {colors: ['#473b7b', '#3584a7', '#30d2be'], options: {}},
	morning: {colors: ['#ff5f6d', '#ffc371'], options: {interpolation: 'hsv'}},
	vice: {colors: ['#5ee7df', '#b490ca'], options: {interpolation: 'hsv'}},
	passion: {colors: ['#f43b47', '#453a94'], options: {}},
	fruit: {colors: ['#ff4e50', '#f9d423'], options: {}},
	instagram: {colors: ['#833ab4', '#fd1d1d', '#fcb045'], options: {}},
	retro: {colors: ['#3f51b1', '#5a55ae', '#7b5fac', '#8f6aae', '#a86aa4', '#cc6b8e', '#f18271', '#f3a469', '#f7c978'], options: {}},
	summer: {colors: ['#fdbb2d', '#22c1c3'], options: {}},
	rainbow: {colors: ['#ff0000', '#ff0100'], options: {interpolation: 'hsv', hsvSpin: 'long'}},
	pastel: {colors: ['#74ebd5', '#74ecd5'], options: {interpolation: 'hsv', hsvSpin: 'long'}}
};

module.exports = InitGradient;
for (const a in aliases) { // eslint-disable-line guard-for-in
	module.exports[a] = str => new InitGradient(aliases[a].colors)(str, aliases[a].options);
	module.exports[a].multiline = str => new InitGradient(aliases[a].colors).multiline(str, aliases[a].options);
}
