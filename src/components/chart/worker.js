import { Chart } from "chart.js/auto";

let chart;
let dataPoints = [];

self.onmessage = (e) => {
  switch (e.data.type) {
    case "init":
      initChart(e.data);
      break;
    case "data":
      addDataPoint(e.data);
      break;
    case "resize":
      resizeChart(e.data);
      break;
  }
};

function initChart({ canvas, width, height }) {
  chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "实时数据",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    // options: {
    //   animation: false, // 关闭动画
    //   responsive: false, // 关闭响应式
    //   maintainAspectRatio: false,
    //   scales: {
    //     x: {
    //       type: "time", // 时间轴
    //       time: {
    //         unit: "second",
    //       },
    //     },
    //   },
    // },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Chart.js Line Chart",
        },
      },
    },
  });
}

function addDataPoint({ value, timestamp }) {
  // 保持数据长度（示例保留最近100点）
  if (dataPoints.length >= 100) {
    dataPoints.shift();
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  dataPoints.push({ x: timestamp, y: value });
  chart.data.labels.push(new Date(timestamp).toISOString());
  chart.data.datasets[0].data.push(value);

  // 增量更新（避免全量重绘）
  chart.update("none"); // 参数 'none' 表示跳过动画
}

function resizeChart({ width, height }) {
  chart.canvas.width = width;
  chart.canvas.height = height;
  chart.resize(width, height);
}
