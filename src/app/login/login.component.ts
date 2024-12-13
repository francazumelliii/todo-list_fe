import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';


@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService) {}
  loginForm !: FormGroup

  buildLoginForm(){
    this.loginForm = this.fb.group(
      {
        email: new FormControl("", Validators.required),
        password: new FormControl("", Validators.required)
      }
    )
  }
  ngOnInit(): void {
    this.buildLoginForm()
  }


  login(){
    const email = this.loginForm.get("email")?.value;
    const password = this.loginForm.get("password")?.value; 
    const body = {
      email: email,
      password: password
    }
    this.loginService.login(body).subscribe((response: any) => {
      this.navigateToTodo()
    }, (error: any) => console.error(error))

    
  }

  navigateToTodo() {
    this.router.navigate(['/todo-list']);
  }
}
