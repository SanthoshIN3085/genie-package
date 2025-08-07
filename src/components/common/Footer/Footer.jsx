import React from "react";
import { useDispatch } from "react-redux";
import { updateSettings, updateUI } from "Reducers/genie/reducer";

function Footer() {
  const dispatch = useDispatch();
  return (
    <div className="genie__footer">
      <span className="genie__footer-text">
        Copyrights © Genie, RESULTICKS Solution Inc |{" "}
        <span
          className="terms-link"
          onClick={() => {
            dispatch(
              updateSettings({
                isTermsAndConditions: true,
              })
            );
            dispatch(
              updateUI({
                showAlert: true,
              })
            );
          }}
        >
          Terms and Conditions
        </span>
      </span>
    </div>
  );
}

export default Footer;
