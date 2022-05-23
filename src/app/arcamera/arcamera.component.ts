import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as THREE from 'three';
const AFRAME = (window as any).AFRAME;

@Component({
  selector: 'barthauer-arcamera',
  templateUrl: './arcamera.component.html',
  styleUrls: ['./arcamera.component.scss'],
})
export class ARCameraComponent implements OnInit {
  public vis: boolean = true;
  public userX: number;
  public userY: number;
  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    // this.activateArJSExp();
    // this.activateThreeAframeExp();
    // this.activateThreeWebXRExp();

    // this.test();
    // this.activateWebXrExp();
    // this.testColor();

    // this.test2();
    this.new();
  }

  private getUserLocation(): Observable<any> {
    const observable$ = new Observable((observer) => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('positionnn: ', position);

        this.userX = position.coords.latitude;
        this.userY = position.coords.longitude;
        observer.next(this.userX);
        observer.next(this.userY);
      });
    });
    return observable$;
  }

  public new(): void {
    const el = document.querySelector('[gps-entity-place]');
    const distanceMsg = document.getElementById('distance');
    const message = document.getElementById('message');

    const latitude: number = 35.83536188036047;
    const longitude: number = 10.59502392075956;

    this.getUserLocation()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('dataaaaaa: ', data);

        const distance = this.haversine(this.userX, this.userY, latitude, longitude);
        console.log(distance);
        message.innerHTML = distance.toString();
        if (distance < 30) {
          distanceMsg.style.display = 'block';
        } else {
          distanceMsg.style.display = 'none';
        }
      });
  }

  public click(): void {
    const distanceMsg = document.getElementById('distance');
    distanceMsg.innerHTML = 'btn clicked';

    let scene = document.querySelector('a-scene');
    let cylinder = document.createElement('a-cylinder');
    cylinder.setAttribute('test-cylinder', '');
    cylinder.setAttribute('color', '#FF9500');
    cylinder.setAttribute('height', '1');
    cylinder.setAttribute('witdh', '8');
    cylinder.setAttribute('radius', '0.75');
    cylinder.setAttribute('position', '0 -4 0');
    cylinder.setAttribute('gps-entity-place', 'latitude: 35.83536188036047; longitude: 10.59502392075956;');
    scene.appendChild(cylinder);


    AFRAME.registerComponent('foo', {
      init() {
        const seconds = new THREE.Group()
        seconds.name = 'seconds'
    
        const parent1 = new THREE.Object3D()
        const geometry = new THREE.PlaneGeometry(1, 10)
        const material = new THREE.MeshBasicMaterial({color: 0xe9435e, side: THREE.DoubleSide})
        const mesh1 = new THREE.Mesh(geometry, material)
        mesh1.rotateX(Math.PI / 2)
        parent1.add(mesh1)
        parent1.position.x = 0.0
        parent1.position.y = -4
        // parent1.rotateX = 90;
        // parent1.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
        parent1.position.z = 0.0
        seconds.add(parent1)
    
        // add a plane
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(4, 10, 1, 1),
          new THREE.MeshBasicMaterial({
            color: 0x0000ff,
          })
        )
        plane.rotation.set(-Math.PI / 2, 0, 0)
        // seconds.add(plane);
    
        // this.el.setObject3D('ClockMesh', seconds);
        this.el.object3D.add(seconds)
      },
    })

  }

  public test2(): void {
    // let scene = document.querySelector('a-scene');
    // let sphere = document.createElement('a-sphere');
    // sphere.setAttribute('color', '#FF9500');
    // sphere.setAttribute('radius', '0.09');
    // sphere.setAttribute('position', '8 0.005 -0.5');
    // scene.appendChild(sphere);
    AFRAME.registerComponent('foo', {
      init() {
        let seconds = new THREE.Group();
        seconds.name = 'seconds';

        let parent1 = new THREE.Object3D();
        const geometry = new THREE.PlaneGeometry(1, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0xe9435e, side: THREE.DoubleSide });
        const mesh1 = new THREE.Mesh(geometry, material);
        mesh1.rotateX(Math.PI / 2);
        parent1.add(mesh1);
        parent1.position.x = 0.0;
        parent1.position.y = -4;
        // parent1.rotateX = 90;
        // parent1.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
        parent1.position.z = 0.0;
        seconds.add(parent1);

        // add a plane
        let plane = new THREE.Mesh(
          new THREE.PlaneGeometry(4, 10, 1, 1),
          new THREE.MeshBasicMaterial({
            color: 0x0000ff,
          })
        );
        plane.rotation.set(-Math.PI / 2, 0, 0);
        // seconds.add(plane);

        // this.el.setObject3D('ClockMesh', seconds);
        this.el.object3D.add(seconds);
      },
    });
  }

  public testColor(): void {
    AFRAME.registerComponent('random-color', {
      dependencies: ['material'],

      init() {
        // Set material component's color property to a random color.
        this.el.setAttribute('material', 'color', this.getRandomColor());
      },
    });
  }

  public getRandomColor() {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public activateArJSExp(): void {
    // navigator.geolocation.getCurrentPosition((position) => {
    // document
    //   .querySelector('a-entity')
    //   .setAttribute(
    //     'gps-entity-place',
    //     'latitude:' + position.coords.latitude + '; longitude:' + position.coords.longitude
    //   );
    // });
    const el = document.querySelector('[gps-entity-place]');
    const distanceMsg = document.getElementById('distance');
    const message = document.getElementById('message');

    el.addEventListener('gps-entity-place-update-positon', (event: CustomEvent) => {
      console.log(event.detail);

      distanceMsg.textContent = 'distance: ' + event.detail.distance + ' m';
      if (event.detail.distance <= 30) {
        // distance below 30m, hide distance display msg
        distanceMsg.style.display = 'block';
        message.style.display = 'block';
      } else if (event.detail.distance <= 50) {
        // The closer you get to 50m or less, the message is hidden, the distance is displayed.
        distanceMsg.style.display = 'block';
        message.style.display = 'none';
      } else {
        // When the distance > 50m, the message is hidden, the distance is displayed.
        distanceMsg.style.display = 'block';
        message.style.display = 'none';
      }
    });
  }

  public activateThreeJsExp(): void {
    // AFRAME.registerComponent('mythreejsthing', {
    //   schema: {
    //     color: {
    //       default: '#000',
    //     },
    //   },
    //   init() {
    //     let el = this.el;  // Entity.
    //     var mythreejsobject = // ... Create three.js object.
    //     el.setObject3D('mesh', mythreejsobject);
    //   },
    // });
    AFRAME.registerComponent('box', {
      schema: {
        width: { type: 'number', default: 1 },
        height: { type: 'number', default: 1 },
        depth: { type: 'number', default: 1 },
        color: { type: 'color', default: '#AAA' },
      },

      init() {
        let el = this.el;
        el.setAttribute('gltf-model', 'assets/magnemite/scene.gltf');
        el.setAttribute('scale', '0.07384432153677448 0.07384432153677448 0.07384432153677448');
        el.setAttribute('gps-entity-place', 'latitude: 35.83536188036047; longitude: 10.59502392075956;');
      },
    });
  }

  public test(): void {
    AFRAME.registerComponent('treadmill', {
      schema: {
        repeat: { default: 10 },
        spacing: { default: 1 },
      },
      init() {
        let scene: any = document.querySelector('a-scene');

        this.grid = document.createElement('a-entity');
        const { repeat, spacing } = this.data;
        for (let i = -repeat; i <= repeat; i++) {
          for (let j = -repeat; j <= repeat; j++) {
            const dot: any = document.createElement('a-entity');
            dot.setAttribute('geometry', 'primitive:cone');
            // dot.setAttribute('position', i * spacing + ' 0 '+ j * spacing);
            dot.object3D.position.set(i * spacing, 0, j * spacing);
            dot.setAttribute('rotation', '-90 0 0');
            dot.setAttribute('scale', '0.07 0.25 0.001');
            dot.setAttribute('material', 'color:green');
            this.grid.appendChild(dot);
          }
        }
        this.el.sceneEl.appendChild(this.grid);
        this.camera = document.getElementById('camera');
        this.positionTemp = new THREE.Vector3();
        this.positionOut = document.getElementById('positionOut');
      },
      tick() {
        const { spacing } = this.data;
        this.positionTemp.copy(this.camera.object3D.position);
        this.positionTemp.x = Math.round(this.positionTemp.x / spacing);
        this.positionTemp.z = Math.round(this.positionTemp.z / spacing);
        this.positionTemp.y = 0;
        this.grid.object3D.position.copy(this.positionTemp);
        (this.positionOut.textContent = this.positionTemp.x), this.positionTemp.z;
      },
    });
  }

  public activateThreeWebXRExp(): void {
    console.log('hereeeee');

    AFRAME.registerComponent('recenter', {
      schema: {
        // 0 means don't auto recenter, ex. 10 means auto recenter after moving 10 units
        recenterDistance: { default: 0 },
        // 0 means don't adjust height, ex. 5 means recenter to height of 5
        recenterHeight: { default: 0 },
        // 0 means when adjusting height, go all the way, ex. .75 means go .75 of the way
        recenterFactor: { default: 0 },
      },
      init() {
        this.camera = document.getElementById('camera');
        this.output = document.getElementById('recenterOut');
        document.getElementById('recenter').addEventListener('click', () => {
          console.log('zzzz');

          this.recenter();
        });
        document.getElementById('recenterSmart').addEventListener('click', () => this.smartRecenter());
        this.origin = this.camera.object3D.position.clone();
        this.recenterSum = this.data.recenterDistance * 1.4;
      },
      tick() {
        if (this.data.recenterDistance > 0) {
          // If auto recentering, use cheap distance calculation to decide whether or not to recenter
          const moveX = Math.abs(this.origin.x - this.camera.object3D.position.x);
          const moveZ = Math.abs(this.origin.z - this.camera.object3D.position.z);
          if (
            moveX > this.data.recenterDistance ||
            moveZ > this.data.recenterDistance ||
            moveX + moveZ > this.recenterSum
          ) {
            this.smartRecenter();
          }
        }
      },
      recenter() {
        this.showMessage('recenter');
        this.origin.set(0, 1, 0);
        this.el.sceneEl.emit('recenter', { origin: this.origin, facing: { w: 0, x: 0, y: 0, z: 0 } });
        // This line isn't required, but it prevents the auto smart recentering from happening
        this.camera.object3D.copy(this.origin);
      },
      smartRecenter() {
        // 'Smart recenter' is a term we coined for resetting the tracking to the current tracked
        // position of the camera. It clears the map and resets tracking, but virtual objects will
        // appear to stay in the same place
        this.showMessage('smart recentered');
        this.origin.copy(this.camera.object3D.position);
        if (this.data.recenterHeight) {
          // Recenter with current x,z position, but adjust height to prevent scale drift
          if (this.data.recenterFactor) {
            // Reset origin with weighted average to desired height
            this.origin.y =
              this.data.recenterFactor * this.data.recenterHeight + (1 - this.data.recenterFactor) * this.origin.y;
          } else {
            this.origin.y = this.data.recenterHeight;
          }
        }
        this.el.sceneEl.emit('recenter', { origin: this.origin, facing: this.camera.object3D.quaternion });
      },
      showMessage(message, duration = 500) {
        clearTimeout(this.timeout);
        this.output.textContent = message;
        this.output.style.display = 'block';
        this.timeout = setTimeout(() => (this.output.style.display = 'none'), duration);
      },
    });
    // Shows a grid of arrows that let you visualize tracking, ground height, and scale, while moving
    // with the camera
    AFRAME.registerComponent('treadmill', {
      schema: {
        repeat: { default: 10 },
        spacing: { default: 1 },
      },
      init() {
        this.grid = document.createElement('a-entity');
        const { repeat, spacing } = this.data;
        for (let i = -repeat; i <= repeat; i++) {
          for (let j = -repeat; j <= repeat; j++) {
            const dot = document.createElement('a-entity');
            dot.setAttribute('geometry', 'primitive:cone');
            dot.setAttribute('position', i * spacing + ' 0 ' + j * spacing);
            dot.setAttribute('rotation', '-90 0 0');
            dot.setAttribute('scale', '0.07 0.25 0.001');
            dot.setAttribute('material', 'color:green');
            this.grid.appendChild(dot);
          }
        }
        this.el.sceneEl.appendChild(this.grid);
        this.camera = document.getElementById('camera');
        this.positionTemp = new THREE.Vector3();
        this.positionOut = document.getElementById('positionOut');
      },
      tick() {
        const { spacing } = this.data;
        this.positionTemp.copy(this.camera.object3D.position);
        this.positionTemp.x = Math.round(this.positionTemp.x / spacing);
        this.positionTemp.z = Math.round(this.positionTemp.z / spacing);
        this.positionTemp.y = 0;
        this.grid.object3D.position.copy(this.positionTemp);
        this.positionOut.textContent = `${this.positionTemp.x}, ${this.positionTemp.z}`;
      },
    });
    // Displays a map of past camera positions on the x,z plane
    AFRAME.registerComponent('path-display', {
      init() {
        this.camera = document.getElementById('camera');
        this.camera3D = this.camera.object3D;
        this.canvas = document.createElement('canvas');
        Object.assign(this.canvas.style, {
          position: 'absolute',
          top: '0',
          right: '0',
          zIndex: '5',
          width: '50vw',
          height: '50vw',
          backgroundColor: '#0005',
        });
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.context.width = 300;
        this.context.height = 300;
        this.resetData();
        this.canvas.addEventListener('click', () => this.resetData());
        setInterval(() => this.pushLocation(), 500);
      },
      resetData() {
        this.locations = [];
        this.minX = -1;
        this.maxX = 1;
        this.minY = -1;
        this.maxY = 1;
        this.pushLocation();
      },
      redraw() {
        const ctx = this.context;
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';
        ctx.lineJoin = 'round';
        if (this.locations.length > 1) {
          // Draw data line
          ctx.beginPath();
          ctx.moveTo(this.getCanvasCoords(this.locations[0].x, this.locations[0].y));
          for (let i = 1; i < this.locations.length; i++) {
            ctx.lineTo(this.getCanvasCoords(this.locations[i].x, this.locations[i].y));
          }
          ctx.stroke();
          // Draw start point
          ctx.beginPath();
          ctx.fillStyle = 'green';
          ctx.arc(this.getCanvasCoords(this.locations[0].x, this.locations[0].y), 5, 0, 2 * Math.PI);
          ctx.fill();
          // Draw current location
          ctx.beginPath();
          ctx.fillStyle = 'gray';
          ctx.arc(
            this.getCanvasCoords(
              this.locations[this.locations.length - 1].x,
              this.locations[this.locations.length - 1].y
            ),
            5,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      },
      getCanvasCoords(x, y) {
        const scale = Math.min(
          this.context.width / (this.maxX - this.minX),
          this.context.height / (this.maxY - this.minY)
        );
        const xFromMapCenter = x - (this.minX + this.maxX) / 2;
        const xCoord = xFromMapCenter * scale + this.context.width / 2;
        const yFromMapCenter = y - (this.minY + this.maxY) / 2;
        const yCoord = yFromMapCenter * scale + this.context.height / 2;
        return [xCoord, yCoord];
      },
      pushLocation() {
        const newLocation = { x: this.camera3D.position.x, y: this.camera3D.position.z };
        this.locations.push(newLocation);
        if (newLocation.x < this.minX) {
          this.minX = newLocation.x;
        }
        if (newLocation.x > this.maxX) {
          this.maxX = newLocation.x;
        }
        if (newLocation.y < this.minY) {
          this.minY = newLocation.y;
        }
        if (newLocation.y > this.maxY) {
          this.maxY = newLocation.y;
        }
        this.redraw();
      },
    });
    // Displays a graph of past camera heights over time
    AFRAME.registerComponent('height-display', {
      init() {
        this.camera = document.getElementById('camera');
        this.camera3D = this.camera.object3D;
        this.canvas = document.createElement('canvas');
        Object.assign(this.canvas.style, {
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: '5',
          width: '50vw',
          height: '50vw',
          backgroundColor: '#0005',
        });
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.context.width = 300;
        this.context.height = 300;
        this.resetData();
        setInterval(() => this.pushHeight(), 500);
        this.canvas.addEventListener('click', () => this.resetData());
      },
      resetData() {
        this.heights = [];
        this.minHeight = -0.1;
        this.maxHeight = 2;
        this.pushHeight();
      },
      redraw() {
        const ctx = this.context;
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'green';
        ctx.lineJoin = 'round';
        if (this.heights.length > 1) {
          // Draw y=0 line
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.moveTo(0, this.getCanvasHeight(0));
          ctx.lineTo(this.canvas.width, this.getCanvasHeight(0));
          ctx.stroke();
          // Draw y=1 line
          ctx.beginPath();
          ctx.strokeStyle = 'gray';
          ctx.moveTo(0, this.getCanvasHeight(1));
          ctx.lineTo(this.canvas.width, this.getCanvasHeight(1));
          ctx.stroke();
          // Draw data line
          ctx.beginPath();
          ctx.strokeStyle = 'white';
          ctx.moveTo(this.getCanvasCoords(0, this.heights[0]));
          for (let i = 1; i < this.heights.length; i++) {
            ctx.lineTo(this.getCanvasCoords(i, this.heights[i]));
          }
          ctx.stroke();
        }
      },
      getCanvasCoords(index, height) {
        return [(index / (this.heights.length - 1)) * this.canvas.width, this.getCanvasHeight(height)];
      },
      getCanvasHeight(height) {
        return this.canvas.height * (1 - (height - this.minHeight) / (this.maxHeight - this.minHeight));
      },
      pushHeight() {
        // Add current height to graph
        const newHeight = this.camera3D.position.y;
        this.heights.push(newHeight);
        if (newHeight < this.minHeight) {
          this.minHeight = newHeight;
        }
        if (newHeight > this.maxHeight) {
          this.maxHeight = newHeight;
        }
        this.redraw();
      },
    });
  }

  public activateThreeAframeExp(): void {
    console.log('this activateThreeAframeExps');

    AFRAME.registerComponent('foo', {
      init() {
        const el = this.el;
        el.addEventListener('click', (evt) => {
          console.log('cylinder clicked: ', evt);
          const cylinder = document.querySelector('a-cylinder');
          const vis = !cylinder.getAttribute('visible');
          cylinder.setAttribute('visible', vis.toString());
        });
      },
    });

    let scene = document.querySelector('a-scene');
    let cylinder = document.createElement('a-cylinder');
    cylinder.setAttribute('test-cylinder', '');
    cylinder.setAttribute('color', '#FF9500');
    cylinder.setAttribute('height', '1');
    cylinder.setAttribute('witdh', '8');
    cylinder.setAttribute('radius', '0.75');
    cylinder.setAttribute('position', '0 0 0');
    cylinder.setAttribute('gps-entity-place', 'latitude: 35.83536188036047; longitude: 10.59502392075956;');
    scene.appendChild(cylinder);
  }

  //calculate distance
  private haversine(lat1, lon1, lat2, lon2): number {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
