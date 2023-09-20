import "./index.css"
import React, { useState, useEffect } from "react";
import { socket } from './socket';
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon, divIcon, point } from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"

export default function Maps() {

    const url = "http://localhost:1337/delayed";

    const [result, setData] = useState([])
    const [markers, setMarkers] = useState([])
    
    const fetchInfo = () => { 
    return fetch(url) 
            .then((response) => response.json()) 
            .then((d) => setData(d.data)) 
    }
    useEffect(() => {
        fetchInfo();
    }, [])

    // markers
    // let markers = [

    //     // {
    //     // geocode: [62.173276, 14.942265],
    //     // popUp: "Hello, I am pop up 1"
    //     // },
    //     // {
    //     // geocode: [62.473276, 14.952265],
    //     // popUp: "Hello, I am pop up 2"
    //     // },
    //     // {
    //     // geocode: [62.873276, 14.242265],
    //     // popUp: "Hello, I am pop up 3"
    //     // }
    // ];
    // console.log(result)
    socket.on("message", (data) => {
        // console.log(data.position)
        setMarkers(
            [...markers,
            { geocode: data.position, popUp: `${data.trainnumber}` }
        ]
        )
        // let newMarker = {geocode: data.position, popUp: `${data.trainnumber}`}
        // markers.push(newMarker)
    });
    console.log(markers)
    // result.map((item) => {
    //     console.log(item.AdvertisedTrainIdent)
    //     newMarker = {geocode: [item.position[1], item.position[3]], popUp: `${item.trainnumber}`}
    //     markers.push(newMarker)
    // })

    const customIcon = new Icon({
        iconUrl: require("./img/icon.png"),
        iconSize: [38, 38]
    })

    const createCustomClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
            className: "custom-marker-cluster",
            iconSize: point(33, 33, true)
        })

    }

    return (
        <MapContainer center={[62.173276, 14.942265]} zoom={5}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createCustomClusterIcon}
            >
            {markers.map(marker =>(
                <Marker position={marker.geocode} icon={customIcon}>
                    <Popup>{marker.popUp}</Popup>
                </Marker>
            ))}
            </MarkerClusterGroup>
        </MapContainer>
    )
}