import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>
  constructor(private angularFireAuth: AngularFireAuth) {
    this.user = angularFireAuth.authState;
  }

  public signup(email: string, password: string): Promise<boolean> {
    let success: Promise<boolean> = new Promise<boolean>(
      (resolve, reject) => {
        this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
          .then(
          (res: any) => {
            console.log("SUCCESS" + res);
            resolve(true);
          }
          )
          .catch(
          (error: any) => {
            console.log("FAILED" + error);
            reject(false)
          }
          );
      }
    );
    return success;
  }

}
