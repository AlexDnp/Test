var set_real_time;
var active = 'egiste';
var jsonPage;
var jsonResponse;
var ajax = {};
var xmlHttp = createXmlHttpObject();
var tt = 220;
var jsonStateDev;
var step;
//var isSocketConnect = false;




function SubmitDisabled(request) {
  var element = document.getElementsByTagName("input");
  for (var i = 0; i < element.length; i++) {
    //  if (element[i].type === 'button') {
    element[i].disabled = request;
    //  }
  }
  var element = document.getElementsByTagName("button");
  for (var i = 0; i < element.length; i++) {
    //  if (element[i].type === 'button') {
    element[i].disabled = request;
    //  }
  }
}

function selectSave(isCheck, target, name) {
  if (document.getElementById(target)) {
    var element = document.getElementById(target).classList;
    if (isCheck.checked) {
      element.remove('hidden');
      element.add('show');
      changeInput(name, false);
    }
    else {
      element.remove('show');
      element.add('hidden');
      changeInput(name, true);
    }
  }
}

function changeInput(name, state) {
  var x = document.getElementById(name);
  var element = x.getElementsByTagName("input");
  for (var i = 0; i < element.length; i++) {
    if (element[i].type === 'text' || element[i].type === 'date' || element[i].type === 'password') {
      element[i].disabled = state;
    }
    else if (element[i].type === 'button') {
      if (state === false) {
        element[i].classList.remove('hidden');
        element[i].classList.add('show');
      }
      else {
        element[i].classList.remove('show');
        element[i].classList.add('hidden');
      }
    }
  }
}

function input_disabled(request) {
  var element = document.getElementsByTagName("input");
  for (var i = 0; i < element.length; i++) {
    if (element[i].type === 'text' || element[i].type === 'date' || element[i].type === 'password') {
      element[i].disabled = request;
    }
  }
}


ajax.x = function () {
  var xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return xhr;
};

ajax.send = function (url, callback, method, data, async) {
  // SubmitDisabled(true);
  if (async === undefined) {
    async = true;
  }
  var x = ajax.x();
  x.open(method, url, async);
  x.onreadystatechange = function () {
    if (x.readyState == 4) {
      // SubmitDisabled(false);
      callback(x.responseText)
    }
  };
  if (method == 'POST') {
    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  }
  x.send(data)
};

ajax.get = function (url, data, callback, async) {
  var query = [];
  for (var key in data) {
    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
  }
  ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.put = function (url, data, callback, async) {
  var query = [];
  for (var key in data) {
    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
  }
  ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'PUT', null, async)
};

ajax.post = function (url, data, callback, async) {
  var query = [];
  for (var key in data) {
    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
  }
  ajax.send(url, callback, 'POST', query.join('&'), async)
};


function createXmlHttpObject() {
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  return xmlHttp;
}



document.onkeydown = function (e) {
  var evtobj = window.event ? event : e
  // var element = document.getElementById('edit-content');
  var charCode = String.fromCharCode(evtobj.which).toLowerCase();
  // if (charCode === 'e' && evtobj.ctrlKey && element) { window.open('/edit', '_blank'); }
  // if (charCode === 'm' && evtobj.ctrlKey && element) { toggle('edit-content'); toggle('url-content'); }
  // if (charCode === 's' && evtobj.ctrlKey && element) {
  //   evtobj.preventDefault(); send_request_edit(this, val('edit-json'), window.location.search.substring(1).split("&")[0] + '.json'); toggle('edit-content'); toggle('url-content');
  // }
  if (charCode === 'm' && evtobj.ctrlKey) {
    var el = document.getElementsByClassName('info');
    if (el[0].disabled)
      el[0].disabled = false;
    else
      el[0].disabled = true;
    var el = document.getElementById('debug').classList;
    if (el.contains('d-none'))
      el.remove('d-none');
    else
      el.add('d-none');

  }
  if (charCode === 'e' && evtobj.ctrlKey) {
    var el = document.getElementsByClassName('info');
    el[0].disabled = true;
  }
}

//var connection = new WebSocket('ws://' + location.hostname + ':81/', ['arduino']);
//var timerIdSocketDisconnect;
//var timerIdSocketConnect;
var timerState;

// function socketConnect() {
//   connection.send("ws");
//   console.log('WebSocket send: ws');
// }
function selectHistory(st, en) {
  var data = {};
  SubmitDisabled(true);
  data['hcnt'] = en;
  //data['hend'] = st;

  ajax.get('hstGet', data, function (response) {
    if (response != "" && response[0] == '{') {
      en--;

      try {
        var jsonResponse = JSON.parse(response);
        if (jsonResponse.rows)
          addRowHistory(jsonResponse.rows);
        if (en > st - 1)
          selectHistory(st, en);
      }
      catch{ }
    }
    SubmitDisabled(false);
  }, true);

}

function clearHistory() {
  toggle('divHistory', 'hidden');
  ajax.get('historyClear' + '?' + Math.random(), {}, function (response) {
  }, true);
}

function removeOptions(selectbox) {
  var i;
  for (i = selectbox.options.length - 1; i >= 0; i--) {
    selectbox.remove(i);
  }
}

function addRowHistory(rows) {
  var container = document.getElementById("bodyHistory");
  var row = document.createElement("TR");
  for (var key in rows) {


    if (key == 'cnt') {
      var th = document.createElement("TH");
      th.setAttribute("scope", "row");
      th.innerText = rows[key];
      row.appendChild(th);
    }
    else {
      var td = document.createElement("TD");
      if (key == 'st' & jsonStateDev != null) {
        for (var keyDev in jsonStateDev) {
          if (keyDev == rows[key]) {
            td.appendChild(document.createTextNode(jsonStateDev[keyDev]));
            break;
          }
        }
      }
      else if (key == 'tml') {
        var tml = rows[key];
        continue;
      }
      else if (key == 'tmh') {
        var tm = rows[key] << 8 | tml;
        td.appendChild(document.createTextNode(secondsToTime(tm)));
      }
      else
        td.appendChild(document.createTextNode(rows[key]));
      row.appendChild(td);
    }
  }
  container.appendChild(row);
}

function clickBody(idBody, request, obj) {
  try {
    var element = document.getElementById(idBody).classList;
    if (element.contains('hidden')) {
      requestJson(request, obj);
    }
    else {
      element.remove('show');
      element.add('hidden');
      var el = document.getElementById(idBody).getElementsByTagName('button');
      el[0].classList.add('hidden');
      //  
    }
  }
  catch (e) { console.log(e.name + ': ' + e.message); }
}

function getHistory(obj) {
  SubmitDisabled(true);
  var container = document.getElementById("bodyHistory");
  var element = document.getElementById("divHistory").classList;

  if (element.contains('hidden') == false) {
    element.remove('show');
    element.add('hidden');
    SubmitDisabled(false);
    return;
  }
  var element = document.getElementById("noHistory").classList;

  if (element.contains('show')) {
    element.remove('show');
    element.add('hidden');
    SubmitDisabled(false);
    return;
  }

  toggle('divHistory', 'hidden');
  toggle('noHistory', 'hidden');

  if (obj) {
    var cl = obj.querySelector('.spinner-border');
    if (cl)
      cl.classList.remove('d-none');
  }

  ajax.get('history.json' + '?' + Math.random(), {}, function (response) {

    if (response != "" && response[0] == '{') {
      try {
        var jsonResponse = JSON.parse(response);

        // Clear previous contents of the container
        while (container.hasChildNodes()) {
          container.removeChild(container.lastChild);
        }
        for (var key in jsonResponse) {
          if (key == 'rows')
            addRowHistory(jsonResponse.rows);
          if (key == 'rec') {
            var data = jsonResponse.rec;
            if (data > 0) {
              document.getElementById('countHistory').innerText = data;
              var elem = document.getElementById("selecCountHistory");
              removeOptions(elem);
              if (data > 9) {
                var cnt = parseInt(data / 5);
                var ii = data - 5;
                var mval = data;
                for (var i = cnt; i > 0; i--) {
                  var option = document.createElement("option");
                  option.text = ii + '-' + mval;
                  option.value = mval;
                  option.val2 = ii;
                  mval = ii - 1;
                  ii = mval - 5;
                  if (ii < 1) ii = 1;
                  elem.add(option);
                }
                elem.options[elem.selectedIndex].disabled = 'true';
                selectHistory(elem.options[elem.selectedIndex].val2, elem.options[elem.selectedIndex].value);
                elem.options[elem.selectedIndex].disabled = 'true';
                toggle('selecCountHistory', 'show');
                toggle('lbCountHistory', 'show');
              }
              else {
                toggle('selecCountHistory', 'hidden');
                toggle('lbCountHistory', 'hidden');
                selectHistory(1, data);
              }
              toggle('divHistory', 'show');
            }
            else {
              toggle('noHistory', 'show');
              toggle('divHistory', 'hidden');
            }
          }
        }
        // toggle('noHistory', 'show');
        // toggle('divHistory', 'hidden');

      }
      catch{

      }
    } else {

    }
    if (cl)
      cl.classList.add('d-none');
    SubmitDisabled(false);
  }, true);

}

