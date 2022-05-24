//'use strict';

// const idInfo = {
//   InfLanguage: "iL",
//   InfNumDevice: "iN",
//   InfPower: "iP",
//   InfComment: "iC",
//   InfSteps: "iS",
//   InfDateProduction: "iDP",
//   InfDateSoft: "iDS"
// }
const MODE = {
  MODE_OFF: 0,
  MODE_RUN: 1,
  MODE_WAIT_START: 2,
  MODE_START: 3,
  MODE_PAUSE: 4,
  MODE_RESTART: 5
}

var days;
var hours;
var minutes;
var seconds;

var historyCountRec = 0;
var historySelectRec = 0;

// const idStep = [
//   "st1",
//   "st2",
//   "st3",
//   "st4",
//   "st5",
//   "st6",
//   "st7",
//   "st8",
//   "st9"
// ]
// let strInfo = [
//   "iL",
//   "iN",
//   "iP",
//   "iC",
//   "iS",
//   "iD"
// ]

var isConnected = false;
var isPageInfo = false;
var timerId;
var mode = 0;

const trans = {
  BLE: 0,
  SERIAL: 1,
}// });

let transport = trans.BLE; selConnect;

createInputChart();


$(document).ready(function () {
  $("body").css("-webkit-touch-callout", "none");
  $("body").css("-webkit-user-select", "none");
  $("body").css("-moz-user-select", "none");
  $("body").css("-ms-user-select", "none");
  $("body").css("-o-user-select", "none");
  $("body").css("user-select", "none");

  // $('.navbar .dropdown').hover(function() {
  //   $(this).find('.dropdown-menu').first().stop(true, true).slideDown(150);
  // }, function() {
  //   $(this).find('.dropdown-menu').first().stop(true, true).slideUp(105)
  // });


  // let wh = $(window).width();
  // $("#vUi").html(wh);
  // let h = $(window).height();
  // $("#vUo").html(h);

  // $(window).on('resize', function () {
  //   let wh = $(window).width();
  //   $("#vUi").html(wh);
  //   let h = $(window).height();
  //   $("#vUo").html(h);


  let connectButton = document.getElementById('connectBLE');

  // Подключение к устройству при нажатии на кнопку Connect
  connectButton.addEventListener('click', function () {
    if (transport === trans.BLE)
      connectBluetooth();
    else
      connectSerial();
  });


  $('#selConnect').change(function () {
    if (this.checked)
      transport = trans.SERIAL;
    else
      transport = trans.BLE;
  });

  $('#mode').change(function () {
    let id = $(this).attr('id');
    // let vl = Number(this.checked);
    let js;

    if (this.checked) {
      if (mode === MODE.MODE_RUN) {
        $('#lbmode').text("Включить");
        sendJson(id, MODE.MODE_PAUSE);
        // js = "{" + id + ":" + MODE.MODE_PAUSE + "}";
        // send(js);
      }
      else
        this.checked = false;
    }
    else {
      $('#lbmode').text("Выключить");
      if (mode === MODE_PAUSE) {
        sendJson(id, MODE.MODE_RESTART);
        // js = "{" + id + ":" + MODE.MODE_RESTART + "}";
        // send(js);
      }
    }
  });



  $('#dfan').change(function () {
    let id = $(this).attr('id');
    let vl = Number(this.checked);
    sendJson(id, vl);
    // let js = "{" + id + ":" + vl + "}";
    // send(js);
  });




  $('#hClr').click(function () {
    let id = $(this).attr('id');
    // send(id);
    $('#bodyHistory').empty();
    historySelectRec = 0;
    // $('#history').click();
  });

  let timerSelect = null;
  var countSelect = 0;
  $('#selectSet').click(function () {
    if (isConnected) {
      if (timerSelect === null) {
        timerSelect = setTimeout(endTime, 3000);
      } else if (++countSelect === 3) {
        SubmitDisabledToggle();
        endTime();
      }
    }
  });

  function endTime() {
    countSelect = 0;
    clearTimeout(timerSelect);
    timerSelect = null; // (*)
  }


  $('input').bind('copy paste', function (e) {
    e.preventDefault();
  });
  $('input[type=number]').on('keydown', checkInputNumber);
  $('input[type=number]').on('change', changeInputNumber);
  $('input[name="set"]').change(function () {
    let id = $(this).attr('id');
    let vl = $(this).val();
    if (vl != "") {
      sendJson(id, vl);
      // let js = "{" + id + ":" + vl + "}";
      // send(js);
    }
  });
  $('input[type=date]').on('change', sendNewValue);

  $('input[type=date]').keypress(function (e) {
    $(this).off('change blur');

    $(this).blur(function () {
      sendNewValue(e);
    });

    if (e.keyCode === 13) {
      sendNewValue(e);
    }
  });

  $("#carouselContent").on('slide.bs.carousel', selectCarouselItem);

  $(".titlePage").click(function (e) {
    // let str = idInfo.InfComment;

    if (isConnected === false)
      return;
    let nm = $(this).attr('name');
    let id = '#page' + nm;
    if ($(id).length) {
      if ($(id).hasClass('d-none'))
        $(id).removeClass('d-none');
      send(nm);
    }
  });

  var pressTimer;

  $('.legendClick, .titlePage').on('mousedown touchstart', function () {
    $(".dropdown-content").each(function () {
      $(this).hide();
    });
    if (isConnected === false)
      return;

    let nm = '.' + $(this).attr('id');
    let el = $(nm);//.find(".dropdown-content");
    if (el.length) {
      pressTimer = window.setTimeout(function () {
        $(el[0]).show();
      }, 1000)
    }
  });

  $('.legendClick, .titlePage').on('mouseup touchend', function () {
    window.clearTimeout(pressTimer); //clear time on mouseup
  });



  window.onclick = function (event) {
    $(".dropdown-content").each(function () {
      if ($.contains(this, event.target))
        $(this).hide();
    });

    // if (document.getElementsByClassName('dropdown-content')[0].contains(event.target)) {
    //   $(".dropdown-content").each(function () {
    //     $(this).hide();
    //   });
    // }
  }

  $('.legendClick, .clear').click(function (e) {
    if (isConnected === false)
      return;
    let id = $(this).attr('id');
    send(id);
  });

  // $('body').on('DOMSubtreeModified', '#vUi ,#vUo ,#vCr', function(){
  //   var dd=this.id;
  //   console.log('changed');
  // });
  // $("#vUi ,#vUo ,#vCr").change(function () {
  //   updateBufChart(this.id, this.innerText);
  // });

  $('#vUi ,#vUo ,#vCr').bind('DOMSubtreeModified', function () {
    if (this.innerText === '')
      return;
    updateBufChart(this.id, this.innerText);
    $(".vizm").each(function () {
      if ($(this).hasClass('d-none'))
        $(this).removeClass('d-none');
    });

  });
  // $('.vizm').bind('DOMSubtreeModified', function () {
  //   if ($(".vStr").hasClass('d-none') === false)
  //     $(".vStr").addClass('d-none');
  //   $(".vizm").each(function () {
  //     if ($(this).hasClass('d-none'))
  //       $(this).removeClass('d-none');
  //   });
  // });


  // $('#vSt').bind('DOMSubtreeModified', function () {
  //   let tkey = Number(this.innerText);
  //   let strOut = "";

  //   if (tkey) {
  //     let str = State[tkey];
  //     if (str)
  //       strOut = str;
  //   }
  //   document.getElementById('strState').innerHTML = strOut
  // });

  $('#pDev').bind('DOMSubtreeModified', function () {
    let time = Number($('#pDev').text());
    var sam = new Date();
    sam.setTime(time * 1000);
  });

  $('#hRec').bind('DOMSubtreeModified', function () {
    if ($('#hRec').text() == "")
      return;
    historyCountRec = Number($('#hRec').text());
    if (historyCountRec > 0) {
      if ($('#hClr').hasClass('d-none'))
        $('#hClr').removeClass('d-none');

      $("[name='hRec']").each(function () {
        if ($(this).hasClass('d-none'))
          $(this).removeClass('d-none');
      });
      let rc = historyCountRec - historySelectRec;
      if (rc > 0) {
        // historySelectRec++;
        sendJson('hRec', rc);
        //send("{hRec:" + rc + "}");
      }
    }
    else {
      historySelectRec = 0;
      if ($('#hClr').hasClass('d-none') == false)
        $('#hClr').addClass('d-none');
      $("[name='hRec']").each(function () {
        if ($(this).hasClass('d-none') == false)
          $(this).addClass('d-none');
      });
    }

  });

});

