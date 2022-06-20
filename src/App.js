import React, {useState, useRef, useEffect, Suspense} from 'react';
import './App.scss';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import {Canvas, useFrame, useThree, useLoader} from '@react-three/fiber'
import {TextureLoader} from "three/src/loaders/TextureLoader.js";
import { invalidate } from "@react-three/fiber"
import {MapControls, Html, PerspectiveCamera, Bounds, Glow, Sparkles, Billboard} from "@react-three/drei";
import { useSpring } from '@react-spring/core'
import {a} from '@react-spring/three';


function App({moduleData}) {
    const [floor, setFloor] = useState(1);
    const [currentFloor, setCurrentFloor] = useState(floor);
    const [riverwalkMap, setRiverwalkMap] = useState(moduleData.floor1.map_image.src);
    const [currentPinSet, setCurrentPinSet] = useState('floor1');
    const [pinInfo, setPinInfo] = useState()
    const [zoomLevel, setZoomLevel] = useState(15);
    const [pinHtml, setPinHtml] = useState("");
    const [showMap, setShowMap] = useState(true);
    const [pinHeader, setPinHeader] = useState("Room: ");

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

        function returnPinClass(pin){
            console.log('pin is: ' + pin);
            switch (pin){
                case 'available':
                    return '<span class="greenText">Available</span>';
                default:
                    return '<span class="redText">Sold</span>';
            }
        }

        function returnPinImage(pin){
            console.log('pin image is: ' + pin);
            return `<img src=${pin.src} alt=${pin.alt}/>`;
        }

        function setHtml(){
            setPinHeader(`<div class="popupContentDiv">
                                <h2>Room: ${pinInfo.popup_title}</h2>
                            </div>`);
            setPinHtml(`

                        <div class="popupContentBlock">
                            <div class="contentBlocks"> 
                                <div class="contentBlockLeft">
                                    <div class="fractionalDiv">
                                        ${pinInfo.pin_image ? returnPinImage(pinInfo.pin_image): ''}
                                        <h4>Fractional Availability:</h4>
                                                        <ul>
                                                            <li>
                                                                <span class="listHeader slightPadRight"> I:</span>${returnPinClass(pinInfo.availability.frac1_av)}
                                                            </li>
                                                             <li>
                                                                <span class="listHeader slightPadRight"> II:</span>${returnPinClass(pinInfo.availability.frac2_av)}
                                                            </li>
                                                             <li>
                                                                <span class="listHeader slightPadRight"> III:</span>${returnPinClass(pinInfo.availability.frac3_av)}
                                                            </li>
                                                             <li>
                                                                <span class="listHeader slightPadRight"> IV:</span>${returnPinClass(pinInfo.availability.frac4_av)}
                                                            </li>
                                                             <li>
                                                                <span class="listHeader slightPadRight"> V:</span>${returnPinClass(pinInfo.availability.frac5_av)}
                                                            </li>
                                                             <li>
                                                                <span class="listHeader slightPadRight"> VI:</span>${returnPinClass(pinInfo.availability.frac6_av)}
                                                            </li>
                                                        </ul>
                                    </div>
                                </div>
                                <div class="contentBlockRight">
                                   ${pinInfo.popup_content}
                                </div>
                            </div>
                         
                                
                    </div>
`);
        }
        const scale = spring.to([0,1], [.6,1.25]);

        const pinTexture = useLoader(TextureLoader, setPinColor(pinInfo.pin_color));


        return(
            <>
                <a.mesh {...props}
                        scale-x={scale}
                        scale-y={scale}
                        scale-z={scale}
                        onPointerOver={(e)=> {
                            setActive(Number(!active));
                        }}
                        onPointerOut={(e)=>{
                            setActive(Number(!active));
                        }}
                        onClick={e => {
                            setHtml();
                            setShowMap(false);
                        }}
                        onPointerMissed={() => {setShowPopup(false)}}
                        position={[pinInfo.pin_position.x_pos,pinInfo.pin_position.y_pos,0]}
                        >
                    <planeGeometry args={[5,5]}/>
                    <meshBasicMaterial map={pinTexture} toneMapped={false} transparent={true}/>

                </a.mesh>
            </>
        )
    }

    function setFloorButton(floor) {
        setFloor(floor)
        floorHeading(floor)
        changePins(floor)
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

    function changePins(sentFloor){
        setCurrentPinSet('floor'+sentFloor);
    }

    function drawPins(currentSet){
        switch (currentSet){
            case 'floor1':
                return moduleData.floor1.pins;
            case 'floor2':
                return moduleData.floor2.pins;
            case 'floor3':
                return moduleData.floor3.pins;
        }
    }
    // THREE JS STUFF

    // Drop Pins Programmatically


    console.log(moduleData);
    return (
        <div className="cms-react-boilerplate__container">
            <div className={"mapInfo"}>
                <h1>Floor {currentFloor}</h1>
                <p>Floors:</p>
                <div className={"buttonSelector"}>
                    <button onClick={(e) => {
                        setFloorButton(1);
                        setPinHtml('');
                    }}>1</button>
                    <button onClick={(e) => {
                        setFloorButton(2);
                        setPinHtml('');
                    }}>2</button>
                    <button onClick={(e) => {
                        setFloorButton(3);
                        setPinHtml('');
                    }}>3</button>
                </div>
            </div>
            <div className={"mapGrid"}>
                <div className={"mapDiv"} style={{ width: "75vw", height: "75vh", border: "2px solid black" }}>
                    <Canvas linear flat frameloop="demand" orthographic
                            camera={{position: [0, 0, 20], zoom: zoomLevel, up: [0, 0, 1], far: 10000}}
                    >
                        {showMap ? <Suspense fallback={null}>
                            {
                                drawPins(currentPinSet).map(e =>
                                    <Pin pinInfo={e}/>
                                )}

                                <Scene mapImage={riverwalkMap}/>
                        </Suspense> : null}
                        <MapControls enableRotate={false}/>
                    </Canvas>
                </div>
                <div className={'infoLeft'} >
                    {!showMap ?
                    <div className={"infoGridBlock"}>
                        {ReactHtmlParser(pinHeader)}
                        <div className="closeButton" onClick={() => {
                            setShowMap(true);
                            setPinHtml('');
                        }}>
                            <p>✖</p>
                        </div>
                    </div>
                    : null }
                    {ReactHtmlParser(pinHtml)}
                </div>
            </div>
        </div>
    );
}

export default App;
