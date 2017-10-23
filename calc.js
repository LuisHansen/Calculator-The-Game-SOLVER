"use strict";

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

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

let updateOps = (ops, operation, num) => {
	ops.forEach((op) => {
		switch (operation) {
			case "x":
			case "X":
				op.string = op.string.replaceAll(op.num, (Number(op.num) * Number(num)).toString());
				op.num = op.num ? (Number(op.num) * Number(num)).toString() : undefined;
				op.num1 = op.num1 ? (Number(op.num1) * Number(num)).toString() : undefined;
				op.num2 = op.num2 ? (Number(op.num2) * Number(num)).toString() : undefined;
			break;

			case "+":
				op.string = op.string.replaceAll(op.num, (Number(op.num) + Number(num)).toString());
				op.num = op.num ? (Number(op.num) + Number(num)).toString() : undefined;
				op.num1 = op.num1 ? (Number(op.num1) + Number(num)).toString() : undefined;
				op.num2 = op.num2 ? (Number(op.num2) + Number(num)).toString() : undefined;
			break;

			case "-":
				op.string = op.string.replaceAll(op.num, (Number(op.num) - Number(num)).toString());
				op.num = op.num ? (Number(op.num) - Number(num)).toString() : undefined;
				op.num1 = op.num1 ? (Number(op.num1) - Number(num)).toString() : undefined;
				op.num2 = op.num2 ? (Number(op.num2) - Number(num)).toString() : undefined;
			break;

			case "/":
				op.string = op.string.replaceAll(op.num, (Number(op.num) / Number(num)).toString());
				op.num = op.num ? (Number(op.num) / Number(num)).toString() : undefined;
				op.num1 = op.num1 ? (Number(op.num1) / Number(num)).toString() : undefined;
				op.num2 = op.num2 ? (Number(op.num2) / Number(num)).toString() : undefined;
			break;
		}
	});
}

let evalOps = (ops) => {
	let newOps = ops.map((op) => {
		let buf;
		let opObj = { string: op };
		let regex;

		// Multiplication
		regex = /x(-*\d+)/ig;
		if (buf = regex.exec(op)) {
			opObj.operation = "mul";
			opObj.num = buf[1];
			return opObj;
		}

		// Division
		regex = /\/(-*\d+)/ig;
		if (buf = regex.exec(op)) {
			opObj.operation = "div";
			opObj.num = buf[1];
			return opObj;
		}

		// Sum
		regex = /\+(\d+)/ig;
		if (buf = regex.exec(op)) {
			opObj.operation = "sum";
			opObj.num = buf[1];
			return opObj;
		}

		// Subtraction
		regex = /^-(\d+)/ig;
		if (buf = regex.exec(op)) {
			opObj.operation = "sub";
			opObj.num = buf[1];
			return opObj;
		}

		// PUT num
		regex = /put\s*(\d+)/ig;
		if (buf = regex.exec(op)) {
			opObj.operation = "put";
			opObj.num = buf[1];
			return opObj;
		}

		// => fn
		regex = /(-*\d*)=>(-*\d*)/ig;
		if (buf = regex.exec(op)) {
			opObj.operation = "fn";
			opObj.num1 = buf[1];
			opObj.num2 = buf[2];
			return opObj;
		}

		// <<
		if (op === "<<") {
			opObj.operation = "<<";
			return opObj;
		}

		// +-
		if (op === "+-" || op === "-+") {
			opObj.operation = "opo";
			return opObj;
		}

		// "SUM"
		if (op === "SUM" || op === "sum") {
			opObj.operation = "sal";
			return opObj;
		}

		// REVERSE
		if (op === "REVERSE" || op === "reverse") {
			opObj.operation = "rev";
			return opObj;
		}

		// SHIFT RIGHT
		if (op === "shift>" || op === "SHIFT>") {
			opObj.operation = "sh>";
			return opObj;
		}

		// SHIFT LEFT
		if (op === "<shift" || op === "<SHIFT" || op === "shift<" || op === "SHIFT<") {
			opObj.operation = "sh<";
			return opObj;
		}

		// MIRROR
		if (op === "MIRROR" || op === "mirror") {
			opObj.operation = "mir";
			return opObj;
		}

		// CHANGE OPS
		regex = /\[([x\+-\/])\](\d+)/ig;
		if (buf = regex.exec(op)) {
			opObj.operation = "cop";
			opObj.copOp = buf[1];
			opObj.copNum = buf[2];
			return opObj;
		}

		// STORE
		if (op === "STORE" || op === "store") {
			opObj.operation = "strl";
			return opObj;
		}

		// INV10
		if (op === "inv10" || op === "INV10") {
			opObj.operation = "inv10";
			return opObj;
		}

	});

	newOps.forEach((op) => {
		if (op.operation === "strl") {
			op.string = "Store (long hold)";
			newOps.push({
				string: "Store (single click)",
				operation: "str",
				num: null
			});
		}
	});

	return newOps;
}

