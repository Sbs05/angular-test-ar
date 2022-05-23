import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare let navigator: any;
declare let window: any;
declare let device: any;
declare let cordova: any;

@Injectable({
  providedIn: 'root',
})
export class CordovaService {
  device: any;
  
  constructor(private router: Router) {
    document.addEventListener(
      'offline',
      () => {
        this.device.online = false;
      },
      false
    );

    document.addEventListener(
      'online',
      () => {
        this.device.online = true;
      },
      false
    );
    document.addEventListener(
      'backbutton',
      (event) => {
        this.router.navigate([`/`]);
      }
    );
  }
}
