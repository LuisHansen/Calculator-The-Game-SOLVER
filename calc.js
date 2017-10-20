"use strict";
let count = 0;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.rotate = (function() {
    // save references to array functions to make lookup faster
    var push = Array.prototype.push,
        splice = Array.prototype.splice;

    return function(count) {
        var len = this.length >>> 0, // convert to uint
            count = count >> 0; // convert to int

        // convert count to value in range [0, len)
        count = ((count % len) + len) % len;

        // use splice.call() instead of this.splice() to make function generic
        push.apply(this, splice.call(this, 0, count));
        return this;
    };
})();

let getNS = (op, num) => {
	count ++;
	var buf;
	var operand;
	var regex;

	// Multiplication
	regex = /x(-*\d+)/ig;
	if (buf = regex.exec(op)) {
		operand = buf[1];
		return (Number(num)*Number(operand)).toString();
	}

	// Division
	regex = /\/(-*\d+)/ig;
	if (buf = regex.exec(op)) {
		operand = buf[1];
		return (Number(num)/Number(operand)).toString();
	}

	// Sum
	regex = /\+(\d+)/ig;
	if (buf = regex.exec(op)) {
		operand = buf[1];
		return (Number(num)+Number(operand)).toString();
	}

	// Subtraction
	regex = /^-(\d+)/ig;
	if (buf = regex.exec(op)) {
		operand = buf[1];
		return (Number(num)-Number(operand)).toString();
	}

	// PUT num
	regex = /put\s*(\d+)/ig;
	if (buf = regex.exec(op)) {
		operand = buf[1];
		return num + "" + operand;
	}

	// => fn
	regex = /(-*\d*)=>(-*\d*)/ig;
	if (buf = regex.exec(op)) {
		return num.toString().replaceAll(buf[1], buf[2]);
	}

	// <<
	if (op === "<<") {
		return (Math.floor(num/10)).toString();;
	}

	// +-
	if (op === "+-" || op === "-+") {
		return (-1*num).toString();;
	}

	// "SUM"
	if (op === "SUM" || op === "sum") {
		return eval(num.toString().replace(/(\d)(?=\d)/g, '$1+')).toString();
	}

	// REVERSE
	if (op === "REVERSE" || op === "reverse") {
		if ( num >= 0 ) {
			return num.toString().split('').reverse().join('').toString();
		} else {
			return (-1*(-1*num).toString().split('').reverse().join('')).toString();
		}
	}

	// SHIFT RIGHT
	if (op === "shift>" || op === "SHIFT>") {
		if ( num >= 0 ) {
			return num.toString().split('').rotate(-1).join('').toString();
		} else {
			return (-1*(-1*num).toString().split('').rotate(-1).join('')).toString();
		}
	}

	// SHIFT LEFT
	if (op === "<shift" || op === "<SHIFT") {
		if ( num >= 0 ) {
			return num.toString().split('').rotate(1).join('').toString();
		} else {
			return (-1*(-1*num).toString().split('').rotate(1).join('')).toString();
		}
	}

	// MIRROR
	if (op === "mirror" || op === "MIRROR") {
		if ( num >= 0 ) {
			return num.toString() + num.toString().split('').reverse().join('').toString();
		} else {
			return num.toString() + (-1*(-1*num).toString().split('').reverse().join('')).toString();
		}
	}

}

function solve(ops, movs, init, final, history = [init]) {
	let my_ops = arguments[0];
	let my_movs = arguments[1];
	let my_init = arguments[2];
	let my_final = arguments[3];

	if (my_movs === 0) {
		history.push(my_init);
		if (my_init == my_final) {
			console.log(history.join(' -> '));
		}
		return my_init;
	} else {
		for (let i=0;i<my_ops.length;i++) {
			let newHistory = history.slice();
			newHistory.push(ops[i]);
			let a = getNS(ops[i], my_init);
			solve(ops, my_movs-1, a, my_final, newHistory);
		}
	}
}