import React, {useEffect, useRef} from 'react';
import {total_timeline} from '../mockData';
import ComChart from "../../components/comChart";


function BlockChart(props) {

    return (
        <div className="pageBlock">
            <h3>Distribution dynamics</h3>
            <ComChart data={total_timeline} />
        </div>
    );
}

export default BlockChart;
