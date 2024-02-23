import { Injectable } from '@angular/core';
import { Link } from '../models/link';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HandleError } from './service-helper';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LinkService {
    private linkUrl = 'http://localhost:8000/api/link';
    constructor(private http: HttpClient) {}
    async get(): Promise<Link[]> {
        try {
            const response = await firstValueFrom(this.http.get<any>(this.linkUrl));
            console.log(JSON.stringify(response));
            if (response.link) {
                const links = response.link.map((item: any) => ({
                    id: item.id,
                    type: item.type,
                    source: item.source,
                    target: item.target
                }));
                return links;
            } 
            return [];
        } catch (error) {
            return HandleError(error);
        }
    }

  insert(link: Link): Promise<Link> {

      console.log(JSON.stringify(link));
      // Remove the id field from the task object
      link.id = Math.random();

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return firstValueFrom(this.http.post<any>(this.linkUrl, JSON.stringify(link), { headers }))
          .then(response => {
             return response as Link; 
          })
          .catch(HandleError);
  }


  update(link: Link): Promise<void> {
      return firstValueFrom(this.http.put(`${this.linkUrl}/${link.id}`, link))
          .catch(HandleError);
  }


  remove(id: number): Promise<void> {
      return firstValueFrom(this.http.delete(`${this.linkUrl}/${id}`))
          .catch(HandleError);
  }
}