import React from "react";
import GenCard from "../../Components/GenCard/GenCard";
import { Col, Row } from "react-bootstrap";
import KendoGrid from "Components/RSKendoGrid";
import RSHighchartsContainer from "../../components/Highcharts";

// Recursive component to handle nested sections
const SectionCard = ({
  section,
  renderContent,
  sectionLength,
  isNested = false,
}) => {
  return (
    <GenCard className={isNested && section?.isborder ? "border-section" : ""}>
      <div className="settings__main-title">{section?.title}</div>
      <div className="settings__main-subtitle">{section?.subtitle}</div>
      <div className="settings__main__content">
        {(() => {
          if (renderContent) {
            const result = renderContent(section?.mainContent);

            if (
              result &&
              typeof result === "object" &&
              !React.isValidElement(result)
            ) {
              return <div></div>;
            }
            return result;
          } else {
            return <div></div>;
          }
        })()}
      </div>
      {section?.isGrid ? (
        <div className="mb30">
          <KendoGrid
            data={section?.gridData}
            column={section?.columnData}
            pageable
            settings={{
              total: section?.gridData?.length,
            }}
            scrollable="scrollable"
          />
        </div>
      ) : null}
      {section?.chart ? (
        <RSHighchartsContainer
          options={section?.chartData}
          className={`${
            section?.chartOptions ? "" : "opacity-0"
          } settings__chart`}
        />
      ) : null}
      {section?.isbutton ? (
        <button
          className={`settings__main__btn ${
            section?.buttonPosition === "center"
              ? "settings__main__btn-center"
              : section?.buttonPosition === "right"
              ? "settings__main__btn-right"
              : ""
          }`}
        >
          {section?.buttonText}
        </button>
      ) : null}
      {section?.isfooter ? (
        <div className="settings__main_footer">{section?.footerText}</div>
      ) : null}

      {/* Render nested subMainSection if it exists */}
      {section?.subMainSection && section.subMainSection.length > 0 && (
        <div className="settings__sub-section">
          <Row className="m0">
            {section.subMainSection.map((subSection, subIndex) => (
              <Col
                key={subIndex}
                xs={12}
                md={
                  section?.colValue
                    ? section?.colValue
                    : section.subMainSection.length === 1
                    ? 12
                    : section.subMainSection.length === 2
                    ? 6
                    : section.subMainSection.length === 3
                    ? 4
                    : 3
                }
              >
                <SectionCard
                  section={subSection}
                  renderContent={renderContent}
                  sectionLength={section.subMainSection.length}
                  isNested={true}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </GenCard>
  );
};

function SettingsLayout({ pageData, renderContent }) {
  const isHeader = pageData?.isHeader;

  // Get all main section properties dynamically
  const getMainSections = () => {
    const sections = [];
    let index = 0;

    // Check for mainSection, mainSection1, mainSection2, etc.
    while (pageData?.[`mainSection${index === 0 ? "" : index}`]) {
      const sectionData = pageData[`mainSection${index === 0 ? "" : index}`];
      if (sectionData && sectionData.length > 0) {
        sections.push({
          data: sectionData,
          key: `mainSection${index === 0 ? "" : index}`,
          length: sectionData.length,
        });
      }
      index++;
    }

    return sections;
  };

  const mainSections = getMainSections();

  return (
    <>
      <div className="settings">
        {isHeader ? (
          <div className="settings__header">
            {pageData?.isHeader?.map((header, index) => {
              return (
                <div key={index}>
                  <div className="settings__header__title">
                    {header?.headerTitle}
                  </div>
                  <small className="settings__header__subtitle">
                    {header?.headerSubTitle}
                  </small>
                </div>
              );
            })}
          </div>
        ) : null}
        <div className="settings__container">
          {mainSections.map((sectionInfo, sectionIndex) => {
            const { data: sectionData, length: sectionLength } = sectionInfo;

            return (
              <div
                key={sectionIndex}
                className={`settings__main settings__main-${sectionIndex + 1}`}
              >
                <Row className="m0">
                  {sectionData?.map((section, index) => {
                    return (
                      <Col
                        key={index}
                        xs={12}
                        md={
                          section?.colValue
                            ? section?.colValue
                            : sectionLength === 1
                            ? 12
                            : sectionLength === 2
                            ? 6
                            : sectionLength === 3
                            ? 4
                            : 3
                        }
                      >
                        <SectionCard
                          section={section}
                          renderContent={renderContent}
                          sectionLength={sectionLength}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default SettingsLayout;
