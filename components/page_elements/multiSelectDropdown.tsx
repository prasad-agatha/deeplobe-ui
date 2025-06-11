import React, { useEffect } from "react";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const MultiSelectDropdown = ({
  options,
  selectedOptions,
  setSelectedOptions,
  setFieldValue,
  from,
}) => {
  useEffect(() => {
    setTimeout(function () {
      let optList = document.getElementsByClassName("css-1qprcsu-option");
      // debugger;
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
    if (options.length === 0) {
      return `${placeholderButtonLabel}: ${value.length} selected`;
    } else if (value.length === options.length) {
      return `${placeholderButtonLabel}: All`;
    } else {
      return `${placeholderButtonLabel}: ${value.length} selected`;
    }
    // if (value && value.some((o) => o.value === "*")) {
    //   return `${placeholderButtonLabel}: All`;
    // } else {
    //   return `${placeholderButtonLabel}: ${value.length} selected`;
    // }
  }

  function onChange(value, event) {
    let temp;
    if (event.action === "deselect-option") {
      temp = value.filter((o) => o.value !== "*");
      this.setState(value.filter((o) => o.value !== "*"));
    } else if (value.length === this.options.length) {
      temp = this.options;
      this.setState(this.options);
    } else {
      temp = value;
      this.setState(value);
    }
    if (from === "INTERESTED IN") {
      setFieldValue("interestedIn", temp);
    } else {
      setSelectedOptions(temp);
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
      //   opacity: 0.65,
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "#EDF2F7",
      borderRadius: 5,
      padding: 8,
      textAlign: "start",
      textTransform: "capitalize",
      border: "none",
      color: "grey",
    }),
  };

  return (
    <div id="multiSelectDropdown">
      <ReactMultiSelectCheckboxes
        className="w-100"
        style={{ width: "100%" }}
        options={[...options]}
        styles={customStyles}
        placeholderButtonLabel="Models"
        getDropdownButtonLabel={getDropdownButtonLabel}
        value={selectedOptions}
        onChange={onChange}
        setState={setSelectedOptions}
      />
    </div>
  );
};

export default MultiSelectDropdown;
