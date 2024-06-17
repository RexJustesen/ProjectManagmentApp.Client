import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';
import { SignalRService } from '../services/signalR.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit{
[x: string]: any;
  @Input() project: Project | undefined;
  @Output() projectDeleted = new EventEmitter();

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private signalRService: SignalRService // Inject SignalRService
  ) { }

  ngOnInit(): void {
    //console.log(this.project?.id);
  }

  deleteProject(id: number, name: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(
        () => {
          console.log(`Project with ID ${id} deleted successfully.`);
          this.signalRService.projectUpdateReceived.next(name); 
          this.router.navigate(['/']);
        },
        error => {
          console.error('Error deleting project:', error);
        }
      );
    }
  }
}
