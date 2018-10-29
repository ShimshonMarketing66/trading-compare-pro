import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Profile } from '../../models/profile-model';
import { ModalController, Platform, Loading } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';
import firebase from 'firebase';
import { CountryModel } from '../../models/country-model';
import { Nexmo } from '../../models/nexmo-model';



@Injectable()
export class AuthDataProvider {
  localCountry: CountryModel = new CountryModel();
  isAuth: boolean = false
  user: Profile = new Profile();

  constructor(
    public afAuth: AngularFireAuth,
    private store: InAppPurchase2,
    private googlePlus: GooglePlus,
    public facebook: Facebook,
    public modalCtrl: ModalController,
    public http: HttpClient,
    public plt: Platform
  ) {
    console.log("constructor AuthDataProvider");

  }
  /* from here I used these functions */

  getContry(): Promise<CountryModel> {
    return new Promise((resolve, reject) => {
      if (this.localCountry.isRequested) {
        return this.localCountry;
      } else {
        this.http.get("https://xosignals.herokuapp.com/get-location").toPromise()
          .then((data: CountryModel) => {
            Object.keys(this.localCountry).forEach(key => this.localCountry[key] = data[key]);
            this.localCountry.isRequested = true;
            this.http.get('../../assets/lot of data/countries.json')
              .toPromise()
              .then(response => {
                for (let index = 0; index < response["countries"].length; index++) {
                  if (((response["countries"][index].name) as string).toLocaleUpperCase() == (data.country as string).toLocaleUpperCase()) {
                    this.localCountry.dial_code = response["countries"][index].dial_code;
                    break;
                  }
                }
                resolve(this.localCountry);
              })

          })
          .catch(err => {
            resolve(undefined)
          })
      }
    })
  }


  signupUser(profile: Profile, loading: Loading): Promise<any> {
    return new Promise((resolve, reject) => {
      loading.setContent("create user with email and password...");
      this.afAuth.auth.createUserWithEmailAndPassword(profile.email, profile.password)
        .then((newUser) => {
          profile._id = newUser.user.uid;
          profile.platform = (this.plt.is('ios')) ? "ios" : "android";
          profile.provider = "password";
          profile.createAccountDate = new Date().toLocaleDateString();
          this.user = profile;
          loading.setContent("keep profile in server...");
          this.keepProfileInServer(profile)
            .then(data => {
              resolve(data);
            })
            .catch(err => {
              reject(err);
            })
        })
        .catch(err => {
          reject(err);
        })
    })
  }

  keepProfileInServer(profile: Profile): Promise<Profile> {
    return new Promise((resolve, reject) => {
      this.http.post("https://xosignals.herokuapp.com/trading-compare-v2/createUser", profile)
        .toPromise()
        .then((newUserServer) => {
          resolve(profile);
        })
        .catch((err) => {
          reject("error in our server.");
        })
    })
  }

  sendVerifyCode(loading: Loading): Promise<any> {
    loading.setContent("sending verifing code to your Phone device..");
    return new Promise((resolve, reject) => {
      console.log("avi",this.user);
      
      this.http.post("https://xosignals.herokuapp.com/trading-compare-v2/send-user-verify-code", this.user).toPromise()
        .then((data: any) => {
          console.log(data);
          if (data.status == "0") {
            let a = new Nexmo();
            a.verify_id = data.request_id;
            a.is_verify_code_sent = true;
            var x = {
              "verifyData":a
            }
            console.log(a);
            
            this.updateFields(x).then(()=>{
              console.log("promise from this.updateFields()");
              
            })
            resolve();
          }else{ // in futur need check the status response and to response as well
            reject(data);
          }

        })
        .catch(err => {
          console.log(err, "sendUserVerifyCode");
        })
    })

  }

  updateFields(fieldsToUpdate) : Promise<any>{
    fieldsToUpdate["_id"] = this.user._id;
    return new Promise((resolve)=>{
      this.http.post("https://xosignals.herokuapp.com/trading-compare-v2/update-fields", fieldsToUpdate)
      .toPromise()
      .then(() => {
        console.log("server updated field", fieldsToUpdate);
        resolve();
      })
      .catch((err) => {
        console.log(err);
        
      })
    })

  }

  checkCode(verify_code): Promise<boolean> {
    return new Promise(resolve => {
      var data = {
        _id: this.user._id,
        verify_code: verify_code
      }
      this.http.post("https://xosignals.herokuapp.com/trading-compare-v2/matchUserVerifyCode", data).toPromise()
        .then(data => {
          console.log(data);

          if (data == "ok") {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.log("err", err);
          resolve(false);
        })
    })

  }


  /* until here I used these functions */



  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }



