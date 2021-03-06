import * as THREE from "three";
import {useEffect} from "@types/react";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";

const scene = new THREE.Scene()
scene.background = new THREE.Color('#f8f7f2')

var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000)

const loader = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader()



// Textures
// const riverwalkLogo = textureLoader.load('https://2822935.fs1.hubspotusercontent-na1.net/hubfs/2822935/RiverWalk/Test%20Images/riverwalklogo.png')
// const riverwalkMap = textureLoader.load(moduleData.floor1.map_image.src)

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight)

// document.body.appendChild(renderer.domElement)
const threeRef = document.querySelector('.threeRef');
threeRef.appendChild(renderer.domElement)

var geometry = new THREE.PlaneGeometry(5,3)
var material = new THREE.MeshBasicMaterial()

// Dynamically Set Map Assets
let riverwalkMap = textureLoader.load(moduleData.floor1.map_image.src);

useEffect(() => {
    console.log(floor);
    switch(setFloor){
        case 1:
            return riverwalkMap = textureLoader.load(moduleData.floor1.map_image.src)
        case 2:
            return riverwalkMap = textureLoader.load(moduleData.floor2.map_image.src)
        case 3:
            return riverwalkMap = textureLoader.load(moduleData.floor3.map_image.src)
        default:
            return riverwalkMap = textureLoader.load(moduleData.floor1.map_image.src)
    }

}, [setFloor])

material.map = riverwalkMap
material.transparent = true

var cube = new THREE.Mesh(geometry, material)

scene.add(cube)

// Controls
const controls = new TrackballControls(camera, renderer.domElement)
controls.enabled = true
controls.mouseButtons = {
    MIDDLE: THREE.MOUSE.PAN
}
controls.noPan = false
controls.maxDistance = 2
controls.minDistance = 1
controls.noRotate = true
controls.panSpeed = 1
controls.zoomSpeed = .5
controls.dynamicDampingFactor = 0.1
controls.keys = ['KeyA', 'KeyS', 'KeyD']
camera.position.z = 5;

const clock = new THREE.Clock()
renderer.setPixelRatio(window.devicePixelRatio)

var animate = function(){

    const elapsedTime = clock.getElapsedTime()

    // rotates logo back and forth
    // cube.rotation.y = Math.sin(elapsedTime) * .2

    controls.update()
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
}

let onWindowResize = function(){
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize, false)

animate()