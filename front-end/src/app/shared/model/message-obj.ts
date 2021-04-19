import {ChatBody} from './chatBody';

export class MessageObj implements ChatBody{
  roomId:string='';
  room:string='';
  chatType?:string='';
  members?:any[]=[];
  fromName:string='';
  fromId:string='';
  createdAt:Date=new Date();
  message:string='';

  constructor(){

  }
}
