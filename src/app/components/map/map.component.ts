import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import {SearchControl, OpenStreetMapProvider} from "leaflet-geosearch";
import { TtsService } from "../../services/tts.service";

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [],
    templateUrl: './map.component.html',
    styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
    private map!: L.Map;
    private routingControl: L.Routing.Control;

    constructor(private ttsService: TtsService) {
        this.routingControl = L.Routing.control({
            waypoints: [
                L.latLng(-34.93309, -57.902241)
            ],
            routeWhileDragging: true
        });
    }


    ngOnInit(): void {
        this.initMap();
    }

    private initMap(): void {
        this.map = L.map('map', {
            center: [-34.93309, -57.902241],
            zoom: 15
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Routing between two points
        this.addRouting();

        // Auto SearchBar for places
        const provider = new OpenStreetMapProvider();
        const searchControl = SearchControl({
            provider: provider,
            style: 'bar',
            showMarker: true
        });

        this.map.addControl(searchControl);

        // Shape in map
        const polygon: L.Polygon = L.polygon([
            [-34.93309, -57.952241],
            [-34.94319, -57.912341],
            [-34.95329, -57.922441]
        ], {
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.8,
        }).addTo(this.map);

        this.map.on('click', this.onMapClick.bind(this));
    }

    private addRouting(): void {
        this.routingControl.on('routesfound', (e) => {
            const routes = e.routes;
            const instructions = routes[0].instructions;
            instructions.forEach((instruction: { text: string; }) => {
                this.ttsService.speak(instruction.text);
            });
        }).addTo(this.map);
    }

    private onMapClick(e:L.LeafletMouseEvent): void {
        const content: string = `Mapa clickeado en coordenadas ${e.latlng.toString()} Hola que onda wey`;
        const popup: L.Popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(content)
            .openOn(this.map);

        const wp = this.routingControl.getWaypoints();

        if (wp.length == 2) {
            wp.pop();
        }
        wp.push(L.Routing.waypoint(e.latlng));
        this.routingControl.setWaypoints(wp);

        console.log(this.routingControl.getWaypoints())

        this.routingControl.route();
    }
}
