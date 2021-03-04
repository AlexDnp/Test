const idInfo = {
  InfLanguage: "iL",
  InfNumDevice: "iN",
  InfPower: "iP",
  InfComment: "iC",
  InfSteps: "iS",
  InfDate: "iD"
}

let strInfo = [
  "iL",
  "iN",
  "iP",
  "iC",
  "iS",
  "iD"
]

var isConnected = false;



$(document).ready(function () {
  $('input').bind('copy paste', function (e) {
    e.preventDefault();
  });
  $('input[type=number]').on('keydown', checkInputNumber);
  $("#carouselContent").on('slide.bs.carousel', selectCarouselItem);
});



function checkInputNumber(event) {
  let key = event.key;
  if (key === "Backspace" || key === "Delete") {
    return true;
  }
  let value = event.target.value;
  let new_value = Number(value + key);
  let max = Number(event.target.max);
  if (new_value > max || new_value === 0) {
    event.preventDefault();
  }
  var regex = /[0-9]/;
  if (!regex.test(key)) {
    event.preventDefault();
  }

}

function selectCarouselItem(e) {
  if (isConnected) {
    var id = e.relatedTarget.id;
    switch (id) {
      case "info":
        // do something the id is 1
        break;
      case "2":
        // do something the id is 2
        break;
      case "3":
        // do something the id is 3
        break;
      default:
      //the id is none of the above
    }
  }

}

function StateConnect(state) {

  if (state && isConnected === false) {
    isConnected = true;
    document.getElementById("carIndicators").classList.remove("d-none");
    document.getElementById("carousel-control").classList.remove("d-none");
    var lst = document.getElementsByClassName("nav-link");
    for (var i = 0; i < lst.length; i++) {

      lst[i].classList.remove("disabled");
    }

    document.getElementById("connectBLE").classList.add("d-none");
    document.getElementById("disconnectBLE").classList.remove("d-none");

    addSteps(1, 8);
  }
  else if (state === false && isConnected) {
    isConnected = false;
    SubmitDisabled(true);
    document.getElementById("carIndicators").classList.add("d-none");
    document.getElementById("carousel-control").classList.add("d-none");
    var lst = document.getElementsByClassName("nav-link");
    for (var i = 0; i < lst.length; i++) {
      if (lst[i].id != "term")
        lst[i].classList.add("disabled");
    }
    document.getElementById("connectBLE").classList.remove("d-none");
    document.getElementById("disconnectBLE").classList.add("d-none");
  }
}

function SubmitDisabled(request) {
  var element = document.getElementsByTagName("input");
  for (var i = 0; i < element.length; i++) {
    //  if (element[i].type === 'button') {
    element[i].disabled = request;
    //  }
  }
  var element = document.getElementsByTagName("select");
  for (var i = 0; i < element.length; i++) {
    //  if (element[i].type === 'button') {
    element[i].disabled = request;
    //  }
  }
}

// Обработка полученных данных
function receiveData(data) {
  var jsonResponse = JSON.parse(data);
  for (var key in jsonResponse) {
    var elem = document.getElementById(key);
    if (elem) {
      if (elem.tagName == 'SELECT') {
        for (var i = 0; i < elem.length; i++) {
          if (elem[i].value == jsonResponse[key]) {
            elem.selectedIndex = i;
            // elem.disabled = false;
            break;
          }
        }
      }
      else if (elem.tagName == 'INPUT') {
        elem.value = jsonResponse[key];
      } else {
        elem.innerHTML = jsonResponse[key];
      }
    }
  }
}

// var dig = 0;
// function validate(evt, sender) {
//   var theEvent = evt || window.event;

//   // Handle paste
//   if (theEvent.type === 'paste') {
//     key = event.clipboardData.getData('text/plain');
//   } else {
//     // Handle key press
//     var key = theEvent.keyCode || theEvent.which;
//     key = String.fromCharCode(key);
//   }
//   var regex = /[0-9]/;
//   if (!regex.test(key)) {
//     theEvent.returnValue = false;
//     if (theEvent.preventDefault) theEvent.preventDefault();
//   }

// }

// function checkValue(sender) {
//   let min = sender.min;
//   let max = sender.max;
//   // here we perform the parsing instead of calling another function
//   let value = parseInt(sender.value);
//   if (isNaN(value))
//     return false;
//   if (sender.value.length > sender.maxLength)
//     sender.value = sender.value.slice(0, sender.maxLength);
//   if (value > max) {
//     sender.value = max;
//   } else if (value < min) {
//     sender.value = min;
//   }

// }

function addSteps(number, count) {
  // Number of inputs to create
  //var number = document.getElementById("iSteps").value;

  // Container <div> where dynamic content will be placed
  // toggle('saveSteps', 'hidden');


  // document.getElementById("").classList.remove('show');
  // document.getElementById("saveSteps").classList.add('hidden');
  var container = document.getElementById("countSteps");
  // Clear previous contents of the container
  while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
  }
  for (i = number; i < count + 1; i++) {
    // Append a node with a random text
    // container.appendChild(document.createTextNode("Member " + (i+1)));
    var label = document.createElement("label");
    label.setAttribute('for', 'step' + i);
    label.style = "width: 120px";
    label.innerText = i + " ступень";
    label.name = i;
    var cr = document.createElement("label");
    //<label class="circle"></label>
    cr.classList.add('circle');
    cr.classList.add('cr');
    cr.id = 'cr' + i;
    cr.classList.add('d-none');

    //<span class="validity"></span>
    var sp = document.createElement("span");
    sp.classList.add('validity');

    // Create an <input> element, set its type and name attributes
    var input = document.createElement("input");
    input.type = "number";
    input.name = "step" + i;
    input.id = "step" + i;
    input.min = 100;
    input.step = 1;
    input.max = 300;
    input.value = "";
    //input.disabled=true;
    input.setAttribute('size', '3');
    input.setAttribute('maxLength', '3');
    input.addEventListener('keydown', checkInputNumber);
    // input.setAttribute('oninput', "checkValue(this)");
    //"javascript:if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);");
    input.setAttribute('required', 'true');
    //oninput="checkValue(this);"
    // input.pattern = "[0-9]{3}";
    // input.setAttribute('pattern', '^[0–9]$');//
    //input.oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');";
    input.setAttribute('pattern', '\\d*');
    //input.setAttribute('oninput', "changeLevelStep('countSteps',this); actionSave('countSteps','saveSteps')");

    //<label class="circle"></label>


    // input.oninput=actionSave('countSteps','saveSteps');

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(sp);
    container.appendChild(cr);


    // Append a line break 
    container.appendChild(document.createElement("br"));
  }
  // toggle('stepsLevel', 'show');
  // document.getElementById('stepsLevel').classList.remove('hidden');
  // document.getElementById('stepsLevel').classList.add('show');

}
// function changeValueById(elem, newValue) {
//   if (elem.tagName == 'INPUT') {
//     elem.value = newValue;
//   } else {
//     elem.innerHTML = newValue;
//   }
// }