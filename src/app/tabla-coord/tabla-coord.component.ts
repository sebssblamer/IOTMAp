import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../api/database.service';
import { Coordenadas } from '../interfaces/coordenadas';

@Component({
  selector: 'app-tabla-coord',
  templateUrl: './tabla-coord.component.html',
  styleUrls: ['./tabla-coord.component.css']
})
export class TablaCoordComponent {
  ListCoor: Coordenadas[] = [];
  
  constructor(public dbService: DatabaseService) {
    this.loadCoor();
  }

  public loadCoor(): void{
    this.dbService.getCoor().subscribe(
      (res) => {
        //variable para guardar la conversion de datos json a string
        const listString = JSON.stringify(res);
        //concatena los datos que se reciben uno a uno en listString en el arreglo ListCoor
        this.ListCoor = JSON.parse(listString);
      },
      (e) => {
        console.log('ERROR: ' + e);
      }
    );
  }

  reload(){
    window.location.reload();
  }
}

