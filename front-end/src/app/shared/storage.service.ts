import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setSession = (key, value): void => {
    let str = JSON.stringify(value);
    window.sessionStorage.setItem(key, str);
  }

  getSession = (key): any => {
    let value = window.sessionStorage.getItem(key);
    return JSON.parse(value);
  }

  getSessionByProps = (key, props): any => {
    let value = window.sessionStorage.getItem(key);
    if (value != undefined || value != null) {
      let parsed: any = JSON.parse(value);
      return parsed[props];
    } else {
      return value;
    }
  }

  removeSession = (key): void => {
    window.sessionStorage.removeItem(key);
  }

}
