import { Component } from '@angular/core';
import {FirebaseService} from "../firebase.service";
import * as moment from "moment";

@Component({
  selector: 'app-dashborad',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  sendThisMessage: any;
  selectedRoom: any;

  constructor(public firebase:FirebaseService) { }

  date(timestamp) {
    return moment(timestamp.toDate(), "YYYYMMDD").fromNow()
  }

}
