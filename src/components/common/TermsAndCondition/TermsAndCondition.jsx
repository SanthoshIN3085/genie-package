import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GenPrimaryButton, GenSecondaryButton } from "Components/Buttons";
import * as genieIcons from "../../../assets/genieIcons";
import RSAlert from "Components/RSAlert";
import { updateUI, updateSettings } from "Reducers/genie/reducer";

function TermsAndCondition() {
  const { ui, settings } = useSelector((state) => state.genie);
  const { isTermsAndConditions } = settings;
  const { showAlert } = ui;
  const dispatch = useDispatch();

  return (
    <div>
      {" "}
      <RSAlert
        show={showAlert}
        containerClass
        body={
          <>
            <div className="genie__alerts">
              <div className="genie__alerts__logo">
                <img
                  src={genieIcons?.genielogowhite}
                  alt="genie"
                  width={150}
                  height={150}
                />
              </div>
              <div className="genie__alerts__content-container">
                <div className="genie__alerts__content-container-item">
                  Genie is an AI agent that assists in delivering results based
                  on your data sets and inputs. It does not take responsibility
                  for output errors, market data accuracy, or copyright issues.
                  You are responsible for validating and using the outcomes, as
                  well as ensuring data security. Using Genie will consume
                  tokens and could result in additional charges if your usage
                  exceeds your plan's quota. By clicking{" "}
                  {isTermsAndConditions ? (
                    '"OK"'
                  ) : (
                    <>
                      <span>"I Agree",</span>
                    </>
                  )}{" "}
                  you accept these terms.
                </div>
              </div>
              <div className="genie__alerts__btn">
                {!isTermsAndConditions && (
                  <GenSecondaryButton
                    onClick={() => {
                      dispatch(
                        updateUI({
                          showAlert: false,
                          howerStarIcon: false,
                        })
                      );
                    }}
                    className="white"
                  >
                    Cancel
                  </GenSecondaryButton>
                )}
                <GenPrimaryButton
                  onClick={() => {
                    dispatch(
                      updateUI({
                        showAlert: false,
                      })
                    );
                    dispatch(
                      updateSettings({
                        isTermsAndConditions: false,
                      })
                    );
                  }}
                  className={`${
                    isTermsAndConditions ? "ml20" : ""
                  } text-nowrap`}
                >
                  {isTermsAndConditions ? "OK" : "I Agree"}
                </GenPrimaryButton>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
}

export default TermsAndCondition;
