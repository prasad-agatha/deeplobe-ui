import React, { useEffect } from "react";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const MultiSelectAll = ({ options, selectedOptions, setSelectedOptions }) => {
  useEffect(() => {
    // setSelectedOptions([{ label: "All", value: "*" }, ...options]);
    setTimeout(function () {
      let optList = document.getElementsByClassName("css-1qprcsu-option");
      debugger;
      for (let i = 0; i < optList.length; i++) {
        let item = optList[i];
        let index = i;
        addTitle(item, index);
      }
    }, 100);
  }, []);

  function addTitle(item, index) {
    let val = item.innerText;
    item.title = val;
  }
  function getDropdownButtonLabel({ placeholderButtonLabel, value }) {
    if (value && value.some((o) => o.value === "*")) {
      return `${placeholderButtonLabel}: All`;
    } else {
      return `${placeholderButtonLabel}: ${value.length} selected`;
    }
  }

  function onChange(value, event) {
    if (event.action === "select-option" && event.option.value === "*") {
      this.setState(this.options);
    } else if (event.action === "deselect-option" && event.option.value === "*") {
      this.setState([]);
    } else if (event.action === "deselect-option") {
      this.setState(value.filter((o) => o.value !== "*"));
    } else if (value.length === this.options.length - 1) {
      this.setState(this.options);
    } else {
      this.setState(value);
    }
  }

  const customStyles = {
    placeholder: (provided: any) => ({
      ...provided,
      width: "100%",
      fontSize: 14,
    }),
    menu: (base: any) => ({
      ...base,
      width: "100%",
    }),
    control: (base: any) => ({
      ...base,
      width: "100%",
      marginLeft: 0,
      marginRight: 0,
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      width: "100%",
    }),
    option: (base: any) => ({
      ...base,
      width: "100%",
      fontWeight: "normal !important",
      display: "flex",
      flexWrap: "nowrap",
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: 200,
      width: "100%",
    }),
    dropdownButton: () => ({
      width: "100%",
      fontSize: 14,
      opacity: 0.65,
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "white",
      borderRadius: 2,
      border: "1px solid #ced4da",
      padding: 8,
      textAlign: "start",
      textTransform: "capitalize",
    }),
  };

  return (
    <ReactMultiSelectCheckboxes
      options={[{ label: "All", value: "*" }, ...options]}
      styles={customStyles}
      placeholderButtonLabel="All Models"
      getDropdownButtonLabel={getDropdownButtonLabel}
      value={selectedOptions}
      onChange={onChange}
      setState={setSelectedOptions}
    />
  );
};

export default MultiSelectAll;
