import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ChartService from "services/charts.service";
import "chart.js/auto";
import { preTrainedModelsData } from "common_functions/common_cards";
import { Doughnut } from "react-chartjs-2";

// import { Chart, ArcElement } from "chart.js";
// Chart.register(ArcElement);

const chartService = new ChartService();

export default function CircularChart({
  selected_days,
  setSelected_days,
  fromDate,
  toDate,
  ccSelectedModels,
  apiKeysModelsLength,
}) {
  const [loading, setLoading] = useState(false);
  const [chart_data, setChart_data] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });
  const [labelsData, setLabelsData] = useState([]);

  const getColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  };

  useEffect(() => {
    setLoading(true);
    if (selected_days === "CUSTOM") {
      if (fromDate && toDate) {
        let Smonth: any = new Date(fromDate).getMonth();
        parseInt(Smonth);
        Smonth = Smonth + 1;
        let Emonth: any = new Date(toDate).getMonth();
        parseInt(Emonth);
        Emonth = Emonth + 1;

        const fd =
          new Date(fromDate).getFullYear() + "-" + Smonth + "-" + new Date(fromDate).getDate();
        const td = new Date(toDate).getFullYear() + "-" + Emonth + "-" + new Date(toDate).getDate();
        const selcted_models = ccSelectedModels.map((ele) => {
          return ele.value;
        });
        const data = {
          time_period: selected_days,
          start_date: fd,
          end_date: td,
          models: selcted_models.length === apiKeysModelsLength ? ["ALL"] : selcted_models,
        };
        chartService
          .circular_chart(data)
          .then((res) => {
            const bgColors: any = [];
            const temp_array: any = [];
            res.labels.map((lebel) => {
              const bgcolor = getColor();
              bgColors.push(bgcolor);
              const temp = {
                label:
                  preTrainedModelsData.filter((ele) => {
                    return ele.value == lebel;
                  })?.[0]?.label || lebel,
                color: bgcolor,
              };
              temp_array.push(temp);
            });

            setLabelsData(temp_array);

            const data1 = {
              labels: res.labels,
              datasets: [
                {
                  label: "predictions",
                  data: res.data,
                  backgroundColor: bgColors,
                  borderColor: bgColors,
                  borderWidth: 1,
                },
              ],
            };
            setChart_data(data1);
            setLoading(false);
          })
          .catch((e) => {
            toast(e);
            setLoading(false);
          });
      }
    } else {
      const data = { time_period: selected_days };
      chartService
        .circular_chart(data)
        .then((res) => {
          const bgColors: any = [];
          const temp_array: any = [];
          res.labels.map((lebel, idx) => {
            const bgcolor = getColor();
            bgColors.push(bgcolor);
            const temp = {
              label: idx,
              color: bgcolor,
            };
            temp_array.push(temp);
          });

          setLabelsData(temp_array);

          const data1 = {
            labels: res.labels,
            datasets: [
              {
                label: "predictions",
                data: res.data,
                backgroundColor: bgColors,
                borderColor: bgColors,
                borderWidth: 1,
              },
            ],
          };
          setChart_data(data1);
          setLoading(false);
        })
        .catch((e) => {
          toast(e);
          setLoading(false);
        });
    }
  }, [selected_days, fromDate, toDate, ccSelectedModels]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <>
      <div className="mb-2 text-center h-100">
        {labelsData.length !== 0 ? (
          <>
            <div style={{ height: "250px", width: "250px" }} className="mx-auto">
              <Doughnut
                data={chart_data}
                options={options}
                height={250}
                width={250}
                className="p-3"
              />
            </div>{" "}
            <div
              style={{ height: "80px", overflowY: "auto" }}
              className="flex flex-wrap justify-content-center"
            >
              {labelsData?.map((data) => (
                <div className="flex flex-wrap gap-2 align-items-center me-3">
                  <div style={{ backgroundColor: data.color, width: "25px", height: "12px" }}></div>
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
    </>
  );
}
