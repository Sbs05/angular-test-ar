import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { ManHole, Models, Pipe } from '../dataModel/models.viewModel';
const AFRAME = (window as any).AFRAME;

@Component({
  selector: 'barthauer-ar-opera',
  templateUrl: './ar-opera.component.html',
  styleUrls: ['./ar-opera.component.scss'],
})
export class ArOperaComponent implements OnInit {
  public isPopupVisible: boolean = false;
  public pipes: Pipe[];
  public manHoles: ManHole[];
  public pipeViewModel: Pipe;
  public manHoleViewModel: ManHole;
  public viewModel: Pipe | ManHole;
  constructor(models: Models) {
    this.pipes = models.getPipes();
    this.manHoles = models.getManHoles();
  }

  ngOnInit(): void {
    this.createManHoles();
    this.createPipes();
    this.registerComponent();

    // this.events();
  }

  private createManHoles(): void {
    const scene: any = document.querySelector('a-scene');
    this.manHoles.forEach((element) => {
      const entity = this.createEntity(element, true);
      const sphere: any = document.createElement('a-sphere');
      // sphere.setAttribute('gltf-model', 'assets/manhole/scene.gltf');
      // sphere.setAttribute('scale', '25 25 25');
      // sphere.setAttribute('scale', '20 20 20');
      sphere.setAttribute('color', 'red');
      // sphere.setAttribute('position', '0 -90 0');
      sphere.addEventListener('click', (e) => {
        this.isPopupVisible = true;
        this.viewModel = new ManHole();
        this.viewModel.Designation = element.Designation;
        this.viewModel.Latitude = element.Latitude;
        this.viewModel.Longitude = element.Longitude;
      });

      entity.appendChild(sphere);
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
      // cylinder.setAttribute('width', '20');
      cylinder.setAttribute('id', element.id);
      // cylinder.setAttribute('radius', '20');
      cylinder.setAttribute('rotation', '0 90 -90');
      cylinder.setAttribute('color', '#696969');
      cylinder.setAttribute('theta-start', '50');
      cylinder.setAttribute('theta-length', '2800');
      cylinder.addEventListener('click', (e) => {
        console.log('clicked! cylinder: ' + element.id);
        this.isPopupVisible = true;
        this.viewModel = new Pipe();
        this.viewModel.Designation = element.Designation;
        this.viewModel.dimension = element.dimension;
        this.viewModel.Slope = element.Slope;
      });
      // window.addEventListener('load', () => {
      //   cylinder.addEventListener('gps-entity-place-update-positon', (event) => {
      //     if (event.detail.distance < 100) {
      //       cylinder.setAttribute('color', 'yellow');
      //     } else {
      //       cylinder.setAttribute('color', 'red');
      //     }
      //   });
      // });

      pipe.appendChild(cylinder);
      scene.appendChild(pipe);
    });
  }

  public buttonClicked(element) {
    this.isPopupVisible = true;
    console.log('clicked! cylinder: ' + element.id);
    this.viewModel = new Pipe();
    this.viewModel.Designation = element.Designation;
    this.viewModel.dimension = element.dimension;
    this.viewModel.Slope = element.Slope;
  }

