import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

import More from 'highcharts/highcharts-more.js';
import VaraiblePie from 'highcharts/modules/variable-pie.js';
import SolidGauge from 'highcharts/modules/solid-gauge.js';
// import Funnel from 'highcharts/modules/funnel.js';
import Sankey from 'highcharts/modules/sankey.js';
import Map from 'highcharts/modules/map';
import highchartsSonification from 'highcharts/modules/sonification';
import HCAnnotations from 'highcharts/modules/annotations';

import Highcharts3d from "highcharts/highcharts-3d.js";
import Cylinder from "highcharts/modules/cylinder.js";
import Funnel from "highcharts/modules/funnel3d";

Highcharts3d(Highcharts);
Cylinder(Highcharts);

More(Highcharts);
VaraiblePie(Highcharts);
SolidGauge(Highcharts);
Funnel(Highcharts);
Sankey(Highcharts);
Map(Highcharts);
highchartsSonification(Highcharts);
HCAnnotations(Highcharts);

// require("highcharts/highcharts-more.js")(Highcharts);
// require("highcharts/modules/variable-pie.js")(Highcharts);
// require("highcharts/modules/solid-gauge.js")(Highcharts);
// require("highcharts/modules/funnel.js")(Highcharts);
// require("highcharts/modules/sankey.js")(Highcharts);
// require("highcharts/modules/map")(Highcharts);

import COMMON_OPTIONS from './commonOptions';

const RSHighchartsContainer = ({ constructorType, options, width, height, pClassName, className, chartCore, smallText }) => {
    const [chartOptions, setChartOptions] = React.useState(options);
    const [rerender, setRerender] = React.useState(false);

    React.useEffect(() => setChartOptions(Highcharts.merge(COMMON_OPTIONS, options)), [options]);
    // React.useEffect(() => setChartOptions(Highcharts.merge(COMMON_OPTIONS, options)), []);

    const onMouseLeave = React.useCallback(() => {
        if (constructorType === 'mapChart') {
            setRerender(true);
            setTimeout(() => {
                setRerender(false);
            }, 10);
        }
    }, [rerender, constructorType]);

    return (
        <div className={`${chartCore ? '' : 'portlet-chart'} ${pClassName}`} onMouseLeave={onMouseLeave}>
            <div style={{ width: width !== null && width, height: height }} className={className}>
                {rerender ? null : (
                    <HighchartsReact
                        highcharts={Highcharts}
                        constructorType={constructorType}
                        // options={Highcharts.merge(COMMON_OPTIONS, chartOptions)}
                        options={chartOptions}
                    />
                )}
            </div>
            {smallText && <small className="portlet-info-text">{smallText}</small>}
        </div>
    );
};

RSHighchartsContainer.defaultProps = {
    constructorType: '',
    width: null,
    height: '100%',
    className: '',
};

RSHighchartsContainer.propTypes = {
    constructorType: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string,
};

export default RSHighchartsContainer;
