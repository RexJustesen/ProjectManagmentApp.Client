import { Injectable} from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class SignalRService {
    //connection used to connect to SignalR hub in project management API
    private hubConnection: signalR.HubConnection | undefined;

    public projectUpdateReceived = new Subject<string>();
    public taskUpdateReceived = new Subject<string>();
    public linkUpdateReceived = new Subject<string>();

    constructor() { }

    public startProjectConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
                                 .withUrl('https://localhost:8001/project-hub')
                                 .build();
        

        this.hubConnection
            .start()
            .then(() => console.log('Connection Started'))
            .catch(err => console.log("Error while starting connection: " +err));

        this.hubConnection.on('ReceiveProjectUpdate', (data) => {
            console.log(data);
            this.projectUpdateReceived.next(data);
        });
    }

    public startTaskConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
                                 .withUrl('https://localhost:8001/ticket-hub')
                                 .build();
        

        this.hubConnection
            .start()
            .then(() => console.log('Connection Started'))
            .catch(err => console.log("Error while starting connection: " +err));

        this.hubConnection.on('ReceiveTicketUpdate', (data) => {
            console.log(data);
            this.taskUpdateReceived.next(data);
        });
    }

    public startLinkConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
                                 .withUrl('https://localhost:8001/ticket-hub')
                                 .build();
        

        this.hubConnection
            .start()
            .then(() => console.log('Connection Started'))
            .catch(err => console.log("Error while starting connection: " +err));

        this.hubConnection.on('ReceiveLinkUpdate', (data) => {
            console.log(data);
            this.linkUpdateReceived.next(data);
        });
    }
}