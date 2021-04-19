import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule} from 'ngx-socket-io';
import {HttpClientModule} from '@angular/common/http'
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import {MatRippleModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ToastrModule } from 'ngx-toastr';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppComponent } from './app.component';
import { HomeComponent } from './dashboard/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ComposeComponent } from './dashboard/csa/compose/compose.component';
import { InboxComponent } from './dashboard/csa/inbox/inbox.component';
import { SentComponent } from './dashboard/csa/sent/sent.component';
import { ChatRoomComponent } from './dashboard/csa/chat-room/chat-room.component';
import { InboxDetailComponent } from './dashboard/csa/inbox/inbox-detail/inbox-detail.component';
import { SentDetailComponent } from './dashboard/csa/sent/sent-detail/sent-detail.component';
import { EmployerChatComponent } from './dashboard/employer/employer-chat/employer-chat.component';
import {JobseekerChatComponent} from './dashboard/job-seeker/jobseeker-chat/jobseeker-chat.component';
import { CustomerQueueComponent } from './dashboard/csa/customer-queue/customer-queue.component';
import { ChatHistoryComponent } from './dashboard/csa/chat-history/chat-history.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ComposeComponent,
    InboxComponent,
    SentComponent,
    ChatRoomComponent,
    InboxDetailComponent,
    SentDetailComponent,
    EmployerChatComponent,
    JobseekerChatComponent,
    RegisterComponent,
    HomeComponent,
    CustomerQueueComponent,
    ChatHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatRippleModule,
    MatTooltipModule,
    ToastrModule.forRoot(),
    MatMenuModule,
    MatChipsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
