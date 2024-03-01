import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Observable } from 'rxjs';
import { Project } from '../models/project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit{
  projects$: Observable<Project[]> | undefined;
  constructor(private projectService: ProjectService, private router: Router) { }


  ngOnInit(){
    this.loadProjects();
    
  }

  loadProjects(){
    this.projects$ = this.projectService.getProjects();
    console.log(this.projects$);
  }

  onProjectCreated(){
    this.loadProjects();
  }

}
