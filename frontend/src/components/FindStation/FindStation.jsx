import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import Hero from './Hero/Hero'
import Map from './Map/Map'
import Filter from '../Common/Filter/Filter'
import style from './FindStation.module.css'


export default function FindStation() {
    const [stationMatch, setStationMatch] = useState(246);
    const [isFilterClicked, setIsFilterClicked] = useState(false);
    const [passBackLocationFromHero, setPassBackLocationFromHero] = useState("");
    const [passBackFilterFromFilter, setPassBackFilterFromFilter] = useState([]);
    const [passBackLocationFromLocation, setPassBackLocationFromLocation] = useState([]);
    const [passBackLocationFromMap, setPassBackLocationFromMap] = useState([]);
    const [dataPassToMap, setDataPassToMap] = useState({ address: '', filter: [], locationData: [] });
    const [dataPassToLocation, setDataPassToLocation] = useState({ locations: [] });

    function handleClickForFilter() {
        setIsFilterClicked(!isFilterClicked);
    }

    function handleDataFromHero(childData) {
        setPassBackLocationFromHero(childData.location);
    }

    function handleDataFromFilter(childData) {
        setPassBackFilterFromFilter(childData);
    }

    function handleDataFromLocation(childData) {
        setPassBackLocationFromLocation(childData);
    }

    function handleDataFromMap(childData) {
        setPassBackLocationFromMap(childData);
    }

    function handleDataPassToLocation() {
        setDataPassToLocation({
            locations: passBackLocationFromMap,
        });
    }

    function handleDataPassToMap() {
        setDataPassToMap({
            address: passBackLocationFromHero,
            filter: passBackFilterFromFilter,
            locationData: passBackLocationFromLocation,
        });
    }

    useEffect(() => {
        handleDataPassToMap();
    }, [passBackLocationFromHero, passBackFilterFromFilter, passBackLocationFromLocation]);

    useEffect(() => {
        if (passBackLocationFromMap.length > 0) {
            handleDataPassToLocation();
            setStationMatch(passBackLocationFromMap.length);
        }
    }, [passBackLocationFromMap]);


    return (
        <div className="findStationContainer">
            {isFilterClicked && 
                <div>
                    <button className={style.backBtn} onClick={handleClickForFilter}>
                        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: "0.8rem" }} />
                        Back
                    </button>
                    <Filter sendDataToStation={handleDataFromFilter} page={"Find A Station"} />
                </div>
            }
            {!isFilterClicked &&
                <div>
                    <Hero sendDataToStation={handleDataFromHero} />
                    {window.screen.width > 431 &&
                        <div>
                            <Filter sendDataToStation={handleDataFromFilter} page={"Find A Station"} />
                            <p className={style.numberOfStation}>{stationMatch} stations found</p>
                            <div className={style.main}>
                                <Location className={style.location} sendDataToStation={handleDataFromLocation} getDataFromStation={dataPassToLocation} />
                                <Map className={style.map} getDataFromStation={dataPassToMap} sendStoreBackToStation={handleDataFromMap} />
                            </div>
                        </div>
                    }
                    {window.screen.width <= 430 &&
                        <div>
                            <button className={style.filterBtn} onClick={handleClickForFilter}>Filters</button>
                            <div className={style.mobileMain}>
                                <Map className={style.map} getDataFromStation={dataPassToMap} sendStoreBackToStation={handleDataFromMap} />
                                <p className={style.numberOfStation}>{stationMatch} stations found</p>
                                <Location className={style.location} getDataFromStation={passBackLocationFromMap} sendDataToStation={handleDataFromLocation} />
                            </div>
                        </div>
                    }         
                </div>       
            }
        </div>
    );
}