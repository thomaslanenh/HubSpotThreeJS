import React, {useState, useEffect, Suspense} from 'react';
import './App.scss';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import {Canvas, useFrame, useLoader} from '@react-three/fiber'
import {TextureLoader} from "three/src/loaders/TextureLoader.js";
import {MapControls, PerspectiveCamera} from "@react-three/drei";


function setPinColor(pinColor){
    switch (pinColor){
        case "green":
            return 'https://2822935.fs1.hubspotusercontent-na1.net/hubfs/2822935/RiverWalk/Test%20Images/pin_green.png'
        case "red":
            return 'https://2822935.fs1.hubspotusercontent-na1.net/hubfs/2822935/RiverWalk/Test%20Images/pin_red.png'
        case "yellow":
            return 'https://2822935.fs1.hubspotusercontent-na1.net/hubfs/2822935/RiverWalk/Test%20Images/pin_yellow.png'
        default:
            return 'https://2822935.fs1.hubspotusercontent-na1.net/hubfs/2822935/RiverWalk/Test%20Images/pin_green.png'
    }
}

function Pin(pinInfo){
    const pinTexture = useLoader(TextureLoader, setPinColor(pinInfo.pin_color));
    console.log(pinInfo)
    return(
        <>
        <mesh position={[5,-8,0]}>
            <planeGeometry args={[5,5]}/>
            <meshBasicMaterial map={pinTexture} toneMapped={false} transparent={true}/>
        </mesh>
        </>
    )
}

function Scene({mapImage}){
    const riverwalkMap = useLoader(TextureLoader, mapImage);

    return(
        <>
            <mesh>
                <planeGeometry args={[70,50]}/>
                <meshBasicMaterial map={riverwalkMap} toneMapped={false}/>
            </mesh>
        </>
    )
}


function App({moduleData}) {
    const [floor, setFloor] = useState(1);
    const [currentFloor, setCurrentFloor] = useState(floor);
    const [riverwalkMap, setRiverwalkMap] = useState(moduleData.floor1.map_image.src);
    const [pinInfo, setPinInfo] = useState()

    function setFloorButton(floor) {
        setFloor(floor)
        floorHeading(floor)
        setCurrentFloor(floor)
    }

    function floorHeading(sentFloor) {
        switch (sentFloor) {
            case 1:
                changeMap(moduleData.floor1)
                return ReactHtmlParser(moduleData.floor1.heading);
            case 2:
                changeMap(moduleData.floor2)
                return ReactHtmlParser(moduleData.floor2.heading);
            case 3:
                changeMap(moduleData.floor3)
                return ReactHtmlParser(moduleData.floor3.heading);
            default:
                return 'No Floor Selected';
        }
    }

    function changeMap(floorData) {
        setRiverwalkMap(floorData.map_image.src);
    }

    // THREE JS STUFF

    // Drop Pins Programmatically


    console.log(moduleData)
    return (
        <div className="cms-react-boilerplate__container">
            <h1>Floor {currentFloor}</h1>
            <p>Floors:</p>
            <div className={"buttonSelector"}>
                <button onClick={(e) => setFloorButton(1)}>1</button>
                <button onClick={(e) => setFloorButton(2)}>2</button>
                <button onClick={(e) => setFloorButton(3)}>3</button>
            </div>
            <h2>{(e) => floorHeading(currentFloor)}</h2>

            <Canvas linear flat frameloop="demand" orthographic
                    camera={{position: [0, 0, 50], zoom: 20, up: [0, 0, 1], far: 10000}}>
                <Suspense fallback={null}>
                    {moduleData.floor1.pins.map(e =>
                        <Pin pinInfo={e}/>
                    )}
                    <Scene mapImage={riverwalkMap}/>
                </Suspense>
                <MapControls enableRotate={false}/>
            </Canvas>
        </div>
    );
}

export default App;
