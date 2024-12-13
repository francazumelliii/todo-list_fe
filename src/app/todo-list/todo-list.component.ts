import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { CategoryService } from '../category.service';
import { StatusService } from '../status.service';


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
editTask(task: any): void {
  this.todoId = task.id; // Imposta il task attualmente in modifica
  this.todoForm.patchValue({
    label: task.label,
    description: task.description,
    categoryId: task.category.id,
    statusId: task.status.id,
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
      label: new FormControl('', Validators.required),
      description: new FormControl(''),
      categoryId: new FormControl('', Validators.required),
      statusId: new FormControl('', Validators.required),
      expDate:  new FormControl('', Validators.required),
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
    this.getAllTodo()

    
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
  getAllTodo(){
    this.todoService.getAllTodo(this.userId).subscribe((response: any) => {
      this.tasks = response
    },(error: any)=> {
      console.error(error);
    })
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

    console.log(this.todoForm.get("label")?.valid)
    console.log(this.todoForm.get("description")?.valid)
    console.log(this.todoForm.get("expDate")?.valid)


  }


  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  updateStatus(task: any) {
    const body = {
      statusId: task.status.id
    };
    this.todoService.updateTask(this.userId, task.id, body)
      .subscribe((response: any) => {
        const index = this.tasks.findIndex((t: Task) => t.id == task.id);
        this.tasks.splice(index, 1, response);
        this.tasks.sort((a: any, b: any) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
  
      });
  }

  getColor(task: any){
    switch(task.status.label){
      case "CREATED":  return "created"
        break;
        
      case "IN PROGRESS":  return "in-progress"
        break;

      case "COMPLETED":  return "completed"
        break;

      case "DISABLED":  return "disabled"
        break;

      default: return null;

    }
  }
  
}
