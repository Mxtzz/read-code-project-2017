'use strict'; 																		// 严格模式 ES6
//需要安装两个模块 chalk tinygradient
const chalk = require('chalk'); 													//输出彩色文本到终端 模块
const tinygradient = require('tinygradient');										//过渡的实现 模块

const forbiddenChars = /\s/g;														//正则表达式 匹配全局空白字符

//初始化过渡色
function InitGradient() {
	const grad = tinygradient.apply(this, arguments);								//apply() 将函数的属性与方法进行拷贝，主要是实现类的继承
	const ret = (str, opts) => applyGradient(str ? str.toString() : '', grad, opts);
	ret.multiline = (str, opts) => multilineGradient(str ? str.toString() : '', grad, opts);
	return ret;
}

//getColors 获得颜色，可以为hsv，默认rgb。不区分大小写	
const getColors = (gradient, options, count) => options.interpolation.toLowerCase() === 'hsv' ?
	gradient.hsv(count, options.hsvSpin.toLowerCase()) : gradient.rgb(count);		//toLowerCase() 将字符串转换为小写
	
//单行上色
function applyGradient(str, gradient, opts) {
	const options = validateOptions(opts);											//先判断options
	const colorsCount = Math.max(str.replace(forbiddenChars, '').length, gradient.stops.length);	//Math.max() 返回最大值//str.replace(forbiddenChars, '') 用''取代无法显示的字符
	const colors = getColors(gradient, options, colorsCount);
	let result = '';
	for (const s of str) {															//如果s是不能显示的字符，返回s；否则加上hex颜色
		result += s.match(forbiddenChars) ? s : chalk.hex(colors.shift().toHex())(s);//match()在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
																					 //shift()把数组的第一个元素从其中删除，并返回第一个元素的值。
																					 //十六进制颜色 hex
	}	
	return result;
}

//多行上色
function multilineGradient(str, gradient, opts) {
	const options = validateOptions(opts);
	const lines = str.split('\n');													//从换行处分割字符串 //split()把一个字符串分割成字符串数组。
	const maxLength = Math.max.apply(null, lines.map(l => l.length).concat([gradient.stops.length]));	//以最长的字符串为颜色基准。  concat()连接数组。
	const colors = getColors(gradient, options, maxLength);							//定义所使用的的颜色。梯度，选项，长度
	const results = [];																//建立返回数组
	for (const line of lines) {  													//for循环：每行的字符
		const lineColors = colors.slice(0);											//slice(0) 选取从位置0开始的所有字符
		let lineResult = '';
		for (const l of line) {  													//for循环：为每行字符设置颜色
			lineResult += chalk.hex(lineColors.shift().toHex())(l);					//shift()把数组的第一个元素从其中删除，并返回第一个元素的值。
		}
		results.push(lineResult);													//添加lineResult到results //push()向数组的末尾添加一个或多个元素,并返回新的长度。
	}
	return results.join('\n');														//每行结尾换行 //join()把数组中的所有元素放入一个字符串，通过指定元素分割。
}

//判断条件
function validateOptions(opts) {
	
	const options = Object.assign({interpolation: 'rgb', hsvSpin: 'short'}, opts);	//Object.assign()方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象
	if (opts !== undefined && typeof opts !== 'object') {
		throw new TypeError(`Expected \`options\` to be an \`object\`, got \`${typeof opts}\``);	//'option'的预期类型是'object',获取'opts'的类型.//TypeError（类型错误）值的类型 非 预期类型时 发生的错误。
	}																				//Expected 'options' to be an 'object', got '${typeof opts}'
		

	if (typeof options.interpolation !== 'string') {
		throw new TypeError(`Expected \`options.interpolation\` to be a \`string\`, got \`${typeof options.interpolation}\``);	//'option.interpolation'的预期类型是'string',获取'options.interpolation'的类型.
	}	

	if (options.interpolation.toLowerCase() === 'hsv' && typeof options.hsvSpin !== 'string') {
		throw new TypeError(`Expected \`options.hsvSpin\` to be a \`string\`, got \`${typeof options.hsvSpin}\``);	//'options.hsvSpin'的预期类型是'string',获取'options.hsvSpin'的类型.
	}	
	return options;
}

// built-in gradients 内置的几种样式
const aliases = {	//别名
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