  loginUserWithProvider(m_provider: string): Promise<Profile> {
    var provider;
    switch (m_provider) {
      case "facebook":
        provider = new firebase.auth.FacebookAuthProvider()
        break;
      case "google":
        provider = new firebase.auth.GoogleAuthProvider()
      default:
        break;
    }

    //real device
    if (this.plt.is("cordova")) {
      return new Promise((resolve, reject) => {
        this.providerLogin(m_provider).then((profile: Profile) => {
          console.log(profile);

          this.checkIfUserExistAlready(profile._id).then(userFromServer2 => {
            if (userFromServer2 == null) {
              profile.verifyData.is_phone_number_verified = false
              this.keepProfileInServer(profile).then((profile) => {
                this.user.first_name = profile.first_name
                this.user.last_name = profile.last_name
                this.user._id = profile._id
                this.user.email = profile.email
                this.user.countryData = profile.countryData
                this.user.verifyData.is_phone_number_verified = profile.verifyData.is_phone_number_verified
                if (profile.provider != undefined) {
                  this.user.provider = profile.provider
                }
                this.user = profile as Profile
                resolve(profile)
              })
                .catch(() => {
                  reject("error")
                })
            } else {
              this.user = userFromServer2
              resolve(userFromServer2 as Profile)
            }
          })
        })
          .catch((err) => {
            console.log("err", err);

            reject(err)
          })
      })
    }


    //browser
    else {
      return new Promise((resolve, reject) => {
        console.log("signInWithPopup " + m_provider);
        firebase.auth().signInWithPopup(provider).then((newUser) => {
          console.log(newUser.user, "newUser");

          this.checkIfUserExistAlready(newUser.user.uid).then(userFromServer2 => {
            if (userFromServer2 == null) {


              var profile = this.getProfileWithFirebaseUser(newUser.user, m_provider)
              console.log(profile);

              profile.verifyData.is_phone_number_verified = false
              profile.platform = (this.plt.is('ios')) ? "ios" : "android"

              this.keepProfileInServer(profile).then((profile) => {
                this.user = profile
                if (profile.provider != undefined) {
                  this.user.provider = profile.provider
                }
                resolve(profile)
              })
                .catch(() => {
                  reject("error")
                })
            } else {
              resolve(userFromServer2 as Profile)
            }
          })
            .catch(err => {
              reject("error")
            })
        })
          .catch(function (error) {
            console.log(error);

            reject(error.message)
          });
      })
    }
  }

