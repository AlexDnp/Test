'use strict';

const idInfo = {
  InfLanguage: "iL",
  InfNumDevice: "iN",
  InfPower: "iP",
  InfComment: "iC",
  InfSteps: "iS",
  InfDateProduction: "iDP",
  InfDateSoft: "iDS"
}

var days;
var hours;
var minutes;
var seconds;

var historyCountRec = 0;
var historySelectRec = 0;

const idStep = [
  "st1",
  "st2",
  "st3",
  "st4",
  "st5",
  "st6",
  "st7",
  "st8",
  "st9"
]
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
let timerId;


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
  // });

  $('#dfan').change(function () {
    let id = $(this).attr('id');
    let vl = Number(this.checked);
    let js = "{" + id + ":" + vl + "}";
    send(js);
  });

  $('#dkey').change(function () {
    let id = $(this).attr('id');
    let vl = $(this).val();
    if (vl != "") {
      let js = "{" + id + ":" + vl + "}";
      send(js);
    }
  });

  $('#hClr').click(function () {
    let id = $(this).attr('id');
    send(id);
    $('#bodyHistory').empty();
    $('#history').click();
  });

  $('input').bind('copy paste', function (e) {
    e.preventDefault();
  });
  $('input[type=number]').on('keydown', checkInputNumber);
  $('input[type=number]').on('change', changeInputNumber);
  $('input[name="set"]').change(function () {
    let id = $(this).attr('id');
    let vl = $(this).val();
    if (vl != "") {
      let js = "{" + id + ":" + vl + "}";
      send(js);
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

  $('.vizm').bind('DOMSubtreeModified', function () {
    if ($(".vStr").hasClass('d-none') === false)
      $(".vStr").addClass('d-none');
    $(".vizm").each(function () {
      if ($(this).hasClass('d-none'))
        $(this).removeClass('d-none');
    });
  });


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
        send("{hRec:" + rc + "}");
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

/* функция добавления ведущих нулей */
/* (если число меньше десяти, перед числом добавляем ноль) */
function zero_first_format(value) {
  if (value < 10) {
    value = '0' + value;
  }
  return value;
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
    let js = "{" + id + ":" + vl + "}";
    send(js);
  }
}

function changeInputNumber(e) {
  let vl = e.target.validity;
  var validity = e.target.checkValidity();
  let value = e.target.value;
}

function requestPage(rq) {
  let id = '#page' + rq
  if ($(id).length) {
    if ($(id).hasClass('d-none')) {
      $(id).removeClass('d-none');
      send(rq);
    }
  }
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
  if (isConnected) {
    var id = e.relatedTarget.id;
    requestPage(id);
  }

}

function requestIzm() {
  send("dSt?");
  timerId = setTimeout(requestIzm, 500);
}

function StateConnect(state) {

  if (state && isConnected === false) {
    isConnected = true;
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

    document.getElementById("connectBLE").classList.add("d-none");
    document.getElementById("disconnectBLE").classList.remove("d-none");

    timerId = setTimeout(requestIzm, 500);

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
    //  if (element[i].type === 'button') {
    element[i].disabled = !element[i].disabled;
    //  }
  }
  var element = document.getElementsByTagName("select");
  for (var i = 0; i < element.length; i++) {
    //  if (element[i].type === 'button') {
    element[i].disabled = !element[i].disabled;
    //  }
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

function ParseTime(distance) {
  days = Math.floor(distance / (1000 * 60 * 60 * 24));
  hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  seconds = Math.floor((distance % (1000 * 60)) / 1000);
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
        let inputs = document.getElementsByName(key);
        for (let i = 0; i < inputs.length; i++) { // проходим циклом по всем элементам 
          inputs[i].classList.remove('d-none');
        }
      } else {
        elem.innerText = jsonResponse[key];
      }
    }
    else {
      switch (key) {
        case "pDev":
        case "pWrk":
          let distance = jsonResponse[key] * 1000;
          // Time calculations for days, hours, minutes and seconds
          ParseTime(distance);

          if (days > 0)
            //   let str=days+"d"+ hours+"h"+minutes+"m";
            $("#timeWork").text(days + "d" + hours + "h" + minutes + "m");
          else
            $("#timeWork").text(hours + "h" + minutes + "m");
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
          row.insertAdjacentHTML('beforeend', td);
          td = '<td>' + jsonResponse['hStr'] + '</td>';
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