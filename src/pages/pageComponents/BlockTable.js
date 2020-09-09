import React from 'react';
import {countPercentRatio} from "../modules/funcs";
import ComTable from "../../components/comTable";

const titles = [
    "Country",
    "Total",
    "Recovered",
    "Deaths",
    "Mortality",
    "Active cases",
    "Serious cases",
];


function createData(country, id, total, recovered, deaths, mortality, active, serious, newCases, newDeaths) {
    return { country, id, total, recovered, deaths, mortality, active, serious, newCases, newDeaths };
}


function BlockTable(props) {

    const rows = [];

    for (let key in props.data) {
        rows.push(createData(props.data[key].title,
            props.data[key].code,
            props.data[key].total_cases,
            props.data[key].total_recovered,
            props.data[key].total_deaths,
            countPercentRatio(props.data[key].total_cases, props.data[key].total_deaths),
            props.data[key].total_active_cases,
            props.data[key].total_serious_cases,
            props.data[key].total_new_cases_today,
            props.data[key].total_new_deaths_today,
        ))
    }


    return (
        <div className="pageBlock">
            <h3>Country statistics</h3>
            <ComTable rowsData={rows} columnNames={titles}/>
        </div>
    );
}


export default BlockTable;
