import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

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
    camera.position.z = 7;
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
    const vertices = [
      -1, 1, 0,
      1, 1, 0,
      -1, -1, 0,
      1, -1, 0,
    ];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    const material= new THREE.LineDashedMaterial({
      color: 0xffff00,
      dashSize: 4,
      gapSize: 5,
      scale: 1,
    }) // 선에 대한 색상만 지정, 굵기는 지정가능하지만 반영 안됨
    const line = new THREE.LineLoop(geometry, material);
    this._scene.add(line); 
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
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001;
  }
}

window.onload = function () {
  new App();
}
