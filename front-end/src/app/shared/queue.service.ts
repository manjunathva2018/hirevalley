import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {SocketNamespaceOneService} from '../shared/socket-namespace-one.service';

@Injectable()
export class QueueService {

  constructor(private socket: SocketNamespaceOneService) { }

  public sendQUpdateEvent(room) {
    this.socket.emit('send-queue-update', room);
  }

  public recieveQUpdateEvent = () => {
    return Observable.create((observer) => {
      this.socket.on('recieve-queue-update', (room) => {
        observer.next(room);
      });
    });
  }

}
