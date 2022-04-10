import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quarto } from 'src/app/shared/models/quartos.model';

@Injectable({
  providedIn: 'root'
})

export class QuartoService {

  apiUrl = 'https://localhost:5001';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient) { }

  getAll(): Observable<Quarto[]> {
    return this.httpClient.get<Quarto[]>(this.apiUrl + '/Quarto');
  }

  add(quarto: Quarto): Observable<any> {
    return this.httpClient.post<Quarto>(this.apiUrl + '/Quarto', quarto);
  }

  update(quarto: Quarto): Observable<Quarto> {
    return this.httpClient.put<Quarto>(this.apiUrl + '/Quarto', quarto);
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + `/Quarto/${id}`);
  }
}
