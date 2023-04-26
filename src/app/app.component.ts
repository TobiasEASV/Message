import { Component } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedRoom;
  Email: string = "";
  password: string = "";


  constructor(public firebase: FirebaseService) {
  }
}
