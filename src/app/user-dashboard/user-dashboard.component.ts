import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  constructor(private angularFireAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }
  private logout(): void {
    this.angularFireAuth.auth.signOut()
    .then(
      (res: any) => {
        this.router.navigate(["login"]);
      }
    )
    .catch();
  }

}
