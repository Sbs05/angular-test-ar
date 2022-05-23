import { Component, OnInit } from '@angular/core';
// import * as THREE from 'three';
const AFRAME = (window as any).AFRAME;
const { THREE } = AFRAME;

@Component({
  selector: 'barthauer-artest',
  templateUrl: './artest.component.html',
  styleUrls: ['./artest.component.scss'],
})
export class ArtestComponent implements OnInit {
  public points: any[];
  public alt1: number = 35.8354856;
  public long1: number = 10.5950266;

  public alt2: number = 35.83557543152841;
  public long2: number = 35.83557543152841;
  constructor() {}

  ngOnInit(): void {
    this.createLine();
    // this.createPoints();
    // this.create2Points();
  }

  public click() {
    console.log('clicked');

    // const p1 = this.calcPosFromLatLonRad(35.83536188036047, 10.59502392075956, 1);
    // const p2 = this.calcPosFromLatLonRad(35.835265, 10.594692, 1);
    // console.log(p1);
    // console.log(p2);
    // this.drawCylinder(p1, p2);
  }

  public createPoints(): void {
    console.log('create points');
    const length = this.haversine(35.83536188036047, 10.59502392075956, 35.835265, 10.594692);
    console.log('length: ', length);

    AFRAME.registerComponent('scene-foo', {
      init() {
        console.log('here');
        const scene = document.querySelector('a-scene');
        const gpsEntity: any = document.createElement('a-entity');
        const manHole = document.createElement('a-entity');
        const cylinder: any = document.createElement('a-cylinder');

        const gpsEntity2: any = document.createElement('a-entity');
        const cylinder2: any = document.createElement('a-cylinder');

        //add to ground the gps
        // const ground = document.getElementById('ground')
        // ground.setAttribute('gps-entity-place', 'latitude: 35.83536188036047; longitude: 10.59502392075956;');
        // ground.addEventListener('click', (event: any) => {
        //   console.log('cliickeddddd');
        // })

        //gpsEntity
        // gpsEntity.setAttribute('mixin', 'gpsEntity');
        gpsEntity.setAttribute('id', 'gpsEntity'); //id must be != mixin
        gpsEntity.setAttribute('gps-entity-place', 'latitude: 35.83536188036047; longitude: 10.59502392075956;');

        //manhole
        // manHole.setAttribute('gltf-model', 'assets/manhole/scene.gltf');
        // manHole.setAttribute('position', '0 -10 0');
        // manHole.setAttribute('scale', '0.1 0.1 0.1');
        // manHole.setAttribute('rotation', -Math.PI / 2 + ' 0 0')
        // manHole.setAttribute('look-at', '[gps-camera]')
        gpsEntity.appendChild(manHole);

        //child
        cylinder.setAttribute('test-cylinder', '');
        cylinder.setAttribute('color', '#FF9500');
        cylinder.setAttribute('height', '1');
        cylinder.setAttribute('witdh', '8');
        cylinder.setAttribute('radius', '0.75');
        gpsEntity.appendChild(cylinder);
        scene.appendChild(gpsEntity);

        //gpsEntity2
        // gpsEntity2.setAttribute('mixin', 'gpsEntity2');
        gpsEntity2.setAttribute('id', 'gpsEntity2'); //id must be != mixin
        gpsEntity2.setAttribute('gps-entity-place', 'latitude: 35.835265; longitude: 10.594692;');

        //child
        cylinder2.setAttribute('test-cylinder2', '');
        cylinder2.setAttribute('color', '#30b0ae');
        cylinder2.setAttribute('height', '1');
        cylinder2.setAttribute('witdh', '8');
        cylinder2.setAttribute('radius', '0.75');
        gpsEntity2.appendChild(cylinder2);
        scene.appendChild(gpsEntity2);

        //pipe
        // let seconds = new THREE.Group();
        // const geometry = new THREE.BoxGeometry(40, 50, length); // align length with z-axis
        // geometry.translate(0, 0, length / 2); // so one end is at the origin
        // const material = new THREE.MeshBasicMaterial({ color: 0xe9435e });
        // const footpath = new THREE.Mesh(geometry, material);

        // footpath.position.copy(cylinder);
        // footpath.lookAt(cylinder2);
        // console.log('geometry: ', geometry);
        // console.log('footpath: ', footpath);
        // seconds.add(footpath);
        // this.el.object3D.add(seconds);

        //position of entities

        // const p1 = THREE.Vector3(0, 0, 0);
        // const p2 = THREE.Vector3(0, 0, length);
        // this.drawCylinder(p1, p2, this.el.object3D);
      },
      update() {
        // const cylinder: any = document.getElementById('gpsEntity');
        // console.log('cylinder: ', cylinder);
        // let target = new THREE.Vector3(); // create once an reuse it
        // cylinder.getWorldPosition( target );
        // console.log(target);
      },
    });
  }

