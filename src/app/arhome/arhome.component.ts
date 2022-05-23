import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CordovaService } from '../cordova.service';

@Component({
  selector: 'barthauer-arhome',
  templateUrl: './arhome.component.html',
  styleUrls: ['./arhome.component.scss']
})
export class ARHomeComponent implements OnInit {
  public latitude: number;
  public longitude: number;
  public accuracy: number;

  constructor(private router: Router, private cordovaService: CordovaService) { }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.accuracy = position.coords.accuracy;
    });
    // dx,dy : random offsets from your initial position in meters
    // lat = lat0 + (180/pi)*(dy/6378137)
    // lon = lon0 + (180/pi)*(dx/6378137)/cos(lat0)
    // 6378137 in meters is earth radius
    setTimeout(() => {
      console.log(this.latitude + (180/Math.PI)*(10/6378137));
      console.log(this.longitude + (180/Math.PI)*(10/6378137)/Math.cos(this.latitude));
    }, 1500);
    
  }

  public openCamera(): void {
    console.log('openCamera');
    this.router.navigate([`/camera`]);
    // this.cordovaService.openEmailComposer(this.company.EMail);
    
  }

  public openArTest(): void {
    this.router.navigate([`/artest`]);    
  }

  public openTest(): void {
    this.router.navigate([`/test`]);    
  }

  public openFinal(): void {
    this.router.navigate([`/final`]);    
  }

  public openStack(): void {
    this.router.navigate([`/stack`]);    
  }

  public openOpera(): void {
    this.router.navigate([`/opera`]);    
  }

  public openHikar(): void {
    this.router.navigate([`/hikar`]);    
  }

  public openStatic(): void {
    this.router.navigate([`/static`]);    
  }

}
