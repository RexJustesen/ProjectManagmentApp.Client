import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent  implements OnInit{
  @Output() projectCreated = new EventEmitter();
  @Output() CancelCreate = new EventEmitter();
  project: any = {}


  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    
  }

  newProject(){
    this.projectService.createProject(this.project).subscribe({
      next: () => {
        this.projectCreated.emit();
        this.router.navigate(['/']);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  cancel() {
    this.CancelCreate.emit();
    this.router.navigate(['/']);
  }
  
}
