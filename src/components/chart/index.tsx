import { useEffect } from "react";
// import MyWorker from "./worker.js?worker";
import Plotly from "plotly.js-dist-min";
import {
  ChartOptions,
  createChart,
  createOptionsChart,
  createYieldCurveChart,
  LineSeries,
} from "lightweight-charts";
import "./index.css";

interface IProps {
  id: string;
  top: number;
  left: number;
}

// 容器初始化
const layout = {
  title: "实时多维度数据监控",
  xaxis: {
    title: "时间戳",
    rangeslider: { visible: true }, // 启用时间滑块
    range: [Date.now() - 60000, Date.now()], // 初始显示最近60秒
  },
  yaxis: { title: "数值范围", fixedrange: false },
  showlegend: true,
  // plot_bgcolor: "#1f1f1f", // 暗色主题优化
  // paper_bgcolor: "#2d2d2d",
};

// 数据轨迹定义（三条不同属性的折线）
const traces = [
  {
    name: "温度(℃)",
    y: [],
    x: [],
    line: { color: "#FF5722" },
    range: [0, 50], // 温度波动范围
    // TODO 实测优化效果从 20ms>10ms，优化一半耗时
    // 数据量较小，还需要进一步验证
    // type: "scattergl", // 关键参数
    // mode: "lines",
  },
  {
    name: "湿度(%)",
    y: [],
    x: [],
    line: { color: "#2196F3" },
    range: [30, 80],
    // type: "scattergl", // 关键参数
    // mode: "lines",
  },
  {
    name: "压力(kPa)",
    y: [],
    x: [],
    line: { color: "#4CAF50" },
    range: [90, 110],
    // type: "scattergl", // 关键参数
    // mode: "lines",
  },
];

// 智能数据生成器（避免突变）
function generateValue(traceIndex) {
  const trace = traces[traceIndex];
  const lastValue =
    trace.y.length > 0
      ? trace.y[trace.y.length - 1]
      : Math.random() * (trace.range[1] - trace.range[0]) + trace.range[0];

  // 带约束的随机波动（最大±5%范围）
  const delta = (trace.range[1] - trace.range[0]) * 0.05;
  return Math.max(
    trace.range[0],
    Math.min(trace.range[1], lastValue + (Math.random() - 0.5) * delta * 2)
  );
}

export const ChartBlock = (props: IProps) => {
  const canvasId = "chart-canvas-" + props.id;

  useEffect(() => {
    // 启用WebGL渲染（性能关键[1](@ref)）
    Plotly.newPlot(canvasId, traces, layout, {
      scrollZoom: true,
      // plotGlPixelRatio: 2,
      doubleBuffer: true,
    });
    let isRendering = false;
    function updateChart() {
      if (isRendering) return;
      isRendering = true;
      const now = Date.now();
      // 生成各轨迹新数据点
      const updateData = {
        x: [[now], [now], [now]], // 三维数组结构
        y: [[generateValue(0)], [generateValue(1)], [generateValue(2)]],
      };
      // 执行增量更新（性能关键[1](@ref)）
      Plotly.extendTraces(canvasId, updateData, [0, 1, 2], 1000); // 保留1000个历史点
      // 动态调整时间轴范围
      if (traces[0].x.length % 10 === 0) {
        // 每10次更新调整一次
        Plotly.relayout(canvasId, {
          "xaxis.range": [now - 60000, now],
        });
      }
      isRendering = false;
    }
    // const traceType = Plotly.plotlyjs.getPlotly()._fullData[0].type;
    const plot = document.getElementById(canvasId);
    setInterval(() => {
      console.log("实际渲染类型:", plot._fullData[0].type);
      console.time("===draw");
      updateChart();
      console.timeEnd("===draw");
    }, 100);
  }, []);

  // useEffect(() => {
  //   const canvasDom = document.getElementById(canvasId)!;
  //   const chartOptions = {
  //     layout: {
  //       textColor: "black",
  //       background: { type: "solid", color: "white" },
  //     },
  //   };
  //   const chart = createOptionsChart(canvasDom, chartOptions);
  //   const lineSeries = chart.addSeries(LineSeries, { color: "#2962FF" });
  //   function mockData() {
  //     const data = [];
  //     for (let i = 0; i < 10000; i++) {
  //       data.push({
  //         time: i * 0.25,
  //         value: Math.sin(i / 100) + i / 500,
  //       });
  //     }
  //     return data;
  //   }
  //   lineSeries.setData(mockData());
  //   chart.timeScale().fitContent();
  //   setInterval(() => {
  //     const data = mockData();
  //     console.time("==draw");
  //     lineSeries.setData(data);
  //     console.timeEnd("==draw");
  //   }, 1000);
  // }, []);

  return (
    <div
      className={"chart-container"}
      style={{ top: props.top, left: props.left }}
      onMouseUp={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div id={canvasId} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};
