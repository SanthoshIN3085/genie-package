import React from "react";
import _get from "lodash/get";
import PropTypes from "prop-types";

import { DropDownList } from "@progress/kendo-react-dropdowns";
import { get } from "lodash";
import { Controller } from "react-hook-form";
import { _isObject } from "../../Utils/index";

const RSKendoDropDownList = ({
  control,
  rules,
  name,
  defaultValue = "",
  data,
  textField,
  dataItemKey,
  filterable = false,
  filterChange = () => {},
  value,
  onChange,
  className = "",
  popupClass = "",
  required,
  handleChange = () => {},
  label,
  isError = true,
  itemRender = () => {},
  isCustomRender = false,
  rightAlign = false,
  noBottomBorder = false,
  ...rest
}) => {
  const total = data.length;
  const pageSize = 20;
  const isVirtialization = total > 50;

  const [state, setState] = React.useState({
    skip: 0,
    options: data?.length && data.slice(0, pageSize),
  });

  React.useEffect(() => {
    if (isVirtialization) {
      setState((prev) => ({
        options: data?.slice(0, pageSize),
        skip: prev.skip,
      }));
    }
  }, [data]);

  const onPageChange = (event) => {
    const skip = event.page.skip;
    const take = skip + event.page.take;
    const options = data?.slice(skip, take);
    setState({
      options,
      skip,
    });
  };

  const virtualization = {
    virtual: {
      total,
      pageSize,
      skip: state.skip,
    },
    onPageChange,
  };

  const customRender = (li, itemProps) => {
    const title = _isObject(itemProps.dataItem)
      ? _get(itemProps, `dataItem.${textField}`)
      : itemProps.dataItem;
    const props = {
      ...li.props,
      title,
    };
    const itemChildren = <span>{li.props.children}</span>;
    return React.cloneElement(li, props, itemChildren);
  };

  return (
    <Controller
      control={control}
      // rules={rules}
      defaultValue={defaultValue}
      name={name}
      render={({
        field: { onChange, ...restField },
        fieldState: { error },
      }) => {
        const _isEmpty = get(error, "message", "")?.length > 0;
        let errMsg = get(error, "message", "");
        return (
          <div
            className={`rs-kendo-dropdownmenu-wrapper ${className} ${
              _isEmpty ? "errorContainer" : ""
            } ${rightAlign ? "kendo-dd-right-align" : ""} ${
              noBottomBorder ? "kendo-dd-no-bottom-border" : ""
            } position-relative`}
          >
            {/* {_isEmpty && <div className="validation-message">{get(error, 'message', '')}</div>} */}
            <DropDownList
              className={`rs-kendo-dropdown ${
                required ? "rs-kendo-dropdown-required" : ""
              }`}
              data={isVirtialization ? state.options : data}
              label={_isEmpty && isError ? errMsg : label}
              textField={textField}
              dataItemKey={dataItemKey}
              filterable={filterable}
              onFilterChange={filterChange}
              onChange={(e) => {
                handleChange(e);
                onChange(e);
              }}
              popupSettings={{
                animate: true,
                popupClass: `${popupClass}`,
              }}
              itemRender={isCustomRender ? itemRender : customRender}
              // listNoDataRender={() => NoDataAvailableRender()}
              {...(data.length > 50 && virtualization)}
              {...restField}
              {...rest}
            />
          </div>
        );
      }}
    />
  );
};



RSKendoDropDownList.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
  popupClass: PropTypes.string,
  clearErrors: PropTypes.func,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
    PropTypes.oneOf([null, undefined]),
  ]),
  rules: PropTypes.object,
  setError: PropTypes.func,
  setValue: PropTypes.func,
  textField: PropTypes.string,
  dataItemKey: PropTypes.string,
  filterable: PropTypes.bool,
  filterChange: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  handleChange: PropTypes.func,
  isError: PropTypes.bool,
  isCustomRender: PropTypes.bool,
  itemRender: PropTypes.func,
  rightAlign: PropTypes.bool,
  noBottomBorder: PropTypes.bool,
};

export default React.memo(RSKendoDropDownList);

// For Icon update
// React.useEffect(() => {
//     const arrowIcon = document.getElementsByClassName('k-i-caret-alt-down');
//     [...arrowIcon].forEach((x) => {
//         const element = [...x.classList];
//         // if (!element.includes('icon-rs-caret-mini')) {
//         //     x.className += ' icon-rs-caret-mini';
//         // }
//     });
// }, []);