function requestJson(strJson, obj) {
  SubmitDisabled(true);
  if (obj)
    var cl = obj.querySelector('.spinner-border');
  if (cl)
    cl.classList.remove('d-none');


  ajax.get(strJson + '?' + Math.random(), {}, function (response) {
    if (cl)
      cl.classList.add('d-none');
    if (response != "" && response[0] == '{') {
      var jsonResponse = JSON.parse(response);
      if (jsonResponse.keyMan>=0) {
        document.getElementById('dbg').classList.remove('hidden');
        var sl = document.getElementById('keyman').options;
        for (var i = 0; i < sl.length; i++) {
          if (sl[i].value == jsonResponse.keyMan)
            document.getElementById('keyman').selectedIndex = i;
        }
      }

      for (var key in jsonResponse) {
        var data = jsonResponse[key];
        changeValueByName(key, jsonResponse[key]);
        changeValueById(key, jsonResponse[key]);

      }
    } else {

    }
    SubmitDisabled(false);
  }, true);
}

function secondsToTime(secs) {
  secs = Math.round(secs);
  var hh = Math.floor(secs / (60 * 60));

  var divisor_for_minutes = secs % (60 * 60);
  var mm = Math.floor(divisor_for_minutes / 60);

  var divisor_for_seconds = divisor_for_minutes % 60;
  var ss = Math.ceil(divisor_for_seconds);

  if (hh < 10) { hh = "0" + hh; }
  if (mm < 10) { mm = "0" + mm; }
  if (ss < 10) { ss = "0" + ss; }
  // This formats your string to HH:MM:SS
  var t = hh + ":" + mm + ":" + ss;
  return t;
}

function changeValueByClass(name, val) {
  var elems = document.querySelectorAll('.' + name);
  for (var i = 0; i < elems.length; i++) {
    elems[i].innerHTML = val;
  }
}

function requestState() {
  ajax.get('state.json' + '?' + Math.random(), {}, function (response) {
    var update = false;
    timerState = setTimeout(requestState, 300);
    if (response != "" && response[0] == '{') {
      var jsonResponse = JSON.parse(response);
      //document.getElementById('wait').classList.add('d-none');
      document.getElementById('main').classList.remove('d-none');
      if (jsonResponse.hasOwnProperty('errset')) {
        changeValueByClass('errset', jsonResponse.errset);
        document.getElementById('spErrset').classList.remove('d-none');
      } else
        document.getElementById('spErrset').classList.add('d-none');

      if (jsonResponse.hasOwnProperty('cur')) {
        update = true;
        changeValueByClass('cur', jsonResponse.cur);
        document.getElementById('spCur').classList.remove('d-none');
        updateBufChart("cur", jsonResponse.cur);
      } else
        document.getElementById('spCur').classList.add('d-none');

      if (jsonResponse.hasOwnProperty('step')) {
        changeValueByClass('step', jsonResponse.step);
        document.getElementById('spStep').classList.remove('d-none');
        var cl = document.getElementsByClassName('cr');
        if (cl.length) {
          for (var i = 0; i < cl.length; i++)
            cl[i].classList.add('d-none');
          document.getElementById('cr' + jsonResponse.step).classList.remove('d-none');
        }
      }
      else
        document.getElementById('spStep').classList.add('d-none');

      if (jsonResponse.hasOwnProperty('umax')) {
        changeValueByClass('umax', jsonResponse.umax);
        document.getElementById('spUmax').classList.remove('d-none');
      } else
        document.getElementById('spUmax').classList.add('d-none');

      if (jsonResponse.hasOwnProperty('umin')) {
        changeValueByClass('umin', jsonResponse.umin);
        document.getElementById('spUmin').classList.remove('d-none');
      } else if (!document.getElementById('spUmin').classList.contains('d-none'))
        document.getElementById('spUmin').classList.add('d-none');

      if (jsonResponse.hasOwnProperty('curmax')) {
        changeValueByClass('curmax', jsonResponse.curmax);
        document.getElementById('spCurmax').classList.remove('d-none');
      } else if (!document.getElementById('spCurmax').classList.contains('d-none'))
        document.getElementById('spCurmax').classList.add('d-none');

      if (jsonResponse.hasOwnProperty('tmwrkl')) {
        var tml = jsonResponse.tmwrkl;
        if (jsonResponse.hasOwnProperty('tmwrkh')) {
          var tm = jsonResponse.tmwrkh << 8 | tml;
          changeValueByClass('tmwork', secondsToTime(tm));
          document.getElementById('spTmrwork').classList.remove('d-none');
        }
        else if (!document.getElementById('spTmrwork').classList.contains('d-none'))
          document.getElementById('spTmrwork').classList.add('d-none');
      }
      else if (!document.getElementById('spTmrwork').classList.contains('d-none'))
        document.getElementById('spTmrwork').classList.add('d-none');

      if (jsonResponse.hasOwnProperty('termoIzm')) {
        changeValueByClass('termoIzm', jsonResponse.termoIzm);
        document.getElementById('spTermoIzm').classList.remove('d-none');
      }
      else if (!document.getElementById('spTermoIzm').classList.contains('d-none'))
        document.getElementById('spTermoIzm').classList.add('d-none');



      for (var key in jsonResponse) {
        if (key == 'state')
          getStateStr(jsonResponse.state);
        else if (key == 'wait') {
          document.getElementById('stateStr').innerText = "Пауза " + jsonResponse[key];
        }
        if (key == 'uin') {
          update = true;
          changeValueByClass('uin', jsonResponse.uin);
          updateBufChart("uin", jsonResponse.uin);
        }
        if (key == 'uout') {
          update = true;
          changeValueByClass('uout', jsonResponse.uout);
          updateBufChart("uout", jsonResponse.uout);
        }
        if (key == 'udop') {
          changeValueByClass('udop', jsonResponse.udop);
        }
      }
      if (update)
        updateChart();
      // for (var key in jsonResponse) {
      //   var data = jsonResponse[key];
      //   changeValueByName(key, jsonResponse[key]);
      //   changeValueById(key, jsonResponse[key]);
      // }


    } else {

    }

  }, true);
}

function reload() {
  window.location.reload();
}

function Start() {
  var element = document.getElementsByTagName("checkbox");
  for (var i = 0; i < element.length; i++) {
    element.checked = false;
  }
  // requestJson("infoDev.json");
  timerState = setTimeout(requestState, 2000);
  createInputChart();
}

// function run_socket() {
//   connection = new WebSocket('ws://' + location.hostname + ':81/', ['arduino']);
// }
// connection.onopen = function () {
//   //connection.send('Connect ' + new Date());
//   console.log('Connect ' + new Date());
//   isSocketConnect = true;
//   clearInterval(timerIdSocketDisconnect);
//   timerIdSocketConnect = setInterval(socketConnect, 10000);
// };
// connection.onerror = function (error) {
//   console.log('WebSocket Error ', error);
// };
// connection.onmessage = function (e) {
//   console.log('Server: ', e.data);
//   parse_socket_data(e.data);
// };
// connection.onclose = function () {
//   console.log('WebSocket connection closed');
//   timerIdSocketDisconnect = setInterval(run_socket, 5000);
//   clearInterval(timerIdSocketConnect);
//   isSocketConnect = false;
// };

function changeLevelStep(idDiv) {
  var x = document.getElementById(idDiv);
  var elems = x.getElementsByTagName("input");
  for (var i = 0; i < elems.length - 1; i++) {

    if (elems[i].value + 2 > elems[i + 1].value)
      elems[i].setCustomValidity("err");
    else
      elems[i].setCustomValidity("");

  }
}

function sendData(name, dat, obj) {
  SubmitDisabled(true);
  var data = {};
  data[name] = dat;
  if (obj)
    var cl = obj.querySelector('.spinner-border');
  if (cl)
    cl.classList.remove('d-none');
  ajax.get('save', data, function (response) {// + Math.random()
    if (cl)
      cl.classList.add('d-none');
    if (response != "OK") {
      alert("Ошибка! Повторите попытку");
    }
    SubmitDisabled(false);
  }, true);
}

