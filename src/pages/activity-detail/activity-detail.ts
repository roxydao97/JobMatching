import { Component, ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavParams, NavController, ViewController, ToastController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocationService } from '../../services/locations.service';

@IonicPage()
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {
  @ViewChild('favourite') favourite: ElementRef;
  @ViewChild('map') map: ElementRef;
  user: any;
  activity;
  owner = false;
  tags;
  fromForm = false;

  constructor(  public viewCtrl:ViewController, 
                public navCtrl: NavController,
                public toastCtrl: ToastController,
                public navParams: NavParams,
                private locationService: LocationService,
                public platform: Platform,
                public storage: Storage) {
    this.activity = this.navParams.get('activity');
    this.tags = this.activity.tags;
    this.owner = this.navParams.get('owner'); // remove when set by dtb **backend** TODO
    this.fromForm = this.navParams.get('fromForm');
    if (this.fromForm){
      //set func for hardware back button to go back home if from after post new post or edit post
      this.platform.registerBackButtonAction(function(){
        this.navCtrl.setRoot('TabsPage', {index: 1});
      },2);
    }
  }  
  favouriteJob = false;
  ionViewDidLoad() {
    //show map after the page load
    this.locationService.showLocation(this.activity.activity_info.location, this.map.nativeElement);
    this.map.nativeElement.classList.add('shown');
    //show heart if it is the interested job
    if(this.navParams.get('favourite')!=null && this.navParams.get('favourite')==true) {
      this.favouriteJob = this.navParams.get('favourite');
    }
    if(this.favouriteJob==true&&this.favourite.nativeElement.classList!=null) {
      this.favourite.nativeElement.classList.add('fa-heart');
      this.favourite.nativeElement.classList.remove('fa-heart-o');
    }
  }
  
  apply() {
    this.navCtrl.push('ApplyActivityPage', {activity: this.activity});
  }

  edit() {
    this.navCtrl.push('AddnewactivityPage', {activity: this.activity});
  }

  addtoFavourite() {
    var fav = this.favourite.nativeElement.classList;
    if (fav.contains('fa-heart-o')) {
      //TODO code to add to favourite list
      // some code goes here
      //UI code
      fav.remove('fa-heart-o');
      fav.add('fa-heart');
      this.toastCtrl.create({
        message: 'Added to your favourite list',
        duration: 1500,
        position: 'top'
      }).present();
    } else {
      //TODO code to remove from favourite list
      // some code goes here
      //UI code
      fav.remove('fa-heart');
      fav.add('fa-heart-o');    
      this.toastCtrl.create({
        message: 'Removed from your favourite list',
        duration: 1500,
        position: 'top'
      }).present(); 
    }    
  }

  viewApplications() {
    this.navCtrl.push("AppliedInfoPage", {activity: this.activity});
  }

  goHome() {
    this.navCtrl.setRoot('TabsPage');
  }
}
