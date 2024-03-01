import { Injectable } from '@angular/core';
import { Link } from '../models/link';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HandleError } from './service-helper';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment'; 

@Injectable()
export class LinkService {
    private linkUrl = 'http://localhost:8000/api/project/';
    constructor(private http: HttpClient) {}
    async getLinks(projectId: string): Promise<Link[]> {
        try {
            const response = await firstValueFrom(this.http.get<any>(this.linkUrl + projectId + "/links"));
            console.log(JSON.stringify(response));
            if (response) {
                /*const links = response.link.map((item: any) => ({
                    id: item.id,
                    type: item.type,
                    source: item.source,
                    target: item.target
                }));*/
                console.log(response.links);
                return response.links;
                
            } 
            return [];
        } catch (error) {
            return HandleError(error);
        }
    }

  insert(projectId: string, link: Link): Promise<Link> {

      console.log(JSON.stringify(link));
      // Remove the id field from the task object
      link.id = 0;

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return firstValueFrom(this.http.post<any>(this.linkUrl + projectId + "/links", JSON.stringify(link), { headers }))
          .then(response => {
             return response as Link; 
          })
          .catch(HandleError);
  }


  update(projectId: string, link: Link): Promise<void> {
      return firstValueFrom(this.http.put(`${this.linkUrl + projectId + "/links"}/${link.id}`, link))
          .catch(HandleError);
  }


  remove(projectId: string, id: number): Promise<void> {
      return firstValueFrom(this.http.delete(`${this.linkUrl + projectId + "/links"}/${id}`))
          .catch(HandleError);
  }
}