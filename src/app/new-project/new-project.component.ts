import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';
import { SignalRService } from '../services/signalR.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent  implements OnInit{
  @Output() projectCreated = new EventEmitter();
  @Output() CancelCreate = new EventEmitter();
  project: any = {}


  constructor(
    private projectService: ProjectService,
    private router: Router,
    private signalRService: SignalRService // Inject SignalRService
  ) {}

  ngOnInit(): void {
    
  }

  newProject() {
    this.projectService.createProject(this.project).subscribe({
      next: () => {
        console.log(this.project.name);
        // Emit event to signaRl that a new project is created
        this.signalRService.projectUpdateReceived.next(this.project.name); 
        this.router.navigate(['/']);
      },
      error: error => {
        console.log(error);
      }
    });
  }
  

  cancel() {
    this.CancelCreate.emit();
    this.router.navigate(['/']);
  }
  
}
