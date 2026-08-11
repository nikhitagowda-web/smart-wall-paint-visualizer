import { Routes } from '@angular/router';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { MyProjectsComponent } from './components/my-projects/my-projects.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'visualizer', pathMatch: 'full' },
  { path: 'visualizer', component: VisualizerComponent },
  { path: 'my-projects', component: MyProjectsComponent },
  { path: 'user-guide', component: UserGuideComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'visualizer' }
];