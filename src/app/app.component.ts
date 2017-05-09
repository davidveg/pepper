import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  cuisines : FirebaseListObservable<any[]>;
  restaurants : Observable<any[]>;
  name;
  displayName;
  photoURL;
  logged = false;

  constructor(private af : AngularFire, private http: Http) {
  }

  ngOnInit() {
    this.af.auth.subscribe(authState => {
      if(!authState){
        this.displayName = null;
        this.photoURL = null;
        this.logged = false;
        return;
      }
        let userRef = this.af.database.object('/users/' + authState.uid);
        userRef.subscribe(user => {
          let url = `https://graph.facebook.com/v2.8/${authState.facebook.uid}?fields=first_name,last_name&access_token=${user.accessToken}`;
          this.http.get(url).subscribe(response => {
            let user = response.json();
            userRef.update({
              firstName: user.first_name,
              lastName : user.last_name
            });
          })
        })

        this.displayName = authState.auth.displayName;
        this.photoURL = authState.auth.photoURL;
        console.log("LOGGED IN", authState);
        this.logged = true;
    });
    // this.af.auth.subscribe(authStateEmail => {

    // });

    this.cuisines = this.af.database.list("/cuisines");
    this.restaurants = this.af.database.list("/restaurants")
      .map( restaurants => {
        console.log("BEFORE MAP", restaurants);
        restaurants.map(restaurant => {
          restaurant.cuisineType = this.af.database.object('/cuisines/' + restaurant.cuisine);
          console.log("AFTER MAP", restaurants);
        })
        return restaurants;
      });
  }

  login() {
    this.af.auth.login({
      provider : AuthProviders.Facebook,
      method : AuthMethods.Popup,
      scope : ['public_profile', 'user_friends', 'user_likes']
    }).then( (authState: any) => { 
      this.af.database.object('/users/' + authState.uid).update({
        accessToken : authState.facebook.accessToken
      });
      console.log("AFTER LOGIN", authState);
    });
  }

  logout() {
    this.af.auth.logout();
  }

  register() {
    this.af.auth.createUser({
      email : "testemailauth@gmail.com",
      password : "125692@"
    }).then(authStateEmail => {
      authStateEmail => console.log("REGISTER-THEN ", authStateEmail)
    }).catch(error => console.log("Error: ", error))
  }

  add(param) {
    this.cuisines.push({
      name: param.value
    });
  }

  update(param) {
    this.af.database.object("/restaurant")
      .update({
        name : param.value,
        followers : 50,
        address : { city: "New York",
                    country: "US",
                    district: "Blob",
                    state: "NY",
                    street: "Major Street",
                    followers: 50,
                    name:  "Mobs",
                    rate: 9.1,
                    type: "Italian"
                  }
      });
  }

  remove() {
    this.af.database.object("/restaurant")
      .remove()
      .then(x => { console.log("SUCCESS")})
      .catch(error => console.log("ERROR", error));
  }

}
