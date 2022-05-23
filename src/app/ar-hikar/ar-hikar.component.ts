import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// import * as THREE from 'three';
const AFRAME = (window as any).AFRAME;

@Component({
  selector: 'barthauer-ar-hikar',
  templateUrl: './ar-hikar.component.html',
  styleUrls: ['./ar-hikar.component.scss'],
})
export class ArHikarComponent implements OnInit {
  public isPopupVisible: boolean = false;
  jsonDataResult: any;
  el: any = document.getElementById('scena');
  constructor(private http: HttpClient) {
    this.http.get('assets/json/data.json').subscribe((res) => {
      this.jsonDataResult = res;
      console.log('--- result :: ', this.jsonDataResult);
    });
  }

  ngOnInit(): void {
    this.createPeakFinder();
    setTimeout(() => {
      this.createManHoles();
    }, 1000);
  }

  private createPeakFinder(): void {
    AFRAME.registerComponent('peakfinder', {
      schema: {
        scale: {
          type: 'number',
          default: 15,
        },
      },

      init() {
        this.textScale = this.data.scale * 100;
        this.camera = document.querySelector('a-camera');

        window.addEventListener('gps-camera-update-position', (event) => {
          this.el.setAttribute('terrarium-dem', {
            lat: (<any>event).detail.position.latitude,
            lon: (<any>event).detail.position.longitude,
          });
        });

        this.el.addEventListener('elevation-available', (e) => {
          const position = this.camera.getAttribute('position');
          position.y = e.detail.elevation + 1.6;
          this.camera.setAttribute('position', position);
        });

        this.el.addEventListener('osm-data-loaded', (e) => {
          e.detail.pois
            .filter((f) => f.properties.natural == 'peak')
            .forEach((peak) => {
              const entity = document.createElement('a-entity');
              entity.setAttribute('look-at', '[gps-projected-camera]');
              const text = document.createElement('a-text');
              text.setAttribute('value', peak.properties.name);
              text.setAttribute(
                'scale',
                '' +
                  {
                    x: this.textScale,
                    y: this.textScale,
                    z: this.textScale,
                  }
              );
              text.setAttribute('align', 'center');
              text.setAttribute(
                'position',
                '' +
                  {
                    x: 0,
                    y: this.data.scale * 20,
                    z: 0,
                  }
              );
              entity.setAttribute(
                'gps-projected-entity-place',
                '' +
                  {
                    latitude: peak.geometry.coordinates[1],
                    longitude: peak.geometry.coordinates[0],
                  }
              );
              entity.setAttribute(
                'position',
                '' +
                  {
                    x: 0,
                    y: peak.geometry.coordinates[2],
                    z: 0,
                  }
              );
              entity.appendChild(text);
              const cone = document.createElement('a-cone');
              cone.setAttribute('radiusTop', '0.1');
              cone.setAttribute(
                'scale',
                '' +
                  {
                    x: this.data.scale * 10,
                    y: this.data.scale * 10,
                    z: this.data.scale * 10,
                  }
              );
              cone.setAttribute('height', '3');
              cone.setAttribute('material', '' + { color: 'magenta' });
              entity.appendChild(cone);

              this.el.appendChild(entity);
            });
        });
      },
    });
  }

  private _loadPeaks1(long, lat, that) {
    const scale = 2000;
    console.log(that.jsonDataResult);
    that.jsonDataResult.features.forEach((peak) => {
      const entity = document.createElement('a-text');
      entity.setAttribute('look-at', '[gps-projected-camera]');
      entity.setAttribute('value', peak.properties.Bezeichnung);
      entity.setAttribute(
        'scale',
        '' +
          {
            x: scale,
            y: scale,
            z: scale,
          }
      );
      entity.setAttribute(
        'gps-projected-entity-place',
        '' +
          {
            latitude: peak.geometry.coordinates[1],
            longitude: peak.geometry.coordinates[0],
          }
      );
      document.getElementById('scena').appendChild(entity);
    });
  }

  private createManHoles(): void {
    const scene: any = document.querySelector('a-scene');
    const scale = 2000;
    console.log('mel crateholes: ', this.jsonDataResult);
    this.jsonDataResult?.features.forEach((peak) => {
      console.log('peak: ', peak);
      // const entity = this.createEntity(peak, true);
      const entity: any = document.createElement('a-text');
      entity.setAttribute('look-at', '[gps-projected-camera]');
      entity.setAttribute('value', peak.properties.Bezeichnung);
      entity.setAttribute('scale', {
        x: scale,
        y: scale,
        z: scale,
      });
      entity.setAttribute('gps-projected-entity-place', {
        latitude: peak.geometry.coordinates[1],
        longitude: peak.geometry.coordinates[0],
      });
      entity.setAttribute('peakfinder', '');

      // entity.appendChild(sphere);
      scene.appendChild(entity);
    });
  }

  private createEntity(element: any, hasCoordinates: boolean): any {
    const gpsEntity: any = document.createElement('a-entity');
    gpsEntity.setAttribute('id', element.id);
    if (hasCoordinates) {
      gpsEntity.setAttribute('gps-entity-place', 'latitude:' + element.Latitude + '; longitude:' + element.Longitude);
    }
    return gpsEntity;
  }
}
