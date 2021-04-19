import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketNamespaceOneService } from '../shared/socket-namespace-one.service';

@Injectable()
export class RoomChatService {
  constructor(private socket: SocketNamespaceOneService) { }

  public createRoom(room) {
    this.socket.emit('create-room', room);
  }

  public createCSARoom(room) {
    this.socket.emit('create-csa-room', room);
  }

  public newRoomEvent = () => {
    return Observable.create((observer) => {
      this.socket.on('new-room', (room) => {
        observer.next(room);
      });
    });
  }

  public newCSARoomEvent = () => {
    return Observable.create((observer) => {
      this.socket.on('new-csa-room', (room) => {
        observer.next(room);
      });
    });
  }

  public joinNewRoom(room) {
    this.socket.emit('join-new-room', room);
  }

  public saveCSANewRoom(room) {
    this.socket.emit('save-csa-new-room', room);
  }

  public updateRoomEvent() {
    return Observable.create((observer) => {
      this.socket.on('update-room', (room) => {
        observer.next(room);
      });
    });
  }

  public joinRoom(room) {
    this.socket.emit('join-room', room);
  }

  public leaveRoom(room) {
    this.socket.emit('leave-room', room);
  }

  public updateCSABusy(user) {
    this.socket.emit('update-busy', user);
  }

  public userRoomLeftEvent = () => {
    return Observable.create((observer) => {
      this.socket.on('user-left', (room) => {
        observer.next(room);
      });
    });
  }

}
