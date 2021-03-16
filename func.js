const idInfo = {
  InfLanguage: "iL",
  InfNumDevice: "iN",
  InfPower: "iP",
  InfComment: "iC",
  InfSteps: "iS",
  InfDateProduction: "iDP",
  InfDateSoft: "iDS"
}

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
    let str = idInfo.InfComment;

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

  // $('legend[name=legendClick]').click(function (e) {
  //   let id = $(this).attr('id');
  //   send(id);
  // });

  $('.legendClick').click(function (e) {
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

  // $('#hRec').trigger("contentchanged");


  // $("#hRec").on("contentchanged", function () {
  //   let value = $('#hRec').text();
  //   if (Number($('#hRec').text()) > 0) {
  //     if ($('#hClr').hasClass('d-none'))
  //       $('#hClr').removeClass('d-none');
  //   }
  //   $("[name='hRec']").each(function () {
  //     if ($(this).hasClass('d-none'))
  //       $(this).removeClass('d-none');
  //   });
  // });

  $('#hRec').bind('DOMSubtreeModified', function () {
    let value = $('#hRec').text();
    if (Number($('#hRec').text()) > 0) {
      if ($('#hClr').hasClass('d-none'))
        $('#hClr').removeClass('d-none');
    }
    $("[name='hRec']").each(function () {
      if ($(this).hasClass('d-none'))
        $(this).removeClass('d-none');
    });
  });

});

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
    SubmitDisabledToggle();
  }
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
  send("vizm");
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

function ParseTime() {

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
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if(days>0)
       //   let str=days+"d"+ hours+"h"+minutes+"m";
          $("#timeWork").text(days+"d"+ hours+"h"+minutes+"m");
          else
          $("#timeWork").text(hours+"h"+minutes+"m");
          break;
      }

    }
  }
}

