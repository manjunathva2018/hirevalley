import { Component, OnInit,ViewChild,AfterViewInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import {EmailService} from '../../../shared/api-services/email.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<any>;
  dataSource: any=new MatTableDataSource<any>([]);
  editDeleteAction:boolean=false;
    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    @Input() public displayedColumns = ['mail'];
  emails:any=[];
  mailId:string=null;
  subject:string='';

  constructor(private _emailService:EmailService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllSentMails();
  }



  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // ngAfterViewInit() {

  // }

  refreshMailInvoked(event){
    this.getAllSentMails();
  }

  getAllSentMails(){
    this._emailService.getAllSentMails().subscribe(resp=>{
  this.emails=resp.sentData;
  this.dataSource.data = this.emails;
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
    },err=>{
      this.toastr.error(err.error.error, 'sent mail error');
    })
  }

}
