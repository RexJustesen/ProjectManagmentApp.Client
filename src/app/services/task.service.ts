import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, max } from 'rxjs';
import { HandleError } from './service-helper';

@Injectable()
export class TaskService {
    private ticketUrl = 'http://localhost:8000/api/ticket';

    constructor(private http: HttpClient) {}

    async get(): Promise<Task[]> {
        try {
            const response = await firstValueFrom(this.http.get<any>(this.ticketUrl));
            const data = response.data.map((item: any) => ({
                id: item.id,
                text: item.text,
                start_date: item.start_date,
                duration: item.duration,
                progress: item.progress,
                parent: item.parent
            }));
            return data;
        } catch (error) {
            return HandleError(error);
        }
    }

    async insert(task: Task): Promise<Task> {
        //console.log('Task to be inserted:', JSON.stringify(task));
        
        // Remove the id field from the task object
        task.id = 0;
        console.log(JSON.stringify(task));

        const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
        return firstValueFrom(this.http.post<any>(this.ticketUrl, JSON.stringify(task), { headers }))
            .then(response => {
                return response as Task; 
            })
            .catch(error => {
                return HandleError(error);
            });
    }
    
    

    update(task: Task): Promise<void> {
        return firstValueFrom(this.http.put(`${this.ticketUrl}/${task.id}`, task))
            .then(response => {
                return response as Task;
            })
            .catch(HandleError);
    }

    remove(id: number): Promise<void> {
        return firstValueFrom(this.http.delete(`${this.ticketUrl}/${id}`))
            .catch(HandleError);
    }
}
