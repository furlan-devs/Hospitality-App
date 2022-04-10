import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hospedagem } from 'src/app/shared/models/hospedagens.model';

@Injectable({
  providedIn: 'root'
})

export class HospedagemService {

  apiUrl = 'https://localhost:5001';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient) { }

  getAll(): Observable<Hospedagem[]> {
    return this.httpClient.get<Hospedagem[]>(this.apiUrl + '/Hospedagem');
  }

  add(hospedagem: Hospedagem): Observable<any> {
    return this.httpClient.post<Hospedagem>(this.apiUrl + '/Hospedagem', hospedagem);
  }

  update(hospedagem: Hospedagem): Observable<Hospedagem> {
    return this.httpClient.put<Hospedagem>(this.apiUrl + '/Hospedagem', hospedagem);
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + `/Hospedagem/${id}`);
  }
}
