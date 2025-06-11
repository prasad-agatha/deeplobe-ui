import React from "react";
import { DateRangePicker, Stack } from "rsuite";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
const { allowedMaxDays, allowedDays, allowedRange, beforeToday, afterToday, combine } =
  DateRangePicker;

const predefinedRanges: any = [
  {
    label: "Today",
    value: [new Date(), new Date()],
    placement: "left",
  },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },

  {
    label: "Last 7 days",
    value: [subDays(new Date(), 6), new Date()],
    placement: "left",
  },
  {
    label: "Last 28 days",
    value: [subDays(new Date(), 27), new Date()],
    placement: "left",
  },
  {
    label: "Last 3 months",
    value: [new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date()],
    // value: [subDays(new Date(), 88), new Date()],
    placement: "left",
  },
  {
    label: "Last 6 months",
    value: [new Date(new Date().setMonth(new Date().getMonth() - 6)), new Date()],
    // value: [subDays(new Date(), 88), new Date()],
    placement: "left",
  },
];
const rangesForLinechart: any = [
  {
    label: "Last 7 days",
    value: [subDays(new Date(), 6), new Date()],
    placement: "auto",
  },
  {
    label: "Last 28 days",
    value: [subDays(new Date(), 27), new Date()],
    placement: "left",
  },
  {
    label: "Last 3 months",
    value: [new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date()],
    // value: [subDays(new Date(), 88), new Date()],
    placement: "left",
  },
  {
    label: "Last 6 months",
    value: [new Date(new Date().setMonth(new Date().getMonth() - 6)), new Date()],
    // value: [subDays(new Date(), 88), new Date()],
    placement: "left",
  },
];

export default function CustomDateRangePicker({ setFromDate, setToDate, chart_type }) {
  return (
    <Stack direction="column" spacing={8} alignItems="flex-start">
      <DateRangePicker
        shouldDisableDate={afterToday()}
        cleanable={false}
        defaultValue={[subDays(new Date(), 6), new Date()]}
        ranges={predefinedRanges}
        placeholder="Select Range"
        placement="autoVerticalEnd"
        onChange={(e) => {
          if (!e) {
            setFromDate(subDays(new Date(), 6));
            setToDate(new Date());
            return;
          } else {
            setFromDate(e[0]);
            setToDate(e[1]);
          }
        }}
      />
    </Stack>
  );
}
