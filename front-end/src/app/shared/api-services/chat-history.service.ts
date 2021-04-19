import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  baseUrl = environment.serverURL; 

  constructor(private http: HttpClient) { }

  saveChatHistory(chatData):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/chatHistory/create`,chatData);
  }

  getAllChatsHistory():Observable<any>{
    return this.http.get(`${this.baseUrl}/api/chatHistory/getAll`);
  }

  getAllChatsByRoomId(roomId):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/chatHistory/roomId/${roomId}`);
  }

  deleteOneChatHistory(chatId):Observable<any>{
    return this.http.delete(`${this.baseUrl}/api/chatHistory/${chatId}`)
  }

}
