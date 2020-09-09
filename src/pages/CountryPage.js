import React, {useEffect, useState} from 'react';

import BlockCards from './pageComponents/BlockCards';
import BlockChart from "./pageComponents/BlockChart";
import axios from "axios";
import {urls} from "./modules/urls";





function CountryPage(props) {

    const countryId = props.match.params.country;

    const [dataCountry, setDataCountry] = useState([]);
    const [countryName, setCountryName] = useState('');
    const [isCountryLoading, setIsCountryLoading] = useState(true);

    useEffect(()=> {
            axios.get(`${urls.country}${countryId}`).then((res)=>{
                const dataCountry = res.data.countrydata;
                setDataCountry(dataCountry[0]);

                setCountryName(dataCountry[0].info.title);
                setIsCountryLoading(false);
            });
        }, []
    );


    return (
        <div>
            <h2>Covid-19 {countryName} Spread Data</h2>

            {isCountryLoading ? <h3> Loading... </h3> :
                <div>
                    <BlockCards data={dataCountry} countryId={countryId}/>
                    <BlockChart data={''} countryId={countryId}/>
                </div>
            }
        </div>
    );
}


export default CountryPage;
