import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import { firstValueFrom, of, map, Observable, catchError } from 'rxjs';
import { HandleError } from './service-helper';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private linkUrl = 'https://localhost:8001/api/';
  projects: Project[] = [];
  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<any>(this.linkUrl + "project").pipe(
      map(response => {
        if (response) {
          return response.map((projectData: any) => ({
            id: projectData.id,
            name: projectData.name,
            // Map other properties as needed
            // Example:
            // tickets: projectData.tickets,
            // links: projectData.links,
          } as Project));
        } else {
          console.error('Invalid response format:', response);
          return [];
        }
      })
    );
  }

  createProject(project: any){
    return this.http.post<Project>(this.linkUrl + "createproject", project).pipe();
  }

  deleteProject(id: number): Observable<{}> {
    return this.http.delete<{}>(`${this.linkUrl}project/${id}`).pipe(
      catchError(this.handleError<{}>('deleteProject'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
