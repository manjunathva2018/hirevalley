import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl = environment.serverURL;
  constructor(private http: HttpClient) { }

  checkUserLogin(loginData):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/user/email/${loginData.email}/password/${loginData.password}`);
  }

  registerUser(userData):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/user/create`,userData);
  }

  getAllUsersByRole(roleId):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/user/role/${roleId}`);
  }

  getSingleUser(userId):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/user/id/${userId}`);
  }

}
