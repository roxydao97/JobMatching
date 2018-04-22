import { Component, ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavParams, NavController, ViewController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {
  @ViewChild('favourite') favourite: ElementRef;
  user: any;
  activity;
  owner = false;
  tags;

  constructor(  public viewCtrl:ViewController, 
                public navCtrl: NavController,
                public toastCtrl: ToastController,
                public navParams: NavParams,
                public storage: Storage) {
    this.activity = this.navParams.get('activity');
    this.tags = this.activity.tags;
    this.owner = this.navParams.get('owner'); // remove when set by dtb **backend** TODO
  }  
  
  apply() {
    this.navCtrl.push('ApplyActivityPage', {activity: this.activity});
  }

  edit() {
    this.navCtrl.push('AddnewactivityPage', {activity: this.activity});
  }

  addtoFavourite() {
    console.log(this.favourite.nativeElement.classList);
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
}
