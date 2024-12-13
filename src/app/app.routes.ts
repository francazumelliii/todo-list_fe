import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';  // Assicurati che il componente esista
import { LoginComponent } from './login/login.component';  // Importa il componente Login


// Definisci le rotte dell'applicazione
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirige alla pagina di login all'avvio
  { path: 'login', component: LoginComponent },  // Mostra la pagina di login
  { path: 'todo-list', component: TodoListComponent },  // Mostra la lista dei Todo
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Inizializza le rotte
  exports: [RouterModule]  // Esporta RouterModule per poterlo usare nel modulo principale
})
export class AppRoutingModule {}
