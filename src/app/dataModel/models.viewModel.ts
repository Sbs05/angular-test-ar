import { Injectable } from '@angular/core';

export class ManHole {
  id: string;
  Designation?: string;
  Latitude?: number;
  Longitude?: number;
  Depth?: number;
}
export class Pipe {
  id: number;
  Designation?: string;
  StartPoint: ManHole;
  EndPoint: ManHole;
  Length?: number;
  dimension?: number;
  Slope?: number;
}

const manholes: ManHole[] = [
  {
    id: '0MH1',
    Designation: 'manhole1',
    Latitude: 35.835265000000,
    Longitude: 10.59469200000,
    Depth: 15,
  },
  {
    id: '0MH2',
    Designation: 'manhole2',
    Latitude: 35.8346000000,
    Longitude: 10.593445000000,
    Depth: 10,
  },
  {
    id: '0MH3',
    Designation: 'manhole3',
    Latitude: 35.83342000000,
    Longitude: 10.594018000000,
    Depth: 15,
  },
  {
    id: '0MH4',
    Designation: 'manhole4',
    Latitude: 35.834049000000,
    Longitude: 10.591848000000,
    Depth: 5,
  },
  {
    id: '0MH5',
    Designation: 'manhole5',
    Latitude: 35.83474000000,
    Longitude: 10.5915020000000,
    Depth: 10,
  },
  {
    id: '0MH6',
    Designation: 'manhole6',
    Latitude: 35.833560000000,
    Longitude: 10.59041000000,
    Depth: 3,
  },
];

//dar
// const manholes: ManHole[] = [
//   {
//     id: '0MH1',
//     Designation: 'manhole1',
//     Latitude: 35.714684,
//     Longitude: 10.672209,
//     Depth: 15,
//   },
//   {
//     id: '0MH2',
//     Designation: 'manhole2',
//     Latitude: 35.714035,
//     Longitude: 10.672617,
//     Depth: 10,
//   },
//   {
//     id: '0MH3',
//     Designation: 'manhole3',
//     Latitude: 35.714031,
//     Longitude: 10.673481,
//     Depth: 15,
//   },
//   {
//     id: '0MH4',
//     Designation: 'manhole4',
//     Latitude: 35.713808,
//     Longitude: 10.672794,
//     Depth: 5,
//   },
//   {
//     id: '0MH5',
//     Designation: 'manhole5',
//     Latitude: 35.713416,
//     Longitude: 10.672005,
//     Depth: 10,
//   },
//   {
//     id: '0MH6',
//     Designation: 'manhole6',
//     Latitude: 35.712693,
//     Longitude: 10.672574,
//     Depth: 3,
//   },
// ];

// const manholes: ManHole[] = [
//   {
//     id: '0MH1',
//     Designation: 'manhole1',
//     Latitude: 35.85112,
//     Longitude: 10.59453,
//     Depth: 15,
//   },
//   {
//     id: '0MH2',
//     Designation: 'manhole2',
//     Latitude: 35.851859,
//     Longitude: 10.593862,
//     Depth: 10,
//   },
//   {
//     id: '0MH3',
//     Designation: 'manhole3',
//     Latitude: 35.851598,
//     Longitude: 10.593417,
//     Depth: 15,
//   },
//   {
//     id: '0MH4',
//     Designation: 'manhole4',
//     Latitude: 35.852279,
//     Longitude: 10.594562,
//     Depth: 5,
//   },
//   {
//     id: '0MH5',
//     Designation: 'manhole5',
//     Latitude: 35.852409,
//     Longitude: 10.594801,
//     Depth: 10,
//   },
//   {
//     id: '0MH6',
//     Designation: 'manhole6',
//     Latitude: 35.852722,
//     Longitude: 10.594479,
//     Depth: 3,
//   },
// ];

//in germany
// const manholes: ManHole[] = [
//   {
//     id: '0MH1',
//     Designation: 'manhole1',
//     Latitude: 52.252846,
//     Longitude: 10.563913,
//     Depth: 15,
//   },
//   {
//     id: '0MH2',
//     Designation: 'manhole2',
//     Latitude: 52.25306,
//     Longitude: 10.563988,
//     Depth: 10,
//   },
//   {
//     id: '0MH3',
//     Designation: 'manhole3',
//     Latitude: 52.253304,
//     Longitude: 10.563988,
//     Depth: 15,
//   },
//   {
//     id: '0MH4',
//     Designation: 'manhole4',
//     Latitude: 52.253282,
//     Longitude: 10.564749,
//     Depth: 5,
//   },
//   {
//     id: '0MH5',
//     Designation: 'manhole5',
//     Latitude: 52.253437,
//     Longitude: 10.565087,
//     Depth: 10,
//   },
//   {
//     id: '0MH6',
//     Designation: 'manhole6',
//     Latitude: 52.253693,
//     Longitude: 10.565076,
//     Depth: 3,
//   },
// ];

const pipes: Pipe[] = [
  {
    id: 0,
    Designation: 'pipe between 1 and 2',
    StartPoint: manholes[0],
    EndPoint: manholes[1],
    Length: 134.6916294,
    Slope: 3.71218317,
  },
  {
    id: 1,
    Designation: 'pipe between 2 and 3',
    StartPoint: manholes[1],
    EndPoint: manholes[2],
    Length: 140.7573063,
    Slope: 3.552213473,
  },
  {
    id: 2,
    Designation: 'pipe between 2 and 4',
    StartPoint: manholes[1],
    EndPoint: manholes[3],
    Length: 156.708266,
    Slope: 3.190642159,
  },
  {
    id: 3,
    Designation: 'pipe between 5 and 4',
    StartPoint: manholes[4],
    EndPoint: manholes[3],
    Length: 82.76570906,
    Slope: 6.041149235,
  },
  {
    id: 4,
    Designation: 'pipe between 5 and 6',
    StartPoint: manholes[4],
    EndPoint: manholes[5],
    Length: 140.7752756,
    Slope: 1.42070402,
  },
];

@Injectable()
export class Models {
  getManHoles(): ManHole[] {
    return manholes;
  }

  getPipes(): Pipe[] {
    return pipes;
  }
}
