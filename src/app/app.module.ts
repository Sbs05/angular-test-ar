import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ARCameraComponent } from './arcamera/arcamera.component';
import { ARHomeComponent } from './arhome/arhome.component';
import { ArtestComponent } from './artest/artest.component';
import { ArFinlComponent } from './ar-finl/ar-finl.component';
import { ArStackComponent } from './ar-stack/ar-stack.component';
import { ArOperaComponent } from './ar-opera/ar-opera.component';
import { Models } from './dataModel/models.viewModel';
import { HttpClientModule } from '@angular/common/http';
import { ArHikarComponent } from './ar-hikar/ar-hikar.component';
import { TestComponent } from './test/test.component';
import { StaticPlacesComponent } from './static-places/static-places.component';

const routes: Routes = [
  { path: 'camera', component: ARCameraComponent },
  { path: 'artest', component: ArtestComponent },
  { path: 'final', component: ArFinlComponent },
  { path: 'stack', component: ArStackComponent },
  { path: 'opera', component: ArOperaComponent },
  { path: 'hikar', component: ArHikarComponent },
  { path: 'test', component: TestComponent },
  { path: 'static', component: StaticPlacesComponent },
  { path: '', component: ARHomeComponent },
];

@NgModule({
  declarations: [AppComponent, ARCameraComponent, ARHomeComponent, ArtestComponent, ArFinlComponent, ArStackComponent, ArOperaComponent, ArHikarComponent, TestComponent, StaticPlacesComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes), FlexLayoutModule, HttpClientModule],
  exports: [RouterModule, FlexLayoutModule],
  providers: [Models],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //important to run a frame
})
export class AppModule {}
