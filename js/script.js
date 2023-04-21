const inputSelectors = {
  UNITS: "#units-input",
  METERS: "#meters-input",
};

const outputSelectors = {
  UNITS: "#units-output",
  METERS: "#meters-output",
};

const buttonSelectors = {
  SCALE: ["#a1", "#a2", "#a3"],
};

const conversionScales = [0.01905, 0.254, 0.35];
const conversionInfo = [
  "Architectural Scale (for maps, architecture, and some models)",
  "Entity Scale (for most characters, some models, and in-game objects)",
  "Skybox Scale (for the size of the skybox)"
];

let currentScale = conversionScales[0];

function removeClasses() {
  buttonSelectors.SCALE.forEach(button => {
    $(button).removeClass("btn-outline-light");
  });
}

function setConversionScale(index) {
  if (!_.isNumber(index) || !_.isFinite(conversionScales[index])) {
    console.error('Invalid scale index:', index);
    return;
  }
  
  currentScale = conversionScales[index];
  removeClasses();
  $(buttonSelectors.SCALE[index]).addClass("btn-outline-light");
  $("#info").text(conversionInfo[index]);

  $("#units-input").trigger( "input" );
  $("#meters-input").trigger( "input" );
}

function convertInput() {
  const $input = $(this);
  const isUnitsInput = $input.is(inputSelectors.UNITS);
  const str = $input.val().trim();
  
  if (_.isEmpty(str)) {
    $(outputSelectors.UNITS).text("");
    $(outputSelectors.METERS).text("");
    return;
  }
  
  const isValid = /^-?\d+(?:\.\d+)?$/.test(str);
  
  if (!isValid) {
    const $output = isUnitsInput ? $(outputSelectors.METERS) : $(outputSelectors.UNITS);
    $output.text("Invalid input");
    return;
  }
  
  const units = new Big(str);
  const convertedValue = isUnitsInput ? units.times(currentScale) : units.div(currentScale);
  const $output = isUnitsInput ? $(outputSelectors.METERS) : $(outputSelectors.UNITS);
  $output.text(`${convertedValue.toFixed(2)} ${isUnitsInput ? "meters" : "Hammer Units"}`);
}

function copyToClipboard(id, text) {
  if (!text) {
    return;
  }
  const tmpElem = document.createElement('div');
  const clipboardText = document.createTextNode(text);
  tmpElem.appendChild(clipboardText);
  document.body.insertAdjacentElement('beforeend', tmpElem);
  const range = document.createRange();
  range.selectNode(tmpElem);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('copy');
  document.body.removeChild(tmpElem);
  
  $(id).addClass("btn-new-success");
  setTimeout(function() {
      $(id).removeClass("btn-new-success");
  }, 1000);
}

$("#copy-units-btn").on("click", function() {
  const unitsOutput = $("#units-output").text();
  if (_.isEmpty(unitsOutput)) {
    return;
  }
  copyToClipboard("#copy-units-btn", unitsOutput);
});

$("#copy-meters-btn").on("click", function() {
  const metersOutput = $("#meters-output").text();
  if (_.isEmpty(metersOutput)) {
    return;
  }
  copyToClipboard("#copy-meters-btn", metersOutput);
});

setConversionScale(0);

buttonSelectors.SCALE.forEach((button, index) => {
  $(button).on("click", () => {
    setConversionScale(index);
  });
});

$(inputSelectors.UNITS).on("input", convertInput);
$(inputSelectors.METERS).on("input", convertInput);

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})