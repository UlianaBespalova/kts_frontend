import React, {useEffect, useState} from 'react';
import BlockCards from './pageComponents/BlockCards';
import BlockTable from "./pageComponents/BlockTable";
import BlockMap from "./pageComponents/BlockMap";
import BlockChart from "./pageComponents/BlockChart";
import axios from "axios";
import {urls} from "./modules/urls";






const mockApi2 = {
    "1": {
        "ourid": 1,
        "title": "Afghanistan",
        "code": "AF",
        "source": "https://thevirustracker.com/afghanistan-coronavirus-information-af",
        "total_cases": 37550,
        "total_recovered": 27166,
        "total_unresolved": 0,
        "total_deaths": 1369,
        "total_new_cases_today": 119,
        "total_new_deaths_today": 6,
        "total_active_cases": 452,
        "total_serious_cases": 9015
    },

    "2": {
        "ourid": 2,
        "title": "Albania",
        "code": "AL",
        "source": "https://thevirustracker.com/albania-coronavirus-information-al",
        "total_cases": 7117,
        "total_recovered": 3695,
        "total_unresolved": 0,
        "total_deaths": 219,
        "total_new_cases_today": 0,
        "total_new_deaths_today": 0,
        "total_active_cases": 0,
        "total_serious_cases": 3203
    },
};


function WorldPage() {

    const [dataTotal, setDataTotal] = useState([]);
    const [isTotalLoading, setIsTotalLoading] = useState(true);

    const [dataTimeline, setDataTimeline] = useState([]);
    const [isTimeLineLoading, setIsTimeLineLoading] = useState(true);


    useEffect(()=> {
            axios.get(urls.total).then((res)=>{
                const dataTotal = res.data.results;
                setDataTotal(dataTotal[0]);
                setIsTotalLoading(false);
            });

            axios.get(urls.allCountries).then((res)=>{
                const dataTimeline = res.data.countryitems;
                setDataTimeline(dataTimeline[0]);
                setIsTimeLineLoading(false);
            });
        }, []
    );


    return (
        <div>
            <h2>Covid-19 World Spread Data</h2>
            {isTotalLoading ? <h3>Loading...</h3> :
                <div>
                    <BlockCards data={dataTotal} title={'world'}/>
                    <BlockChart data={''} title={'world'}/>
                </div>
            }

            {isTimeLineLoading ? <h3>Country statistics are loading...</h3> :
                <div>
                    <BlockMap data={dataTimeline}/>
                    <BlockTable data={dataTimeline}/>
                </div>
            }
        </div>
    );
}


export default WorldPage;
