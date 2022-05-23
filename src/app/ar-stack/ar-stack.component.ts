import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { Entity } from '../dataModel/entity.model';
const AFRAME = (window as any).AFRAME;
// const { THREE } = AFRAME;
type Coord = { latitude: number; longitude: number };

@Component({
  selector: 'barthauer-ar-stack',
  templateUrl: './ar-stack.component.html',
  styleUrls: ['./ar-stack.component.scss'],
})
export class ArStackComponent implements OnInit {
  public newCrd: Coord = { latitude: 0, longitude: 0 };
  public showInfo: boolean = false;
  public first: Entity = {
    component: 'a-entity',
    position: '5 5 5'
  }
  public designation: string;
  public isPopupVisible: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.createElemnts();
    this.relativePosition('first', 'second');
    // this.relativePosition('second', 'third');
    // this.arc();
    this.tunnel('first', 'second');
    // this.tunnel('second', 'third');
    this.events();
    this.createGPSEntity2(this.first);

  }

  public shiftPositionBy(crd: Coord, dx, dy) {
    const r_earth = 6378 * 1000;
    const new_latitude = crd.latitude + (dx / r_earth) * (180 / Math.PI);
    const new_longitude = crd.longitude + ((dy / r_earth) * (180 / Math.PI)) / Math.cos((crd.latitude * Math.PI) / 180);

    this.newCrd.latitude = new_latitude;
    this.newCrd.longitude = new_longitude;
    console.log('return this.newcrd: ', this.newCrd);
    return this.newCrd;
  }

  public createElemnts() {
    const scene: any = document.querySelector('a-scene');
    const sphereRed: any = document.createElement('a-sphere');
    const sphereBlue: any = document.createElement('a-sphere');
    const spherePink: any = document.createElement('a-sphere');
    const cylinder: any = document.createElement('a-cylinder');

    //add entities
    console.time('first method')
    const firstObj: any = this.createGPSEntity('a-entity','first');
    const secondObj: any = this.createGPSEntity('a-entity', 'second');
    const thirdObj: any = this.createGPSEntity('a-entity', 'third');
    const pipe: any = this.createGPSEntity('a-entity', 'tunnel', 'tunnel');
    pipe.setAttribute('position', '0 -90 0');
    
     
    //create primitives
    sphereRed.setAttribute('scale', '5 5 5');
    sphereRed.setAttribute('color', 'red');
    sphereRed.setAttribute('position', '0 -90 0');

    sphereBlue.setAttribute('scale', '5 5 5');
    sphereBlue.setAttribute('color', 'blue');
    sphereBlue.setAttribute('position', '0 -90 0');


    spherePink.setAttribute('scale', '5 5 5');
    spherePink.setAttribute('color', 'pink');
    spherePink.setAttribute('position', '0 -90 0');


    cylinder.setAttribute('radius', '4');
    cylinder.setAttribute('rotation', '0 90 -90');
    cylinder.setAttribute('color', 'green');
    console.timeEnd('first method');

    //add primitives to entities
    firstObj.appendChild(sphereRed);
    secondObj.appendChild(sphereBlue);
    thirdObj.appendChild(spherePink);
    pipe.appendChild(cylinder);

    //Add entities to the scene
    scene.appendChild(firstObj);
    scene.appendChild(secondObj);
    scene.appendChild(pipe);
    console.log('-*****', scene);
  }

  public relativePosition(firstP: string, secondP: string): void {
    // this.createElemnts();
    const firstObj = document.getElementById(firstP);
    const secondObj = document.getElementById(secondP);

    // const firstCoords = this.shiftPositionBy(crd, -50, 25);
    // const secondCoords = this.shiftPositionBy(crd, 25, 50);

    // const firstCoords: Coord = { latitude: 35.83536188036047, longitude: 10.59502392075956 };
    // const secondCoords: Coord = { latitude: 35.835265, longitude: 10.594692 };

    const firstCoords: Coord = { latitude: 35.835265, longitude: 10.594692 };
    const secondCoords: Coord = { latitude: 35.834049, longitude: 10.591848 };

    firstObj.setAttribute(
      'gps-entity-place',
      'latitude:' + firstCoords.latitude + '; longitude:' + firstCoords.longitude
    );
    secondObj.setAttribute(
      'gps-entity-place',
      'latitude:' + secondCoords.latitude + '; longitude:' + secondCoords.longitude
    );
  }

  public tunnel(firstP: string, secondP: string) {
    AFRAME.registerComponent('tunnel', {
      init() {
        const firstObj: any = document.getElementById(firstP);
        const secondObj: any = document.getElementById(secondP);
        const firstPos = new THREE.Vector3();
        const secondPos = new THREE.Vector3();
        const el = this.el;
        const cylinder = this.el.querySelector('a-cylinder');
        console.log('from schema: ', firstObj);
        const idx = setInterval(() => {
          firstPos.copy(firstObj.object3D.position);
          secondPos.copy(secondObj.object3D.position);

          // console.log('firstPos: ', firstPos);
          // console.log('secondPos: ', secondPos);

          const distance = firstPos.distanceTo(secondPos);
          // console.log('************: ', distance);

          if (!distance) return;
          // console.log('anchors ready');
          clearInterval(idx);

          const middle = firstPos
            .multiplyScalar(-1)
            .add(secondPos)
            .multiplyScalar(1 / 2);

          cylinder.setAttribute('height', distance);
          cylinder.setAttribute('position', '0 -90 0');
          el.object3D.lookAt(firstPos);
          el.object3D.position.copy(middle).add(firstObj.object3D.position);
        }, 500);
      },
    });
  }

  public events(){
    document.getElementById('first').addEventListener('click', () => {
      console.log('zzzz');
      this.isPopupVisible = true
      // this.object3DViewModel = new Object3DViewModel()
      // this.object3DViewModel.Designation ='first'
      // this.object3DViewModel.Latitude = 35.835265;
      // this.object3DViewModel.Longitude = 10.594692;
      // console.log(this.object3DViewModel);
    });
  }

  private createGPSEntity(type: string, id: string, component?: string): any {
    const gpsEntity: any = document.createElement(type);
    gpsEntity.setAttribute('id', id);
    // gpsEntity.setAttribute('position', '0 -90 0');
    if (component) {
      gpsEntity.setAttribute(component, '');
    }
    return gpsEntity;
  }

  private createGPSEntity2(entity: Entity){
    const gpsEntity: any = document.createElement(entity.component);
    for (const property in entity) {
      console.log(property + ': ' + entity[property]);
    }
    
  }
  

  
}
