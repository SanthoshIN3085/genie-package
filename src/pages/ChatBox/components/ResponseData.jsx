import { BootstrapDropdown } from "Components/RSBootstrapDropDown";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateThumbsFeedback,
  updateUI,
} from "../../../Reducers/genie/reducer";
import * as genieIcons from "../../../assets/genieIcons";
import RSTooltip from "Components/RSTooltip";
import { getPositions } from "../../../constant/constant";
import { Workings } from "../../Workings/Workings";
import { RESPONSE_DATA } from "../../../constant/textConstants";

const ResponseData = ({ data, messageId, messageIndex }) => {
  const dispatch = useDispatch();
  const { ui } = useSelector((state) => state.genie);
  const { showWorkings, collapsed, workingsExpanded } = ui;
  const { thumbsFeedback } = useSelector((state) => state.genie.chat);
  const dataLength = data.responseData?.length === 1;

  const shouldRender =
    data.dataRepresentation === 1 && data.responseData?.length > 0;

  if (!shouldRender) return null;

  const handleThumbsFeedback = (itemIndex, feedback) => {
    dispatch(updateThumbsFeedback({ messageId, itemIndex, feedback }));
  };

  const getFeedbackState = (itemIndex) => {
    const key = `${messageId}-${itemIndex}`;
    return thumbsFeedback[key] || null;
  };

  return (
    <>
      <div className={`workings-icon ${showWorkings ? "active" : ""}`}>
        <RSTooltip text={RESPONSE_DATA.TOOLTIPS.WORKINGS}>
          <img
            src={genieIcons?.iconWorking}
            alt={RESPONSE_DATA.ALT_TEXTS.WORKINGS}
            onClick={(e) => {
              e.stopPropagation();

              dispatch(
                updateUI({
                  collapsed: true,
                  showWorkings: true,
                  currentWorkingsMessageId: messageId,
                  currentWorkingsMessageIndex: messageIndex,
                })
              );
              setTimeout(getPositions, collapsed ? 0 : 300);
            }}
            className="cp"
          />
        </RSTooltip>
      </div>
      <div
        className={`chatbox__response-data ${
          dataLength ? "chatbox__response-data-single" : ""
        }`}
      >
        {data.responseData.map((item, index) => (
          <div key={index} className="chatbox__data-item">
            <div className="chatbox__data-header">
              <h4>{item.name}</h4>
              <div className="chatbox__data-stats-container">
                <div className="chatbox__data-stats chatbox__data-stats-audience">
                  <div className="count">
                    {item.audienceCount}
                    <span>{item?.smallText === "" ? "M" : "K"}</span>
                  </div>
                  <small>{RESPONSE_DATA.LABELS.POTENTIAL_AUDIENCE}</small>
                </div>
                <div className="chatbox__data-stats chatbox__data-stats-reach">
                  <div className="count">
                    {item.reachRate}
                    <span>%</span>
                  </div>
                  <small>{RESPONSE_DATA.LABELS.PROJECTED_REACH}</small>
                </div>
                {dataLength && (
                  <p className="chatbox__data-summary">{item.summary}</p>
                )}
              </div>
            </div>
            {!dataLength && (
              <p className="chatbox__data-summary">{item.summary}</p>
            )}
            <div className="chatbox__data-footer">
              <div className="chatbox__data-footer-icon-container">
                <RSTooltip text={RESPONSE_DATA.TOOLTIPS.LIKE}>
                  <div
                    className={`${
                      getFeedbackState(index) === "down" ? "click-off" : ""
                    }`}
                    onClick={() =>
                      handleThumbsFeedback(
                        index,
                        getFeedbackState(index) === "up" ? null : "up"
                      )
                    }
                  >
                    <img
                      src={
                        getFeedbackState(index) === "up"
                          ? genieIcons?.thumbsUpActive
                          : genieIcons?.thumbsUp
                      }
                    />
                  </div>
                </RSTooltip>
                <RSTooltip text={RESPONSE_DATA.TOOLTIPS.DISLIKE}>
                  <div
                    className={`${
                      getFeedbackState(index) === "up" ? "click-off" : ""
                    }`}
                    onClick={() =>
                      handleThumbsFeedback(
                        index,
                        getFeedbackState(index) === "down" ? null : "down"
                      )
                    }
                  >
                    <img
                      src={
                        getFeedbackState(index) === "down"
                          ? genieIcons?.thumbsDownActive
                          : genieIcons?.thumbsDown
                      }
                    />
                  </div>
                </RSTooltip>
                <RSTooltip text={RESPONSE_DATA.TOOLTIPS.EDIT}>
                  <div>
                    <img src={genieIcons?.IconEdit} />
                  </div>
                </RSTooltip>
              </div>
              <div>
                <BootstrapDropdown
                  data={RESPONSE_DATA.DROPDOWN_OPTIONS}
                  flatIcon
                  showUpdate={false}
                  defaultItem={
                    <img
                      src={genieIcons?.dropdownMenu}
                      className="Genie-icon-size"
                    />
                  }
                  className="no_caret"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ResponseData;
