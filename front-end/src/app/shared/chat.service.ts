import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {SocketNamespaceOneService} from '../shared/socket-namespace-one.service';

@Injectable()
export class ChatService {

  constructor(private socket:SocketNamespaceOneService) { }

  public sendMessage(message) {
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  }

  public newChatEvent = () => {
    return Observable.create((observer) => {
      this.socket.on('new-chat', (message) => {
        observer.next(message);
      });
    });
  }

}
