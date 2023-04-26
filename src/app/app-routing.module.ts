import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashborad/dashboard.component";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {RoomComponent} from "./room/room.component";

const routes: Routes = [
  {
    path: 'Login', component: LoginComponent, title: "Login"
  },
  {
    path: 'Room', component: RoomComponent, title: "Room"
  },
  {
    path: 'Dashboard', component: DashboardComponent, title: "Dashboard"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
