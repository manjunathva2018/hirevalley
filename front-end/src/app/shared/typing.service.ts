import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {SocketNamespaceOneService} from '../shared/socket-namespace-one.service';

@Injectable()
export class TypingService {

public typing:{userName:string,roomName:string,isTyping:boolean}={userName:'',roomName:'',isTyping:false};

  constructor(private socket: SocketNamespaceOneService) { }

  public sendTypeEvent(typeObj) {
    this.socket.emit('send-typing', typeObj);
  }

  public recieveTypeEvent = () => {
    return Observable.create((observer) => {
      this.socket.on('typing', (typeObj) => {
        observer.next(typeObj);
      });
    });
  }

  setTypingObj(userName:string,roomName:string,isTyping:boolean){
    this.typing.userName=userName;
    this.typing.roomName=roomName;
    this.typing.isTyping=isTyping;
    return this.typing;
  }

}
