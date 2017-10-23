formSolve = () => {
	var ops, mov, init, final;

	ops = document.querySelector("form").ops.value.replace(/['",]+/g, '').trim().split(" ");
	mov = Number(document.querySelector("form").mov.value);
	init = Number(document.querySelector("form").init.value);
	final = Number(document.querySelector("form").final.value);

	var linebreak = document.createElement("br");
	document.querySelector("#solutionBox").append("--------------------");
	document.querySelector("#solutionBox").appendChild(linebreak);

	solve(ops, mov, init, final);

	return false;
}

renderSol = (sol) => {
	var linebreak = document.createElement("br");

	document.querySelector("#solutionBox").append(sol);
	document.querySelector("#solutionBox").appendChild(linebreak);
}