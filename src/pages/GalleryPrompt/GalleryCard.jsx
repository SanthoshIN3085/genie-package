import RSTooltip from "Components/RSTooltip";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import * as genieIcons from "../../assets/genieIcons";
import { BootstrapDropdown } from "Components/RSBootstrapDropDown";
import { truncateTitle } from "../../Utils/index";
import { useDispatch, useSelector } from "react-redux";
import KendoGrid from "../../components/RSKendoGrid";
import {
  updateSelectedPrompt,
  updatePromptGalleryFlag,
  updateUI,
  updateChat,
  updateSpeech,
  updateSearch,
  updateSettings,
  resetGenie,
} from "Reducers/genie/reducer";

const GalleryCard = ({
  cardData = [],
  handlePromptClick = () => {},
  selectedTab = "",
  onBookmarkUpdate = () => {},
}) => {
  const { ui } = useSelector((state) => state.genie);
  const { isDarkMode } = ui;
  // Filter cards based on selected tab
  const filteredCardData =
    selectedTab === "Favorite prompts"
      ? cardData.filter((card) => card.isFavorite)
      : cardData;

  // Update selectedIcons whenever cardData changes
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [listTypeView, setListTypeView] = useState(false);

  React.useEffect(() => {
    setSelectedIcons(
      filteredCardData.map((card) => ({
        like: false,
        dislike: false,
        bookMark: card.isFavorite || false,
      }))
    );
  }, []);

  const [counts, setCounts] = useState(
    Array(filteredCardData.length).fill({ likeCount: 115, dislikeCount: 3 })
  );
  const dispatch = useDispatch();
  const dropDowndata = [
    "Segmentation",
    "Data ingestion",
    "User journey builder",
    "Analytics & insights",
    "Content generation",
  ];

  const handleIconClick = (index, type) => {
    if (type === "bookmark") {
      const card = filteredCardData[index];
      const newBookmarkState = !card.isFavorite; // Use card.isFavorite instead of selectedIcons

      // Update the bookmark state in parent component
      onBookmarkUpdate(card.id, newBookmarkState);
    } else {
      setSelectedIcons((prevState) => {
        const newState = [...prevState];
        newState[index] = {
          ...newState[index],
          like:
            type === "like" ? !prevState[index].like : prevState[index].like,
          dislike:
            type === "dislike"
              ? !prevState[index].dislike
              : prevState[index].dislike,
        };

        if (type === "like" && newState[index].like) {
          newState[index].dislike = false;
        } else if (type === "dislike" && newState[index].dislike) {
          newState[index].like = false;
        }

        return newState;
      });
    }

    setCounts((prevCounts) => {
      const newCounts = [...prevCounts];

      if (type === "like") {
        newCounts[index].likeCount += selectedIcons[index].like ? -1 : 1;
        if (selectedIcons[index].dislike) {
          newCounts[index].dislikeCount -= 1;
        }
      } else if (type === "dislike") {
        newCounts[index].dislikeCount += selectedIcons[index].dislike ? -1 : 1;
        if (selectedIcons[index].like) {
          newCounts[index].likeCount -= 1;
        }
      }

      return newCounts;
    });
  };
  const submenuDropdown = [
    <>
      <img
        src={
          isDarkMode
            ? genieIcons?.menuIconRenameDark
            : genieIcons?.menuIconRename
        }
        className="mr10"
      />{" "}
      <span>Edit</span>
    </>,
    <>
      <img
        src={
          isDarkMode ? genieIcons?.menuIconShareDark : genieIcons?.menuIconShare
        }
        className="mr10"
      />
      <span>Share</span>
    </>,

    <>
      <img
        src={
          isDarkMode
            ? genieIcons?.menuIconDeleteDark
            : genieIcons?.menuIconDelete
        }
        className="mr10"
      />{" "}
      <span>Delete</span>
    </>,
  ];

  // const handlePromptClick = (inputValue) => {
  //     dispatch(updatePromptGalleryFlag(false));
  //     dispatch(updateSelectedPrompt(inputValue));
  // };
  const [maxLength, setMaxLength] = useState(17);
  const [visibleLength, setVisibleLength] = useState(15);

  useEffect(() => {
    const updateLength = () => {
      const width = window.innerWidth;
      if (width < 1450) {
        setMaxLength(20);
        setVisibleLength(15);
      } else {
        setMaxLength(25);
        setVisibleLength(18);
      }
    };

    updateLength();
    window.addEventListener("resize", updateLength);
    return () => window.removeEventListener("resize", updateLength);
  }, []);
  const gridData = filteredCardData?.map((item) => ({
    promptName: item.heading,
    Createdby: item.Created_by,
    Createddate: item.Created_date,
    Module: item.Module,
    description: item.description,
  }));

  const columns = [
    {
      field: "promptName",
      title: "Prompt Name",
      cell: (props) => (
        <td>
          {props.dataItem.promptName?.length > maxLength ? (
            <RSTooltip
              text={props.dataItem.promptName}
              position="top"
              className="d-inline-block"
              innerContent={false}
              tooltipOverlayClass={`toolTipOverlayZindexCSS`}
            >
              <span className="m0">
                {props.dataItem.promptName.substring(0, visibleLength) + "..."}
              </span>
            </RSTooltip>
          ) : (
            <span className="m0">{props.dataItem.promptName}</span>
          )}
        </td>
      ),
    },
    {
      field: "Createdby",
      title: "Created By",
    },
    {
      field: "Createddate",
      title: "Created Date",
    },
    {
      field: "Module",
      title: "Module",
    },
    {
      field: "description",
      title: "Description",
      cell: (props) => (
        <td>
          {props.dataItem.description?.length > maxLength ? (
            <RSTooltip
              text={props.dataItem.description}
              position="top"
              className="d-inline-block"
              innerContent={false}
              tooltipOverlayClass={`toolTipOverlayZindexCSS`}
            >
              <span className="m0">
                {props.dataItem.description.substring(0, visibleLength) + "..."}
              </span>
            </RSTooltip>
          ) : (
            <span className="m0">{props.dataItem.description}</span>
          )}
        </td>
      ),
    },
  ];

  return (
    <div className="prompt__gallery__card">
      <div className="prompt__gallery__card__header">
        <Row>
          <Col md={6}>
            <BootstrapDropdown
              data={dropDowndata}
              alignRight
              defaultItem={dropDowndata[0]}
              customAlignRight
              isActive
            />
          </Col>
          <Col md={6}>
            <div className="prompt__gallery__card-icon">
              <span className="mr21">
                {/* <RSDateRangePicker genieAI /> */}
              </span>
              <div className="prompt__gallery__card-icon-listview">
                <RSTooltip
                  text={listTypeView ? "Grid view" : " List view"}
                  position="top"
                  className="lh0"
                >
                  <img
                    src={
                      !listTypeView
                        ? genieIcons?.GenListView
                        : genieIcons?.GenGridView
                    }
                    onClick={() => setListTypeView(!listTypeView)}
                  />
                </RSTooltip>
              </div>
              <div
                className="prompt__gallery__card-icon-newprompt"
                onClick={() => {
                  dispatch(
                    updateUI({
                      home: true,
                    })
                  );
                  dispatch(
                    updateChat({
                      selectedMessages: [],
                    })
                  );
                  dispatch(updatePromptGalleryFlag(false));
                }}
              >
                <RSTooltip text={"New prompt"} className="lh0">
                  <img src={genieIcons?.newPrompt} />
                </RSTooltip>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="prompt__gallery__card__content">
        {!listTypeView ? (
          <div>
            <Row className="m0">
              {filteredCardData.map((card, index) => (
                <Col md={4} key={card.id} className={index < 3 ? "mb33" : ""}>
                  <div
                    className="prompt__gallery__card__content-item"
                    onClick={() => handlePromptClick(card.description)}
                  >
                    <div className="prompt__gallery__card__content-item-top">
                      {card.heading?.length > 24 ? (
                        <RSTooltip
                          text={card.heading}
                          innerContent={false}
                          tooltipOverlayClass={`toolTipOverlayZindexCSS`}
                        >
                          <h1>{truncateTitle(card.heading, 23)}</h1>
                        </RSTooltip>
                      ) : (
                        <h1>{card.heading}</h1>
                      )}
                      <img
                        src={
                          card.isFavorite
                            ? genieIcons?.menuIconFavouriteSelectfill
                            : genieIcons?.menuIconFavouriteSelect
                        }
                        className="Genie-icon-size"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIconClick(index, "bookmark");
                        }}
                      />
                    </div>
                    <div className="prompt__gallery__card__content-item-bottom">
                      <p className="prompt__gallery__card__content-item-bottom-dec">
                        {card.description}
                      </p>
                      <div className="prompt__gallery__card__content-item-bottom-btns">
                        <ul>
                          <li>
                            <RSTooltip text={"Like"}>
                              <img
                                src={
                                  selectedIcons[index]?.like
                                    ? genieIcons?.thumbsUpActive
                                    : genieIcons?.thumbsUp
                                }
                                className={` Genie-icon-size  ${
                                  selectedIcons[index]?.dislike
                                    ? "click-off"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleIconClick(index, "like");
                                }}
                              />
                            </RSTooltip>
                            <small>{counts[index]?.likeCount}</small>
                          </li>
                          <li>
                            <RSTooltip text={"Dislike"}>
                              <img
                                src={
                                  selectedIcons[index]?.dislike
                                    ? genieIcons?.thumbsDownActive
                                    : genieIcons?.thumbsDown
                                }
                                className={` Genie-icon-size ${
                                  selectedIcons[index]?.like
                                    ? "click-off"
                                    : "cp"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleIconClick(index, "dislike");
                                }}
                              />
                            </RSTooltip>
                            <small className="font-xxs ml2">
                              {counts[index]?.dislikeCount}
                            </small>
                          </li>
                        </ul>
                        <div onClick={(e) => e.stopPropagation()}>
                          <BootstrapDropdown
                            data={submenuDropdown}
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
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <div>
            <Row className="mx0">
              <Col>
                <KendoGrid
                  data={gridData}
                  column={columns}
                  scrollable="scrollable"
                />
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryCard;
