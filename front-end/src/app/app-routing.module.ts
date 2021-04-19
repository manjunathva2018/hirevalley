import { NgModule } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ComposeComponent } from './dashboard/csa/compose/compose.component';
import { InboxComponent } from './dashboard/csa/inbox/inbox.component';
import { SentComponent } from './dashboard/csa/sent/sent.component';
import { ChatRoomComponent } from './dashboard/csa/chat-room/chat-room.component';
import { EmployerChatComponent } from './dashboard/employer/employer-chat/employer-chat.component';
import { JobseekerChatComponent } from './dashboard/job-seeker/jobseeker-chat/jobseeker-chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './dashboard/home/home.component';
import {CustomerQueueComponent} from './dashboard/csa/customer-queue/customer-queue.component';
import {ChatHistoryComponent} from './dashboard/csa/chat-history/chat-history.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'csa/compose', component: ComposeComponent },
      { path: 'csa/compose/forward/:forwardMailId', component: ComposeComponent },
      { path: 'csa/compose/resend/:resendMailId', component: ComposeComponent },
      { path: 'csa/inbox', component: InboxComponent },
      { path: 'csa/inbox/:email', component: InboxComponent },
      { path: 'csa/sent', component: SentComponent },
      { path: 'csa/csa-chat/:id', component: ChatRoomComponent },
      { path: 'csa/customer-queue', component: CustomerQueueComponent },
      { path: 'csa/chat-history', component: ChatHistoryComponent },
      { path: 'csa/chat-history/:userId', component: ChatHistoryComponent },
      { path: 'employer/employer-chat', component: EmployerChatComponent },
      {
        path: 'job-seeker/jobseeker-chat', component: JobseekerChatComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
