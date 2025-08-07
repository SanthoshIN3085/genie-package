import React from "react";
import PropTypes from "prop-types";
import _findIndex from "lodash/findIndex";
import { Container, Row } from "react-bootstrap";
import { formatNumber } from "../../Utils";

import { BootstrapDropdown } from "Components/RSBootstrapDropDown";

const RSTabbarFluid = ({
  defaultTab = 0,
  callBack = () => {},
  componentClassname = "",
  tabData = [],
  activeClass = "",
  isReacher = false,
  ...props
}) => {
  const [selected, setSelected] = React.useState(defaultTab);
  const [tabs, setTabs] = React.useState([]);
  const [options, setOptions] = React.useState([]);

  const setSelectedIndex = (index) => {
    if (!tabs[index].disable) {
      setSelected(index);
      callBack(tabs[index], index);
    }
  };

  React.useLayoutEffect(() => {
    if (tabData.length > 7) {
      const tempTab = [...tabData];
      const remainingTabs = tempTab.splice(10, tempTab.length);
      const options = remainingTabs.map((tab) => ({
        id: tab.id,
        name: formatTabText(tab.text),
      }));
      setOptions(options);
      setTabs(tempTab);
    } else {
      setTabs(tabData);
    }
  }, [tabData]);

  React.useEffect(() => {
    if (
      props.tabName !== undefined &&
      props.tabName !== null &&
      props.tabName !== "" &&
      defaultTab >= 10
    ) {
      const findTabIndex = _findIndex(
        tabData,
        (tab) => tab.text === props.tabName
      );
      const tempTabs = [...tabs];
      const remainOptions = [...options];
      remainOptions.splice(props.tabIndex, 1);
      if (tabs.length > 8) {
        const lastTab = tempTabs.splice(tempTabs.length - 1, 1)[0];
        tempTabs.push(tabData[findTabIndex]);
        remainOptions.push({
          id: lastTab.id,
          name: formatTabText(lastTab.text),
        });
      } else {
        tempTabs.push(tabData[findTabIndex]);
      }
      setSelected(tempTabs.length - 1);
      setTabs(tempTabs);
      setOptions(remainOptions);
    }
  }, [props.tabName, props.tabIndex, options, tabData]);

  React.useEffect(() => {
    setSelected(defaultTab);
  }, [defaultTab]);

  const handleTabChange = ({ name }, index) => {
    const findTabIndex = _findIndex(tabData, (tab) => tab.text === name);
    const tempTabs = [...tabs];
    const remainOptions = [...options];
    remainOptions.splice(index, 1);
    if (tabs.length > 8) {
      const lastTab = tempTabs.splice(tempTabs.length - 1, 1)[0];
      tempTabs.push(tabData[findTabIndex]);
      remainOptions.push({
        id: lastTab.id,
        name: formatTabText(lastTab.text),
      });
    } else {
      tempTabs.push(tabData[findTabIndex]);
    }
    setSelected(tempTabs.length - 1);
    setTabs(tempTabs);
    setOptions(remainOptions);
  };

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper function to format tab text if it's a number
  const formatTabText = (text) => {
    if (typeof text === 'number') {
      return formatNumber(text);
    }
    return text;
  };

  return (
    <React.Fragment>
      <Row className={isReacher ? `d-none` : ""}>
        <div className="fullWhiteBackground">
          <Container>
            <ul
              className={`${props.className} ${props.dynamicTab} ${
                props.or ? "or-tab" : ""
              } ${props.animate ? "animate-tab" : ""}`}
            >
              {tabs.map((item, index) => (
                <li
                  className={`tabDefault ${
                    selected === index ? activeClass : ""
                  } ${item.activeTip ? "active-arrow" : ""} ${
                    item.disable ? "click-off" : ""
                  } ${item.noPoniter ? "pointer-event-none" : ""} ${
                    props.defaultClass
                  }`}
                  key={item.id}
                  onClick={() => setSelectedIndex(index)}
                >
                  {item.image && <img src={item.image} alt={item.image} />}
                  {item.icon && <i className={`${item.icon}`}></i>}
                  {item.iconLeft && <i className={`${item.iconLeft}`}></i>}
                  {item.text && <span>{formatTabText(item.text)}</span>}
                  {props.arrow && <div className="arrowBar"></div>}
                  {props.subText && <h3>{item.text2}</h3>}
                  {props.or && (
                    <span className="or-divider user-select-none"></span>
                  )}
                </li>
              ))}
              {props.animate && <span className="animate-key"></span>}
              {tabData.length > 10 && (
                <li>
                  <BootstrapDropdown
                    data={options}
                    fieldKey="name"
                    flatIcon
                    defaultItem={
                      <></>
                      // <i
                      //     className={`${icons.justify_dropdown_medium} mb5 position-relative right7 icon-md`}
                      // />
                    }
                    isObject
                    showUpdate={false}
                    className="no_caret"
                    onSelect={handleTabChange}
                  />
                </li>
              )}
            </ul>
          </Container>
        </div>
      </Row>
      <Container>
        <div className={componentClassname}>{tabs[selected]?.component()}</div>
      </Container>
    </React.Fragment>
  );
};



RSTabbarFluid.propTypes = {
  tabData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      component: PropTypes.func.isRequired,
      disable: PropTypes.bool,
    })
  ).isRequired,
  defaultClass: PropTypes.string,
  defaultSelectedItem: PropTypes.number,
  dynamicTab: PropTypes.string,
  activeClass: PropTypes.string,
  isReacher: PropTypes.bool,
  callBack: PropTypes.func,
  defaultSelectedObjectValue: PropTypes.object,
  animate: PropTypes.bool,
  arrow: PropTypes.bool,
  subText: PropTypes.bool,
  or: PropTypes.bool,
  componentClassname: PropTypes.string,
};

export default React.memo(RSTabbarFluid);
