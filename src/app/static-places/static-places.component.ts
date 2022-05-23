import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'barthauer-static-places',
  templateUrl: './static-places.component.html',
  styleUrls: ['./static-places.component.scss'],
})
export class StaticPlacesComponent implements OnInit {
  models = [
    {
      url: 'assets/magnemite/scene.gltf',
      scale: '0.5 0.5 0.5',
      info: 'Magnemite, Lv. 5, HP 10/10',
      rotation: '0 180 0',
    },
    {
      url: 'assets/articuno/scene.gltf',
      scale: '0.2 0.2 0.2',
      rotation: '0 180 0',
      info: 'Articuno, Lv. 80, HP 100/100',
    },
    {
      url: 'assets/dragonite/scene.gltf',
      scale: '0.08 0.08 0.08',
      rotation: '0 180 0',
      info: 'Dragonite, Lv. 99, HP 150/150',
    },
  ];
  modelIndex = 0;
  constructor() {}

  ngOnInit(): void {
    const button: any = document.querySelector('button[data-action="change"]');
    button.innerText = '﹖';
    let places = this.staticLoadPlaces();
    this.renderPlaces(places);
    setTimeout(() => {
      console.log('llllllllllll: ' + this.models.length);
    }, 2000);
  }

  staticLoadPlaces() {
    return [
      {
        name: 'Pokèmon',
        location: {
          // decomment the following and add coordinates:
          lat: 35.835291, //<your-latitude>
          lng: 10.594771, //<your-longitude>,
        },
      },
    ];
  }

  setModel(model, entity) {
    if (model.scale) {
      entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
      entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
      entity.setAttribute('position', model.position);
    }

    entity.setAttribute('gltf-model', model.url);

    const div: any = document.querySelector('.instructions');
    div.innerText = model.info;
  }

  renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
      let latitude = place.location.lat;
      let longitude = place.location.lng;

      let model = document.createElement('a-entity');
      model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

      this.setModel(this.models[this.modelIndex], model);

      model.setAttribute('animation-mixer', '');

      document.querySelector('button[data-action="change"]').addEventListener('click', (e) => {
        var entity = document.querySelector('[gps-entity-place]');
        this.modelIndex++;
        console.log('model: ' + this.models);

        var newIndex = this.modelIndex % this.models.length;
        this.setModel(this.models[newIndex], entity);
      });

      scene.appendChild(model);
    });
  }
}
