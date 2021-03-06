import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-choose-pic',
  templateUrl: 'choose-pic.html',
})
export class ChoosePicPage {
  lastImage: string = null;
  loading: Loading;
  choosePicForJob = true;
  //var for the destination url to upload img, declare in ionViewWillEnter(){}
  url;
  //declare this var to make sure if the user choose to upload then system can be able to upload to
  //server, if false, then user chooses a picture from application.
  getFromLib = false;
  //have only on page choose pic for post
  imageList: any[] = [
    'https://firebasestorage.googleapis.com/v0/b/jobmatching-dfb1a.appspot.com/o/default%20img%2FOmegaJob.png?alt=media&token=3e04e77c-c4af-4ab6-9fed-c464ee271ae9',
    'https://firebasestorage.googleapis.com/v0/b/jobmatching-dfb1a.appspot.com/o/default%20img%2Fbabysitting.jpg?alt=media&token=75282d78-75bc-4044-a1f7-ed22f7c45680',
    'https://firebasestorage.googleapis.com/v0/b/jobmatching-dfb1a.appspot.com/o/default%20img%2Fcleaning.jpg?alt=media&token=019b6e84-df85-4a09-943b-7a67b25337f9',
    'https://firebasestorage.googleapis.com/v0/b/jobmatching-dfb1a.appspot.com/o/default%20img%2Fpicking_fruits.jpg?alt=media&token=0683aa27-f5ca-4d58-9649-ceeab24cb2dc',   
  ];
  
  constructor(  public navCtrl: NavController, 
                public navParams: NavParams, 
                public viewCtrl: ViewController,
                private transfer: Transfer, 
                private file: File, 
                private filePath: FilePath,
                public toastCtrl: ToastController, 
                public  platform: Platform,
                public loadingCtrl: LoadingController,
                private camera: Camera) {
    if(!this.choosePicForJob){
      this.imageList = null;
    }  
  }  

  ionViewWillEnter() {
    this.getFromLib = false;
    this.choosePicForJob = this.navParams.get("imgJob");    
    if(this.choosePicForJob) {
      this.url = ""; /*TODO add url to upload img for post of JOB*/
    } else {
      this.url = ""; /*TODO add url to upload img for post of USER*/
    }
  }
  
  uploadPic(){
    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  takePic() {
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
  
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
      this.getFromLib = true;
    }, (err) => {
      this.presentToast('Error while selecting image.');
      this.getFromLib = false;
    });
  }
  
  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
  
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
  
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = this.url;
   
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
   
    // File name only
    var filename = this.lastImage;
   
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };
   
    const fileTransfer: TransferObject = this.transfer.create();
   
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
   
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }
  //get data img src back to prev page.
  choose(img){
    if(this.getFromLib){
      this.uploadImage();
    }
    this.viewCtrl.dismiss(img);
  }
}
