import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:8080/api/v1/user';

  constructor(private http: HttpClient) {}

  createTodo(userId: number, todoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/todo`, todoData);
  }

  updateTodo(userId: number, todoId: number, todoData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/todo/${todoId}`, todoData);
  }

  getTodoById(userId: number, todoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}/todo/${todoId}`);
  }
}
