import { Component, OnInit } from '@angular/core';
import L from 'leaflet';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements OnInit{

  private map!: L.Map;
  currentLat: number = 0;
  currentLng: number = 0;

  ngOnInit(): void {
    this.initMap()
  }
 

initMap(){
  this.map = L.map('map').setView([41.0082, 28.9784], 13);
  this.addTileLayer('streets');
  
  // Mouse hareketi ile koordinatları güncelle
  this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
    this.currentLat = e.latlng.lat;
    this.currentLng = e.latlng.lng;
  });
}

zoomIn(): void {
  this.map.zoomIn();
}

zoomOut(): void {
  this.map.zoomOut();
}


changeMapType(event: any): void {
  const mapType = event.target.value;
  this.map.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      this.map.removeLayer(layer);
    }
  });
  this.addTileLayer(mapType);
}

private addTileLayer(type: string): void {
  let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  switch(type) {
    case 'satellite':
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      break;
    case 'terrain':
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      break;
  }

  L.tileLayer(tileUrl, {
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);
}



  }
 
