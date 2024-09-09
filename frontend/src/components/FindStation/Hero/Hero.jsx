import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import style from './Hero.module.css'

export default function Hero({ sendDataToStation }){
    const [inputLocation, setInputLocation] = useState("")
    const [isClicked, setIsClicked] = useState("FindStation")

    function handleInputLocation(e){
        e.preventDefault()
        setInputLocation(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault()
        sendDataToStation(e.target.value)
    }


    return(
        <div className={style.heroContainer}>
            <div className={style.leftSection}>
                <div className={style.bthContainer}>
                    <NavLink to="/findStation">
                        <button 
                            onClick={() => setIsClicked("FindStation")} 
                            className={(isClicked === "FindStation") ? 
                            style.activeHeroBtn : style.heroBtn}>
                                Find a station
                        </button>
                    </NavLink>

                    <NavLink to="/journeyPlanner">
                        <button 
                            onClick={() => setIsClicked("JourneyPlanner")} 
                            className={(isClicked === "JourneyPlanner") ? 
                            style.activeHeroBtn : style.heroBtn}>
                                Journey Planner
                        </button>
                    </NavLink>
                </div>

                <div className={style.inputField}>
                    <input 
                        className={style.userInput}
                        type="text"
                        placeholder="Enter a location or station .."
                        value={inputLocation}
                        onChange={(e)=> handleInputLocation(e)}
                    />
                    <button 
                        className={style.submitBtn} 
                        type="submit" 
                        onClick={(e) => handleSubmit(e)}
                    >
                        <img className={style.searchIcon} src="searchIcon.png" alt="Search Icon" />
                    </button>
                </div>
                
                <div className={style.currentLocationLink}>
                    <p><img className={style.crosshair} src="./crosshair.png" alt="Crosshair" />Use my current location</p>
                </div>
            </div>
        </div>
    )
}