function sendForm(idForm, head, obj) {
  SubmitDisabled(true);
  var elem = document.getElementById(idForm);
  //form.preventDefault();
  //var data = new FormData(form);
  var data = {};
  for (var i = 0, ii = elem.length; i < ii; ++i) {
    var input = elem[i];
    if (input.id) {
      data[input.id] = input.value;
    }
  }
  if (obj)
    var cl = obj.querySelector('.spinner-border');
  if (cl)
    cl.classList.remove('d-none');

  ajax.get('save', data, function (response) {// + Math.random()
    if (cl)
      cl.classList.add('d-none');
    if (response != "OK") {
      alert("Ошибка! Повторите попытку");
    }
    SubmitDisabled(false);
  }, true);
}



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
    label.style = "width: 200px";
    label.innerText = i + " ступень";
    label.name = i;
    var cr = document.createElement("label");
    //<label class="circle"></label>
    cr.classList.add('circle');
    cr.classList.add('cr');
    cr.id = 'cr' + i;
    cr.classList.add('d-none');
    //label.appendChild(cr);
    // Create an <input> element, set its type and name attributes
    var input = document.createElement("input");
    input.type = "text";
    input.name = "step" + i;
    input.id = "step" + i;
    input.value = "";
    input.setAttribute('size', '2px');
    input.setAttribute('maxLength', '3');
    input.setAttribute('required', 'true');
    input.pattern = "[0-9]{3}";
    input.setAttribute('oninput', "changeLevelStep('countSteps',this); actionSave('countSteps','saveSteps')");

    //<label class="circle"></label>


    // input.oninput=actionSave('countSteps','saveSteps');

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(cr);


    // Append a line break 
    container.appendChild(document.createElement("br"));
  }
  // toggle('stepsLevel', 'show');
  // document.getElementById('stepsLevel').classList.remove('hidden');
  // document.getElementById('stepsLevel').classList.add('show');

}



function getSteps(st, num, obj, add) {
  var stRec = 1;
  SubmitDisabled(true);
  if (obj)
    var cl = obj.querySelector('.spinner-border');
  if (cl)
    cl.classList.remove('d-none');
  ajax.get('steps' + num + '.json' + '?' + Math.random(), {}, function (response) {
    SubmitDisabled(false);
    if (cl)
      cl.classList.add('d-none');
    if (response != "" && response[0] == '{') {
      var jsonResponse = JSON.parse(response);
      if (jsonResponse.steps > 0 & add == 1) {
        stRec = jsonResponse.steps;
        addSteps(st, jsonResponse.steps);
      }
      for (var key in jsonResponse) {
        changeValueByName(key, jsonResponse[key]);
        changeValueById(key, jsonResponse[key]);
      }
      if (stRec > num) {
        getSteps(stRec - num, 16, obj, 0);
      }
      return true;
    } else {
      return false;
    }

  }, true);
}

function getLevelSteps(obj) {
  var element = document.getElementById("stepsLevel").classList;

  if (element.contains('hidden') == false) {
    element.remove('show');
    element.add('hidden');
    return;
  }
  getSteps(1, 8, obj, 1);
}

function minmax(value, min, max) {
  //onclick="this.value = minmax(this.value, 80, 200)"
  if (parseInt(value) < min || isNaN(parseInt(value)))
    return min;
  else if (parseInt(value) > max)
    return max;
  else return value;
}

function validation(id, min, max) {
  var dat = document.getElementById(id);
  if (dat.value < min | dat.value > max)
    dat.setCustomValidity(min + "-" + max);
  else
    dat.setCustomValidity("");
}

function actionSave(idDiv, id) {
  var elems = document.getElementById(idDiv);
  var inp = elems.getElementsByTagName('input');
  for (var i = 0; i < inp.length; i++) {
    if (inp[i].checkValidity() == false) {
      document.getElementById(id).classList.remove('show');
      document.getElementById(id).classList.add('hidden');
      return;
    }
  }
  if (inp.length) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id).classList.add('show');
  }
}

function changeSteps(obj) {
  var stp = obj.options[obj.selectedIndex];
  if (stp.value == step)
    return false;
  var r = confirm("\t\t\t\tВнимание!\r\n\
При установке нового значения текущие установки\r\n\
напряжения переключения ступеней будут утеряны.\r\n\
Новые значения будут установленны после перезагрузки.\r\n\r\n\
Изменить количество ступеней?" );
  if (r == false) {
    var sl = obj.options;
    for (var i = 0; i < sl.length; i++) {
      if (sl[i].value == step) {
        obj.selectedIndex = i;
        break;
      }
    }
    return false;
  }
  return true;
}

function changeValueById(id, newValue) {
  var element = document.getElementById(id);
  if (element) {
    if (id == "iNumDev") {
      document.getElementById('Info').classList.remove('hidden');
      document.getElementById('Info').classList.add('show');
    }
    if (id == 'iSteps') {
      var sl = document.getElementById('iSteps').options;
      for (var i = 0; i < sl.length; i++) {
        if (sl[i].value == newValue) {
          document.getElementById('iSteps').selectedIndex = i;
          step = newValue;
          break;
        }
      }
      return;
    }
    if (id == 'trmFanOn')
      toggle('set', 'show');
    if (id == "offUinMin")
      toggle('offLevel', 'show');
    // if (element.tagName == 'SELECT') {
    //   element.options[element.selectedIndex].value = newValue;
    // }
    else if (element.tagName == 'INPUT') {
      element.value = newValue;
    } else {
      element.innerHTML = newValue;

    }
  }
}

// function parse_socket_data(socket_data) {
//   var response = JSON.parse(socket_data);
//   for (var key in response) {
//     changeValueById(key, response[key]);
//   }
// }

function changeValueByName(name, newValue) {
  var elems = document.getElementsByName(name);
  for (var i = 0; i < elems.length; i++) {
    var element = elems[i];
    //  element.innerHTML = newValue;
    //  element.value = newValue;
    if (element) {
      var txt = '';
      // if (element.tagName == 'SELECT') {
      //   element.options[element.selectedIndex].value = newValue;;
      // }
      // else
      if (element.tagName == 'INPUT') {
        element.value = newValue;;
      } else {
        element.innerHTML = newValue;
      }
    }
  }
}
function getStateStr(val) {

  for (var keyDev in jsonStateDev) {
    if (keyDev == val) {
      document.getElementById('stateStr').innerText = jsonStateDev[keyDev];
      break;
    }
  }
}

function getStateDev() {
  SubmitDisabled(true);
  ajax.get('StateDev.json' + '?' + Math.random(), {}, function (response) {
    SubmitDisabled(false);
    if (response != 'FileNotFound' && response[0] == "{") {
      jsonStateDev = JSON.parse(response);
    }
  }, true);
}

function getConfig() {
  SubmitDisabled(true);
  ajax.get('config.json' + '?' + Math.random(), {}, function (response) {
    SubmitDisabled(false);
    if (response != 'FileNotFound' && response != "") {
      var jsonResponse = JSON.parse(response);
      var jsonResponseOld = jsonResponse;
      for (var key in jsonResponse) {
        var data = jsonResponse[key];
        changeValueByName(key, jsonResponse[key]);
        changeValueById(key, jsonResponse[key]);
      }
      document.getElementById('navWiFi').classList.remove('disabled');
    } else {
      document.getElementById('content').innerHTML += '<br><br><h1>Files "' + pages[0] + '.json" not found.<\/h1><hr><h2>Maybe you want to open some file of these:<\/h2><h3 id="file-list">Loading...<\/h3>';
      toggle('container_column', 'hide');
      ajax.get('/list?dir=/', {}, function (response) {
        html('file-list', ' ');
        var jsonFiles = JSON.parse(response);
        for (var i = 0; i < jsonFiles.length; i++) {
          if (jsonFiles[i].name.substr(-4) == 'json') {
            document.getElementById('file-list').innerHTML += '<a href="/page.htm?' + jsonFiles[i].name.slice(0, -5) + '">' + jsonFiles[i].name + '<\/a><br>';
          }
        }
      }, true);
    }

  }, true);
}

