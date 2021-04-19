import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {SocketNamespaceOneService} from '../shared/socket-namespace-one.service';

@Injectable()
export class OnlineMembersService {

  constructor(private socket:SocketNamespaceOneService) { }

  public reciveUserOnlineEvent = () => {
    return Observable.create((observer) => {
      this.socket.on('user-online', (message) => {
        observer.next(message);
      });
    });
  }

  public recieveOnlineMembers = () => {
    return Observable.create((observer) => {
      this.socket.on('send-online-agents', (message) => {
        observer.next(message);
      });
    });
  }
}
