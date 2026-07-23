import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { MyProjectsComponent } from './components/my-projects/my-projects.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'visualizer', component: VisualizerComponent },
  { path: 'my-projects', component: MyProjectsComponent },
  { path: '**', redirectTo: '' }
];