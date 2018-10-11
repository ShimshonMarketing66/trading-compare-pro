import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Profile } from '../../models/profile-model';
import { ModalController, Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';
import firebase from 'firebase';
import { CountryModel } from '../../models/country-model';



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
              profile.is_phone_number_verified = false
              this.keepProfileInServer(profile).then((profile) => {
                this.user.first_name = profile.first_name
                this.user.last_name = profile.last_name
                this.user._id = profile._id
                this.user.email = profile.email
                this.user.country = profile.country
                this.user.is_phone_number_verified = profile.is_phone_number_verified
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

              profile.is_phone_number_verified = false
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

  loginUserViaEmail(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  logoutUser(): Promise<any> {
    return firebase.auth().signOut();
  }

  signupUser(profile: Profile): Promise<any> {

    console.log(profile);

    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(profile.email, profile.password)
        .then((newUser) => {
          profile._id = newUser.user.uid
          profile.platform = (this.plt.is('ios')) ? "ios" : "android"
          if (newUser.user.providerData[0] != undefined) {
            profile.provider = newUser.user.providerData[0].providerId
          } else {
            profile.provider = "password"
          }

          this.user = profile as Profile

          this.keepProfileInServer(profile)
            .then(data => {
              console.log(this.user);
              this.sendVerifyCode()
              resolve(data)
            })
            .catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
    })

  }

  keepProfileInServer(profile: Profile): Promise<Profile> {
    return new Promise((resolve, reject) => {
      this.http.post("https://xosignals.herokuapp.com/api/createUser", profile)
        .toPromise()
        .then((newUserServer) => {
          console.log(newUserServer, "keepProfileInServer");

          resolve(profile)
        })
        .catch((err) => {
          reject(err)
        })
    })

  }

  checkIfUserExistAlready(_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post("https://xosignals.herokuapp.com/api/getUsersById", { _id: _id })
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
    this.user.country = phone.country
    this.user.dial_code = phone.dial_code
    this.user.phone_number = phone.phone_number
    this.user.broker = phone.broker
    this.sendVerifyCode()
  }

  sendVerifyCode(): Promise<any> {
    console.log(this.user);
    this.user.platform = (this.plt.is('ios')) ? "ios" : "android"
    var maydate = ""
    var dateee = new Date()
    maydate = dateee.getMonth().toString() + '/'
    maydate += dateee.getDate().toString() + '/'
    maydate += dateee.getFullYear().toString()
    this.user.date = maydate

    return this.http.post("https://xosignals.herokuapp.com/api/sendUserVerifyCode2", this.user).toPromise().then(data => data)
      .catch(err => {
        console.log(err, "sendUserVerifyCode");

      })

  }


  matchUserVerifyCode(verify_code): Promise<any> {
    var data = {
      _id: this.user._id,
      verify_code: verify_code
    }
    return this.http.post("https://xosignals.herokuapp.com/api/matchUserVerifyCode", data).toPromise().then(data => data)
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
    this.http.post("https://xosignals.herokuapp.com/api/updateProfileChangeinServer", data2).toPromise().then(data => data)
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


  updateIdOneSignals(): Promise<any> {
    return this.http.post("https://xosignals.herokuapp.com/api/insertVipUser", {
      _id: this.user._id,
      notificationId: this.user.notificationId
    }).toPromise()
  }

  updatenotificationId(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!(document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'))) {

        this.plt.ready().then(() => {
          // this.oneSignal.getIds().then(data=>{
          //   this.user.notificationId = data.userId
          //    this.http.post("https://xosignals.herokuapp.com/api/updatenotificationId", {
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


  getContry(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.localCountry.isRequested) {
        return this.localCountry;
      } else {
        this.http.get("https://xosignals.herokuapp.com/get-location").toPromise()
          .then((data: CountryModel) => {
            Object.keys(this.localCountry).forEach(key=>this.localCountry[key]=data[key]);
            this.localCountry.isRequested = true;
            this.http.get('../../assets/lot of data/countries.json')
            .toPromise()
            .then(response => {
                for (let index = 0; index < response["countries"].length; index++) {
                    if (((response["countries"][index].name) as string ).toLocaleUpperCase() == (data.country as string).toLocaleUpperCase() ) { 
                      this.localCountry.dial_code = response["countries"][index].dial_code
                        break;
                    }
                }
                resolve(this.localCountry.dial_code);
            })
          
          })
          .catch(err=>{
            resolve(undefined)
          })
      }
    })
  }
}

