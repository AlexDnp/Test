var UinputArray = [];
var UoutArray = [];
var CurArray = [];
var N = 30;
// for (i = 0; i < N; i++) {
//   UinputArray.push(0);
//   temArray.push(0);
// }

//var myVar = setInterval(loadChart, 60000);
//Chart.defaults.global.legend.labels.usePointStyle = true;


var InputChart;
function createInputChart() {
  var ctx = document.getElementById('inputChart').getContext('2d');
  ctx.backgroundColor = 'rgb(0, 153, 255)';
  InputChart = new Chart(ctx, {
    type: 'line',
    data: {
      //  labels: ['1', '2', '3', '4', '5', '6', '7'],
      datasets: [{
        label: 'Входное напряжение',
        yAxisID: 'A',
        data: UinputArray, // json value received used in method
        borderColor: '#158cba',
        backgroundColor: 'rgb(0, 153, 255)',
        borderWidth: 2,
        lineTension: 0,
        fill: false,
        pointRadius: 1,
        pointHoverRadius: 1
      },
      {
        label: 'Выходное напряжение',
        yAxisID: 'A',
        data: UoutArray, // json value received used in method
        borderColor: '#28b62c',
        borderWidth: 2,
        lineTension: 0,
        fill: false,
        pointRadius: 1,
        pointHoverRadius: 1
      },
      {
        label: 'Ток',
        yAxisID: 'B',
        data: CurArray, // json value received used in method
        borderColor: '#ff4136',
        borderWidth: 2,
        lineTension: 0,
        fill: false,
        pointRadius: 1,
        pointHoverRadius: 1
      },]
    },
    options: {
      animation : false,
      //  legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li class="chapter__item22" style=" color:red"><span style=" background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
      legend: {

        display: false,
        boxWidth: 1,
        //position: 'bottom',
        position: "bottom",
        // legendCallback: function(chart) {
        //   var text = [];
        //   text.push('<ul>');
        //   for (var i=0; i<chart.data.datasets.length; i++) {
        //     console.log(chart.data.datasets[i]); // see what's inside the obj.
        //     text.push('<li>');
        //     text.push('<span style="background-color:' + chart.data.datasets[i].borderColor + '">' + chart.data.datasets[i].label +1+ '</span>');
        //     text.push('</li>');
        //   }
        //   text.push('</ul>');
        //   return text.join("");
        // },
        labels: {
          // generateLabels: function (chart) {
          //   var data = chart.data;
          //   return Chart.helpers.isArray(data.datasets) ? data.datasets.map(function (dataset, i) {

          //     return {
          //       text: dataset.label + " : " + dataset.data[dataset.data.length - 1],
          //       // text: dataset.label + " (Max Value: " + Chart.helpers.max(dataset.data).toLocaleString() + ")",

          //       fillStyle: (!Chart.helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0]),
          //       hidden: !chart.isDatasetVisible(i),
          //       lineCap: dataset.borderCapStyle,
          //       lineDash: dataset.borderDash,
          //       lineDashOffset: dataset.borderDashOffset,
          //       lineJoin: dataset.borderJoinStyle,
          //       lineWidth: dataset.borderWidth,
          //       strokeStyle: dataset.borderColor,
          //       pointStyle: dataset.pointStyle,

          //       // Below is extra data used for toggling the datasets
          //       datasetIndex: i
          //     };
          //   }, this) : [];
          // },

        },
      },
      scales: {
        xAxes: [{
          display: true,

          ticks: {
            beginAtZero: true,
            steps: 1,
            stepValue: 1,
            suggestedMin: 1,
            suggestedMax: 30

          }
          // min: 10//,
          // maxTicksLimit: 80
        }],
        yAxes: [{
          id: 'B',
          display: true,
          position: 'right',         
          gridLines: {
            drawOnChartArea: false
        },
          ticks: {
            beginAtZero: true,
            fontColor: 'red',
            suggestedMax: 40
          }
        }, {
          id: 'A',
          display: true,
          ticks: {
            steps: 10,
            stepValue: 5,
            suggestedMin: 100,
            suggestedMax: 400

          }
        }],
      },
      tooltips: {
        mode: false,
        callbacks: {
          title: function () { },
          label: function () { }
        }
      }
    }
  }
  );
  myLegendContainer = document.getElementById('legend');
  myLegendContainer.innerHTML = InputChart.generateLegend();
  var legendItems = myLegendContainer.getElementsByTagName('li');
  for (var i = 0; i < legendItems.length; i += 1) {

    legendItems[i].style.color = InputChart.data.datasets[i].borderColor;
    legendItems[i].addEventListener("click", legendClickCallback, false);
  }
}


function updateBufChart(id, data) {
  var tmp = false;
  if (id == "vUi")
    var buf = UinputArray;
  else if (id == "vUo")
    var buf = UoutArray;
  else if (id == "vCr") {
    var buf = CurArray;
    tmp = true;
  }
  else
    return;

  if (buf.length > N - 1)
    buf.shift();

 // buf.push(Math.round(Math.random() * 100));
  buf.push(data);

  if (tmp)
    updateChart()
}

 async function updateChart() {
  if (InputChart.data.labels.length < N)
   InputChart.data.labels.push("");
   //  InputChart.data.labels.splice(-1, 1); // remove the label first
await InputChart.update();
}

function legendClickCallback(event) {
  event = event || window.event;

  var target = event.target || event.srcElement;
  while (target.nodeName !== 'LI') {
    target = target.parentElement;
  }
  var parent = target.parentElement;
  var chartId = parseInt(parent.classList[0].split("-")[0], 10);
  var chart = Chart.instances[chartId];
  var index = Array.prototype.slice.call(parent.children).indexOf(target);

  chart.legend.options.onClick.call(chart, event, chart.legend.legendItems[index]);
  if (chart.isDatasetVisible(index)) {
    target.classList.remove('line-through');
  } else {
    target.classList.add('line-through');
  }
 // $(this).toggleClass("line-through");
}