$('#dkey, #iS').change(function () {
  let id = $(this).attr('id');
  let vl = $(this).val();
  if (vl != "") {
    sendJson(id, vl);
    // let js = "{\"" + id + "\":" + vl + "}";
    // send(js);
  }
});

let downKeys = {}; // the set of keys currently down
document.onkeyup = function (e) {
  downKeys[e.key] = false;
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
  downKeys[evtobj.key] = true;
  if (downKeys['2'] && downKeys['5']) {
    SubmitDisabledToggle();
  }
  if (charCode === 'm' && evtobj.ctrlKey) {
    SubmitDisabledToggle();
  }

}

let jsSend = "";
function sendJson(id, vl) {
  jsSend = "{\"" + id + "\":" + vl + "}";
  send(jsSend);
}


// Отправить данные подключенному устройству
function send(data) {
  clearTimeout(timerId);
  data = String(data);

  if (!data) {
    return;
  }
  data += '\r';
  data += '\n';

  var dat = 'TX: ' + data;
  log(dat, 'out');

  if (transport === trans.BLE)
    sendBluetooth(data);
  else
    sendSerial(data);
  timerId = setTimeout(requestIzm, 500);
}

/* функция добавления ведущих нулей */
/* (если число меньше десяти, перед числом добавляем ноль) */
function zero_first_format(value) {
  if (value < 10) {
    value = '0' + value;
  }
  return value;
}


