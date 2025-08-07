import React, { useState } from "react";

import RSTabbarFluid from "Components/RSTabberFluid";
import { tabData } from "./constant";
import * as sectors from "../../constant/Sectors";
import _get from "lodash/get";
import { useSelector } from "react-redux";
import { GALLERY_PROMPT } from "../../constant/textConstants";

function GalleryPrompt({
  handlePromptClick = () => {},
  setGeniePages = () => {},
}) {
  const domain = location.pathname.split("/")[1];
  const { ui } = useSelector((state) => state.genie);
  const { isDarkMode } = ui;
  const { promptGallery } = sectors.banking;
  const [allCardData, setAllCardData] = useState(promptGallery);

  const handleBookmarkUpdate = (cardId, isBookmarked) => {
    setAllCardData((prevData) =>
      prevData.map((card) =>
        card.id === cardId ? { ...card, isFavorite: isBookmarked } : card
      )
    );
  };

  return (
    <div className="prompt__gallery">
      <h4 className="prompt__gallery-title">{GALLERY_PROMPT.TITLE}</h4>
      <p className="prompt__gallery-subtitle">
        {GALLERY_PROMPT.SUBTITLE}
      </p>

      <RSTabbarFluid
        defaultClass={`col-sm-3`}
        dynamicTab={`mb0 mini`}
        activeClass={`active`}
        className="prompt__gallery__tabber"
        tabData={tabData(
          allCardData,
          handlePromptClick,
          setGeniePages,
          handleBookmarkUpdate
        )}
        componentClassname={""}
      />
    </div>
  );
}

export default GalleryPrompt;