// function setContent(stage) {
//   jsonResponse = '';
//   var pages = window.location.search.substring(1).split("&");
//   pages[0] = (pages[0] ? pages[0] : 'index1');
//   ajax.get(pages[0] + '.json', {}, function (response) {
//     document.getElementById('download-json').href = pages[0] + ".json";
//     var jsonPage;
//     if (response != 'FileNotFound' && response != "") {
//       jsonPage = JSON.parse(response);
//       var jsonEdit = response;
//       if (jsonPage.configs) {
//         var fileNumber = 0;
//         (function foo() {
//           ajax.get(jsonPage.configs[fileNumber], {}, function (response) {
//             if (response != 'FileNotFound' && response != "") {
//               var jsonResponseNew = JSON.parse(response);
//               var jsonResponseOld = jsonResponse;
//               jsonResponse = Object.assign(jsonResponseNew, jsonResponseOld);
//               document.getElementById('url-content').innerHTML += '<li><span class="label label-warning">GET</span> <a href="' + jsonPage.configs[fileNumber] + '" class="btn btn-link" style="text-transform:none;text-align:left;white-space:normal;display:inline">' + jsonPage.configs[fileNumber] + '</a> <span class="label label-default">200 OK</span></li>';
//             } else {
//               document.getElementById('url-content').innerHTML += '<li><span class="label label-warning">GET</span> <a href="' + jsonPage.configs[fileNumber] + '" class="btn btn-link" style="text-transform:none;text-align:left;white-space:normal;display:inline">' + jsonPage.configs[fileNumber] + '</a> <span class="label label-danger">File Not Found</span></li>';
//             }
//             fileNumber++;
//             if (fileNumber == jsonPage.configs.length) {
//               //         if (stage == 'first') {
//               //           run_socket("jsonPage.configs[fileNumber]");
//               //         }
//               for (var y = 0; y < pages.length; y++) {
//                 jsonResponse["urlArray" + [y]] = pages[y];
//               }
//               jsonResponse.urlArray = window.location.search.substring(1);
//               var theCookies = document.cookie.split(';');
//               for (var y = 1; y <= theCookies.length; y++) {
//                 jsonResponse[theCookies[y - 1].split("=")[0].replace(/^ /, '')] = theCookies[y - 1].split("=")[1];
//               }
//               if (jsonPage.title) {
//                 document.title = renameBlock(jsonResponse, jsonPage.title);
//                 document.getElementById('title').innerHTML = renameBlock(jsonResponse, jsonPage.title);
//               }
//               if (jsonPage.class) { document.getElementById('content').className = jsonPage.class; }
//               if (jsonPage.style) { document.getElementById('content').style = jsonPage.style; }
//               if (jsonPage.reload) { set_real_time = setTimeout("setContent('edit')", jsonPage.reload); }
//               if (stage == 'first') {
//                 //  document.body.innerHTML += '<a href="/donate.htm" class="hidden-xs btn btn-link" target="_blank" style="position:fixed;bottom:0;"><i class="fav-img"></i> ' + (jsonResponse.LangDonate ? jsonResponse.LangDonate : 'Donate') + '<\/a>';
//                 val('edit-json', jsonEdit);
//                 toggle('container_column', 'hide');
//               } else {
//                 document.getElementById('content').innerHTML = '';
//                 jsonPage = JSON.parse(val('edit-json'));
//               }
//               val('edit-butt', 'view');
//               if (jsonPage.content) {
//                 viewTemplate(jsonPage, jsonResponse);
//               } else {
//                 document.getElementById('url-content').innerHTML += '<li class="alert alert-danger" style="margin:5px 0;">content array not found in "' + pages[0] + '.json"<\/li>';
//                 document.getElementById('content').innerHTML += '<br><br><h1>File "' + pages[0] + '.json" cannot view.<\/h1><hr><h2>You can edit it right.<\/h2>';
//                 toggle('edit-content');
//                 toggle('url-content');
//               }
//             }
//             if (fileNumber < jsonPage.configs.length) {
//               jsonPage.configs[fileNumber] = renameBlock(jsonResponse, jsonPage.configs[fileNumber]);
//               foo();
//             }
//           }, true);
//         })()
//       } else {
//         document.getElementById('content').innerHTML = '<br><br><h1>File "' + pages[0] + '.json" cannot view.<\/h1><hr><h2>Please add configs array.<br>Example: "configs":["/config.live.json"]<br>You can edit this file on right side of this page.<\/h2>';
//         val('edit-json', jsonEdit);
//         toggle('container_column', 'hide');
//         toggle('edit-content');
//         toggle('url-content');
//       }
//     } else {
//       document.getElementById('content').innerHTML += '<br><br><h1>Files "' + pages[0] + '.json" not found.<\/h1><hr><h2>Maybe you want to open some file of these:<\/h2><h3 id="file-list">Loading...<\/h3>';
//       toggle('container_column', 'hide');
//       ajax.get('/list?dir=/', {}, function (response) {
//         html('file-list', ' ');
//         var jsonFiles = JSON.parse(response);
//         for (var i = 0; i < jsonFiles.length; i++) {
//           if (jsonFiles[i].name.substr(-4) == 'json') {
//             document.getElementById('file-list').innerHTML += '<a href="/page.htm?' + jsonFiles[i].name.slice(0, -5) + '">' + jsonFiles[i].name + '<\/a><br>';
//           }
//         }
//       }, true);
//     }
//   }, true);
// }

// function renameBlock(jsonResponse, str) {
//   if (str) {
//     var arr = str.match(/\{\{\S+?\}\}/gim);
//     if (arr) {
//       for (var i = 0; i < arr.length; i++) {
//         var id = arr[i].slice(2, -2);
//         //if (jsonResponse[id]) {
//         //str = str.replace(new RegExp('{{'+id+'}}','g'), jsonResponse[id]);
//         str = str.replace(new RegExp('{{' + id + '}}', 'g'), eval("jsonResponse." + id));
//         // }
//       }
//     }
//   }
//   if (typeof (str) != 'undefined' && str != null && str) {
//     try {
//       return eval(str);
//     } catch (e) {
//       return str;
//     }
//   } else {
//     return '';
//   }
//   //return (typeof(str)!='undefined'&&str!=null?str:'');
// }

function val(id, val) {
  if (document.getElementById(id)) {
    if (val) {
      document.getElementById(id).value = (val == ' ' ? '' : val);
    } else {
      var v = document.getElementById(id).value;
      return v;
    }
  }
}
function getGraph() {
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],

        borderColor: '#158cba',
        borderWidth: 1,
        fill: false,
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function toggleDNONE(target, status) {
  if (document.getElementById(target)) {
    var element = document.getElementById(target).classList;

    if (element.contains('hidden')) {
      if (status != 'hidden') {
        element.remove('hidden');
        element.add('show');
      }
    } else {
      if (status != 'show') {
        element.remove('show');
        element.add('hidden');
      }
    }
  }
}


function toggle(target, status) {
  if (document.getElementById(target)) {
    var element = document.getElementById(target).classList;
    if (element.contains('hidden')) {
      if (status != 'hidden') {
        element.remove('hidden');
        element.add('show');
      }
    } else {
      if (status != 'show') {
        element.remove('show');
        element.add('hidden');
      }
    }
  }
}

// function viewTemplate(jsonPage, jsonResponse) {
//   var i = 0;

//   for (var key in jsonPage) {
//     var element = document.getElementById(key);
//     if (Array.isArray(jsonPage[key]) && element) {

//       var arr = jsonPage[key];
//       for (var j = 0; j < arr.length; j++) {
//         var obj = arr[j];

//         if (!obj.module || searchModule(jsonResponse.module, obj.module)) {
//           var action_val = renameGet(obj.action);
//           var name_val = (obj.name ? obj.name : '');
//           //    var title_val = renameBlock(jsonResponse, obj.title);
//           var class_val = (obj.class ? renameBlock(jsonResponse, obj.class) : '');
//           var style_val = (obj.style ? 'style="' + renameBlock(jsonResponse, obj.style) + '"' : '');
//           var pattern_val = (obj.pattern ? obj.pattern : '');
//           var state_val = renameBlock(jsonResponse, obj.state);
//           var response_val = renameBlock(jsonResponse, obj.response);
//           var module_val = obj.module;
//           var type_val = obj.type;
//           if (type_val == 'div') {
//             element.innerHTML += '<div id="' + name_val + '" class="' + class_val + '" ' + style_val + '>';
//           }

//           if (type_val == 'divClose') {
//             element.innerHTML += '/<div>';
//           }