function sendTime() {
  var NumericValue = parseInt(new Date().getTime() / 1000);//// milliseconds since Jan 1, 1970, 00:00:00.000 GMT
  sendJson('tm', NumericValue);
  // let js = "{tm:" + NumericValue + "}";
  // send(js);
}

/* функция получения текущей даты и времени */
// Результат:
// 05.06.2021 21:34:24
function date_time() {
  var current_datetime = new Date();
  var day = zero_first_format(current_datetime.getDate());
  var month = zero_first_format(current_datetime.getMonth() + 1);
  var year = current_datetime.getFullYear();
  var hours = zero_first_format(current_datetime.getHours());
  var minutes = zero_first_format(current_datetime.getMinutes());
  var seconds = zero_first_format(current_datetime.getSeconds());

  return day + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds;
}

function sendNewValue(e) {
  let id = e.target.id;
  let vl = e.target.value;
  if (vl != "") {
    sendJson(id, vl);
    // let js = "{" + id + ":" + vl + "}";
    // send(js);
  }
}

function changeInputNumber(e) {
  let vl = e.target.validity;
  var validity = e.target.checkValidity();
  let value = e.target.value;
}

function requestPage(rq) {
  if (isConnected === false)
    return;
  let id = '#page' + rq
  if ($(id).length) {
    searchLegend(id);
    if ($(id).hasClass('d-none')) {
      $(id).removeClass('d-none');
      send(rq);
    }
  } //else
  //   searchLegend(rd);
}

function searchLegend(id) {
  $(id + '> fieldset').each(function () {
    $(this).children('.legendClick').each(function () {
      $(this).click();
    });
  });
}


function checkInputNumber(event) {
  let key = event.key;
  if (key === "Backspace" || key === "Delete") {
    return true;
  }

  let value = event.target.value;
  if (value === "0") {
    if (key === "0" || key != ".")
      event.preventDefault();
  }
  let new_value = Number(value + key);
  let max = Number(event.target.max);
  if ($(event.target).hasClass('integer')) {
    if (new_value === 0) {
      event.preventDefault();
    }
    var regex = /[0-9]/;
  }
  else {
    if (value > 0 & event.target.validity.valid === false)
      event.preventDefault();
    // var regex = /[0-9.]/;
    var regex = /^\d*[.]?\d*$/;
  }
  if (!regex.test(key) || new_value > max) {
    event.preventDefault();
  }

}

function selectCarouselItem(e) {
  // if (isConnected) {
  var id = e.relatedTarget.id;
  requestPage(id);
  // }

}

