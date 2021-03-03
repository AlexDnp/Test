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


// Обработка полученных данных
function receiveData(data) {
  var jsonResponse = JSON.parse(data);
  for (var key in jsonResponse) {
    var elem = document.getElementById(key);
    if (elem) {
      //changeValueById(elem, jsonResponse[key]);
      if (elem.tagName == 'INPUT') {
        elem.value = jsonResponse[key];
      } else {
        elem.innerHTML = jsonResponse[key];
      }
    }
  }
}
// function changeValueById(elem, newValue) {
//   if (elem.tagName == 'INPUT') {
//     elem.value = newValue;
//   } else {
//     elem.innerHTML = newValue;
//   }
// }