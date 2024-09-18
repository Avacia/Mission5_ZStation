import { useQuery } from 'react-query'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import style from './Location.module.css'


export default function Location({ sendDataToStation, getDataFromStation }){
    const {data: apiData, isLoading, error } = useQuery("Location", getLocation)
    const [isOpen, setIsOpen] = useState(false)
    const [isServiceOpen, setIsServiceOpen] = useState(false)
    const [serviceOpen, setServiceOpen] = useState(new Set([0]))
    const [storeOpen, setStoreOpen] = useState(new Set([0])) 
    const [storeLocations, setStoreLocations] = useState([])
    const priceOrder = ["Lowest Price", "Highest Price"]

    useEffect(() => {
        sendDataToStation(apiData)
    }, [apiData])

    useEffect(() => {
        if(getDataFromStation.length > 0 && getDataFromStation){
            setStoreLocations(getDataFromStation.locations)
        }
    }, [getDataFromStation])


    function handleFilter(e){
        setSortFilter(e.target.value)
    }

    function handleServiceOpen(index){
        const updatedServiceOpen = new Set(serviceOpen)
        if(updatedServiceOpen.has(index)){
            updatedServiceOpen.delete(index)
        }
        else{
            updatedServiceOpen.add(index)
        }
        setServiceOpen(updatedServiceOpen)
        setIsServiceOpen(!isServiceOpen)
    }

    function handleOpen(index){
        const updatedStoreOpen = new Set(storeOpen)
        if(updatedStoreOpen.has(index)){
            updatedStoreOpen.delete(index)
        }
        else{
            updatedStoreOpen.add(index)
        }
        setStoreOpen(updatedStoreOpen)
        setIsOpen(!isOpen)
    }

    async function getLocation(){
        const res = await fetch('http://localhost:5000/storeLocation')

        if(!res.ok){
            throw new Error("Network response was not ok")
        }

        return res.json()
    }

    if(isLoading){
        return(<p>Loading</p>)
    }

    if(error){
        return(<p>Error!!</p>)
    }

    return(
        <div className={style.locationContainer}>
            <select className={style.sortPrice} onChange={(e) => {handleFilter(e)}}>
                <option>Sort prices ..</option>
                {
                    priceOrder.map((order, index) => {
                        return(
                            <option key={index} value={order}>
                                {order}
                            </option>
                        ) 
                    })
                }
            </select>

            {
                (storeLocations.length > 0 ? storeLocations : apiData).map((store, index) => (
                    <div className={style.locationCard} key={index}>    
                        <NavLink className={style.linkToDetail} to={`/stationDetail/${store._id}`}>
                            <h3>{store.name}</h3>
                        </NavLink>
                        <p className={style.address}>{store.address}</p>
                        

                        <div className={window.screen.width <= 430 && storeOpen.has(index) ? style.openStoreActivate : style.openStore}>
                            <button className={style.openStoreBtn} 
                                    onClick={() => handleOpen(index)}>
                                Opening Hours 
                                {
                                    !storeOpen.has(index) ? 
                                    <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: "0.7rem" }}/> 
                                    : <FontAwesomeIcon icon={faChevronUp} style={{ fontSize: "0.7rem" }} />
                                }
                            </button>

                            {storeOpen.has(index) &&
                                store.openingHours.map((time, index) => (
                                    <div className={style.openingHours} key={index}>
                                        <div className={style.openInfoContainer}>
                                            <p>{time.day}</p>
                                            <p>{time.hours}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        
                        <div className={window.screen.width <= 430 && serviceOpen.has(index) ? style.serviceActivate : style.service}>
                            <button className={style.serviceBtn} onClick={() => handleServiceOpen(index)}>
                                Services 
                                {
                                    !serviceOpen.has(index) ? 
                                    <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: "0.7rem" }}/> 
                                    : <FontAwesomeIcon icon={faChevronUp} style={{ fontSize: "0.7rem" }} />
                                }
                            </button>
                            
                            <div className={style.serviceBtnContainer}>
                                {serviceOpen.has(index) &&
                                    store.services.map((service, index) => (
                                        <div key={index}>
                                            <button className={style.serviceInfoBtn}>{service.name}</button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className={style.fuelPrice}>
                            <p>Fuel Prices :</p>
                            <div className={style.fuels}>
                                <p>TEMP FUEL 1</p>
                                <p>TEMP FUEL 2</p>
                                <p>TEMP FUEL 3</p>
                                {window.screen.width > 431 &&
                                    <button className={style.findOutMoreBtn}>Find out more</button>
                                }
                            </div>
                        </div>
                        <span className={style.divider}></span>
                    </div>
                ))
            }
        </div>
    )
}