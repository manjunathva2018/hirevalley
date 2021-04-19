import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerQueueService {
  baseUrl = environment.serverURL; 

  constructor(private http: HttpClient) { }

  addChatQ(payload):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/customerQueue/create`,payload);
  }

  getSinglePendingQ():Observable<any>{
    return this.http.get(`${this.baseUrl}/api/customerQueue/pending`);
  }

  getAllQs():Observable<any>{
    return this.http.get(`${this.baseUrl}/api/customerQueue/getAll`);
  }

  getAllPendingQ():Observable<any>{
    return this.http.get(`${this.baseUrl}/api/customerQueue/getAll/pending`);
  }

  ackQ(queue):Observable<any>{
    return this.http.put(`${this.baseUrl}/api/customerQueue/acknowledge`,queue)
  }

  markDeleted(queue):Observable<any>{
    return this.http.patch(`${this.baseUrl}/api/customerQueue/markDeleted`,queue)
  }

  deleteOneQ(queueId):Observable<any>{
    return this.http.delete(`${this.baseUrl}/api/customerQueue/${queueId}`)
  }

  deleteAllAckedQ():Observable<any>{
    return this.http.delete(`${this.baseUrl}/api/customerQueue/deleteAll`)
  }

  deleteSelectedQs(selected):Observable<any>{
    return this.http.patch(`${this.baseUrl}/api/customerQueue/deleteSelected`,selected)
  }

}
