import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import gsap from 'gsap';

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 400 });
let guiToggle = true;
gui.show(gui._hidden);
gui.open(gui._closed);

window.addEventListener('keypress', (e) => {
    if ((e.key === 'h' || e.key === 'H') && guiToggle == false) {
        gui.show(guiToggle);
        guiToggle = true;
    } else if ((e.key === 'h' || e.key === 'H') && guiToggle == true) {
        gui.show(guiToggle);
        guiToggle = false;
    }
});

// Cursor
const cursor = {
    x: 0,
    y: 0,
};

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Canvas
const canvas = document.querySelector('canvas.webgl');
const canvasTexture = new THREE.CanvasTexture();

// Scene
const scene = new THREE.Scene();

// Axes helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/11.png');

const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/4/nx.png',
    '/textures/environmentMaps/4/px.png',
    '/textures/environmentMaps/4/py.png',
    '/textures/environmentMaps/4/ny.png',
    '/textures/environmentMaps/4/pz.png',
    '/textures/environmentMaps/4/nz.png',
]);

/**
 * Fonts
 */
const fontLoader = new FontLoader();
const textGroup = new THREE.Group();

fontLoader.load('/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeometry1 = new TextGeometry('Adrian', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    });
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
    const text = new THREE.Mesh(textGeometry1, material);
    textGeometry1.computeBoundingBox();
    textGeometry1.translate(
        -(textGeometry1.boundingBox.max.x - 0.02) * 0.5,
        -(textGeometry1.boundingBox.max.y - 0.02) * 0.5,
        -(textGeometry1.boundingBox.max.z - 0.03) * 6
    );
    const textGeometry2 = new TextGeometry('Studio', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    });
    const text2 = new THREE.Mesh(textGeometry2, material);
    textGeometry2.computeBoundingBox();
    textGeometry2.translate(
        -(textGeometry2.boundingBox.max.x - 0.02) * 0.5,
        -(textGeometry2.boundingBox.max.y - 0.02) * 2,
        -(textGeometry2.boundingBox.max.z - 0.03) * 6
    );
    textGroup.add(text, text2);
});
scene.add(textGroup);
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 0.2;
material.envMap = environmentMapTexture;

gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);

console.time('render');

const donutGroup = new THREE.Group();
const boxGroup = new THREE.Group();

for (let i = 0; i < 500; i++) {
    const torus = new THREE.Mesh(torusGeometry, material);
    const box = new THREE.Mesh(boxGeometry, material);
    const scale = Math.random();
    torus.position.x = (Math.random() - 0.5) * 50;
    torus.position.y = (Math.random() - 0.5) * 50;
    torus.position.z = (Math.random() - 0.5) * 50;
    torus.rotation.x = Math.random() * Math.PI;
    torus.rotation.y = Math.random() * Math.PI;
    torus.scale.set(scale, scale, scale);

    box.position.x = (Math.random() - 0.5) * 50;
    box.position.y = (Math.random() - 0.5) * 50;
    box.position.z = (Math.random() - 0.5) * 50;
    box.rotation.x = Math.random() * Math.PI;
    box.rotation.y = Math.random() * Math.PI;
    box.scale.set(scale, scale, scale);

    // scene.add(torus, box);
    donutGroup.add(torus);
    boxGroup.add(box);

    console.timeEnd('render');
}
scene.add(donutGroup, boxGroup);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0x404040, 2.5);
gui.add(ambientLight, 'intensity').min(0).max(10);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x404040, 1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
gui.add(pointLight.position, 'x').min(0).max(5).name('pointLight x');
gui.add(pointLight.position, 'y').min(0).max(5).name('pointLight y');
gui.add(pointLight.position, 'z').min(0).max(5).name('pointLight z');
scene.add(pointLight);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = -20;
camera.position.y = 20;
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setClearColor(0x003c5f, 1);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
gsap.to(camera.position, { duration: 1, delay: 0.5, x: 0.3 });
gsap.to(camera.position, { duration: 1, delay: 0.5, y: 0 });
gsap.to(camera.position, { duration: 1, delay: 0.5, z: 1 });

let toggle = false;
window.addEventListener('mouseover', () => {
    toggle = true;
});

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // window.addEventListener('mouseover', (event) => {
    //     camera.position.x = cursor.x * 10;
    //     camera.position.y = cursor.y * 10;
    //     camera.position.z = Math.abs(cursor.x * 25) + 2.5;
    // });

    // Update objects
    // textGroup.position.x = Math.sin(elapsedTime) * 0.5;
    // textGroup.position.y = Math.sin(elapsedTime) * 0.5;
    // textGroup.position.z = Math.sin(elapsedTime) * 0.5;
    textGroup.rotation.x = Math.sin(elapsedTime) * 0.25;
    textGroup.rotation.y = Math.sin(elapsedTime) * 0.25;
    textGroup.rotation.z = Math.sin(elapsedTime) * 0.25;

    // donutGroup.position.y = Math.sin(elapsedTime) * 0.25;
    // donutGroup.position.x = Math.sin(elapsedTime) * 0.25;
    // boxGroup.position.y = Math.sin(elapsedTime) * 0.25;
    // boxGroup.position.x = Math.sin(elapsedTime) * 0.25;

    donutGroup.rotation.x = Math.sin(elapsedTime) * -0.25;
    donutGroup.rotation.y = Math.sin(elapsedTime) * -0.25;
    donutGroup.rotation.z = Math.sin(elapsedTime) * -0.25;

    boxGroup.rotation.x = Math.sin(elapsedTime) * -0.25;
    boxGroup.rotation.y = Math.sin(elapsedTime) * -0.25;
    boxGroup.rotation.z = Math.sin(elapsedTime) * -0.25;

    if (toggle == true) {
        gsap.to(camera.position, { duration: 0.3, delay: 0.1, x: cursor.x * 10 });
        gsap.to(camera.position, { duration: 0.3, delay: 0.1, y: cursor.y * 10 });
        gsap.to(camera.position, { duration: 0.3, delay: 0.1, z: Math.abs(cursor.x * 15) + 1.5 });
    }

    // Update Camera
    // camera.position.x = cursor.x * 10;
    // camera.position.y = cursor.y * 10;
    // camera.position.z = Math.abs(cursor.x * 25) + 2.5;
    // camera.lookAt(text.position);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
