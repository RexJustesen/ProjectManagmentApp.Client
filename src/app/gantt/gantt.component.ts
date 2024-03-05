import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TaskService } from '../services/task.service';
import { LinkService } from '../services/link.service';
import { Task } from '../models/task';
import { Link } from '../models/link';

import { gantt } from 'dhtmlx-gantt';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'gantt',
    styleUrls: ['./gantt.component.css'],
    providers: [TaskService, LinkService],
    template: `<div #gantt_here class='gantt-chart'></div>`,
})

export class GanttComponent implements OnInit, OnDestroy {
    @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;
   

    constructor(private taskService: TaskService, private linkService: LinkService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {

        var opts = [
            {key: 'project', label: 'Project'},
            {key: 'task', label: 'Task'},
            {key: 'milestone', label: 'Milestone'}
        ]

        var projectid = this.route.snapshot.paramMap.get('id')
        console.log(projectid);

        gantt.config.date_format = '%Y-%m-%d %H:%i';
        gantt.config.work_time = true;
        gantt.config.correct_work_time = true;
        gantt.config.skip_off_time = true; 
        gantt.config.sort = true; 
        //gantt.config.autosize = "xy";

        gantt.plugins({
            grouping: true,
            keyboard_navigation: true,
            //quick_info: true,
            tooltip: true,
            marker: true,
            overlay: true,
            auto_scheduling: true,
          })

          

        gantt.config.columns = [
            { name: 'id', label: 'ID', tree: false, align: "center", width: 75, resize: true },
            { name: 'text', label: 'Task name', align: "center", tree: true, width: '150' , resize: true },
            { name: 'start_date', label: 'Start date', align: "center", tree: false, width: '150', resize: true },
            { name: 'duration', label: 'Duration', align: "center", tree: false, width: '70', resize: true },
            { name: "add", width: 44, resize: true }
        ];

        gantt.config.lightbox.sections =[
            {name:"Description", height: 38, map_to: "text", type:"texatarea", focus:true},
            {name:"description",     height:45, map_to:"text", type:"textarea"},
            {name: "type",       height: 38, map_to:"type", type:"select", options: opts},
            {name:"time",        height:72, map_to:"auto", type:"duration"}

        ];


        gantt.templates.timeline_cell_class = function(task,date){
            if(date.getDay()==0||date.getDay()==6){
                return "weekend";
            }

            return "";
        };



        gantt.init(this.ganttContainer.nativeElement);
        

        if(!(gantt as any).$_initOnce){
            (gantt as any).$_initOnce = true;

            const dp = gantt.createDataProcessor({
                task: {
                    update: (data: Task) => this.taskService.update(projectid as string,data),
                    create: (data: Task) => this.taskService.insert(projectid as string, data),
                    delete: (id: any) => this.taskService.remove(projectid as string, id),
                },
                link: {
                    update: (data: Link) => this.linkService.update(projectid as string, data),
                    create: (data: Link) => this.linkService.insert(projectid as string,data),
                    delete: (id: any) => this.linkService.remove(projectid as string,id),
                }
            });
        }

   
        if (!projectid) return;
        Promise.all([this.taskService.getTasks(projectid), this.linkService.getLinks(projectid)])
        .then(([data, links]) => {
            console.log(data);
            //console.log('Links:', JSON.stringify(links));
            gantt.parse({ data, links });
            gantt.sort("start_date", false);
        });
        
    


    }

    ngOnDestroy(): void {
        gantt.clearAll();
      }
}