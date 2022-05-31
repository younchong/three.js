import * as THREE from "../build/three.module.js";
import {OrbitControls} from "../examples/jsm/controls/OrbitControls.js";
import { FontLoader } from '../examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from "../examples/jsm/geometries/TextGeometry.js";

class App {
  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);
    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();
// private이 js에는 없어서 _로 App 내부에서만 사용하는 메소드 혹은 필드로 약속
    window.onresize = this.resize.bind(this);
    this.resize();
// resize는 renderer나 camera는 창크기가 변경될때 속성값을 재설정해주기 위해서
    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    new OrbitControls(this._camera, this._divContainer);
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      100
    );
    camera.position.z = 15;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;  // 광원의 색상
    const intensity = 1; //광원의 세기
    const light = new THREE.DirectionalLight(color, intensity); 
    light.position.set(-1, 2, 4); // 광원의 위치
    this._scene.add(light);
  }

  _setupModel() {
    const fontLoader = new FontLoader();
    async function loadFont(that) {
      const url ="../examples/fonts/helvetiker_regular.typeface.json";
      const font = await new Promise((resolve, reject) => {
        fontLoader.load(url, resolve, undefined, reject);
      });

      const geometry = new TextGeometry("Free.js is very funny", {
        font: font,
        size: 3,
        height: 1.5,
        curveSegments: 4,
        bevelEnabled: true, 
        bevelThickness: 0.7,
        bevelSize: .7,
        bevelSegment: 2
      });

      const fillMaterial = new THREE.MeshPhongMaterial({color: 0x515151});
      const cube = new THREE.Mesh(geometry, fillMaterial);

      const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
      const line = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry), lineMaterial
      );
      const group = new THREE.Group();
      group.add(cube);
      group.add(line);

      that._scene.add(group);
      that._cube = group;
    };
    loadFont(this);
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateMatrix();

    this._renderer.setSize(width, height);
  }

  render(time) {
    this._renderer.render(this._scene, this._camera);
    //this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001;
    this._cube.rotation.x = time;
    this._cube.rotation.y = time;
  }
}

window.onload = function () {
  new App();
}
