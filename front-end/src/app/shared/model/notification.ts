import {Inotification} from './inotification';

export class Notification implements Inotification{
  show:boolean=false;
  message:string='';

  constructor(){

  }

  clear(){
    this.show=false;
    this.message='';
  }

  display(message){
    this.show=true;
    this.message=message;
  }

}
