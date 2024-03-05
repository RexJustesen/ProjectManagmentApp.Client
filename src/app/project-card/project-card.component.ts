import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../models/project';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit{
[x: string]: any;
  @Input() project: Project | undefined;

  constructor() { }

  ngOnInit(): void {
    console.log(this.project?.id);
  }

}
