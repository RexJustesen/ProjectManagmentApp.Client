import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { GanttComponent } from './gantt/gantt.component';
import { NewProjectComponent } from './new-project/new-project.component';

const routes: Routes = [
  {path:'', component: ProjectsComponent,},

  {path: 'projects/:id', component: GanttComponent},
  {path: 'create-project', component: NewProjectComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
