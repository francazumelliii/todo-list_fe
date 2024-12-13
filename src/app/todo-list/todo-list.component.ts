import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { CategoryService } from '../category.service';
import { StatusService } from '../status.service';
import { provideHttpClient } from '@angular/common/http';


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
  providers: [],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class TodoListComponent implements OnInit {
tasksFormArray: any;
i: any;
editTask(task: Task): void {
  this.todoId = task.id; // Imposta il task attualmente in modifica
  this.todoForm.patchValue({
    label: task.label,
    description: task.description,
    categoryId: task.categoryId,
    expDate: task.expDate,
    // statusId è opzionale perché viene gestito separatamente
  });
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scorri in alto al form
}

deleteTask(taskId: number) {
  this.todoService.deleteTask(this.userId, taskId).subscribe({
    next: () => {
      console.log('Task eliminato con successo');
      this.tasks = this.tasks.filter((task: any) => task.id !== taskId); // Aggiorna la lista localmente
    },
    error: (err) => {
      console.error('Errore durante l\'eliminazione del task:', err);
    }
  });
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
  isDateValid: boolean = false;
  tasks: any = [];

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
    this.tasksFormArray = this.fb.array([]); // Inizializza il FormArray
  }

  // Metodo per caricare i task
loadTasks() {
  this.todoService.getTasks(this.userId).subscribe((tasks: Task[]) => {
    this.tasksFormArray.clear(); // Pulisci il FormArray
    tasks.forEach((task) => {
      const taskGroup = this.fb.group({
        id: [task.id],
        label: [task.label],
        description: [task.description],
        categoryId: [task.categoryId],
        expDate: [task.expDate],
        statusId: [task.statusId]
      });
      this.tasksFormArray.push(taskGroup);
    });
  });
}



get tasksControls() {
  return this.tasksFormArray.controls as FormGroup[];
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

  submitForm(): void {
    if (this.todoForm.invalid) {
      return;
    }
  
    const formValue = this.todoForm.value;
  
    if (this.todoId) {
      // Aggiorna il task esistente
      this.todoService.updateTask(this.userId, this.todoId, formValue).subscribe({
        next: (updatedTask) => {
          console.log('Task aggiornato con successo:', updatedTask);
          // Aggiorna la lista locale dei task
          const index = this.tasks.findIndex((t: any) => t.id === this.todoId);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.resetForm(); // Reset del form
        },
        error: (err) => {
          console.error('Errore durante l\'aggiornamento del task:', err);
        }
      });
    } else {
      // Crea un nuovo task
      this.todoService.createTodo(this.userId, formValue).subscribe({
        next: (newTask) => {
          console.log('Task creato con successo:', newTask);
          this.tasks.push(newTask);
          this.resetForm();
        },
        error: (err) => {
          console.error('Errore durante la creazione del task:', err);
        }
      });
    }
  }
  resetForm(): void {
    this.todoId = undefined;
    this.todoForm.reset();
  }
  
  
  checkExpDate(){
    const date = this.todoForm.get("expDate")?.value;
    this.isDateValid = new Date(date) >= new Date()
  }


  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
