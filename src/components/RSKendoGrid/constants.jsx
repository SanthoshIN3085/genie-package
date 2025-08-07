import * as React from "react";
import {
  GridColumnMenuFilter,
  GridColumnMenuCheckboxFilter,
  GridColumnMenuSort,
} from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";

export const ColumnMenuCheckboxFilter = (props, data) => {
  React.useEffect(() => {
    const popup = document.querySelector(".k-popup");
    if (popup) {
      popup.classList.add("genKendoFilterTable");
    }
  }, []);
  return (
    <div className="gen-kendo-grid-filter-menu genKendoFilterPopupCSS">
      <GridColumnMenuCheckboxFilter
        {...props}
        data={data}
        expanded={true}
        className="bbbb"
      />
    </div>
  );
};

export const PAGER_CONFIG = {
  info: false,
  pageSizes: [5, 10, 20, 50],
  previousNext: true,
  buttonCount: 4,
  className: "gen-kendo-pager",
};

export const INITIAL_CONFIG = {
  take: 5,
  skip: 0,
};

export const userDataState = (dataState, data) => {
  return {
    result: process(data.slice(0), dataState),
    dataState: dataState,
  };
};

export const ColumnMenu = (props) => {
  return (
    <div className="gen-kendo-grid-filter-menu genKendoFilterPopupCSS">
      <GridColumnMenuSort {...props} />
      <GridColumnMenuFilter {...props} expanded={true} />
    </div>
  );
};

export const isColumnActive = (field, dataState) => {
  // Check if filter is active for the field
  const hasFilter =
    dataState.filter &&
    dataState.filter.filters &&
    dataState.filter.filters.some((filter) => filter.field === field);

  // Check if sort is active for the field
  const hasSort =
    dataState.sort && dataState.sort.some((sort) => sort.field === field);

  return hasFilter || hasSort;
};
