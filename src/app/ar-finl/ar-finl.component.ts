import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
const AFRAME = (window as any).AFRAME;
// const { THREE } = AFRAME;

@Component({
  selector: 'barthauer-ar-finl',
  templateUrl: './ar-finl.component.html',
  styleUrls: ['./ar-finl.component.scss'],
})
export class ArFinlComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // this.insertElemnts();
    this.stack();
  }

  public stack() {
    const scene: any = document.querySelector('a-scene');
    const firstObj: any = document.createElement('a-entity');
    const secondObj: any = document.createElement('a-entity');
    const sphereRed: any = document.createElement('a-sphere');
    const sphereBlue: any = document.createElement('a-sphere');

    scene.appendChild(firstObj);
    scene.appendChild(secondObj);

    firstObj.setAttribute('id', 'first');
    firstObj.setAttribute('gps-entity-place', 'latitude: 35.83536188036047; longitude: 10.59502392075956;');
    // sphereRed
    sphereRed.setAttribute('id', 'gpsEntity'); //id must be != mixin
    sphereRed.setAttribute('scale', '5 5 5');
    sphereRed.setAttribute('color', 'red');
    // sphereRed.setAttribute('gps-entity-place', 'latitude: 35.83536188036047; longitude: 10.59502392075956;');
    firstObj.appendChild(sphereRed);

    secondObj.setAttribute('id', 'second');
    secondObj.setAttribute('gps-entity-place', 'latitude: 35.835265; longitude: 10.594692;');
    // sphereBlue
    sphereBlue.setAttribute('id', 'gpsEntity2'); //id must be != mixin
    sphereBlue.setAttribute('scale', '5 5 5');
    sphereBlue.setAttribute('color', 'blue');
    // sphereBlue.setAttribute('gps-entity-place', 'latitude: 35.835265; longitude: 10.594692;');
    secondObj.appendChild(sphereBlue);

    //tunnel
    const firstPos = new THREE.Vector3();
    const secondPos = new THREE.Vector3();
    const cylinder: any = document.createElement('a-cylinder');

    cylinder.setAttribute('tunnel', '');
    cylinder.setAttribute('radius', '4');
    cylinder.setAttribute('color', 'green');
    cylinder.setAttribute('rotation', '0 90 -90');

    const idx = setInterval(() => {
      // console.log('you r in interval');
      
      firstPos.copy(sphereRed.object3D.position);
      secondPos.copy(sphereBlue.object3D.position);

      const distance = firstPos.distanceTo(secondPos);
      // console.log('distance: ', distance);
      
      if (!distance) return;
      console.log('anchors ready');
      clearInterval(idx);

      const middle = firstPos
        .multiplyScalar(-1)
        .add(secondPos)
        .multiplyScalar(1 / 2);

      cylinder.setAttribute('height', distance);
      scene.appendChild(cylinder);
      scene.object3D.lookAt(firstPos);
      scene.object3D.position.copy(middle).add(sphereRed.object3D.position);
    }, 500);
  }

  // public insertElemnts(){
  //   AFRAME.registerComponent('scene-foo', {
  //     init() {
  //       console.log('here');
  //       const scene = document.querySelector('a-scene');
  //       const gpsEntity: any = document.createElement('a-entity');
  //       const cylinder: any = document.createElement('a-cylinder');

  //       const gpsEntity2: any = document.createElement('a-entity');
  //       const cylinder2: any = document.createElement('a-cylinder');

  //       //gpsEntity
  //       // gpsEntity.setAttribute('mixin', 'gpsEntity');
  //       gpsEntity.setAttribute('id', 'gpsEntity'); //id must be != mixin
  //       gpsEntity.setAttribute('gps-entity-place', 'latitude: 35.83536188036047; longitude: 10.59502392075956;');
  //       //child
  //       cylinder.setAttribute('test-cylinder', '');
  //       cylinder.setAttribute('color', '#FF9500');
  //       cylinder.setAttribute('height', '1');
  //       cylinder.setAttribute('witdh', '8');
  //       cylinder.setAttribute('radius', '0.75');
  //       gpsEntity.appendChild(cylinder);
  //       scene.appendChild(gpsEntity);

  //       //gpsEntity2
  //       // gpsEntity2.setAttribute('mixin', 'gpsEntity2');
  //       gpsEntity2.setAttribute('id', 'gpsEntity2'); //id must be != mixin
  //       gpsEntity2.setAttribute('gps-entity-place', 'latitude: 35.835265; longitude: 10.594692;');
  //       //child
  //       cylinder2.setAttribute('test-cylinder2', '');
  //       cylinder2.setAttribute('color', '#30b0ae');
  //       cylinder2.setAttribute('height', '1');
  //       cylinder2.setAttribute('witdh', '8');
  //       cylinder2.setAttribute('radius', '0.75');
  //       gpsEntity2.appendChild(cylinder2);
  //       scene.appendChild(gpsEntity2);
  //     },
  //   });
  // }

  public insertElemnts() {
    AFRAME.registerComponent('scene-foo', {
      init() {
        let scene = document.querySelector('a-scene');
        let cylinder: any = document.createElement('a-cylinder');
        cylinder.setAttribute('test-cylinder', '');
        cylinder.setAttribute('id', 'cylinder');
        cylinder.setAttribute('color', '#FF9500');
        cylinder.setAttribute('height', '1');
        cylinder.setAttribute('witdh', '8');
        cylinder.setAttribute('radius', '0.75');
        cylinder.setAttribute('position', '0 0 0');
        cylinder.setAttribute('gps-entity-place', 'latitude: 35.83536188036047; longitude: 10.59502392075956;');
        scene.appendChild(cylinder);

        let cylinder2: any = document.createElement('a-cylinder');
        cylinder2.setAttribute('test-cylinder2', '');
        cylinder.setAttribute('id', 'cylinder2');
        cylinder2.setAttribute('color', '#30b0ae');
        cylinder2.setAttribute('height', '1');
        cylinder2.setAttribute('witdh', '8');
        cylinder2.setAttribute('radius', '0.65');
        cylinder2.setAttribute('position', '0 0 0');
        cylinder2.setAttribute('gps-entity-place', 'latitude: 35.835265; longitude: 10.594692;');
        scene.appendChild(cylinder2);

        cylinder2.addEventListener('loaded', (e) => {
          console.log('loeaded');

          console.log('e: ', e);

          const id: any = document.getElementById('cylinder2');
          console.log('id: ', id);
          console.log('mesh: ', id.getObject3D('mesh'));
          const mesh = id.getObject3D('mesh');
          const boxPosition = new THREE.Vector3();
          mesh.getWorldPosition(boxPosition);
          console.log(boxPosition);

          console.log('id.getObject3D: ', id.getObject3D('test-cylinder2'));
          console.log('id.getObject3D.el: ', id.getObject3D('mesh').el);
          // console.log('id.getObject3D.el.postion: ',id.getObject3D('mesh').el.position());
          // console.log('id.getObject3D.el.getWorldPosition: ',id.getObject3D('mesh').el.getWorldPosition());
        });
      },
    });
  }
}
