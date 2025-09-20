import { useRef, useEffect, useId } from "hono/jsx";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

export interface ChartPoint {
  x: Date;
  y: number;
}

export interface ObsChartProps {
  data: ChartPoint[];
  title: string;
  ymin?: number;
  ymax?: number;
}

export const ObsChart = (props: ObsChartProps) => {
  const chartId = useId();
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      new Chart(chartRef.current, {
        type: "line",
        data: {
          datasets: [
            {
              label: props.title,
              data: props.data,
              pointRadius: 0,
              tension: 0.25,
              borderColor: 'rgba(190, 190, 190, 0.8)',
              borderWidth: 1.5
            },
          ],
        },
        options: {
          animation: false,
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "hour",
              },
              grid: {
                color: "rgba(102, 102, 102, 0.2)",
              },
              ticks: {
                minRotation: 45,
                maxRotation: 45,
                color: 'rgba(170, 170, 170, 0.6)'
              },
            },
            y: {
              grid: {
                color: "rgba(102, 102, 102, 0.2)",
              },
              ticks: {
                color: 'rgba(170, 170, 170, 0.6)'
              },
              min: props.ymin,
              max: props.ymax,
            },
          },
          layout: {
            padding: {
              top: 0,
              right: 5,
              bottom: 5,
              left: 5,
            },
          },
          plugins: {
            title: {
              display: true,
              text: props.title,
              font: {
                size: 14,
                weight: "bold",
              },
              color: "rgba(170, 170, 170, 0.6)"
            },
            legend: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      const weatherChart = Chart.getChart(chartId);
      weatherChart?.destroy();
    };
  });

  return (
    <div class="col-12 col-md-6">
      <div class="card border shadow rounded-2 overflow-hidden h-100">
        <div class="card-body d-flex flex-column">
          <canvas ref={chartRef} id={chartId} style="flex: 1; min-height: 300px;" />
        </div>
      </div>
    </div>
  );
};
