import { Component } from '@angular/core';
import {FirebaseService} from "../firebase.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  Email: string = "";
  password: string = "";

  constructor(public firebase: FirebaseService) { }
}
