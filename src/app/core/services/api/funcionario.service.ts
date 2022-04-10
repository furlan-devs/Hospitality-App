import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from 'src/app/shared/models/funcionarios.model';

@Injectable({
  providedIn: 'root'
})


export class FuncionarioService {

  apiUrl = 'https://localhost:5001';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient) { }

  getAll(): Observable<Funcionario[]> {
    return this.httpClient.get<Funcionario[]>(this.apiUrl + '/Funcionario');
  }

  add(funcionario: Funcionario): Observable<any> {
    return this.httpClient.post<Funcionario>(this.apiUrl + '/Funcionario', funcionario);
  }

  update(funcionario: Funcionario): Observable<Funcionario> {
    return this.httpClient.put<Funcionario>(this.apiUrl + '/Funcionario', funcionario);
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + `/Funcionario/${id}`);
  }
}