//           if (type_val == 'hr') {
//             element.innerHTML += '<hr id="' + name_val + '" class="' + class_val + '" ' + style_val + '>';
//           }
//           if (type_val == 'h1' || type_val == 'h2' || type_val == 'h3' || type_val == 'h4' || type_val == 'h5' || type_val == 'h6') {
//             element.innerHTML += '<' + type_val + ' id="' + name_val + '" class="' + class_val + '" ' + style_val + '>' + renameBlock(jsonResponse, obj.title) + '<\/' + type_val + '>';
//           }
//           if (type_val == 'input') {
//             if (action_val) action_val = 'onfocusout="send_request(this, \'' + (typeof module_val != 'undefined' && module_val ? 'cmd?command=' : '') + '\'+renameGet(\'' + obj.action + '\'),\'' + response_val + '\')"';
//             element.innerHTML += '<input ' + action_val + ' id="' + name_val + '" class="form-control ' + class_val + '" ' + style_val + ' ' + (pattern_val ? 'pattern="' + pattern_val + '"' : '') + ' placeholder="' + renameBlock(jsonResponse, obj.title) + '" value="' + state_val + '">';
//           }
//           if (type_val == 'textarea') {
//             if (action_val) action_val = 'onfocusout="send_request(this, \'' + (typeof module_val != 'undefined' && module_val ? 'cmd?command=' : '') + '\'+renameGet(\'' + obj.action + '\'),\'' + response_val + '\')"';
//             element.innerHTML += '<textarea ' + action_val + ' id="' + name_val + '" class="form-control ' + class_val + '" ' + style_val + ' ' + (pattern_val ? 'pattern="' + pattern_val + '"' : '') + ' placeholder="' + renameBlock(jsonResponse, obj.title) + '">' + state_val + '"</textarea>';
//           }
//           if (type_val == 'password') {
//             if (action_val) action_val = 'onfocusout="send_request(this, \'' + (typeof module_val != 'undefined' && module_val ? 'cmd?command=' : '') + '\'+renameGet(\'' + obj.action + '\'),\'' + response_val + '\')"';
//             element.innerHTML += '<input ' + action_val + ' id="' + name_val + '" class="form-control ' + class_val + '" ' + style_val + ' ' + (pattern_val ? 'pattern="' + pattern_val + '"' : '') + ' placeholder="' + renameBlock(jsonResponse, obj.title) + '" value="' + state_val + '" onfocus="this.type=\'text\'" type="password">';
//           }
//           if (type_val == 'button') {
//             if (action_val) action_val = 'onclick="send_request(this, \'' + (typeof module_val != 'undefined' && module_val ? 'cmd?command=' : '') + '\'+renameGet(\'' + obj.action + '\'),\'' + response_val + '\')"';
//             element.innerHTML += '<input id="' + name_val + '" ' + action_val + ' class="' + class_val + '" ' + style_val + ' value="' + renameBlock(jsonResponse, obj.title) + '" type="button">';
//           }
//           if (type_val == 'checkbox') {
//             var checked = '';
//             if (state_val == 1) { checked = 'checked'; }
//             if (action_val) { action_val = 'onchange="val(this.id,(this.checked?\'1\':\'0\'));send_request(this, \'' + (typeof module_val != 'undefined' && module_val ? 'cmd?command=' : '') + '\'+renameGet(\'' + obj.action + '\'),\'' + response_val + '\')"'; } else { action_val = 'onchange="val(this.id,(this.checked?\'1\':\'0\'));"'; }
//             element.innerHTML += '<label ' + style_val + '><input id="' + name_val + '" value="' + state_val + '" ' + action_val + ' type="checkbox" class="' + class_val + '" ' + checked + '> ' + renameBlock(jsonResponse, obj.title) + '<\/label>';
//           }
//           if (type_val == 'range') {
//             if (action_val) action_val = 'onchange="send_request(this, \'' + (typeof module_val != 'undefined' && module_val ? 'cmd?command=' : '') + '\'+renameGet(\'' + obj.action + '\'),\'' + response_val + '\')"';
//             element.innerHTML += '<label ' + style_val + ' style="display:block;"><h4>' + renameBlock(jsonResponse, obj.title) + '<\/h4> <input id="' + name_val + '" class="form-control ' + class_val + '" ' + action_val + ' ' + pattern_val + ' value="' + state_val + '" type="range"><\/label>';
//           }
//           if (type_val == 'table') {
//             var thead = '';
//             var jsonTable = obj.title;
//             element.innerHTML += '<table class="' + class_val + '" ' + style_val + ' id="' + name_val + '"><thead id="thead-' + state_val.replace(/[^a-z0-9]/gi, '-') + '"><tr><td><center><span class="loader"></span>' + jsonResponse.LangLoading + '</center></td></tr><\/thead><tbody id="tbody-' + state_val.replace(/[^a-z0-9]/gi, '-') + '"><\/tbody><\/table>';
//             loadTable(state_val, jsonTable);
//           }
//           if (type_val == 'select') {
//             if (action_val) action_val = 'onchange="send_request(this, \'' + (typeof module_val != 'undefined' && module_val ? 'cmd?command=' : '') + '\'+renameGet(\'' + obj.action + '\'),\'' + response_val + '\')"';
//             var option = '';
//             jsonSelect = obj.title;
//             for (var key in jsonSelect) {
//               option += '<option value="' + renameBlock(jsonResponse, key) + '"' + (state_val == key ? ' selected' : '') + '>' + renameBlock(jsonResponse, jsonSelect[key]) + '<\/option>';
//             }
//             element.innerHTML += '<select class="form-control ' + class_val + '" ' + style_val + ' ' + action_val + ' id="' + name_val + '">' + option + '<\/select>';
//           }
//           if (type_val == 'dropdown') {
//             var option = '';
//             var i = 0;
//             var title1 = '';
//             jsonSelect = obj.title;
//             for (var key in jsonSelect) {
//               if (i == 0) {
//                 title1 += renameBlock(jsonResponse, jsonSelect[key]);
//               } else {
//                 option += '<li><a href="' + renameBlock(jsonResponse, key) + '">' + renameBlock(jsonResponse, jsonSelect[key]) + '</a><\/li>';
//               }
//               i++;
//             }
//             element.innerHTML += '<div class="btn-group"><a href="#" class="dropdown-toggle ' + class_val + '" ' + style_val + ' onclick="toggle(\'' + name_val + '\');return false">' + title1 + '</a><ul class="dropdown-menu hidden" id="' + name_val + '">' + option + '<\/ul><\/div>';
//           }
//           if (type_val == 'configs') {
//             var htmlopt = '';
//             htmlopt += '<div id="' + name_val + '"><div id="' + state_val.replace(/[^a-z0-9]/gi, '-') + '" class="' + class_val + '" ' + style_val + '><center><span class="loader"></span>' + jsonResponse.LangLoading + '</center><\/div><\/div>';
//             htmlopt += '<div class="btn-group btn-block"><input  style="width:85%" onclick="changeTextarea(\'' + state_val.replace(/[^a-z0-9]/gi, '-') + '\');send_request_edit(this, val(\'' + state_val.replace(/[^a-z0-9]/gi, '-') + '-edit\'),\'configs/' + state_val + '\');alert(\'' + jsonResponse.LangReset2 + '\')" class="btn btn-block btn-success" value="' + jsonResponse.LangSave + '" type="button">';
//             htmlopt += '<a href="#" style="width:15%" class="btn btn-info dropdown-toggle" onclick="toggle(\'cloud\');return false"><i class="cloud-img"></i> <span class="caret"></span></a>';
//             htmlopt += '<ul class="dropdown-menu hidden" style="right:0;left:auto" id="cloud"><li><a onclick="toggle(\'cloud\');cloudUpload(\'' + jsonResponse.mac + '\',\'' + jsonResponse.configs + '\');alert(\'' + jsonResponse.LangReset2 + '\');return false" href="#"><i class="cloud-img"></i> ' + jsonResponse.LangCloudUpload + '</a></li><li><a onclick="toggle(\'cloud\');cloudDownload(\'' + jsonResponse.mac + '\',\'' + jsonResponse.configs + '.txt\');alert(\'' + jsonResponse.LangReset2 + '\');return false" href="#"><i class="cloud-img"></i> ' + jsonResponse.LangCloudDownload + '</a></li><li><a href="/configs/' + jsonResponse.configs + '.txt?download=true" download=""><i class="download-img"></i> ' + jsonResponse.LangCloudPC + '</a></li></ul>';
//             htmlopt += '</div>';
//             element.innerHTML += htmlopt;
//             setTimeout("loadConfigs('" + state_val + "')", 500);
//           }
//           if (type_val == 'link') {
//             element.innerHTML += '<a id="' + name_val + '" class="' + class_val + '" ' + style_val + ' href="' + renameGet(obj.action) + '">' + renameBlock(jsonResponse, obj.title) + '<\/a>';
//           }
//           if (type_val == 'img') {
//             element.innerHTML += '<img id="' + name_val + '" class="' + class_val + '" ' + style_val + ' src="' + renameGet(obj.state) + '" onclick="' + renameGet(obj.action) + '" title="' + renameBlock(jsonResponse, obj.title) + '"\/>';
//           }
//           if (type_val == 'text') {
//             element.innerHTML += '<div id="' + name_val + '" class="' + class_val + '" ' + style_val + '>' + renameBlock(jsonResponse, obj.title) + '<\/div>';
//           }
//           if (type_val == 'iframe') {
//             element.innerHTML += renameBlock(jsonResponse, obj.title) + '<iframe src="' + state_val + '" id="' + name_val + '" class="' + class_val + '" ' + style_val + '><\/iframe>';
//           }
//           if (type_val == 'chart') {
//             element.innerHTML += '<div id="' + name_val + '" class="' + renameBlock(jsonResponse, '{{' + state_val.replace(/[^a-z0-9]/gi, '') + '-hidden}}') + '"><button class="close" onclick="hide(\'' + state_val.replace(/[^a-z0-9]/gi, '') + '-hidden\',this)" type="button">×<\/button><a href="' + renameGet(obj.action) + '" target="_blank" class="close">' + (typeof action_val != 'undefined' && action_val ? '<i class="popup-img"><\/i>' : '') + '<\/a><h2><span id="' + state_val.replace(/[^a-z0-9]/gi, '') + '-title">' + renameBlock(jsonResponse, obj.title) + '</span> <span id="' + state_val.replace(/[^a-z0-9]/gi, '') + '-data"></span><\/h2><div id="' + state_val.replace(/[^a-z0-9]/gi, '') + '" class="' + class_val + '" ' + style_val + '><\/div><hr><\/div>';
//             if (renameBlock(jsonResponse, '{{' + state_val.replace(/[^a-z0-9]/gi, '') + '-hidden}}') != 'hidden') {
//               setTimeout("loadChart('" + state_val.replace(/[^a-z0-9]/gi, '') + "','" + state_val + "', {" + obj.options + "}," + obj.refresh + "," + obj.points + ",'" + obj.chartist + "')", 1500);
//             }
//           }
//           if (type_val == 'loadJson') {
//             element.innerHTML += '<div id="json-' + state_val.replace(/[^a-z0-9]/gi, '-') + '" class="' + class_val + '" ' + style_val + '><center><span class="loader"></span>' + jsonResponse.LangLoading + '</center><\/div>';
//             loadJson(state_val, obj.refresh, jsonResponse);
//           }
//           if (type_val == 'time-list') {
//             element.innerHTML += '<table class="' + class_val + '" ' + style_val + ' id="' + name_val + '"><tbody id="time-list"><\/tbody><\/table>';
//             loadTime(jsonResponse);
//           }
//           if (type_val == 'time-add') {
//             var option = '';
//             option += '<input type="hidden" id="hidden-val-then" value="1"><div id="new-then"></div>';
//             option += ' <h4><label class="label label-danger"><input type="checkbox" name="day-sun" id="day-0" checked>' + jsonResponse.LangSun + '</label>';
//             option += ' <label class="label label-info"><input type="checkbox" name="day-mon" id="day-1" checked>' + jsonResponse.LangMon + '</label>';
//             option += ' <label class="label label-info"><input type="checkbox" name="day-tue" id="day-2" checked>' + jsonResponse.LangTue + '</label>';
//             option += ' <label class="label label-info"><input type="checkbox" name="day-wed" id="day-3" checked>' + jsonResponse.LangWed + '</label>';
//             option += ' <label class="label label-info"><input type="checkbox" name="day-thu" id="day-4" checked>' + jsonResponse.LangThu + '</label>';
//             option += ' <label class="label label-info"><input type="checkbox" name="day-fri" id="day-5" checked>' + jsonResponse.LangFri + '</label>';
//             option += ' <label class="label label-danger"><input type="checkbox" name="day-sat" id="day-6" checked>' + jsonResponse.LangSat + '</label>';
//             option += ' <label class="label label-info"><input type="checkbox" name="day-sat" onchange="toggleCheckbox(this)" checked>' + jsonResponse.LangAll + '</label></h4>';
//             option += '<input id="set-time" class="form-control" pattern="(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}" placeholder="' + jsonResponse.LangTime4 + '. ' + jsonResponse.LangExample + ': 07:09:30" value="" style="width:90%;display:inline"><a href="#" class="btn btn-default" style="width:10%;" onclick="val(\'set-time\',\'' + jsonResponse.time + '\');return false"><i class="clock-img"></i></a>';
//             option += "<input class=\"btn btn-block btn-lg btn-success\" onclick=\"addTimer();\" value=\"" + jsonResponse.LangSave + "\" type=\"button\">";
//             element.innerHTML += option;
//             loadNewThen('new-then', ' ');
//             html("load-life-opt", "onclick");
//           }
//           if (type_val == 'scenary-list') {
//             element.innerHTML += '<table class="' + class_val + '" ' + style_val + ' id="' + name_val + '"><tbody id="scenary-list"><\/tbody><\/table>';
//             loadScenary(jsonResponse, 'loadList');
//           }
//           if (type_val == 'scenary-add') {
//             var option = '';
//             option += '<select class="form-control" id="ssdp-list0" onchange="loadScenaryList(0,\'loadInTextarea\',this.options[this.selectedIndex].value);loadLive(this.value,\'config.live.json\',\'ssdp-module\');toggle(\'ssdp-module\',\'hidden\');"><\/select>';
//             option += '<select class="form-control hidden" id="ssdp-module" onchange="pattern(this.querySelector(\':checked\').getAttribute(\'title\'),\'ssdp-command\');toggle(\'hidden-if\',\'hidden\');toggle(\'or-and\',\'hidden\');"><\/select>';
//             option += '<span class="hidden" id="hidden-if"><select class="form-control" id="ssdp-condition" style="width:50%;display:inline"><option value="=">' + jsonResponse.LangEqual + ' (=)<\/option><option value="<">' + jsonResponse.LangLess + ' (<)<\/option><option value=">">' + jsonResponse.LangMore + ' (>)<\/option><option value="<=">' + jsonResponse.LangLess + ' ' + jsonResponse.LangOr + ' ' + jsonResponse.LangEqual + ' (<=)<\/option><option value=">=">' + jsonResponse.LangMore + ' ' + jsonResponse.LangOr + ' ' + jsonResponse.LangEqual + ' (>=)<\/option><option value="!=">' + jsonResponse.LangNotEqual + ' (!=)<\/option><\/select>';
//             option += '<input class="form-control" id="ssdp-command" pattern="" style="width:40%;display:inline" value=""><a href="#" id="load-life-opt" class="btn btn-default" style="width:10%;" onclick="loadLive2(\'ssdp-list0\',\'ssdp-module\',\'ssdp-command\');return false"><i class="find-replace-img"></i></a></span>';
//             option += '<textarea id="scenary-list-edit" style="display:none" class="form-control"></textarea>';
//             option += '<input type="hidden" id="hidden-val-and" value="1"><input type="hidden" id="hidden-val-or" value="1"><div id="new-and-or"></div>';
//             option += '<div class="btn-group hidden" id="or-and" style="width:100%;"><input onclick="loadNewAnd(\'new-and-or\');" class="btn btn-sm btn-default" style="width:50%;" value="+ ' + jsonResponse.LangAnd + '" type="button">';
//             option += '<input onclick="loadNewOr(\'new-and-or\');" class="btn btn-sm btn-default" style="width:50%;" value="+ ' + jsonResponse.LangOr + '" type="button"></div>';
//             option += '<input type="hidden" id="hidden-val-then" value="1"><div id="new-then"></div>';
//             option += '<input onclick="loadNewThen(\'new-then\');" class="btn btn-sm btn-block btn-default" value="+ ' + jsonResponse.LangThen + '" type="button">';
//             option += "<input onclick=\"loadInTextarea();send_request_edit(this, val('scenary-list-edit'),'scenary.save.txt','send_request(this,\\'http://\\'+document.getElementById(\\'ssdp-list0\\').options[document.getElementById(\\'ssdp-list0\\').selectedIndex].value+\\'/setscenary\\');val(\\'ssdp-list0\\',\\' \\');loadScenary(jsonResponse,\\'loadList\\');',document.getElementById('ssdp-list0').options[document.getElementById('ssdp-list0').selectedIndex].value);\" class=\"btn btn-block btn-lg btn-success\" value=\"" + jsonResponse.LangSave + "\" type=\"button\">";
//             element.innerHTML += '<h3>' + jsonResponse.LangIf + '</h3> ' + option;
//             loadScenary(jsonResponse);
//             html("load-life-opt", "onclick");
//           }
//           if (type_val == 'scenary-test') {
//             var option = '';
//             option += '<select class="form-control" id="ssdp-list2" style="display:none"><option value="' + location.host + '">-</option></select>';
//             option += '<input type="hidden" id="hidden-val-then" value="1"><div id="new-then"></div>';
//             option += '<select class="form-control hidden" id="scenary-then2" style="width:50%;" onchange="loadCommandHelp(this.value,\'command-help.json\',\'command-help2\',\'scenary-othe2\');toggle(\'if-then2\',\'hidden\');"><option value=""></option></select>';
//             option += '<div id="if-then2" class="hidden"><div id="command-help2" class="alert alert-warning"></div><a href="#" id="scenary-othe-play2" class="btn btn-default" style="width:10%;float:right;" onclick="send_request(this, \'http://\'+document.getElementById(\'ssdp-list2\').options[document.getElementById(\'ssdp-list2\').selectedIndex].value+\'/cmd?command=\'+document.getElementById(\'scenary-then2\').options[document.getElementById(\'scenary-then2\').selectedIndex].value+\' \'+document.getElementById(\'scenary-othe2\').value.replace(/&/g,\'%26\'),\'\');return false"><i class="eye-img"></i></a><input class="form-control" style="width:90%" placeholder="Действие" id="scenary-othe2" type="text"></div>';
//             element.innerHTML += '<h4 style="float:left;">Module:</h4> ' + option;
//             setTimeout("loadCommand('" + location.host + "','command.json','scenary-then2');toggle('scenary-then2','hidden');", 500);
//           }
//           if (type_val == 'login') {
//             var option = '';
//             option += '<h2>' + jsonResponse.LangAuthorization + '</h2><div class="alert alert-warning" style="width:45%;float:right;">' + renameBlock(jsonResponse, obj.title) + '</div>';
//             option += '<input id="passLogin" class="form-control " style="width:50%;display:inline" placeholder="' + jsonResponse.LangPass + '" value="" onfocus="this.type=\'text\'" type="password">';
//             option += '<a class="btn btn-block btn-success" style="width:50%;display:block" href="#" onclick="if(\'' + state_val + '\'==val(\'passLogin\')){sessionStorage.setItem(\'sossionLogin\', \'hidden\');toggle(\'loginForm\');}else{alert(\'The password is incorrect\')}">' + jsonResponse.LangSave + '</a>';
//             element.innerHTML += '<div id="loginForm" class="' + jsonResponse.sossionLogin + '" style="background-color:#fff;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;padding:10% 30%;">' + option + '</div>';
//           }
//           if (type_val == 'wifi') {
//             element.innerHTML += '<div class="btn-group btn-block" id="ssid-group"><a href="#" class="btn btn-default btn-block dropdown-toggle" onclick="toggle(\'ssid-select\');loadWifi(\'ssid-select\',\'' + name_val + '\');return false"><span id="ssid-name">' + state_val + '<\/span> <span class="caret"><\/span><\/a><ul class="dropdown-menu hidden" id="ssid-select"><li><a href="#">' + jsonResponse.LangLoading + '<\/a><\/li><\/ul><\/div>';
//             element.innerHTML += '<input id="' + name_val + '" value="' + state_val + '" class="form-control hidden ' + class_val + '" ' + style_val + ' ' + pattern_val + ' placeholder="' + renameBlock(jsonResponse, obj.title) + '">';
//           }
//           if (type_val == 'time' && typeof jsonResponse.time !== "undefined") {
//             element.innerHTML += '<h2 id="' + name_val + '" ' + style_val + '>' + renameBlock(jsonResponse, obj.title) + ' <strong id="time" class="' + class_val + '">' + state_val + '<\/strong><\/h2>';
//             clearTimeout(set_real_time);
//             var res = jsonResponse.time.split(":");
//             real_time(hours = res[0], min = res[1], sec = res[2]);
//           }
//           if (type_val == 'rgb') {
//             element.innerHTML += '<div class="' + name_val + '-thumb ' + class_val + '"><div class="' + name_val + '-preview"><\/div><img alt="" ' + style_val + ' src="' + renameBlock(jsonResponse, obj.title) + '"><\/div><canvas id="' + name_val + '-cs" style="display:none"><\/canvas>';
//             element.innerHTML += '<input id="' + name_val + '" value="' + state_val + '" class="form-control hidden">';
//             setTimeout("createRGB('" + name_val + "', '" + obj.action + "','" + module_val + "','" + response_val + "')", 500);
//           }
//           if (type_val == 'issues') {
//             element.innerHTML += '<div id="issues-list" class="' + class_val + '" ' + style_val + '><center><span class="loader"></span>' + jsonResponse.LangLoading + '</center><\/div>';
//             setTimeout("loadIssues('tretyakovsa/Sonoff_WiFi_switch'," + (state_val) + ");", 1500);
//           }
//           if (type_val == 'commits') {
//             element.innerHTML += '<div id="commits-list" class="' + class_val + '" ' + style_val + '><center><span class="loader"></span>' + jsonResponse.LangLoading + '</center><\/div>';
//             setTimeout("loadCommits('tretyakovsa/Sonoff_WiFi_switch'," + (state_val) + ");", 1500);
//           }
//           if (type_val == 'dev') {
//             var option = '<div id="' + name_val + '" class="' + class_val + '" ' + style_val + '><a href="/help.htm" target="_blank" class="close"><i class="help-img"><\/i><\/a>' + renameBlock(jsonResponse, obj.title) + '<span id="dev-update" class="hidden"><a href="/edit" class="btn btn-primary" target="_blank">File manager<\/a> <a href="/page.htm?starting" class="btn btn-primary">Starting log<\/a> <a href="/page.htm?debug" class="btn btn-primary">Debug<\/a> ';
//             if (searchModule(jsonResponse.module, "upgrade")) {
//               option += ' <div class="btn-group"><a href="#" class="btn btn-danger dropdown-toggle" onclick="toggle(\'repos-all\');loadBuild(\'sonoff\',\'all\');return false">Upgrade <span class="caret"><\/span><\/a><ul class="dropdown-menu hidden" id="repos-all" style="min-width:350px"><li><a href="https://github.com/tretyakovsa/Sonoff_WiFi_switch/commits/master" style="text-align:right" target="_blank"><i class="help-img"><\/i> Github code history<\/a><ul id="sonoff-all" style="margin-right:20px"><li><a href="#">' + jsonResponse.LangLoading + '<\/a><\/li><\/ul><\/li><\/ul><\/div>';
//             }
//             option += '<br><b><a href="#" onclick="toggle(\'repos-bin\');return false">' + jsonResponse.LangOtheSetting + '<\/a><\/b><span id="repos-bin" class="hidden">';
//             option += '<form method="POST" action="/update" enctype="multipart/form-data"><div class="btn-group"><input type="file" class="btn btn-primary btn-xs" name="update" style="height:33px" accept=".bin"><input type="submit" class="btn btn-default btn-sm" value="Update build" onclick="this.value=\'' + jsonResponse.LangLoading + '\';" style="height:33px"><\/div><\/form><hr>';
//             option += jsonResponse.LangType + ': <div class="btn-group"><select class="btn btn-default btn-sx" onchange="send_request(this, \'/configs?set=\'+this.value,\'[[configs-edit-button]]\')"><option value="' + jsonResponse.configs + '">' + jsonResponse.configs + '<\/option><option value="sonoff-rf">Sonoff-rf / Sonoff / Wi-Fi Smart socket<\/option><option value="sonoff-pow">Sonoff-Pow<\/option><option value="rgb">RGB (WS2811/WS2812/NeoPixel LEDs)<\/option><option value="jalousie">Jalousie<\/option><option value="smart-room">Smart-Room<\/option><option value="5v-wifi-relay">5v WiFi Relay<\/option><option value="manually">Manually</option></select> <a href="/page.htm?configs&' + jsonResponse.configs.toLowerCase() + '" id="configs-edit-button" class="btn btn-primary">Edit<\/a><\/div>';
//             option += '<\/span><\/span><\/div>';
//             element.innerHTML += option;
//           }

