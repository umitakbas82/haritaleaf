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
constructor(){
  const iconRetinaUrl = 'assets/marker-icon-2x.png';
  const iconUrl = 'assets/marker-icon.png';
  const shadowUrl = 'assets/marker-shadow.png';
  
  L.Marker.prototype.options.icon = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });
}

  addTileLayer(type: string): void {
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
 

initMap(){
  this.map = L.map('map').setView([39.920561111, 32.853516666], 12);
  this.addTileLayer('streets');
  
  // Mouse hareketi ile koordinatları güncelle
  this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
    this.currentLat = e.latlng.lat;
    this.currentLng = e.latlng.lng;
  });

  const marker = L.marker([39.920561111, 32.853516666]).addTo(this.map);
    marker.bindPopup("<b>Özgür Amirim!</b><br>Burası Angara.").openPopup();
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





  }
 
