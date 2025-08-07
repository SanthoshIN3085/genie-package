import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _get from "lodash/get";

import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";

const loadingPanel = (
  <div className="k-loading-mask">
    <span className="k-loading-text">Loading</span>
    <div className="k-loading-image"></div>
    <div className="k-loading-color"></div>
  </div>
);

import {
  ColumnMenuCheckboxFilter,
  ColumnMenu,
  isColumnActive,
  PAGER_CONFIG,
  INITIAL_CONFIG,
  userDataState,
} from "./constants";

const KendoGrid = ({
  data,
  column = [],
  settings,
  scrollable = "none",
  pageable = true,
  isListTable = true,
  noBoxShadow = false,
  isDataStateRequired = false,
  onDataStateChange = () => {},
  loading = false,
  config,
  rowRender,
  customSettingsClassName = "",
}) => {
  const [pageUser, setPageUser] = useState([]);
  const [pageuserGrid, setPageUserGrid] = useState(
    config ? config : INITIAL_CONFIG
  );
  const scrollSettings =
    scrollable == "none" ? "gen-kendo-fixed-grid" : "gen-kendo-scrollable-grid";
  const pageConfig = _get(settings, "total", 0) > 5 ? PAGER_CONFIG : false;
  const pageableSettings = pageable ? pageConfig : false;
  useEffect(() => {
    const filterIcon = document.getElementsByClassName("k-i-more-vertical");
    [...filterIcon].forEach((x) => {
      const element = [...x.classList];
      if (!element.includes("icon-gen-filter-mini")) {
        x.className += " icon-gen-filter-mini icon-xs";
      }
    });
  }, []);

  React.useEffect(() => {
    if (isDataStateRequired) {
      setPageUser(data);
    } else {
      let {
        result,
        dataState: { skip, take },
      } = userDataState(pageuserGrid, data);
      setPageUser(result);
      setPageUserGrid({ skip, take });
    }
  }, [data]);

  const dataStateChange = async (event) => {
    let updatedState = userDataState(event.dataState, data);
    if (isDataStateRequired) {
      await onDataStateChange(event);
    } else {
      setPageUser(updatedState.result);
    }
    setPageUserGrid(updatedState.dataState);
  };

  const columnProps = React.useCallback(
    (field) => ({
      field: field,
      columnMenu: ColumnMenu,
      headerClassName: isColumnActive(field, pageuserGrid) ? "bg-alert" : "",
    }),
    [pageuserGrid]
  );

  return (
    <div
      className={`${
        isListTable ? "gen-kendo-grid-table" : "gen-kendo-list-table"
      } `}
    >
      {loading && loadingPanel}
      <Grid
        data={pageUser}
        rowRender={rowRender}
        onDataStateChange={dataStateChange}
        pageable={pageableSettings}
        scrollable={scrollable}
        className={`${noBoxShadow ? "no-box-shadow" : ""} ${scrollSettings} ${
          data.length > 5 ? "" : "mb0"
        } ${
          data.length === 0 ? "noDataAvailable" : ""
        } ${customSettingsClassName}`}
        {...pageuserGrid}
        {...settings}
      >
        {/* <GridNoRecords>
                    <genSkeletonTable text message={'No data available'} />
                </GridNoRecords> */}
        {/* filter Types ["text","numeric","boolean","date"]. */}
        {column?.map((column) => {
          return (
            <GridColumn
              key={column.field}
              {...column}
              {...columnProps(column.field)}
              columnMenu={
                column?.filter && column?.filter !== ""
                  ? (props) => {
                      if (column?.filter === "text") {
                        return ColumnMenuCheckboxFilter(props, data);
                      }
                      return ColumnMenu(props, data);
                    }
                  : ""
              }
            />
          );
        })}
      </Grid>
    </div>
  );
};


KendoGrid.propTypes = {
  data: PropTypes.array.isRequired,
  column: PropTypes.array,
  settings: PropTypes.object,
  filter: PropTypes.string,
  isListTable: PropTypes.bool,
  noBoxShadow: PropTypes.bool,
  onDataStateChange: PropTypes.func,
  isDataStateRequired: PropTypes.bool,
  loading: PropTypes.bool,
};

export default KendoGrid;
