import { Component, OnInit } from '@angular/core';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js';
import * as THREE from 'three';
import { ManHole, Models, Pipe } from '../dataModel/models.viewModel';
const AFRAME = (window as any).AFRAME;

@Component({
  selector: 'barthauer-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  public manHoles: ManHole[];
  public pipes: Pipe[];
  public viewModel: Pipe | ManHole;
  constructor(models: Models) {
    this.manHoles = models.getManHoles();
    this.pipes = models.getPipes();
  }

  ngOnInit(): void {
    this.createManHoles();
    this.createPipes();
    this.registerComponent();
  }

  private createManHoles(): void {
    const scene: any = document.querySelector('a-scene');
    this.manHoles.forEach((element) => {
      const entity = this.createEntity(element, true);
      const sphere: any = document.createElement('a-sphere');
      sphere.setAttribute('color', 'red');
      entity.appendChild(sphere);

      const textInfo: any = document.createElement('a-text');
      textInfo.setAttribute('scale', '20 20 20');
      textInfo.setAttribute('value', 'Hiiiiiiii');
      textInfo.setAttribute('position', '0 100 0');
      textInfo.setAttribute('look-at', '[gps-camera]');
      textInfo.setAttribute('gps-entity-place', 'longitude:' + element.Longitude + '; latitude:' + element.Latitude);
      entity.appendChild(textInfo);

      scene.appendChild(entity);
    });
  }

  private createPipes(): void {
    const scene: any = document.querySelector('a-scene');
    this.pipes.forEach((element) => {
      const pipe: any = this.createEntity(element, false);
      const cylinder: any = document.createElement('a-cylinder');
      console.log(element);
      pipe.setAttribute('id', element.id);
      pipe.setAttribute(
        'tunnel',
        'startPoint: ' +
          element.StartPoint.id +
          '; endPoint: ' +
          element.EndPoint.id +
          '; id: ' +
          element.id +
          ';startPointLong: ' +
          element.StartPoint.Longitude +
          '; startPointLat: ' +
          element.StartPoint.Latitude +
          ';endPointLong: ' +
          element.EndPoint.Longitude +
          '; endPointLat: ' +
          element.EndPoint.Latitude
      );
      cylinder.setAttribute('id', element.id);
      cylinder.setAttribute('rotation', '0 90 -90');
      cylinder.setAttribute('color', '#696969');
      cylinder.setAttribute('theta-start', '50');
      cylinder.setAttribute('theta-length', '2800');
      cylinder.addEventListener('click', (e) => {
        console.log('clicked! cylinder: ' + element.id);
        this.viewModel = new Pipe();
        this.viewModel.Designation = element.Designation;
        this.viewModel.dimension = element.dimension;
        this.viewModel.Slope = element.Slope;
      });
      pipe.appendChild(cylinder);
      scene.appendChild(pipe);
    });
  }

  private registerComponent() {
    // AFRAME.registerComponent('gps-place', {
    //   cameraGpsPosition: null,
    //   deferredInitInterval: 0,
    //   schema: {
    //     latitude: {
    //       type: 'number',
    //       default: 0,
    //     },
    //     longitude: {
    //       type: 'number',
    //       default: 0,
    //     },
    //     cameraSelector: {
    //       type: 'string',
    //       default: 'a-camera, [camera]',
    //     },
    //   },

    //   init() {
    //     console.log('this is gps-place');
    //     if (this.deferredInit()) return;
    //     this.deferredInitInterval = setInterval(this.deferredInit.bind(this), 1000);
    //   },

    //   deferredInit() {
    //     if (!this.cameraGpsPosition) {
    //       var camera = document.querySelector(this.data.cameraSelector);
    //       if (typeof camera.components['gps-position'] == 'undefined') return;
    //       this.cameraGpsPosition = camera.components['gps-position'];
    //     }
    //     if (!this.cameraGpsPosition.zeroCrd) return;
    //     this.updatePosition();
    //     clearInterval(this.deferredInitInterval);
    //     this.deferredInitInterval = 0;
    //     return true;
    //   },

    //   updatePosition() {
    //     var p = { x: 0, y: 0, z: 0 };
    //     p.x =
    //       this.cameraGpsPosition.calcMeters(this.cameraGpsPosition.zeroCrd, {
    //         longitude: this.data.longitude,
    //         latitude: this.cameraGpsPosition.zeroCrd.latitude,
    //       }) * (this.data.longitude > this.cameraGpsPosition.zeroCrd.longitude ? 1 : -1);
    //     p.z =
    //       this.cameraGpsPosition.calcMeters(this.cameraGpsPosition.zeroCrd, {
    //         longitude: this.cameraGpsPosition.zeroCrd.longitude,
    //         latitude: this.data.latitude,
    //       }) * (this.data.latitude > this.cameraGpsPosition.zeroCrd.latitude ? -1 : 1);
    //     p.y = 1.6;
    //     console.log(p);
    //     // console.log(this.el);
    //     // console.log(this.cameraGpsPosition);
    //     this.el.setAttribute('position', p);
    //   },
    // });

    AFRAME.registerComponent('foo', {
      schema: {
        elemLaltitude: { type: 'string' },
        elemLongitude: { type: 'string' },
        id: { type: 'string' },
      },
      init() {
        const self = this;
        const el = this.el;
        const data = this.data;

        // const p1 = new LatLon(50.06632, -5.71475);
        // const p2 = new LatLon(58.64402, -3.07009);

        // const d = p1.distanceTo(p2);
        // console.log('latlon: ' + d);
        // console.log(self.haversine(50.06632, -5.71475, 58.64402, -3.07009));
      },
      update() {
        const self = this;
        const point: any = document.getElementById(this.data.id);
        const camera = document.getElementById('camera');
        // console.log(document.getElementById('camera'));

        // console.log(point.object3D.position);
        // console.log(point.position)

        const data = this.data;
        let distance = 0;
        let bearing = 0;
        let angle = 0;
        const p1 = new LatLon(data.elemLaltitude, data.elemLongitude);
        // console.log('******toCartesian: ' + p1.toNvector());

        navigator.geolocation.watchPosition(updatePosition);

        function updatePosition(pos) {
          console.log(pos);

          const p2 = new LatLon(pos.coords.latitude, pos.coords.longitude);
          distance = p1.distanceTo(p2);
          // console.log(distance + 'm');
          bearing = p1.initialBearingTo(p2);
          // console.log('inti bearing: ' + p1.initialBearingTo(p2));
          // console.log('final bearing: ' + p1.finalBearingTo(p2));
          // console.log(Number(data.elemLaltitude), Number(data.elemLongitude));
          // console.log(pos.coords.latitude, pos.coords.longitude);

          //polar coordinates
          let _x = 0;
          let _y = 0;
          console.log('_x: ' + _x);
          _x = Math.sin(bearing) * distance;
          _y = Math.cos(bearing) * distance;

          console.log('_x: ' + _x);
          console.log('_y: ' + _y);

          point.object3D.position.set(_x, 1.6, _y);
          console.log('position X: ' + point.object3D.position.x);
          console.log('position Y: ' + point.object3D.position.y);
          console.log('position Z: ' + point.object3D.position.z)
        }
      },
      tick() {},
      remove() {},
      pause() {},
      play() {},

      _getBearing(lat1, lng1, lat2, lng2): number {
        const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
        const θ = Math.atan2(y, x);
        const brng = ((θ * 180) / Math.PI + 360) % 360; // in degrees
        return brng;
      },
    });

    AFRAME.registerComponent('tunnel', {
      schema: {
        startPoint: { type: 'string' },
        endPoint: { type: 'string' },
        id: { type: 'string' },
        startPointLong: { type: 'string' },
        startPointLat: { type: 'string' },
        endPointLong: { type: 'string' },
        endPointLat: { type: 'string' },
      },

      init() {
        const el = this.el;
        const data = this.data;
        const startPoint: any = document.getElementById(data.startPoint);
        const endPoint: any = document.getElementById(data.endPoint);
        const cylinder = el.querySelector('a-cylinder');
        const startPos = new THREE.Vector3();
        const endPos = new THREE.Vector3();
        // console.log(this.el);
        // console.log(data);
        // console.log(startPoint?.object3D?.position);

        const idx = setInterval(() => {
          startPos.copy(startPoint.object3D.position);
          endPos.copy(endPoint.object3D.position);

          const distance = startPos.distanceTo(endPos);
          console.log(distance);
          if (!distance) return;
          clearInterval(idx);

          const middle = startPos
            .multiplyScalar(-1)
            .add(endPos)
            .multiplyScalar(1 / 2);

          cylinder.setAttribute('height', distance);
          cylinder.setAttribute('position', '0 -90 0');
          el.object3D.lookAt(startPos);
          el.object3D.position.copy(middle).add(startPoint.object3D.position);
        }, 500);
      },
    });
  }

  private createEntity(element: any, hasCoordinates: boolean): any {
    const gpsEntity: any = document.createElement('a-entity');
    gpsEntity.setAttribute('id', element.id);
    if (hasCoordinates) {
      // gpsEntity.setAttribute('gps-place', 'latitude:' + element.Latitude + '; longitude:' + element.Longitude);
      gpsEntity.setAttribute('gps-entity-place', 'longitude:' + element.Longitude + '; latitude:' + element.Latitude);
      gpsEntity.setAttribute('scale', '15 15 15');
      gpsEntity.setAttribute(
        'foo',
        'elemLaltitude: ' + element.Latitude + '; elemLongitude: ' + element.Longitude + '; id:' + element.id
      );
    }
    return gpsEntity;
  }
}