  private registerComponent(): void {
    // AFRAME.registerComponent('transparent-texture', {
    //   init: function () {
    //     this.applyToMesh();
    //     var $this = this;
    //     this.el.addEventListener('model-loaded', function () {
    //       return $this.applyToMesh();
    //     });
    //   },

    //   applyToMesh: function () {
    //     const mesh = this.el.getObject3D('mesh');
    //     if (mesh)
    //       mesh.traverse(function (child) {
    //         if (child.isMesh) {
    //           child.material.transparent = true;
    //           child.material.alphaTest = 0.5;
    //         }
    //       });
    //   },
    // });
    AFRAME.registerComponent('gps-position', {
      watchId: null,
      zeroCrd: null,
      crd: null,

      schema: {
        accuracy: {
          type: 'int',
          default: 100,
        },
        'zero-crd-latitude': {
          type: 'number',
          default: NaN,
        },
        'zero-crd-longitude': {
          type: 'number',
          default: NaN,
        },
      },

      init: function () {
        console.log('data from gps: ' + this.data)
        if (!isNaN(this.data['zero-crd-latitude']) && !isNaN(this.data['zero-crd-longitude'])) {
          this.zeroCrd = { latitude: this.data['zero-crd-latitude'], longitude: this.data['zero-crd-longitude'] };
        }

        this.watchId = this.watchGPS(
          function (position) {
            this.crd = position.coords;
            this.updatePosition();
          }.bind(this)
        );
      },

      watchGPS: function (success, error) {
        if (typeof error == 'undefined')
          error = function (err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
          };

        if (!('geolocation' in navigator)) {
          error({ code: 0, message: 'Geolocation is not supported by your browser' });
          return;
        }
        // changed from 0 to 30
        return navigator.geolocation.watchPosition(success, error, {
          enableHighAccuracy: true,
          maximumAge: 30,
          timeout: 27000,
        });
      },

      updatePosition: function () {
        if (this.crd.accuracy > this.data.accuracy) return;

        if (!this.zeroCrd) this.zeroCrd = this.crd;

        var p = this.el.getAttribute('position');
        p.y = this.crd.altitude;
        p.x =
          this.calcMeters(this.zeroCrd, {
            longitude: this.crd.longitude,
            latitude: this.zeroCrd.latitude,
          }) * (this.crd.longitude > this.zeroCrd.longitude ? 1 : -1);
        p.z =
          this.calcMeters(this.zeroCrd, {
            longitude: this.zeroCrd.longitude,
            latitude: this.crd.latitude,
          }) * (this.crd.latitude > this.zeroCrd.latitude ? -1 : 1);
        console.log(p);
        console.log(this.el);
        console.log(this.crd);
        this.el.setAttribute('position', p);
      },

      calcMeters: function (src, dest) {
        var dlon = THREE.Math.degToRad(dest.longitude - src.longitude);
        var dlat = THREE.Math.degToRad(dest.latitude - src.latitude);

        var a =
          Math.sin(dlat / 2) * Math.sin(dlat / 2) +
          Math.cos(THREE.Math.degToRad(src.latitude)) *
            Math.cos(THREE.Math.degToRad(dest.latitude)) *
            (Math.sin(dlon / 2) * Math.sin(dlon / 2));
        var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return angle * 6378160;
      },

      remove: function () {
        if (this.watchId) navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      },
    });

    AFRAME.registerComponent('compass-rotation', {
      lookControls: null,
      lastTimestamp: 0,
      heading: null,

      schema: {
        fixTime: {
          type: 'int',
          default: 2000,
        },
        orientationEvent: {
          type: 'string',
          default: 'auto',
        },
      },

      init: function () {
        console.log('this.el.components****************: '+ this.el)
        if (typeof this.el.components['look-controls'] == 'undefined') return;

        this.lookControls = this.el.components['look-controls'];

        this.handlerOrientation = this.handlerOrientation.bind(this);

        if (this.data.orientationEvent == 'auto') {
          if ('ondeviceorientationabsolute' in window) {
            this.data.orientationEvent = 'deviceorientationabsolute';
          } else if ('ondeviceorientation' in window) {
            this.data.orientationEvent = 'deviceorientation';
          } else {
            this.data.orientationEvent = '';
            alert('Compass not supported');
            return;
          }
        }

        window.addEventListener(this.data.orientationEvent, this.handlerOrientation, false);

        window.addEventListener(
          'compassneedscalibration',
          function (event) {
            alert('Your compass needs calibrating! Wave your device in a figure-eight motion');
            event.preventDefault();
          },
          true
        );
      },

      tick: function (time, timeDelta) {
        if (this.heading === null || this.lastTimestamp > time - this.data.fixTime) return;

        this.lastTimestamp = time;
        this.updateRotation();
      },

      calcCompassHeading: function (alpha, beta, gamma) {
        // Convert degrees to radians
        var alphaRad = alpha * (Math.PI / 180);
        var betaRad = beta * (Math.PI / 180);
        var gammaRad = gamma * (Math.PI / 180);

        // Calculate equation components
        var cA = Math.cos(alphaRad);
        var sA = Math.sin(alphaRad);
        var cB = Math.cos(betaRad);
        var sB = Math.sin(betaRad);
        var cG = Math.cos(gammaRad);
        var sG = Math.sin(gammaRad);

        // Calculate A, B, C rotation components
        var rA = -cA * sG - sA * sB * cG;
        var rB = -sA * sG + cA * sB * cG;
        var rC = -cB * cG;

        // Calculate compass heading
        var compassHeading = Math.atan(rA / rB);

        // Convert from half unit circle to whole unit circle
        if (rB < 0) {
          compassHeading += Math.PI;
        } else if (rA < 0) {
          compassHeading += 2 * Math.PI;
        }

        // Convert radians to degrees
        compassHeading *= 180 / Math.PI;

        return compassHeading;
      },

      handlerOrientation: function (evt) {
        var heading = null;

        //console.log('device orientation event', evt);
        const camera: any = document.getElementById('camera');
        this.cameraGpsPosition = camera.components['gps-position'];
        if (typeof evt.webkitCompassHeading != 'undefined') {
          if (evt.webkitCompassAccuracy < 50) {
            heading = evt.webkitCompassHeading;
          } else {
            console.warn('webkitCompassAccuracy is evt.webkitCompassAccuracy');
          }
        } else if (evt.alpha !== null) {
          if (evt.absolute === true || typeof (evt.absolute == 'undefined')) {
            // heading = this.calcCompassHeading(evt.alpha, evt.beta, evt.gamma);
            heading = this.cameraGpsPosition.crd.heading;
          } else {
            console.warn('evt.absolute === false');
          }
        } else {
          console.warn('evt.alpha === null');
        }
        this.heading = 0;
      },

      updateRotation: function () {
        // const camera: any = document.getElementById('camera');
        // camera.components["look-controls"].yawObject.rotation.y = THREE.Math.degToRad(
        //   (
        //     360
        //     - camera.components["compass-rotation"].heading
        //     - (
        //       camera.getAttribute('rotation').y
        //       - THREE.Math.radToDeg(camera.components["look-controls"].yawObject.rotation.y)
        //     )
        //   )
        //   % 360
        // )
        

        // var heading = 360 - this.heading;
        // var camera_rotation = this.el.getAttribute('rotation').y;
        // var yaw_rotation = THREE.Math.radToDeg(this.lookControls.yawObject.rotation.y);

        // var offset = (heading - (camera_rotation - yaw_rotation)) % 360;

        // this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
      },

      remove: function () {
        if (this.data.orientationEvent)
          window.removeEventListener(this.data.orientationEvent, this.handlerOrientation, false);
      },
    });

    AFRAME.registerComponent('gps-place', {
      cameraGpsPosition: null,
      deferredInitInterval: 0,

      schema: {
        latitude: {
          type: 'number',
          default: 0,
        },
        longitude: {
          type: 'number',
          default: 0,
        },
        cameraSelector: {
          type: 'string',
          default: 'a-camera, [camera]',
        },
      },

      init: function () {
        console.log('this is gps-place')
        if (this.deferredInit()) return;
        this.deferredInitInterval = setInterval(this.deferredInit.bind(this), 1000);
      },

      deferredInit: function () {
        if (!this.cameraGpsPosition) {
          var camera = document.querySelector(this.data.cameraSelector);
          if (typeof camera.components['gps-position'] == 'undefined') return;
          this.cameraGpsPosition = camera.components['gps-position'];
        }

        if (!this.cameraGpsPosition.zeroCrd) return;

        this.updatePosition();

        clearInterval(this.deferredInitInterval);
        this.deferredInitInterval = 0;

        return true;
      },

      updatePosition: function () {
        var p = { x: 0, y: 0, z: 0 };

        p.x =
          this.cameraGpsPosition.calcMeters(this.cameraGpsPosition.zeroCrd, {
            longitude: this.data.longitude,
            latitude: this.cameraGpsPosition.zeroCrd.latitude,
          }) * (this.data.longitude > this.cameraGpsPosition.zeroCrd.longitude ? 1 : -1);
        p.z =
          this.cameraGpsPosition.calcMeters(this.cameraGpsPosition.zeroCrd, {
            longitude: this.cameraGpsPosition.zeroCrd.longitude,
            latitude: this.data.latitude,
          }) * (this.data.latitude > this.cameraGpsPosition.zeroCrd.latitude ? -1 : 1);
        p.y = 1.6;
        // p.z = p.z *10;
        p.x = p.x *10;
        console.log(p);
        // console.log(this.el);
        // console.log(this.cameraGpsPosition);
        this.el.setAttribute('position', p);
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
          // cylinder.setAttribute('position', '0 0 0');
          el.object3D.lookAt(startPos);
          el.object3D.position.copy(middle).add(startPoint.object3D.position);
        }, 500);
      },
    });

    AFRAME.registerComponent('line', {
      schema: {
        start: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
        end: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
        color: { type: 'color', default: '#74BEC1' },
        opacity: { type: 'number', default: 1 },
        visible: { default: true },
      },

      multiple: true,

      init: function () {
        console.log('this is the line')
        var data = this.data;
        var geometry;
        var material;
        this.rendererSystem = this.el.sceneEl.systems.renderer;
        material = this.material = new THREE.LineBasicMaterial({
          color: data.color,
          opacity: data.opacity,
          transparent: data.opacity < 1,
          visible: data.visible,
        });
        geometry = this.geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(2 * 3), 3));

        this.rendererSystem.applyColorCorrection(material.color);
        this.line = new THREE.Line(geometry, material);
        this.el.setObject3D(this.attrName, this.line);
      },

      update: function (oldData) {
        var data = this.data;
        var geometry = this.geometry;
        var geoNeedsUpdate = false;
        var material = this.material;
        var positionArray = geometry.attributes.position.array;

        // Update geometry.
        if (!isEqualVec3(data.start, oldData.start)) {
          positionArray[0] = data.start.x;
          positionArray[1] = data.start.y;
          positionArray[2] = data.start.z;
          geoNeedsUpdate = true;
        }

        if (!isEqualVec3(data.end, oldData.end)) {
          positionArray[3] = data.end.x;
          positionArray[4] = data.end.y;
          positionArray[5] = data.end.z;
          geoNeedsUpdate = true;
        }

        if (geoNeedsUpdate) {
          geometry.attributes.position.needsUpdate = true;
          geometry.computeBoundingSphere();
        }

        material.color.setStyle(data.color);
        this.rendererSystem.applyColorCorrection(material.color);
        material.opacity = data.opacity;
        material.transparent = data.opacity < 1;
        material.visible = data.visible;
      },

      remove: function () {
        this.el.removeObject3D('line', this.line);
      },
    });

    // const camera: any = document.getElementById('camera');

    // camera.addEventListener('componentchanged', function (evt: any) {
    //   console.log(evt);
    //   switch (evt.detail.name) {
    //     case 'rotation':
    //       //console.log('camera rotation changed', evt.detail.newData);
    //       var compassRotation = camera.components['compass-rotation'],
    //         lookControls = camera.components['look-controls'];
    //       // camera_angle.innerText = evt.detail.newData.y;
    //       if (lookControls) {
    //         // yaw_angle.innerText = THREE.Math.radToDeg(lookControls.yawObject.rotation.y);
    //       }
    //       if (compassRotation) {
    //         // compass_heading.innerText = compassRotation.heading;
    //       }
    //       break;
    //     case 'position':
    //       //console.log('camera position changed', evt.detail.newData);
    //       var gpsPosition = camera.components['gps-position'];
    //       console.log(gpsPosition);
    //       // camera_p_x.innerText = evt.detail.newData.x;
    //       // camera_p_z.innerText = evt.detail.newData.z;
    //       if (gpsPosition) {
    //         if (gpsPosition.crd) {
    //           // crd_longitude.innerText = gpsPosition.crd.longitude;
    //           // crd_latitude.innerText = gpsPosition.crd.latitude;
    //           console.log(evt.detail.newData);

    //           var hash = Geohash.encode(gpsPosition.crd.latitude, gpsPosition.crd.longitude, 7);
    //           // geohash_7chars.innerText = hash;

    //           if(typeof(hash_fences[hash]) == 'undefined'){
    //             hash_fences[hash] = null;
    //             document.head.appendChild(ce('script', {
    //               src: 'https://yaglov.ru/cadastre/hash.php?hash='+hash+'&callback=load_hash'
    //             }));
    //           }
    //         }
    //         if (gpsPosition.zeroCrd) {
    //           // zero_crd_longitude.innerText = gpsPosition.zeroCrd.longitude;
    //           // zero_crd_latitude.innerText = gpsPosition.zeroCrd.latitude;
    //         }
    //       }

    //       break;
    //   }
    // });
  }

  private createEntity(element: any, hasCoordinates: boolean): any {
    const gpsEntity: any = document.createElement('a-entity');
    gpsEntity.setAttribute('id', element.id);
    gpsEntity.setAttribute('transparent-texture', '');
    if (hasCoordinates) {
      // gpsEntity.setAttribute('gps-place', 'latitude:' + element.Latitude + '; longitude:' + element.Longitude);
      gpsEntity.setAttribute('gps-place', 'longitude:' + element.Longitude + '; latitude:' + element.Latitude);
      // gpsEntity.setAttribute('transparent-texture','');
      // gpsEntity.setAttribute('collada-model','#fence_50_31_0040507_9_asset');
      gpsEntity.setAttribute('gltf-model', '#manhole');
      gpsEntity.setAttribute('scale', '0.15 0.15 0.15');
    }
    return gpsEntity;
  }
}

export function isEqualVec3(a, b) {
  if (!a || !b) {
    return false;
  }
  return a.x === b.x && a.y === b.y && a.z === b.z;
}
