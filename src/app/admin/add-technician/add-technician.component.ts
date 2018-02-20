import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from 'angularfire2/auth';

import { TechnicianDetails } from "./../../models/technician-details";

@Component({
  selector: 'app-add-technician',
  templateUrl: './add-technician.component.html',
  styleUrls: ['./add-technician.component.css']
})
export class AddTechnicianComponent {

  constructor(private angularFireDatabase: AngularFireDatabase, private angularFireAuth: AngularFireAuth) { }
  private newTechnician: TechnicianDetails = {
    id: "",
    fname: "",
    lname: "",
    contact: "",
    email: "",
    username: "",
    password: ""
  }

  public addNewTechnician(): void {
    let alreadyExists: boolean = false;
    this.angularFireDatabase.list("/technicians").first().subscribe(
      (technicians: TechnicianDetails[]) => {
        for (let technician of technicians) {
          if (this.newTechnician.username == technician.username || this.newTechnician.email == technician.email) {
            alreadyExists = true;
          }
        }
        if (!this.technicianDetailsEmpty()) {
          if (!alreadyExists) {
            this.angularFireDatabase.list("/technicians").push(this.newTechnician);
            this.angularFireAuth.auth.createUserWithEmailAndPassword(this.newTechnician.email, this.newTechnician.password)
              .then(
              (res: any) => {
                this.angularFireAuth.auth.signOut();
                this.newTechnician = {
                  id: "",
                  fname: "",
                  lname: "",
                  contact: "",
                  email: "",
                  username: "",
                  password: ""
                };
              }
              );
          } else {
            console.log("Technician already exists");
          }
        } else {
          console.log("Please complete the form");
        }
      }
    );
  }

  private technicianDetailsEmpty(): boolean {
    if (this.newTechnician.fname == "" ||
      this.newTechnician.lname == "" ||
      this.newTechnician.contact == "" ||
      this.newTechnician.email == "" ||
      this.newTechnician.username == "" ||
      this.newTechnician.password == "") {
      return true;
    } else {
      return false;
    }
  }

}
