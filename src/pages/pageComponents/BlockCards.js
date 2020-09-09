import React from 'react';
import {countPercentRatio} from '../modules/funcs'

import ComCard from '../../components/comCard';

const titles = [
    "Total",
    "Recovered",
    "Deaths",
    "Active",
    "Mortality",
    "Affected countries"
];

function createData(title, number=0, delta) {
    return { title, number, delta };
}


function BlockCards(props) {

    const data = [
        createData(titles[0], props.data.total_cases, props.data.total_new_cases_today),
        createData(titles[1], props.data.total_recovered),
        createData(titles[2], props.data.total_deaths, props.data.total_new_deaths_today),
        createData(titles[3], props.data.total_active_cases),
        createData(titles[4], countPercentRatio(props.data.total_cases, props.data.total_deaths, 1)),
        createData(titles[5], props.data.total_affected_countries),
    ]
    return (
        <div className="pageBlock">
            <ComCard data={data}/>
        </div>
    );
}


export default BlockCards;
