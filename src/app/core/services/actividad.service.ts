import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actividad } from '../models/interfaces';
const API = 'http://localhost:3000/api';
@Injectable({ providedIn: 'root' })
export class ActividadService {
 constructor(private http: HttpClient) {}
 getActividades(filtros?: any): Observable<{ total: number; actividades: Actividad[] }> {
 return this.http.get<{ total: number; actividades: Actividad[] }>(`${API}/actividades`, { params: filtros });
 }
 getActividad(id: string): Observable<{ actividad: Actividad }> {
 return this.http.get<{ actividad: Actividad }>(`${API}/actividades/${id}`);
 }
 crearActividad(datos: any): Observable<any> {
 return this.http.post(`${API}/actividades`, datos);
 }
 actualizarActividad(id: string, datos: any): Observable<any> {
 return this.http.put(`${API}/actividades/${id}`, datos);
 }
 eliminarActividad(id: string): Observable<any> {
 return this.http.delete(`${API}/actividades/${id}`);
 }
}