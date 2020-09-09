import React, {useEffect, useState} from 'react';
import BlockCards from './pageComponents/BlockCards';
import BlockTable from "./pageComponents/BlockTable";
import BlockMap from "./pageComponents/BlockMap";
import BlockChart from "./pageComponents/BlockChart";
import axios from "axios";
import {urls} from "./modules/urls";


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
