formSolve = () => {
	var ops, mov, init, final;

	ops = document.querySelector("form").ops.value.replace(/['",]+/g, '').trim().split(" ");
	mov = Number(document.querySelector("form").mov.value);
	init = Number(document.querySelector("form").init.value);
	final = Number(document.querySelector("form").final.value);
	portalin = Number(document.querySelector("form").in.value);
	portalout = Number(document.querySelector("form").out.value);

	var linebreak = document.createElement("br");
	document.querySelector("#solutionBox").append("--------------------");
	document.querySelector("#solutionBox").appendChild(linebreak);

	solve(ops, mov, init, final, ((portalin != null) && (portalout != null)) ? {in: portalin, out: portalout} : undefined);

	return false;
}

clearPortals =() => {
	form = document.querySelector("form");
	form.in.forEach( (input) => {
	    if (input.checked == true) {
	        input.checked = false;
	    }
	});
	form.out.forEach( (input) => {
	    if (input.checked == true) {
	        input.checked = false;
	    }
	});
	return false;
}

renderSol = (sol) => {
	var linebreak = document.createElement("br");

	document.querySelector("#solutionBox").append(sol);
	document.querySelector("#solutionBox").appendChild(linebreak);
}