let store = (num, ops) => {
	ops.forEach((op) => {
		if (op.operation === "str") {
			if (num >= 0) {
				op.num = num.toString();
			} else {
				op.num = (-1*Number(op.num)).toString();
			}
		}
	});
}

let getNS = (op, num, ops) => {

	let operand = op.num ? op.num : undefined;

	switch (op.operation) {

		case "mul":
			return (Number(num)*Number(operand)).toString();
		break;

		case "div":
			return (Number(num)/Number(operand)).toString();
		break;

		case "sum":
			return (Number(num)+Number(operand)).toString();
		break;

		case "sub":
			return (Number(num)-Number(operand)).toString();
		break;

		case "put":
			return Number(num).toString() + "" + operand;
		break;

		case "fn":
			return Number(num.toString().replaceAll(op.num1, op.num2)).toString();
		break;

		case "<<":
			return (Math.floor(Number(num)/10)).toString();
		break;

		case "opo":
			return (-1*Number(num)).toString();
		break;

		case "sal":
			return Number(eval(Number(num).toString().replace(/(\d)(?=\d)/g, '$1+'))).toString();
		break;

		case "rev":
			if ( num >= 0 ) {
				return Number(Number(num).toString().split('').reverse().join('')).toString();
			} else {
				return Number(-1*(-1*Number(num)).toString().split('').reverse().join('')).toString();
			}
		break;

		case "sh>":
			if ( num >= 0 ) {
				return Number(num.toString().split('').rotate(-1).join('')).toString();
			} else {
				return Number(-1*(-1*num).toString().split('').rotate(-1).join('')).toString();
			}
		break;

		case "sh<":
			if ( num >= 0 ) {
				return Number(num.toString().split('').rotate(1).join('')).toString();
			} else {
				return Number(-1*(-1*num).toString().split('').rotate(1).join('')).toString();
			}
		break;

		case "mir":
			if ( num >= 0 ) {
				return Number(num).toString() + Number(num.toString().split('').reverse().join('')).toString();
			} else {
				return Number(num).toString() + Number(-1*(-1*num).toString().split('').reverse().join('')).toString();
			}
		break;

		case "cop":
			updateOps(ops, op.copOp, op.copNum);
			return num;
		break;

		case "strl":
			store(num, ops);
			return num;
		break;

		case "str":
			return num + (operand ? operand : "");
		break;

		case "inv10":

			if(num >= 0) {
				let buf = Number(num).toString().split('');
				buf = buf.map((number) => {
					if (number != 0) {
						return 10 - number;
					} return number;
				});
				return Number(buf.join('')).toString();
			} else {
				let buf = (-1*Number(num)).toString().split('');
				buf = buf.map((number) => {
					if (number != 0) {
						return 10 - number;
					} return number;
				});
				return (-1*Number(buf.join(''))).toString();
			}

		break;

	}

}

function solve(ops, movs, init, final, history = [init]) {
	let my_ops = arguments[0];
	let my_movs = arguments[1];
	let my_init = arguments[2];
	let my_final = arguments[3];

	if (typeof my_ops[0] != "object") {
		my_ops = evalOps(my_ops);
	}

	if (my_ops.len === 0) {
		console.log("No operations!");
		return;
	}


	if (my_movs === 0) {
		history.push(my_init);
		if (my_init == my_final) {
			console.log(history.join(' -> '));
			renderSol(history.join(' ⇒ '));
		}
		return my_init;
	} else {
		for (let i=0;i<my_ops.length;i++) {
			let countStr = 0;
			let countStrl = 0;
			history.forEach((oper)=> {
				if (oper === "Store (long hold)")
					countStrl ++;
				if (oper === "Store (single click)")
					countStr ++;
			});
			if ((countStrl <= countStr+1)) {
				let newHistory = history.slice();
				newHistory.push(my_ops[i].string);
				let newOps = my_ops.map((val)=>clone(val));
				let nextInit = getNS(my_ops[i], my_init, newOps);
				solve(newOps, ((my_ops[i].operation === "strl") ? my_movs : my_movs-1), nextInit, my_final, newHistory);
			}
		}
	}
}