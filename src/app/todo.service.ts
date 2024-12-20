import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './todo-list/todo-list.component';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  getTasks: any;
  createTask(task: Task) {
    throw new Error('Method not implemented.');
  }
  updateTask(userId: number, taskId: number, updatedTask: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${userId}/todo/${taskId}`, updatedTask);
  }
  
  updateTaskStatus(taskId: any, arg1: { statusId: any; }) {
    throw new Error('Method not implemented.');
  }
  deleteTask(userId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/todo/${taskId}`);
  }
  
  getTasksByUserId(userId: number) {
    throw new Error('Method not implemented.');
  }
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

  getAllTodo(userId: number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${userId}/todo/all`)
  }
  


}
