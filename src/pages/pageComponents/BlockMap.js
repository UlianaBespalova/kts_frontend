import React, {useEffect, useRef} from 'react';
import ComMap from "../../components/comMap";
import {population} from "../modules/constants";


function createData(id, confirmed, deaths, active, recovered, confirmedPC, deathsPC, activePC, recoveredPC) {
    return { id, confirmed, deaths, active, recovered, confirmedPC, deathsPC, activePC, recoveredPC };
}


function BlockMap(props) {

    const data = [];
    for (let key in props.data) {

        let tmpPopulation = Number(population[props.data[key].code]);

        if (tmpPopulation>1000000) {

            data.push(createData(props.data[key].code,
                props.data[key].total_cases,
                props.data[key].total_deaths,
                props.data[key].total_active_cases,
                props.data[key].total_recovered,
                props.data[key].total_cases / tmpPopulation * 1000000,
                props.data[key].total_deaths / tmpPopulation * 1000000,
                props.data[key].total_active_cases / tmpPopulation * 1000000,
                props.data[key].total_recovered / tmpPopulation * 1000000,
            ));
        } else {
            data.push(createData(props.data[key].code,
                props.data[key].total_cases,
                props.data[key].total_deaths,
                props.data[key].total_active_cases,
                props.data[key].total_recovered), 0, 0, 0, 0);
        }
    }

    return (
        <div className="pageBlock">
            <h3>Covid distribution</h3>
            <ComMap data={data}/>
        </div>
    );
}

export default BlockMap;