let cn = 0;

function requestIzm() {

  if (jsSend.length === 0) {
    send("vizm");
    cn = 0;
  } else {
    send(jsSend);
    if (++cn > 3)
      jsSend = "";
  }

}

function StateConnect(state) {

  if (state && isConnected === false) {
    isConnected = true;
    sendTime();
    var id = $(".carousel-item , .active").attr('id');
    if (id)
      requestPage(id);
    $(".page").each(function () {
      // let id = this.id;
      if (this.id === "") {
        if ($(this).hasClass('d-none'))
          $(this).removeClass('d-none');
      }
    });

    document.getElementById("carousel-control").classList.remove("d-none");
    var lst = document.getElementsByClassName("nav-link");
    for (var i = 0; i < lst.length; i++) {

      lst[i].classList.remove("disabled");
    }
    document.getElementById("selConnect").setAttribute("disabled", "true");
    document.getElementById("connectBLE").classList.add("d-none");
    document.getElementById("disconnectBLE").classList.remove("d-none");

    timerId = setTimeout(requestIzm, 500);
    //createInputChart();
  }
  else if (state === false && isConnected) {
    clearTimeout(timerId);
    location.reload();
    return;
    isConnected = false;
    SubmitDisabled(true);
    $(".page").each(function () {
      // let id = this.id;
      if (this.id != "") {
        if ($(this).hasClass('d-none') === false)
          $(this).addClass('d-none');
      }
    });

    // document.getElementById("carIndicators").classList.add("d-none");
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

function SubmitDisabledToggle() {
  var element = document.getElementsByTagName("input");
  for (var i = 0; i < element.length; i++) {
    if (element[i].id != 'selConnect')
      element[i].disabled = !element[i].disabled;
    //  }
  }
  var element = document.getElementsByTagName("select");
  for (var i = 0; i < element.length; i++) {
    if (element[i].id != 'speed')
      element[i].disabled = !element[i].disabled;
    //  }
  }
}

function SubmitDisabled(request) {
  var element = document.getElementsByTagName("input");
  for (var i = 0; i < element.length; i++) {
    if (element[i].id != 'selConnect')
      element[i].disabled = request;
    //  }
  }
  var element = document.getElementsByTagName("select");
  for (var i = 0; i < element.length; i++) {
    if (element[i].id != 'speed')
      element[i].disabled = request;
    //  }
  }
}

function ParseTime(distance) {
  days = Math.floor(distance / (1000 * 60 * 60 * 24));
  hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  seconds = Math.floor((distance % (1000 * 60)) / 1000);
}

var tm500 = false;
var countRec = 0;
function timer500ms() {
  // document.getElementById("sm").style.visibility = 'hidden';
  //  $('#sm').toggle();
  if ($('#sm').css('visibility') == 'hidden')
    $('#sm').css('visibility', 'visible');
  else
    $('#sm').css('visibility', 'hidden');
  if (countRec > 0) {
    setTimeout(timer500ms, 1000);
    countRec--;
  }
  else
    $('#sm').css('visibility', 'hidden');

}


// Обработка полученных данных
function receiveData(data) {
  try {
    var jsonResponse = JSON.parse(data);
    if (jsSend.length > 0) {
      if (jsSend.localeCompare(data) === 0)
        jsSend = "";
    }
    if (countRec === 0) {
      setTimeout(timer500ms, 500);
    }
    countRec = 5;
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
          let inputs = document.getElementsByName(key);
          for (let i = 0; i < inputs.length; i++) { // проходим циклом по всем элементам 
            inputs[i].classList.remove('d-none');
          }
        } else {
          elem.innerText = jsonResponse[key];
          // var df = $("#vUi").text();
          // $("#vUi").text(df);
          // df = $("#vUo").text();
          // $("#vUo").text(df);
          // df = $("#vCr").text();
          // $("#vCr").text(df);
        }
      }
      else {
        if (key[0] === 'p') {
          let distance = jsonResponse[key] * 1000;
          // Time calculations for days, hours, minutes and seconds
          if (jsonResponse[key] >= 0)
            ParseTime(distance);

        }
        switch (key) {
          case "vMd": {
            mode = parseInt(jsonResponse[key]);
            if (mode === MODE.MODE_RUN) {
              if ($('.mode').css('visibility') == 'hidden')
                $('.mode').css('visibility', 'visible');
              document.getElementById('dSt').innerHTML = "Включен";
            }
            let tkey = Number(jsonResponse['vSt']);
            let strOut = "";
            if (jsonResponse['vDt'] > 0)
              strOut += (jsonResponse['vDt'] + " ");
            if (tkey) {
              let str = State[tkey];
              if (str)
                strOut += str;
            }
            document.getElementById('strState').innerHTML = strOut
          }
            break;
          case "pTot":
            if (jsonResponse[key] >= 0) {
              if (days > 0)
                //   let str=days+"d"+ hours+"h"+minutes+"m";
                $("#timeTotalWork").text(days + "d " + To2(hours) + ":" + To2(minutes));
              else
                $("#timeTotalWork").text(To2(hours) + ":" + To2(minutes));
            }
            else
              $("#timeTotalWork").text('-');
            break;
          case "pDev":

            break;
          case "pWrk":
            if (jsonResponse[key] >= 0) {
              if (days > 0)
                $("#timeWork").text(days + "d " + To2(hours) + ":" + To2(minutes));
              else
                $("#timeWork").text(To2(hours) + ":" + To2(minutes));
            }
            else
              $("#timeWork").text('-');
            break;

          case "hCnt":
            let cnt = $('#bodyHistory td:nth-child(1)').filter(function () {
              if ($(this).text() === jsonResponse['hCnt'].toString())
                return true;
            })
            if (cnt.length > 0)
              return;
            historySelectRec++;
            let dist = jsonResponse['hTm'] * 1000;
            ParseTime(dist);
            var container = document.getElementById("bodyHistory");
            var row = document.createElement("TR");

            // var td = document.createElement("TD");
            var td = '<td >' + jsonResponse['hCnt'] + '</td>';
            row.insertAdjacentHTML('beforeend', td);
            td = '<td>' + To2(hours) + ':' + To2(minutes) + '</td>';
            //td = '<td>' + To2(hours) + ':' + To2(minutes) + '</td>';
            row.insertAdjacentHTML('beforeend', td);

            let tkey = Number(jsonResponse['hSt']);
            let strOut = "";
            if (jsonResponse['hDt'] > 0)
              strOut += (jsonResponse['hDt'] + " ");
            if (tkey) {
              let str = State[tkey];
              if (str)
                strOut += str;
            }

            td = '<td>' + strOut + '</td>';//jsonResponse['hStr']
            row.insertAdjacentHTML('beforeend', td);
            container.appendChild(row);
            var d = $('#pagehistory');
            d.scrollTop(d.prop("scrollHeight"));
            // let str = '<div>' + ' ' + 'Запись : ' + " " + jsonResponse['hCnt'] + "  "
            //   + 'Время :' + " " + jsonResponse['hTm'] + "  " + 'Причина : ' + " " + jsonResponse['hStr'] + '</div>';
            // $('#terminalHistory').append(str);
            break;
        }

      }
    }
  }
  catch (e) {
    log(e);
  }
}

function To2(val) {
  return (val < 10 ? "0" + val : val);
}

const askUserToUpdate = reg => {
  return Modal.confirm({
    onOk: async () => {
      // вешаем обработчик изменения состояния
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // пропускаем ожидание 
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    },

    onCancel: () => {
      Modal.destroyAll();
    },
    icon: null,
    title: 'Хорошие новости 11! ? ',
    content:
      'Мы только что обновили версию приложения! Чтобы получить обновления, нажмите на кнопку ниже (страница перезагрузится)',
    cancelText: 'Не обновлять',
    okText: 'Обновить'
  });
};

// Install service worker - for offline support
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('serviceworker.js')
//     .then((reg) => {
//       if (reg.waiting) {
//         console.log('Reg waiting');
//         // оброботчик SW в ожидании
//         askUserToUpdate(reg);
//       }
//       // регистрация сработала
//       console.log('Registration succeeded. Scope is ' + reg.scope);
//     }).catch((error) => {
//       // регистрация прошла неудачно
//       console.log('Registration failed with ' + error);
//     });
// }
//createInputChart();

