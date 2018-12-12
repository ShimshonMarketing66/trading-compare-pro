import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, App } from 'ionic-angular';
import { Slides } from 'ionic-angular';

@IonicPage({
  name:"onboarding"
})
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnboardingPage {
  currentIndex: number=0;
  @ViewChild(Slides) slides: Slides;
  
  constructor(public navCtrl: NavController,public app:App) {

  }
  slideChanged() {
    console.log(this.slides.getActiveIndex());
    
    this.currentIndex = this.slides.getActiveIndex();
  }
  clickNext() {
    console.log( this.slides.slideNext());
    this.slides.slideNext();
  }
  ionViewDidEnter(){
    console.log("ionViewDidEnter onboarding");
    
  }
  ionViewWillLeave(){
  }

  
  skipToSignin(){
    
    this.navCtrl.setRoot("sign-in-tabs")
  }
  
}
