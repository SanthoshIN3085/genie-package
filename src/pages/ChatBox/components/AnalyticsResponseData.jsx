import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUI,
} from "../../../Reducers/genie/reducer";
import * as genieIcons from "../../../assets/genieIcons";
import RSTooltip from "Components/RSTooltip";
import { GenPrimaryButton } from "Components/Buttons";
import { getPositions } from "../../../constant/constant";
import { ANALYTICS_RESPONSE } from "../../../constant/textConstants";

const AnalyticsResponseData = ({ data, messageId, messageIndex }) => {
  const dispatch = useDispatch();
  const { ui } = useSelector((state) => state.genie);
  const { showWorkings, collapsed } = ui;
  
  const dataLength = data.responseData?.length === 1;

  const shouldRender =
    data.dataRepresentation === 2 && data.responseData?.length > 0;

  if (!shouldRender) return null;

  return (
    <>
      <div className={`workings-icon ${showWorkings ? "active" : ""}`}>
        <RSTooltip text={ANALYTICS_RESPONSE.WORKINGS_TOOLTIP}>
          <img
            src={genieIcons?.iconWorking}
            alt="workings"
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
      <div className={`chatbox__response-data chatbox__response-data-analytics`}>
        <div className="chatbox__response-data-analytics-wrapper">
          <p className="chatbox__response-data-analytics-title">
            {ANALYTICS_RESPONSE.COMMUNICATION_PERFORMANCE_TITLE}
          </p>
          <div className="chatbox__response-data-analytics-card-container">
            {data.responseData.map((item, index) => (
              <div key={index} className="chatbox__data-item">
                <div className="chatbox__data-header">
                  <h4>{item.heading}</h4>
                  <div className="chatbox__data-stats-container">
                    <div className="chatbox__data-stats chatbox__data-stats-audience">
                      <div className="count">
                        {item.audienceCount}
                        <span>{item?.smallText === "" ? "M" : "K"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {!dataLength && (
                  <div className="chatbox__data-content">
                    <p className="chatbox__data-summary">{item.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="chatbox__response-data-analytics-dec">
            {ANALYTICS_RESPONSE.PERFORMANCE_DESCRIPTION}
          </div>
          <div className="chatbox__data-footer">
            <div className="chatbox__data-footer-icon-container">
              <RSTooltip text={ANALYTICS_RESPONSE.LIKE_TOOLTIP}>
                <div className={``}>
                  <img src={genieIcons?.thumbsUp} />
                </div>
              </RSTooltip>
              <RSTooltip text={ANALYTICS_RESPONSE.DISLIKE_TOOLTIP}>
                <div>
                  <img src={genieIcons?.thumbsDown} />
                </div>
              </RSTooltip>
              <RSTooltip text={ANALYTICS_RESPONSE.SHARE_TOOLTIP}>
                <div>
                  <img src={genieIcons?.iconShare} />
                </div>
              </RSTooltip>
            </div>
            <div>
              <GenPrimaryButton>{ANALYTICS_RESPONSE.VIEW_ANALYTICS_BUTTON}</GenPrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsResponseData;
