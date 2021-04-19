import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  baseUrl = environment.serverURL; 

  HttpUploadOptions = {
    headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
  }

  constructor(private http: HttpClient) { }

  sendMail(mailData):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/email/send`,mailData);
  }

  syncMails():Observable<any>{
    return this.http.get(`${this.baseUrl}/api/email/sync`);
  }

  getAllInboxMails():Observable<any>{
    return this.http.get(`${this.baseUrl}/api/email/inbox`);
  }

  getInboxSingleThread(mailId):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/email/inbox/${mailId}`)
  }

  markInboxThreadSeen(mailId):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/email/inbox/seen/${mailId}`)
  }

  getInboxAttachment(filename):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/email/inbox/filename/${filename}`,{responseType:'arraybuffer', 
    reportProgress: true,
   observe: 'events' })
  }

deleteInboxThread(mailId):Observable<any>{
  return this.http.delete(`${this.baseUrl}/api/email/inbox/${mailId}`)
}

deleteInboxSelectedThreads(selected):Observable<any>{
  return this.http.patch(`${this.baseUrl}/api/email/inbox/deleteSelected`,selected)
}

getAllSentMails():Observable<any>{
  return this.http.get(`${this.baseUrl}/api/email/sent`);
}

deleteSentThread(mailId):Observable<any>{
  return this.http.delete(`${this.baseUrl}/api/email/sent/${mailId}`)
}

deleteSentSelectedThreads(selected):Observable<any>{
  return this.http.patch(`${this.baseUrl}/api/email/sent/deleteSelected`,selected)
}

getSentSingleThread(mailId):Observable<any>{
  return this.http.get(`${this.baseUrl}/api/email/sent/${mailId}`)
}

getSentAttachment(filename):Observable<any>{
  return this.http.get(`${this.baseUrl}/api/email/sent/filename/${filename}`,{responseType:'arraybuffer', 
  reportProgress: true,
 observe: 'events' })
}

}
