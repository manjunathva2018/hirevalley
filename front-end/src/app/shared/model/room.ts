import {Iroom} from './iroom';

export class Room implements Iroom{
    _id ?: string='';
    users : any[]=[];
    issue:string='';
    namespace:string='';
    roomName : string='';
    roomType : string='';
    createdAt? : string='';
    messagesCount? : number=0;
    owner? : any;
    accepted?:boolean=false;

    constructor(){

    }
}
