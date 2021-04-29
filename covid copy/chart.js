var ctx = document.getElementById("myChart");

let config = {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: [],
    datasets: [
      {
        label: "Infected",
        backgroundColor: "rgb(255, 104, 104)",
        borderColor: "rgb(255, 104, 104)",
        data: [],
      },
      {
        label: "Susceptible",
        backgroundColor: "rgb(232, 230, 230)",
        borderColor: "rgb(232, 230, 230)",
        // backgroundColor: "rgb(7, 117, 2)", green
        // borderColor: "rgb(7, 117, 2)",
        data: [],
      },
      {
        label: "Immune",
        backgroundColor: "rgb(117, 0, 179)",
        borderColor: "rgb(117, 0, 179)",
        data: [],
      },
      {
        label: "Dead",
        backgroundColor: "rgb(18, 3, 43)",
        borderColor: "rgb(18, 3, 43)",
        data: [],
      },
    ],
  },

  // Configuration options go here
  options: {
    //responsive: false,
    legend: {
      labels: {
        // This more specific font property overrides the global property
        fontColor: "white",
      },
    },
    maintainAspectRatio: false,

    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            fontColor: "white",
          },

          // fontColor: "white",
          // color: "white",
        },
      ],
    },
    animation: {
      duration: 0, // general animation time
    },
    hover: {
      animationDuration: 0, // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0, // animation duration after a resize
    elements: {
      line: {
        tension: 0, // disables bezier curves
      },
      point: {
        radius: 0,
      },
    },
  },
};
var chart = new Chart(ctx, config);

// var dynamic_chart = chart;
// var ctx;

// // pass the chart that we want to clone as an object

// function myDynamicChart(chart) {
//   //destroy the previous chart in the canvas to avoid any overlapping

//   if (dynamic_chart != null) dynamic_chart.destroy();

//   //set the context jquery..
//   ctx = $("chart-container2");

//   //or set the conext by html which will be ctx= document.getElementById("myBarChart3");

//   //instantiate the chart
//   dynamic_chart = new Chart(ctx, {
//     type: chart.config.type,
//     data: chart.config.data,
//     options: chart.config.options,
//   });
// }