  loginUserViaEmail(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  logoutUser(): Promise<any> {
    return firebase.auth().signOut();
  }





  checkIfUserExistAlready(_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post("https://xosignals.herokuapp.com/api2/getUsersById", { _id: _id })
        .toPromise()
        .then(data => {
          resolve(data)
        })
        .catch(() => {
          resolve("error in our servers")
        })
    })
  }

  getProfileWithFirebaseUser(user, m_provider): Profile {
    var profile = new Profile()
    console.log("getProfileWithFirebaseUser", user);

    if (user.displayName != null) {
      let displayName = user.displayName.split(" ")

      if (displayName.length >= 2) {
        profile.first_name = displayName[0]

        profile.last_name = ""
        for (let index = 1; index < displayName.length - 1; index++) {
          profile.last_name += displayName[index] + " "
        }
        profile.last_name += displayName[displayName.length - 1]

      } else {
        profile.first_name = user.displayName
      }
    }
    profile.email = user.email
    profile._id = user.uid
    profile.provider = m_provider

    return profile
  }


  updatePhone(phone: {
    dial_code: string,
    phone_number: string,
    country: string
    broker: string
  }) {
    this.user.countryData.country = phone.country
    this.user.countryData.dial_code = phone.dial_code
    this.user.phone_number = phone.phone_number
    this.user.broker = phone.broker
    // this.sendVerifyCode().then(
  }





  providerLogin(m_provider): Promise<Profile> {
    if (m_provider == "facebook") {
      return new Promise((resolve, reject) => {
        this.facebook.login(['email'])
          .then(response => {
            const facebookCredential = firebase.auth.FacebookAuthProvider
              .credential(response.authResponse.accessToken);
            firebase.auth().signInWithCredential(facebookCredential)
              .then((success: any) => {

                console.log(JSON.stringify("success", success));
                resolve(this.getProfileWithFirebaseUser(success, m_provider))
              });
          }).catch((error) => {
            console.log("error", error);

            reject(error)
          });
      })
    }
    else if (m_provider == "google") {
      return new Promise((resolve, reject) => {
        this.googlePlus.login({
          'webClientId': '740803067623-sivifgg69dmiq5r7reo9m0vncnri3ahk.apps.googleusercontent.com',
        }).then(response => {
          console.log(response);
          const googleCrendential = firebase.auth.GoogleAuthProvider
            .credential(response.idToken);

          firebase.auth().signInWithCredential(googleCrendential)
            .then(success => {
              console.log(JSON.stringify(success));

              resolve(this.getProfileWithFirebaseUser(success, m_provider))
            })
            .catch(err => {
              alert(err + "error");

            })

        }).catch((error) => { reject(error) });
      })

    }

  }

  updateProfileChangeinServer(data2) {
    this.http.post("https://xosignals.herokuapp.com/api2/updateProfileChangeinServer", data2).toPromise().then(data => data)
    alert("Profile Updated Successfully ");
  }
  // getBrokerByName(){
  //   this.http.get("./assets/lot of data/brokers.json")
  //   .toPromise()
  //   .then((response) => {

  //      for (let index = 0; index < response["brokers"].length; index++) {
  //        if( response["brokers"][index].name == this.user.broker ){
  //         this.user.brokerimg=response["brokers"][index].img 

  //        break}
  //      }
  //   })
  // }
  // async initializeStore() {
  //   this.productMouth.appleProductId = "com.vip.1Month"
  //   this.productMouth.googleProductId = "com.vip.month"
  //   this.productMouth.name = "trading signals (1 month)"

  //   this.productYear.appleProductId = "com.vip.1Year"
  //   this.productYear.googleProductId = "com.vip.year"
  //   this.productYear.name = "trading signals (1 year)"

  //   if (!this.plt.is('cordova')) { return };
  //   var productMouth_id = ""
  //   var productYear_id = ""
  //   if (this.plt.is('ios')) {
  //     productMouth_id = this.productMouth.appleProductId
  //     productYear_id = this.productYear.appleProductId
  //   } else {
  //     productMouth_id = this.productMouth.googleProductId
  //     productYear_id = this.productYear.googleProductId
  //   }


  //   this.store.verbosity = this.store.INFO;
  //   this.store.refresh()
  //   InAppPurchase2.getPlugin().ready(() => {
  //     this.store.register({
  //       id: productMouth_id,
  //       alias: productMouth_id,
  //       type: this.store.NON_RENEWING_SUBSCRIPTION
  //     });
  //     this.store.register({
  //       id: productYear_id,
  //       alias: productYear_id,
  //       type: this.store.NON_RENEWING_SUBSCRIPTION
  //     });

  //     this.store.refresh();

  //     this.store.when(this.productMouth.appleProductId).cancelled(() => {
  //       console.log("cancelled")
  //     })
  //     this.store.when(this.productYear.appleProductId).cancelled(() => {
  //       console.log("cancelled")
  //     })

  //     this.store.when(this.productMouth.googleProductId).approved((product: IAPProduct) => {
  //       product.finish()
  //       this.user.state = "approved";
  //       this.updateIdOneSignals()
  //       console.log("approved")
  //     })
  //     this.store.when(this.productYear.appleProductId).approved((product: IAPProduct) => {
  //       product.finish()
  //       this.user.state = "approved";
  //       this.updateIdOneSignals()
  //       console.log("approved")
  //     })

  //     this.store.when(this.productYear.googleProductId).owned((product: IAPProduct) => {
  //       product.finish()
  //       this.updateIdOneSignals()
  //       this.user.state = "approved";
  //       console.log("owned")
  //     })
  //     this.store.when(this.productYear.appleProductId).owned((product: IAPProduct) => {
  //       product.finish()
  //       this.updateIdOneSignals()
  //       this.user.state = "approved";
  //       console.log("owned")
  //     })
  //   })
  // }


  // updateIdOneSignals(): Promise<any> {
  //   return this.http.post("https://xosignals.herokuapp.com/api2/insertVipUser", {
  //     _id: this.user._id,
  //     notificationId: this.user.notificationId
  //   }).toPromise()
  // }

  updatenotificationId(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!(document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'))) {

        this.plt.ready().then(() => {
          // this.oneSignal.getIds().then(data=>{
          //   this.user.notificationId = data.userId
          //    this.http.post("https://xosignals.herokuapp.com/api2/updatenotificationId", {
          //     _id: this.user._id,
          //     notificationId: this.user.notificationId
          //   }).toPromise().then(()=>{
          //     resolve("ok")
          //   }).catch(()=>{
          //     reject("error")
          //   })
          // })
        })
      }
    })

  }



}

