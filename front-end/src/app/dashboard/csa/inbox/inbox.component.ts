import { Component, OnInit,ViewChild,AfterViewInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, ParamMap  } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import {EmailService} from '../../../shared/api-services/email.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<any>;
  dataSource:any= new MatTableDataSource<any>([]);
  editDeleteAction:boolean=false;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  @Input() public displayedColumns = ['mail'];
emails=[];
mailId:string=null;
subject:string='';


  constructor(   private activatedRoute: ActivatedRoute,
    private _emailService:EmailService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.syncEmails();
    this.getAllInboxMails();
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      let email = params.get('email');
      if (email !== null) {
       this.applyFilter(email);
      }
    })
  }

syncEmails(){
  this._emailService.syncMails().subscribe(resp=>{
    this.toastr.info('syncing your inbox', 'email sync');
  },err=>{
    this.toastr.error(err.error.error, 'mail sync error');
  });
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

ngAfterViewInit() {

}

refreshMailInvoked(event){
  this.getAllInboxMails();
}



getAllInboxMails(){
  this._emailService.getAllInboxMails().subscribe(resp=>{
    this.emails=resp.inboxData;
    this.dataSource.data = this.emails;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  },err=>{
    this.toastr.error(err.error.error, 'inbox error');
  })
}


}
