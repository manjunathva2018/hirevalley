import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {environment} from '../../environments/environment';

@Injectable()
export class SocketNamespaceOneService extends Socket {

  constructor() {

    super({
      url: environment.serverURL, options: {
        query: {
          userData: window.sessionStorage.getItem('userData')
        }
      }
    });

  }

}
