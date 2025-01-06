import { Component, OnInit } from '@angular/core';
import L from 'leaflet';
import { MarkerService } from '../models/services/marker.service';
import { IMarker } from '../models/marker.interfaceDTO';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements OnInit {



  map!: L.Map;
  markers: L.Marker[] = [];
  marker:any
  editingMarker: IMarker | null = null;
  selectedPoint: IMarker | null = null;

  searchTerm: string = '';
  searchResults: IMarker[] = [];
  selectedMarker: IMarker | null = null;
  currentLat: number = 0;
  currentLng: number = 0;

  ngOnInit(): void {
    this.initMap();
    this.loadMarkers();


    document.addEventListener('updateMarker', ((e: CustomEvent) => {
      const { id, temperature, humidity } = e.detail;
      this.markerService.updateMarkerData(id, {
        temperature: Number(temperature),
        humidity: Number(humidity)
      });
      
      // Popup'ı güncelle
      const marker = this.markers.find(m => {
        const markerData = this.markerService.getMarkers().find(md => md.id === id);
        return markerData && 
               m.getLatLng().lat === markerData.lat && 
               m.getLatLng().lng === markerData.lng;
      });
      
      if (marker) {
        const updatedMarkerData = this.markerService.getMarkers().find(m => m.id === id);
        if (updatedMarkerData) {
          marker.setPopupContent(this.createPopupContent(updatedMarkerData));
          marker.getPopup()?.update();
        }
      }
    }) as EventListener);
  }
  constructor(public markerService: MarkerService) {
    const iconRetinaUrl = '../assets/marker-icon.png';
    const iconUrl = '../assets/marker-icon.png';
    const shadowUrl = '../assets/marker-icon.png';

    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      // iconSize: [25, 41],
      // iconAnchor: [12, 41],
      // popupAnchor: [1, -34],
      // tooltipAnchor: [16, -28],
      // shadowSize: [41, 41]
    });
  }
  getmarkers() {
    return this.markerService.getMarkers();
  }

  addTileLayer(type: string): void {
    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    switch (type) {
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


  initMap() {
    this.map = L.map('map').setView([39.920561111, 32.853516666], 12);
    this.addTileLayer('streets');

    // Mouse hareketi ile koordinatları güncelle
    this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
      this.currentLat = e.latlng.lat;
      this.currentLng = e.latlng.lng;
    });


  }


  loadMarkers() {
    const markers = this.markerService.getMarkers();

    markers.forEach(markerData => {
      const marker = L.marker([markerData.lat, markerData.lng])
        .bindPopup(`
        <div class="popup-content">
          <h3>${markerData.title}</h3>
          <p>${markerData.description}</p>
        </div>
      `);

      this.markers.push(marker);
      marker.addTo(this.map);
    });
  }


  toggleMarkers(show: boolean): void {
    this.markers.forEach(marker => {
      if (show) {
        marker.addTo(this.map);
      } else {
        marker.remove();
      }
    });
  }
  ///Marker Arama
  searchMarkers(): void {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }
    this.searchResults = this.markerService.searchMarkers(this.searchTerm);
  }

  focusMarker(marker: IMarker): void {
    this.map.setView([marker.lat, marker.lng], 15);
    this.selectedMarker = marker;

    // Bulunan markera popup aç
    this.markers.forEach(m => {
      if (m.getLatLng().lat === marker.lat && m.getLatLng().lng === marker.lng) {
        m.openPopup();
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.selectedMarker = null;
  }

  fitBounds(): void {
    const group = L.featureGroup(this.markers);
    this.map.fitBounds(group.getBounds().pad(0.1));
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



  showMarkerDetails(marker: IMarker, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedPoint = marker;
    this.map.setView([marker.lat, marker.lng], 15);

    // Marker'ı bul ve popup'ı aç
    this.markers.forEach(m => {
      if (m.getLatLng().lat === marker.lat && m.getLatLng().lng === marker.lng) {
        m.openPopup();
      }
    });
  }


  private createPopupContent(markerData: IMarker): HTMLElement {
    const container = document.createElement('div');
    container.className = 'popup-container';
    
    container.innerHTML = `
      <div class="popup-content p-2">
        <h5 class="mb-2">${markerData.title}</h5>
        <form id="markerForm-${markerData.id}">
          <div class="mb-2">
            <label class="form-label">Sıcaklık (°C)</label>
            <input type="number" class="form-control form-control-sm" 
                   id="temp-${markerData.id}" 
                   value="${markerData.temperature}">
          </div>
          <div class="mb-2">
            <label class="form-label">Nem (%)</label>
            <input type="number" class="form-control form-control-sm" 
                   id="humidity-${markerData.id}" 
                   value="${markerData.humidity}">
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">Son Güncelleme:<br>
              ${markerData.lastUpdated?.toLocaleString() || 'N/A'}
            </small>
            <button type="button" class="btn btn-primary btn-sm" 
                    onclick="document.dispatchEvent(new CustomEvent('updateMarker', 
                      {detail: {
                        id: ${markerData.id},
                        temperature: document.getElementById('temp-${markerData.id}').value,
                        humidity: document.getElementById('humidity-${markerData.id}').value
                      }}))">
              Güncelle
            </button>
          </div>
        </form>
      </div>
    `;

    return container;
  }

}

