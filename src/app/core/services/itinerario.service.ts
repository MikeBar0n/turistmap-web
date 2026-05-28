import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Itinerario } from '../models/interfaces';
const API = 'http://localhost:3000/api';
@Injectable({ providedIn: 'root' })
export class ItinerarioService {
  constructor(private http: HttpClient) {}
  getItinerarios(): Observable<{ total: number; itinerarios: Itinerario[] }> {
    return this.http.get<{ total: number; itinerarios: Itinerario[] }>(`${API}/itinerarios`);
  }
  getItinerario(id: string): Observable<{ itinerario: Itinerario }> {
    return this.http.get<{ itinerario: Itinerario }>(`${API}/itinerarios/${id}`);
  }
  crearItinerario(datos: Partial<Itinerario>): Observable<any> {
    return this.http.post(`${API}/itinerarios`, datos);
  }
  actualizarItinerario(id: string, datos: Partial<Itinerario>): Observable<any> {
    return this.http.put(`${API}/itinerarios/${id}`, datos);
  }
  eliminarItinerario(id: string): Observable<any> {
    return this.http.delete(`${API}/itinerarios/${id}`);
  }
}