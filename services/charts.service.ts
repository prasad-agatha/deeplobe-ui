import APIService from "./api.service";

class ChartService extends APIService {
  circular_chart(data): Promise<any> {
    return this.post(`circular_chart_api_statistics_by_time_period/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  get_linechart_data(data): Promise<any> {
    return this.post(`line_chart_api_statistics_by_time_period/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  metric_logs(data?): Promise<any> {
    return this.post(`api_metrics_logs/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
}

export default ChartService;
