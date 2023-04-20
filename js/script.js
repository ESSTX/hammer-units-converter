let scale = 0;
const SCALES = [0.01905, 0.254, 0.35];
const INFO = [
	"Architectural Scale (maps, architecture, certain models)",
	"Entity Scale (most characters, certain models, in-game)",
	"Only Skybox Scale"
]
let Elements = ["#a1", "#a2", "#a3"];

function removeClasses(){
	let i = 0;
	while (let = i < Elements.length) {
		$(Elements[i]).removeClass("btn-outline-light");
		i++;
	}
}

function setScale(number) {
	if(typeof number != "number") {return} 
	scale = SCALES[number];
	removeClasses();
	$(Elements[number]).addClass("btn-outline-light");
	$("#info").text(INFO[number]);
}

function convertUnits() {
	var units = new Big(document.getElementById("units-input").value);
	var meters = units.times(scale);
	document.getElementById("meters-output").textContent = meters.toString().slice(0, 7) + " meters";
}
function convertMeters() {
	var meters = new Big(document.getElementById("meters-input").value);
	var units = meters.div(scale);
	document.getElementById("units-output").textContent = units.toString().slice(0, 7) + " Hammer Units";
}

function isNumber(e){
    e = e || window.event;
    var charCode = e.which ? e.which : e.keyCode;
    return /\d/.test(String.fromCharCode(charCode));
}

setScale(0);