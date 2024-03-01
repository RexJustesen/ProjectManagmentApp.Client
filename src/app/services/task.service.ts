import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, map, max, of } from 'rxjs';
import { HandleError } from './service-helper';

@Injectable()
export class TaskService {
    private ticketUrl = 'http://localhost:8000/api/project/';
    tasks: Task[] = [];

    constructor(private http: HttpClient) {}

    async getTasks(projectId: string): Promise<Task[]> {
        try {
            const response = await firstValueFrom(this.http.get<any>(this.ticketUrl + projectId + "/tickets"));
            console.log(response); // Ensure that the response is as expected
            
   
            if (response) {
                const data = response.tickets.map((item: any) => ({
                    id: item.id,
                    text: item.text,
                    start_date: item.startDate, // Adjusted property name
                    duration: item.duration,
                    progress: item.progress,
                    parent: item.parentId // Adjusted property name
                }));
                console.log(data);
                return data;
            } else {
                // Handle the case when response.tickets doesn't exist
                throw new Error("Invalid response format: tickets array not found");
            }
        } catch (error) {
            return HandleError(error);
        }
    }

    async insert(projectId: string,task: Task): Promise<Task> {
        //console.log('Task to be inserted:', JSON.stringify(task));
        
        // Remove the id field from the task object
        task.id = 0;
        console.log(JSON.stringify(task));

        const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
        return firstValueFrom(this.http.post<any>(this.ticketUrl + projectId + "/tickets" ,JSON.stringify(task), { headers }))
            .then(response => {
                return response as Task; 
            })
            .catch(error => {
                return HandleError(error);
            });
    }
    
    

    update(projectId: string,task: Task): Promise<void> {
        return firstValueFrom(this.http.put(`${this.ticketUrl + projectId + "/tickets"}/${task.id}`, task))
            .then(response => {
                return response as Task;
            })
            .catch(HandleError);
    }

    remove(projectId: string, id: number): Promise<void> {
        return firstValueFrom(this.http.delete(`${this.ticketUrl + projectId + "/tickets"}/${id}`))
            .catch(HandleError);
    }
}
