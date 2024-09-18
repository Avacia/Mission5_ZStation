import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api'
import { useState, useEffect } from 'react'
import style from './Map.module.css'

export default function map({ getDataFromStation, sendStoreBackToStation }){
    const [mapCenter, setMapCenter] = useState({lat: -40.88694417577929, lng: 172.25732675689105})

    const [userInputLocation, setUserInputLocation] = useState({lat: 0, lng: 0})
    const [zoom, setZoom] = useState(5.6)
    const [map, setMap] = useState(null)
    const [maps, setMaps] = useState(null)
    const [address, setAddress] = useState("")
    const [storeLocation, setStoreLocation] = useState([])
    const [filter, setFilter] = useState([])
    const [storeByRegion, setStoreByRegion] = useState([])
    const [nearbyStores, setNearbyStores] = useState([])
    const [radius, setRadius] = useState(100)
    const apiKey = process.env.REACT_APP_API_KEY

    const locationPosition= [
        {
            region: "Auckland",
            latitude:-36.848822281804644,
            longitude:174.75521620223307
        }, 
        {
            region:"Bay of Plenty",
            latitude:-38.071153960657895,
            longitude:176.8898470084462
        }, 
        {
            region:"Canterbury",
            latitude:-43.319949602570276,
            longitude:172.43597833938347
        }, 
        {
            region:"Gisborne",
            latitude:-38.63237898761293,
            longitude:177.9504248551218
        }, 
        {
            region:"Hawkes Bay",
            latitude:-39.430255708701395,
            longitude:176.78757764694
        }, 
        {
            region:"Manawatu-Wanganui",
            latitude:-39.91875400309465,
            longitude:175.08823324160463
        }, 
        {
            region: "Nelson, Tasman, Marlborough",
            latitude:-41.29102117725894,
            longitude:173.29338139463258
        }, 
        {
            region:"Northland",
            latitude:-35.25532369963732,
            longitude:173.64282653685146
        }, 
        {
            region:"Otago",
            latitude:-45.10299286110708,
            longitude:169.42897005594716
        }, 
        {
            region:"Southland",
            latitude:-46.1058167159193,
            longitude:168.22156162883638
        }, 
        {
            region:"Taranaki",
            latitude:"-39.30929368291425",
            longitude:"174.28370285496015"
        }, 
        {
            region:"Waikato",
            latitude:-37.485614597170084,
            longitude:175.02105659728073
        }, 
        {
            region:"Wellington",
            latitude:-41.28184802654788,
            longitude:"174.7769263684856"
        }, 
        {
            region:"West Coast",
            latitude:-42.47696520275326,
            longitude:171.4517923892756
        },
    ]

    const locationCount=[
        {"Auckland": 71},
        {"Bay of Plenty": 16},
        {"Canterbury": 32},
        {"Gisborne": 2},
        {"Hawks Bay": 12},
        {"Manawatu-Wanganui": 12},
        {"Nelson, Tasman, Marlborough": 10},
        {"Northland": 8},
        {"Otago": 12},
        {"Southland": 5},
        {"Taranaki": 9},
        {"Waikato": 33},
        {"Wellington": 22},
        {"West Coast": 2}
    ]

    const containerStyle = {
        width: '100%',
        height: '100vh'
    };

    const options = {
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        keyboardShortcuts: false
    }

    useEffect(() => {
        if(getDataFromStation && getDataFromStation?.locationData){
            setAddress(getDataFromStation.address)
            setFilter(getDataFromStation.filter)
            setStoreLocation(getDataFromStation.locationData)

            if(address === "" && storeLocation.length > 0){
                sortStoreByRegion()               
            }
            console.log("Address updated: ", getDataFromStation.address)
        }
    }, [getDataFromStation, storeLocation])

    useEffect(() => {
        console.log("useEffect triggered:", { maps, map, address })
        if(maps && map && address){
            console.log("Running geocode for address: ", address)
            handleGeoCode(address)
        }
    }, [maps, map, address])

    useEffect(() => {
        if(userInputLocation.lat !== 0 && userInputLocation.lng !== 0){
            const radiusKm = 15
            const servicesFilter = Array.isArray(filter[0]) ? filter[0]: []
            const specialFuelTypeFilter = Array.isArray(filter[1]) ? filter[1]: []
            const typeFilter = typeof filter[2] === 'string' ? filter[2] : '';

            const nearbyStore = storeLocation.map(store => {
                const lat = Number(store.latitude)
                const lng = Number(store.longitude)
                const awayFromInput = calculateDistance(userInputLocation.lat, userInputLocation.lng, lat, lng)
                

                const matchesServices = servicesFilter.length === 0 || servicesFilter.every(requiredService =>
                    store.services.some(service => service.name === requiredService)
                )
                const matchesSpecialFuelType = specialFuelTypeFilter.length === 0 || specialFuelTypeFilter.every(requiredSpecialFuel => 
                    store.special_fuel_Type.some(fuel => fuel.name === requiredSpecialFuel)
                )
                const matchesType = typeFilter === "" || typeFilter === store.type

                console.log("Services Filter:", servicesFilter);
                console.log("Store Services:", store.services);
                console.log("Special Fuel Type Filter:", specialFuelTypeFilter);
                console.log("Store Special Fuel Types:", store.special_fuel_Type);
                console.log("Type Filter:", typeFilter);
                console.log("Store Type:", store.type);

                return { 
                    ...store, 
                    distance: awayFromInput,
                    hasRequiredServices: matchesServices && matchesSpecialFuelType && matchesType    
                }     
            })
            .filter(store => 
                !isNaN(store.latitude) && 
                !isNaN(store.longitude) && 
                store.distance <= radiusKm &&
                store.hasRequiredServices
            )
            .sort((a, b) => a.distance - b.distance)
            setNearbyStores(nearbyStore)

            if(nearbyStore.length > 0){
                setMapCenter({lat: Number(nearbyStore[0].latitude), lng: Number(nearbyStore[0].longitude)})
            }
        }
    }, [userInputLocation, storeLocation, filter])

    useEffect(() => {
        if(address !== ""){
            radius > 100 ? updateZoom() : setZoom(17)            
        }
        else{
            setZoom(5.6)
        }
    }, [address, radius])

    useEffect(() => {
        if(nearbyStores.length > 0){
            sendStoreBackToStation(nearbyStores)
        } 
    }, [nearbyStores])

    function updateZoom(){
        const updateZoom = Math.ceil(radius / 2500)
        setZoom(17 - updateZoom)
    }

    function handleApiLoaded(map, maps){
        console.log("API Loaded: ", {map, maps})
        setMap(map)
        setMaps(maps)
    }

    function handleGeoCode(userInputAddress){
        if(!maps || !maps.Geocoder){
            console.error("Google Maps not loaded yet!!")
        }

        if(!address){
            console.error("Address is Empty!!")
        }

        const geocoder = new maps.Geocoder()
        geocoder.geocode({address: userInputAddress}, (results, status) => {
            if(status === "OK"){
                const location = results[0].geometry.location
                const lat = location.lat()
                const lng = location.lng()
                setUserInputLocation({lat, lng})
                console.log("Position Changed", location)
            }
            else{
                console.error("Geocode failed: ", status)
            }
        })
    }

    function calculateDistance(lat1, lng1, lat2, lng2){
        function toRadians(deg){
            return deg * (Math.PI / 180)
        }

        const radiusOfEarthKm = 6371
        const distanceOfLat = toRadians(lat2 - lat1)
        const distanceOfLng = toRadians(lng2 - lng1)
        const a = Math.sin(distanceOfLat / 2) * Math.sin(distanceOfLat / 2) +
                  Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                  Math.sin(distanceOfLng / 2) * Math.sin(distanceOfLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return radiusOfEarthKm * c;
    }

    function sortStoreByRegion(){
        const storesByRegion = storeLocation?.reduce((acc, store) => {
            const region = store.region
            if(region){
                if(!acc[region]){
                    acc[region] = []
                }
                acc[region].push(store)
            }
            return acc
        }, {})
        setStoreByRegion(storesByRegion)
    }

    function handleRadiusChange(e){
        setRadius(e.target.value)
    }

    console.log("Map Filter: ", filter)
    console.log("Map Store Location: ", storeLocation)
    console.log("Map NearByStore: ", nearbyStores)
    console.log("Map StoreByRegion: ",storeByRegion)
    return(
        <div className={style.mapContainer}>
            <LoadScript
                googleMapsApiKey={apiKey}
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={zoom}
                    options={options}
                    onLoad={mapInstance => handleApiLoaded(mapInstance, window.google.maps)}
                >
                    {address === "" &&
                        locationPosition.map((location, index) => {
                            const lat = Number(location.latitude)
                            const lng = Number(location.longitude)
                            const regionCount = locationCount.find(place => place[location.region])
                            const regionStoreCount = storeByRegion ? storeByRegion[location.region]?.length : regionCount[location.region]
                            return(
                                <Marker
                                    key={index}
                                    position={{lat, lng}}
                                    icon={{
                                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                                                <circle cx="25" cy="25" r="20" stroke="orange" stroke-width="4" fill="rgba(255, 102, 0, 0.4)" />
                                                <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="16px" font-family="Arial" fill="white">${regionStoreCount}</text>
                                            </svg>
                                        `),
                                    }}
                                />
                            )
                        }) 
                    }
                    
                    <Circle
                        center={mapCenter}
                        radius={parseInt(radius)}
                        options={{
                            fillColor:"orange",
                            fillOpacity: 0.2,
                            strokeColor: "red",
                            strokeOpacity: 0.7,
                            strokeWeight: 1
                        }}
                    />
                    {address !== "" &&
                        nearbyStores.map((store, index) => {
                            const lat = Number(store.latitude)
                            const lng = Number(store.longitude)
                            return(
                                    <Marker
                                        key={index}
                                        position={{ lat, lng }}
                                        icon={{
                                            url:"/public/StationPin.png",
                                            scaledSize: new window.google.maps.Size(40,50)
                                        }}
                                    />
                                )
                        })
                    }
                </GoogleMap>
            </LoadScript>

            {address !== "" && 
                <div className={style.distanceSlider}>
                    <label>{radius / 1000} km</label>
                    <input
                        type="range"
                        min="100"
                        max="15000"
                        value={radius}
                        onChange={handleRadiusChange}
                        style={{width: "100%"}}
                    />
                </div>
            }
        </div>
    )
}