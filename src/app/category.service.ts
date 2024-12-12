import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Questo fa sì che il servizio venga fornito globalmente
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/api/v1/category';  // URL della tua API

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
