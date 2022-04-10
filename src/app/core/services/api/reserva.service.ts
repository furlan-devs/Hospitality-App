import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from 'src/app/shared/models/reservas.model';

@Injectable({
  providedIn: 'root'
})

export class ReservaService {

  apiUrl = 'https://localhost:5001';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient) { }

  getAll(): Observable<Reserva[]> {
    return this.httpClient.get<Reserva[]>(this.apiUrl + '/Reserva');
  }

  add(reserva: Reserva): Observable<any> {
    return this.httpClient.post<Reserva>(this.apiUrl + '/Reserva', reserva);
  }

  update(reserva: Reserva): Observable<Reserva> {
    return this.httpClient.put<Reserva>(this.apiUrl + '/Reserva', reserva);
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + `/Reserva/${id}`);
  }
}
