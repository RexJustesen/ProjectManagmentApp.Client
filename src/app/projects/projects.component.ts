import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Observable, Subscription } from 'rxjs';
import { Project } from '../models/project';
import { Router } from '@angular/router';
import { SignalRService } from '../services/signalR.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects$: Observable<Project[]> | undefined;
  private projectUpdateSubscription: Subscription | undefined; // Subscription for project updates
  noProjects = false; // Add this variable to track if there are no projects

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private signalRService: SignalRService // Inject SignalRService
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.subscribeToProjectUpdates(); // Subscribe to project updates
  }

  ngOnDestroy() {
    // Unsubscribe from project updates to prevent memory leaks
    if (this.projectUpdateSubscription) {
      this.projectUpdateSubscription.unsubscribe();
    }
  }

  loadProjects() {
    this.projects$ = this.projectService.getProjects();
    console.log(JSON.stringify(this.projects$));
    this.projects$.subscribe(projects => {
      this.noProjects = projects.length === 0; // Check if there are no projects
    });
  }

  

  subscribeToProjectUpdates() {
    // Subscribe to project update events from SignalRService
    console.log("signalr handler");
    this.projectUpdateSubscription = this.signalRService.projectUpdateReceived.subscribe(() => {
      console.log("getting projects");
      // Reload projects when a new project is created or deleted
      this.loadProjects();
    });
  }

}
