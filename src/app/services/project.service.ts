import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import { firstValueFrom, of, map } from 'rxjs';
import { HandleError } from './service-helper';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private linkUrl = 'http://localhost:8000/api/';
  projects: Project[] = [];
  constructor(private http: HttpClient) {}

  getProjects(){
    if (this.projects.length >0) return of(this.projects);
    return this.http.get<Project[]>(this.linkUrl + "project").pipe(
      map(projects => {
        this.projects = projects;
        return projects;
      })
    )
  }

  createProject(project: any){
    return this.http.post<Project>(this.linkUrl + "createproject", project).pipe();
  }

  deleteProject(id: number){
    return this.http.delete<Project>(this.linkUrl + "project"+`/${id}`).pipe();
  }
}
