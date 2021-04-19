import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  baseUrl = environment.serverURL; 

  constructor(private http: HttpClient) { }

  saveRoom(roomData):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/room/create`,roomData);
  }

  getAllRoomDetails():Observable<any>{
    return this.http.get(`${this.baseUrl}/api/room/getAll`);
  }

  getAllRoomByNamespace(namespace):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/room/getAll/namespace/${namespace}`)
  }

  getOneRoomDetails(roomId):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/room/id/${roomId}`);
  }

  updateRoomUsers(users):Observable<any>{
    return this.http.patch(`${this.baseUrl}/api/room/updateRoomUsers`,users)
  }

  deleteOneRoom(roomId):Observable<any>{
    return this.http.delete(`${this.baseUrl}/api/room/${roomId}`)
  }

}
