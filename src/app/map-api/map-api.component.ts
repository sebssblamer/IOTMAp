import {  Component, OnDestroy, Renderer2, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { DatabaseService } from '../api/database.service';
import { Coordenadas } from '../interfaces/coordenadas';

@Component({
  selector: 'app-map-api',
  templateUrl: './map-api.component.html',
  styleUrls: ['./map-api.component.css']
})
export class MapApiComponent implements OnDestroy {
  ListCoor: Coordenadas[] = [];
  @Input() center : L.LatLngExpression = [21.910941, -102.316465];
  mapRef: any;
  
  constructor(private renderer: Renderer2, public dbService: DatabaseService) {
    this.loadCoor();
  }
  ngOnInit(){
    this.cargaTabla();
  }

  ngOnDestroy(): void {
    this.mapRef.off('click');
  }


  cargaTabla(){
    const mapDiv = document.getElementById('map') as HTMLElement;
    const map = L.map(mapDiv).setView(this.center, 16); 
    this.mapRef = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);
    
    this.renderer.addClass(mapDiv, 'visible');

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapDiv);

    //Array con coordenadas    
    var latlngs :any = []; 
    
    //Código para el Leaflet Routing Machine para mostrar la línea de ruta
    const planOptions = {       
      addWaypoints: false,       
      draggableWaypoints: false     
    }; 

    const plan = new L.Routing.Plan(latlngs, planOptions);

    const control = L.Routing.control({
      plan,
      addWaypoints: false,
      routeWhileDragging: false
    }).addTo(map);
    
    //divide el array
    for (var i = 0; i < this.ListCoor.length; i++) {
      console.log("Entra for")
      
      var objCoorde = this.ListCoor[i];
      var lati = parseFloat(objCoorde.latitud);
      var longi = parseFloat(objCoorde.longitud);  
      var num = parseFloat(objCoorde.id);

      if(num==1){
        L.marker([longi, lati]).addTo(map).bindPopup("Punto " + num).openPopup();
      }
      latlngs.push([longi,lati]);
    }

    control.setWaypoints(latlngs); //Establece los puntos en el mapa
    control.hide();
  }

  public loadCoor(): void{
    this.dbService.getCoor().subscribe(
      (res) => {
        console.log("ENTRA A SERVICIO");
        //variable para guardar la conversion de datos json a string
        const listString = JSON.stringify(res);
        //concatena los datos que se reciben uno a uno en listString en el arreglo ListCoor
        this.ListCoor = JSON.parse(listString);
        //DEBUG
        console.log('Coordenadas nuevas = ' + this.ListCoor);
      },
      (e) => {
        console.log('ERROR: ' + e);
      }
    );
  }
}
