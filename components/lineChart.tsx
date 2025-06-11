import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ChartService from "services/charts.service";
import React from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { preTrainedModelsData } from "common_functions/common_cards";

const chartService = new ChartService();

const LineChart = ({
  selected_days,
  setSelected_days,
  fromDate,
  toDate,
  ccSelectedModels,
  apiKeysModelsLength,
}) => {
  const [chart_data, setChart_data] = useState({
    labels: [],
    datasets: [],
  });

  const getColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  };

  useEffect(() => {
    let data;
    if (selected_days === "CUSTOM") {
      let Smonth: any = new Date(fromDate).getMonth();
      parseInt(Smonth);
      Smonth = Smonth + 1;
      let Emonth: any = new Date(toDate).getMonth();
      parseInt(Emonth);
      Emonth = Emonth + 1;
      const fd =
        new Date(fromDate).getFullYear() + "-" + Smonth + "-" + new Date(fromDate).getDate();
      const td = new Date(toDate).getFullYear() + "-" + Emonth + "-" + new Date(toDate).getDate();

      let diff_in_sec = new Date(toDate).getTime() - new Date(fromDate).getTime();
      let diff_in_days = Math.ceil(diff_in_sec / (1000 * 3600 * 24) + 1);
      let timeInterval: any = "";
      if (diff_in_days > 31) {
        timeInterval = "MONTHLY";
      } else {
        timeInterval = "DAILY";
      }
      const selcted_models = ccSelectedModels.map((ele) => {
        return ele.value;
      });
      data = {
        time_period: selected_days,
        time_interval: timeInterval,
        start_date: fd,
        end_date: td,
        models: selcted_models.length === apiKeysModelsLength ? ["ALL"] : selcted_models,
      };
    }

    chartService
      .get_linechart_data(data)
      .then((res) => {
        res.datasets.map((data) => {
          data.borderColor = getColor();
          data.tension = 0.1;
          data.fill = false;
          data.label = Number.isInteger(data.label)
            ? data.name
            : preTrainedModelsData.filter((ele) => {
                return ele.value === data.label;
              })?.[0]?.label || data.label;

          data.name = "";
          data.type = "";
        });

        const data1 = {
          labels: res.dates ? res.dates : res.months,
          datasets: res.datasets,
        };
        setChart_data(data1);
      })
      .catch((e) => toast(e));
  }, [selected_days, fromDate, toDate, ccSelectedModels]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      // title: {
      //   display: true,
      //   text: "Chart.js Line Chart",
      // },
    },
  };

  return (
    <div className="mb-2 text-center h-100">
      {chart_data.datasets.length !== 0 ? (
        <>
          <div style={{ height: "250px", width: "500px" }} className="mx-auto">
            <Line options={options} data={chart_data} />
          </div>
          <div
            style={{ height: "80px", overflowY: "auto" }}
            className="flex flex-wrap justify-content-center"
          >
            {chart_data.datasets?.map((data, idx) => (
              <div className="flex flex-wrap gap-2 align-items-center me-3" key={idx}>
                <div
                  style={{ backgroundColor: data.borderColor, width: "25px", height: "12px" }}
                ></div>
                <div className="font-12">{data.label}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-column justify-content-center h-100">
          <img src="/noactivityIcon.svg" height={120} />
          <div style={{ height: "80px", overflowY: "auto" }}>
            {" "}
            <p style={{ color: "#bdbdbd" }} className=" p-2 mb-0">
              No activity yet
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(LineChart);
