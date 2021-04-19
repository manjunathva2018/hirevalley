import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {SocketNamespaceOneService} from '../shared/socket-namespace-one.service';

@Injectable()
export class NotificationService {

  constructor(private socket: SocketNamespaceOneService) { }


  public sendNotificationEvent(room) {
    this.socket.emit('send-notification', room);
  }

  public recieveNotificationEvent = () => {
    return Observable.create((observer) => {
      this.socket.on('recieve-notification', (room) => {
        observer.next(room);
      });
    });
  }

}
