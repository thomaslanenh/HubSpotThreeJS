import React, {useState, useRef, useEffect, Suspense} from 'react';
import './App.scss';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import {Canvas, useFrame, useLoader} from '@react-three/fiber'
import {TextureLoader} from "three/src/loaders/TextureLoader.js";
import { invalidate } from "@react-three/fiber"
import {MapControls, Html, PerspectiveCamera} from "@react-three/drei";
import { useSpring } from '@react-spring/core'
import {a} from '@react-spring/three';

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

function Pin({props,pinInfo}){
    const [active, setActive] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(()=>{
        document.body.style.cursor = hovered ? 'pointer' : 'auto'
    },[hovered])

    const { spring } = useSpring({
        spring: active,
        onChange: () => {
            invalidate()
        },
        config: {mass:5, tension: 400, friction: 50, precision: 0.0001}
    })


    const scale = spring.to([0,1], [1,1.25]);

    const pinTexture = useLoader(TextureLoader, setPinColor(pinInfo.pin_color));

    return(
        <>
        <a.mesh {...props} scale-x={scale} scale-y={scale} scale-z={scale} onPointerOver={(e)=>setHovered(true)} onPointerOut={(e)=>setHovered(false)} onClick={() => {setShowPopup(!showPopup); setActive(Number(!active))}} position={[pinInfo.pin_position.x_pos,pinInfo.pin_position.y_pos,0]}>

            <planeGeometry args={[5,5]}/>

            <meshBasicMaterial map={pinTexture} toneMapped={false} transparent={true}/>
            <Html distanceFactor={1}>
                <div class={showPopup ? 'show content popupBlock ' + pinInfo.popup_color : 'hide content popupBlock ' + pinInfo.popup_color}>
                    <div class="pinContent">
                        <h2>{pinInfo.popup_title}</h2>
                        {ReactHtmlParser(pinInfo.popup_content)}
                    </div>
                    <div class="closeButton" onClick={()=>setShowPopup(false)}>
                        <p>✖</p>
                    </div>
                </div>
            </Html>

        </a.mesh>
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
            <div style={{ width: "75vw", height: "75vh" }}>
                <Canvas linear flat frameloop="demand" orthographic
                        camera={{position: [0, 0, 50], zoom: 20, up: [0, 0, 1], far: 10000}}
                >
                    <Suspense fallback={null}>
                        {moduleData.floor1.pins.map(e =>
                            <Pin pinInfo={e}/>
                        )}
                        <Scene mapImage={riverwalkMap}/>
                    </Suspense>
                    <MapControls enableRotate={false}/>
                </Canvas>
            </div>
        </div>
    );
}

export default App;