//         }
//       }
//     }
//     i++;
//   }
// }


function send_request(submit, server, state) {
  var old_submit = submit.value;
  //submit.value = jsonResponse.LangLoading;
  ajax.get(server, {}, function (responses) {
    submit.value = old_submit;
    var element = document.getElementById('url-content');
    if (typeof (element) != 'undefined' && element != null) {
      element.innerHTML += '<li><span class="label label-warning">GET</span> <a href="' + server + '" class="btn btn-link" style="text-transform:none;text-align:left;white-space:normal;display:inline">' + server + '</a> <span class="label label-' + (responses == 'FileNotFound' ? 'danger' : 'default') + '">' + (responses == 'FileNotFound' ? 'File Not Found' : '200 OK') + '</span></li>';
    }
    var ddnsUrl1 = document.getElementById('ddns-url1');
    if (typeof (ddnsUrl1) != 'undefined' && ddnsUrl1 != null) {
      ddnsUrl1.innerHTML = '<a href="http://' + location.hostname + '/' + server + '">http://' + location.hostname + '/' + server + '</a>';
    }
    var ddnsUrl2 = document.getElementById('ddns-url2');
    if (typeof (ddnsUrl2) != 'undefined' && ddnsUrl2 != null && jsonResponse.ddnsName) {
      ddnsUrl2.innerHTML = '<a href="http://' + jsonResponse.ddnsName + ':' + jsonResponse.ddnsPort + '/' + server + '">http://' + jsonResponse.ddnsName + ':' + jsonResponse.ddnsPort + '/' + server + '</a>';
    }
    if (state != '' && state != null && state != 'undefined') {
      var block = state.split(',');
      for (var i = 0; i < block.length; i++) {
        if (block[i].slice(0, 2) != '[[') {
          window.location = block[i];
        } else {
          var response = JSON.parse(responses);
          var htmlblock = document.getElementById(block[i].slice(2, -2));
          if (response.class && response.class != 'undefined') { htmlblock.className = response.class; }
          if (response.style && response.style != 'undefined') { htmlblock.style = response.style; }
          if (response.title && response.title != 'undefined') {
            if (htmlblock.tagName == 'INPUT') {
              htmlblock.value = renameBlock(jsonResponse, response.title);
            }
            if (htmlblock.tagName == 'SELECT') {
              var option = '';
              jsonSelect = response.title;
              for (var key in jsonSelect) {
                option += '<option value="' + renameBlock(jsonResponse, key) + '">' + renameBlock(jsonResponse, jsonSelect[key]) + '<\/option>';
              }
              htmlblock.innerHTML = option;
            }
            if (htmlblock.tagName == 'DIV' || htmlblock.tagName == 'A' || htmlblock.tagName == 'H1' || htmlblock.tagName == 'H2' || htmlblock.tagName == 'H3' || htmlblock.tagName == 'H4' || htmlblock.tagName == 'H5' || htmlblock.tagName == 'H6') { htmlblock.innerHTML = renameBlock(jsonResponse, response.title); }
          }
          if (htmlblock.tagName == 'TABLE' && response.state) {
            loadTable(response.state, response.title);
          }
          if (htmlblock.tagName == 'A' && response.action) {
            htmlblock.href = response.action;
          }
          if (typeof (element) != 'undefined' && element != null) {
            element.innerHTML += '<li class="alert alert-info" style="margin:5px 0;"><a href="#' + block[i].slice(2, -2) + '" class="label label-success">' + block[i] + '</a> ' + responses.replace(/</g, '&lt;') + '</li>';
          }
        }
      }
    } else {
      if (typeof (element) != 'undefined' && element != null) {
        element.innerHTML += '<li class="alert alert-info" style="margin:5px 0;">' + responses.replace(/</g, '&lt;') + '</li>';
      }
    }
    // load('next');
  }, true);
}

