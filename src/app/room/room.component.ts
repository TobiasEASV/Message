import { Component } from '@angular/core';
import {FirebaseService} from "../firebase.service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent {


  sendThisMessage: any;
  selectedRoom: any;
  roomName: string  = "";
    constructor(public firebase: FirebaseService) {
  }
}
