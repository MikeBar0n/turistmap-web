import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destino } from '../models/interfaces';
const API = 'http://localhost:3000/api';
@Injectable({ providedIn: 'root' })
export class DestinoService {
  constructor(private http: HttpClient) {}
  getDestinos(filtros?: any): Observable<{ total: number; destinos: Destino[] }> {
    return this.http.get<{ total: number; destinos: Destino[] }>(`${API}/destinos`, { params: filtros });
  }
  getDestino(id: string): Observable<{ destino: Destino }> {
    return this.http.get<{ destino: Destino }>(`${API}/destinos/${id}`);
  }
  crearDestino(datos: Destino): Observable<any> {
    return this.http.post(`${API}/destinos`, datos);
  }
  actualizarDestino(id: string, datos: Partial<Destino>): Observable<any> {
    return this.http.put(`${API}/destinos/${id}`, datos);
  }
  eliminarDestino(id: string): Observable<any> {
    return this.http.delete(`${API}/destinos/${id}`);
  }
}