function pattern(str, id) {
  document.getElementById(id).setAttribute("pattern", "[" + (str == 'number' ? '0-9' : '0-9a-zA-Zа-яА-Яё:_. ') + "]{1,100}");
}

function loadTime(jsonResponse) {
  html('time-list', '<tr><td colspan="2"><center><span class="loader"></span>' + jsonResponse.LangLoading + '</center></td></tr>');
  ajax.get('/ssdp.list.json?' + Math.random(), {}, function (response) {
    var option = '';
    var ipDevice = sortObject(JSON.parse(response));
    for (var i in ipDevice) {
      loadDeviceTime(jsonResponse, i, ipDevice[i]);
    }
    html('time-list', ' ');
  }, true);
}

function loadDeviceTime(jsonResponse, ssdp, ip) {
  //html('time-list', '<tr><td colspan="2"><center><span class="loader"></span>'+jsonResponse.LangLoading+'</center></td></tr>');
  ajax.get('http://' + ip + '/timer.save.json?' + Math.random(), {}, function (response) {
    var options = '';
    var timeDevice = JSON.parse(response);
    for (var i in timeDevice['timer']) {
      var day_view = timeDevice['timer'][i].day.split("");
      var day_view_add = '';
      for (var y in day_view) {
        if (y == 0 && day_view[y] == 1) { day_view_add += ' <span class="label label-danger">' + jsonResponse.LangSun + '</span> '; }
        if (y == 1 && day_view[y] == 1) { day_view_add += ' <span class="label label-info">' + jsonResponse.LangMon + '</span> '; }
        if (y == 2 && day_view[y] == 1) { day_view_add += ' <span class="label label-info">' + jsonResponse.LangTue + '</span> '; }
        if (y == 3 && day_view[y] == 1) { day_view_add += ' <span class="label label-info">' + jsonResponse.LangWed + '</span> '; }
        if (y == 4 && day_view[y] == 1) { day_view_add += ' <span class="label label-info">' + jsonResponse.LangThu + '</span> '; }
        if (y == 5 && day_view[y] == 1) { day_view_add += ' <span class="label label-info">' + jsonResponse.LangFri + '</span> '; }
        if (y == 6 && day_view[y] == 1) { day_view_add += ' <span class="label label-danger">' + jsonResponse.LangSat + '</span> '; }
      }
      options += '<tr><td><span class="label label-default"><i class="clock-new-img"></i> ' + timeDevice['timer'][i].time1 + '</span></td><td>' + day_view_add + '</td><td>' + timeDevice['timer'][i].com1 + '</td><td><a class="btn btn-sm btn-danger" style="float:right;" href="#" onclick="if(confirm(\'' + jsonResponse.LangDel + '?\')){deleteTimer(\'' + i + '\',\'' + ip + '\');}return false"><i class="del-img"></i> <span class="hidden-xs">' + jsonResponse.LangDel + '</span></a></td><tr>';
    }
    document.getElementById("time-list").innerHTML += '<tr><td colspan="2"><h4><a href="http://' + ip + '">' + ssdp + '</a> <a href="http://' + ip + '/scenary.save.txt?download=true" download="" title="' + jsonResponse.LangCloudPC + '"><i class="download-img" style="opacity:0.2"><\/i><\/a></h4></td></tr><tr><td><b>' + jsonResponse.LangTime4 + '</b></td><td><b>' + jsonResponse.LangDay + '</b></td><td><b>command</b></td><td></td></tr>' + options;
  }, true);
}

function loadJson(file, setDelay, jsonResponse) {
  function setLoad() {
    ajax.get(file + '?' + Math.random(), {}, function (response) {
      html('json-' + file.replace(/[^a-z0-9]/gi, '-'), ' ');
      jsonPage = JSON.parse(response);
      viewTemplate(jsonPage, jsonResponse);
    }, true);
  };
  if (!isNaN(setDelay)) {
    var valTime;
    clearInterval(valTime);
    valTime = setInterval(function () { setLoad(); }, setDelay);
  } else {
    setLoad();
  }
}

function renameGet(str) {
  if (str) {
    var arr = str.match(/\[\[\S+?\]\]/gim);
    if (arr) {
      for (var i = 0; i < arr.length; i++) {
        var id = arr[i].slice(2, -2);
        var element = document.getElementById(id);
        if (element) {
          var txt = '';
          if (element.tagName == 'SELECT') {
            txt = element.options[element.selectedIndex].value;
          }
          else if (element.tagName == 'INPUT') {
            txt = encodeURIComponent(element.value);
          } else {
            txt = element.innerHTML;
          }
          str = str.replace(new RegExp('\\[\\[' + id + '\\]\\]', 'g'), txt);
        }
      }
    }
  }
  return str;
}