  public create2Points(): void {
    AFRAME.registerComponent('scene-foo', {
      schema: {
        repeat: { default: 10 },
        spacing: { default: 1 },
      },
      init() {
        const scene = document.querySelector('a-scene');
        const seconds = new THREE.Group();
        seconds.name = 'seconds';

        // add a surface
        const surface = new THREE.Mesh(
          new THREE.PlaneGeometry(100, 100, 1, 1),
          new THREE.ShadowMaterial({
            // opacity: 0.5,
          })
        );
        surface.rotateX(-Math.PI / 2);
        surface.position.set(0, 0, 0);
        surface.receiveShadow = true;
        // seconds.add(surface);

        // add a plane
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(100, 100, 1, 1)
          // new THREE.MeshBasicMaterial({
          //   color: 0x0000ff,
          // })
        );
        // plane.rotation.set(-Math.PI / 2, 0, 0);
        plane.rotateX(-Math.PI / 2);
        plane.position.set(0, 0, 0);
        plane.receiveShadow = true;
        // seconds.add(plane);

        //line with points
        const material = new THREE.BufferGeometry({ color: 0x0000ff });
        const points = [];
        points.push(new THREE.Vector3(-10, 0, 0));
        points.push(new THREE.Vector3(0, 10, 0));
        points.push(new THREE.Vector3(10, 0, 0));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Mesh(geometry, material);
        // seconds.add(line);

        let cylinder = document.createElement('a-entity');
        cylinder.setAttribute('test-cylinder', '');
        cylinder.setAttribute('id', 'cylinder');
        cylinder.setAttribute('color', '#FF9500');
        cylinder.setAttribute('height', '1');
        cylinder.setAttribute('witdh', '80');
        cylinder.setAttribute(
          'radius',
          '10                                                                                              '
        );
        cylinder.setAttribute('position', '0 0 0');
        cylinder.setAttribute('gps-entity-place', 'latitude: 35.83536188036047; longitude: 10.59502392075956;');
        scene.appendChild(cylinder);
        console.log('tzedet');

        let box = document.createElement('a-box');
        cylinder.setAttribute('test-box', '');
        cylinder.setAttribute('color', '#FH9510');
        cylinder.setAttribute('height', '10');
        cylinder.setAttribute('witdh', '10');
        scene.appendChild(box);

        // seconds.add(cylinder);

        this.el.object3D.add(seconds);
        // scene.add(surface)
      },

      update() {
        console.log('this is update');
        const cylinder = document.getElementById('cylinder');
        console.log('cylinder: ', cylinder);
      },

      tick() {
        // console.log('this is tick');
      },
    });
  }

  private getPointInBetweenByLen(pointA, pointB, length): any {
    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);
  }

  //calculate distance
  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    console.log(lat1, lon1, lat2, lon2);
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // in metres
    return d;
  }

  //get position
  // calcPosFromLatLonRad(lat: number, lon: number, radius: number): THREE.Vector3 {
  //   // const point = new THREE.Vector3()
  //   const phi = (90 - lat) * (Math.PI / 180);
  //   const theta = (lon + 180) * (Math.PI / 180);
  //   const x = -(radius * Math.sin(phi) * Math.cos(theta));
  //   const z = radius * Math.sin(phi) * Math.sin(theta);
  //   const y = radius * Math.cos(phi);
  //   return new THREE.Vector3(x, y, z);
  // }

  //draw pipe
  public drawCylinder(vStart, vEnd): void {
    console.log('here onside the draw the cylinder');
    AFRAME.registerComponent('testo', {
      init() {
        const HALF_PI = Math.PI * 0.5;
        const distance = 31.801516116333392; //vStart.distanceTo(vEnd);
        // console.log('position: ', position);

        const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const cylinder = new THREE.CylinderGeometry(10, 10, distance, 10, 10, false);

        const orientation = new THREE.Matrix4(); //a new orientation matrix to offset pivot
        const offsetRotation = new THREE.Matrix4(); //a matrix to fix pivot rotation
        const offsetPosition = new THREE.Matrix4(); //a matrix to fix pivot position
        orientation.lookAt(vStart, vEnd, new THREE.Vector3(0, 1, 0)); //look at destination
        offsetRotation.makeRotationX(HALF_PI); //rotate 90 degs on X
        orientation.multiply(offsetRotation); //combine orientation with rotation transformations
        cylinder.applyMatrix(orientation);

        const mesh = new THREE.Mesh(cylinder, material);
        mesh.position.copy(vStart);
        mesh.position.lerp(vEnd, 0.5);
        // mesh.position = position;
        // const parent1 = new THREE.Object3D()
        // parent1.add(mesh)
        // scene.add(mesh);
        this.el.object3D.add(mesh);
      },
    });
  }

  public createCylinder() {
    // var vstart = whiteSphere.position;
    // var vend = redSphere.position;
    // var distance = BABYLON.Vector3.Distance(vstart, vend);
    // var material = new BABYLON.StandardMaterial('kosh', scene);
    // var cylinder = BABYLON.Mesh.CreateCylinder('cylinder', distance, 1, 1, 36, scene, true);
    // First of all we have to set the pivot not in the center of the cylinder:
    //cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0));
    // Then move the cylinder to red sphere    cylinder.position = redSphere.position;
    // Then find the vector between spheres
    //var v1 = vend.subtract(vstart);
    //v1.normalize();
    //var v2 = new BABYLON.Vector3(0, 1, 0);
    // Using cross we will have a vector perpendicular to both vectors
    //var axis = BABYLON.Vector3.Cross(v1, v2);
    //axis.normalize();    console.log(axis);
    // Angle between vectors
    //var angle = BABYLON.Vector3.Dot(v1, v2);
    //console.log(angle);
    // Then using axis rotation the result is obvious
    //cylinder.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, -Math.PI / 2 + angle);
  }

  public createLine() {
    const scene: any = document.querySelector('a-scene');

    //CREATE GPS ENTITY
    const gpsEntity: any = this.createGPSEntity('lolo', 'gpsEntity', 35.83536188036047, 10.59502392075956);
    scene.appendChild(gpsEntity);
    const gpsEntity2: any = this.createGPSEntity('lolo', 'gpsEntity2', 35.835265, 10.594672);
    scene.appendChild(gpsEntity2);

    //CREATE BOX IN THREE JS
    const THEBox = this.createMesh(0x23996c);
    //ADD BOX TO THE GPS ENTITY
    gpsEntity.addEventListener('loaded', (e) => {
      gpsEntity.setObject3D('mesh', THEBox);
    });

    //CREATE BOX IN THREE JS
    const position = new THREE.Vector3(2, 1, 1);
    const THEBox2 = this.createMesh(0xeb4034, position);
    //ADD BOX TO THE GPS ENTITY
    gpsEntity2.addEventListener('loaded', (e) => {
      gpsEntity2.setObject3D('mesh2', THEBox2);
      console.log(gpsEntity2.object3D);
    });

    const boxes1 = [THEBox, THEBox2];
    const points1 = boxes1.map((box) => {
      const boxPosition = new THREE.Vector3();
      box.getWorldPosition(boxPosition);
      return boxPosition;
    });
    console.log(points1);
    this.test(points1[0], points1[1], scene);

    AFRAME.registerComponent('scene-foo', {
      init() {
        const threeGroup = new THREE.Group();
        //THREE ELEMENTS
        const sceneThree: any = this.el.sceneEl.object3D; // THREE.Scene
        const grp: any = scene.object3D; // THREE.Groups

        //CREATE THE PONTS ARRAY TO CREATE THE LINE
        const boxes = [THEBox, THEBox2];

        const line = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffff99 }));
        // this.el.sceneEl.,,(line);
        line.width = 10;
        this.el.object3D.add(line);

        //here to link between boxes
        const points = boxes.map((box) => {
          const boxPosition = new THREE.Vector3();
          box.getWorldPosition(boxPosition);
          return boxPosition;
        });
        console.log(points);
        this.test(points[0], points[1], scene);
        line.geometry.setFromPoints(points);
      },
      update() {
        const cylinder: any = document.getElementById('gpsEntity');
        // const distanceMsg = document.querySelector('[gps-entity-place]').getAttribute('distanceMsg');
        console.log(cylinder);
      },
    });
  }

  public test(vstart, vend, scene) {
    const HALF_PI = +Math.PI * 0.5;
    const distance = vstart.distanceTo(vend);

    const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    const cylinder = new THREE.CylinderGeometry(10, 10, distance, 10, 10, false);

    const orientation = new THREE.Matrix4(); //a new orientation matrix to offset pivot
    const offsetRotation = new THREE.Matrix4(); //a matrix to fix pivot rotation
    const offsetPosition = new THREE.Matrix4(); //a matrix to fix pivot position
    orientation.lookAt(vstart, vend, new THREE.Vector3(0, 1, 0)); //look at destination
    offsetRotation.rotateX(HALF_PI); //rotate 90 degs on X
    orientation.multiplySelf(offsetRotation); //combine orientation with rotation transformations
    cylinder.applyMatrix(orientation);

    const mesh = new THREE.Mesh(cylinder, material);
    scene.add(mesh);
  }

  //FUNCTIONS FOR CREATELINE
  createGPSEntity(component: string, id: string, latitude: number, longitude: number): any {
    const gpsEntity: any = document.createElement('a-entity');
    gpsEntity.setAttribute(component, '');
    gpsEntity.setAttribute('id', id); //id must be != mixin
    gpsEntity.setAttribute('gps-entity-place', 'latitude:' + latitude + '; longitude:' + longitude);
    return gpsEntity;
  }

  public createMesh(color: any, position?: any): any {
    const box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: color }));
    if (position) {
      box.position.set(position.x, position.y, position.z);
    }
    return box;
  }
}
