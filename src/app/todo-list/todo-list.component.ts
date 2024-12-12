import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { CategoryService } from '../category.service';
import { StatusService } from '../status.service';
import { HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule
import { HttpClient } from '@angular/common/http';  // Importa HttpClient


export interface Task {
  id: number;
  label: string;
  description: string;
  categoryId: number;
  userId: number;
  expDate: string;
  statusId?: number;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule]  // Correct use of HttpClientModule
})
export class TodoListComponent implements OnInit {
editTask(_t70: any) {
throw new Error('Method not implemented.');
}
deleteTask(arg0: any) {
throw new Error('Method not implemented.');
}
updateTaskStatus(_t70: any) {
throw new Error('Method not implemented.');
}
  todoForm: FormGroup;
  categories: any[] = [];
  statuses: any[] = [];
  userId = 1; // L'ID dell'utente, dovrebbe essere dinamico
  todoId?: number;
  router: any;
tasks: any;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private categoryService: CategoryService,
    private statusService: StatusService
  ) {
    this.todoForm = this.fb.group({
      label: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      statusId: ['', Validators.required],
      expDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadStatuses();
    
    // Se c'è un `todoId`, carica i dati del Todo per l'aggiornamento
    if (this.todoId) {
      this.loadTodoData();
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories: any[]) => {
      this.categories = categories;
    });
  }

  loadStatuses() {
    this.statusService.getStatuses().subscribe((statuses: any[]) => {
      this.statuses = statuses;
    });
  }

  loadTodoData() {
    // Carica i dati del Todo tramite il servizio
    this.todoService.getTodoById(this.userId, this.todoId!).subscribe((todo: { [key: string]: any; }) => {
      this.todoForm.patchValue(todo);
    });
  }

  submitForm() {
    if (this.todoForm.invalid) {
      return;
    }

    const formValue = this.todoForm.value;
    if (this.todoId) {
      // Aggiorna il Todo esistente
      this.todoService.updateTodo(this.userId, this.todoId!, formValue).subscribe((response: any) => {
        console.log('Todo aggiornato', response);
      });
    } else {
      // Crea un nuovo Todo
      this.todoService.createTodo(this.userId, formValue).subscribe((response: any) => {
        console.log('Todo creato', response);
      });
    }
  }


  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
