import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TaskService } from '../services/task.service';
import { LinkService } from '../services/link.service';
import { Task } from '../models/task';
import { Link } from '../models/link';
import { gantt } from 'dhtmlx-gantt';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { SignalRService } from '../services/signalR.service';
import { DatePipe } from '@angular/common';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'gantt',
    styleUrls: ['./gantt.component.css'],
    providers: [TaskService, LinkService, DatePipe],
    template: `<div #gantt_here class='gantt-chart'></div>`,
})

export class GanttComponent implements OnInit, OnDestroy {
    @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;
    private taskUpdateSubscription: Subscription | undefined; // Subscription for project updates
    private routeSubscription: Subscription | undefined; // Subscription for route changes
    private projectid: string | null = null;
   

    constructor(private taskService: TaskService,
         private linkService: LinkService, 
         private route: ActivatedRoute, 
         private router: Router,
         private signalRService: SignalRService,
         private datePipe: DatePipe
         ) { }

    ngOnInit() {
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            this.projectid = params.get('id');
            
            console.log(this.projectid);
      
            // Reinitialize the Gantt chart with the new project ID
            this.initializeGantt(this.projectid);
          });

    }

    initializeGantt(projectid:string | null){
        var opts = [
            {key: 'project', label: 'Project'},
            {key: 'task', label: 'Task'},
            {key: 'milestone', label: 'Milestone'}
        ]


        console.log(projectid);

        gantt.config.auto_scheduling = true;
	    gantt.config.auto_scheduling_strict = true;
	    gantt.config.auto_scheduling_compatibility = true;
        gantt.config.open_tree_initially = true;
        gantt.config.date_format = '%Y-%m-%d %H:%i';
        gantt.config.work_time = true;
        gantt.config.correct_work_time = true;
        gantt.config.skip_off_time = true; 
        gantt.config.sort = true; 
        gantt.config.fit_tasks = true; 


        
        gantt.plugins({
            grouping: true,
            keyboard_navigation: true,
            //quick_info: true,
            tooltip: true,
            marker: true,
            overlay: true,
            auto_scheduling: true,
            fullscreen: true
          })

          var dateToStr = gantt.date.date_to_str(gantt.config.task_date);
          var currentDate = new Date();
          var dd = currentDate.getDate();
          var mm = currentDate.getMonth();
          var yyyy = currentDate.getFullYear();
          var hh = currentDate.getHours();
          var today = new Date(yyyy, mm, dd, hh)
          console.log(today);
    

        gantt.config.columns = [
            { name: 'id', label: 'ID', tree: false, align: "center", width: 75, resize: true },
            { name: 'text', label: 'Task name', align: "center", tree: true, width: '150' , resize: true },
            { name: 'start_date', label: 'Start date', align: "center", tree: false, width: '150', resize: true },
            { name: 'duration', label: 'Duration', align: "center", tree: false, width: '70', resize: true },
            { name: "add", width: 44, resize: true }
        ];

        gantt.config.scale_height = 50;
	    gantt.config.scales = [
		    {unit: "day", step: 1, format: "%j, %D"},
		    {unit: "month", step: 1, format: "%F, %Y"},
	    ];

        gantt.config.lightbox.sections =[
            {name:"Description", height: 38, map_to: "text", type:"texatarea", focus:true},
            {name:"description",     height:45, map_to:"text", type:"textarea"},
            {name: "type",       height: 38, map_to:"type", type:"select", options: opts},
            {name:"time",        height:72, map_to:"auto", type:"duration"}

        ];

    

        gantt.templates.timeline_cell_class = function(task,date){
            if(!gantt.isWorkTime(date)){
                return "weekend";
            }

            return "";
        };

        gantt.templates.scale_cell_class = function (date) {
            if (!gantt.isWorkTime(date)) {
                return "weekend";
            }

            return "";
        };


        gantt.attachEvent("onBeforeAutoSchedule", function () {
            gantt.message("Recalculating project schedule...");
            return true;
        });
        gantt.attachEvent("onAfterTaskAutoSchedule", function (task, new_date, constraint, predecessor) {
            if(task && predecessor){
                gantt.message({
                    text: "<b>" + task.text + "</b> has been rescheduled to " + gantt.templates.task_date(new_date) + " due to <b>" + predecessor.text + "</b> constraint",
                    expire: 4000
                });
            }
        });



        gantt.init(this.ganttContainer.nativeElement);
        

        if(!(gantt as any).$_initOnce){
            (gantt as any).$_initOnce = true;
        } else {
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

        gantt.attachEvent("onBeforeAutoSchedule", function () {
            gantt.message("Recalculating project schedule...");
            return true;
        });
        gantt.attachEvent("onAfterTaskAutoSchedule", function (task, new_date, constraint, predecessor) {
            if(task && predecessor){
                gantt.message({
                    text: "<b>" + task.text + "</b> has been rescheduled to " + gantt.templates.task_date(new_date) + " due to <b>" + predecessor.text + "</b> constraint",
                    expire: 4000
                });
            }
        });

        gantt.attachEvent("onAfterTaskUpdate", function(){
            gantt.refreshData();
        });

        gantt.attachEvent("onTemplatesReady", function () {
            var toggle = document.createElement("i");
            toggle.className = "fa fa-expand gantt-fullscreen";
            gantt['toggleIcon'] = toggle;
            gantt.$container.appendChild(toggle);
            toggle.onclick = function() {
                gantt.ext.fullscreen.toggle();
            };
        });
        gantt.attachEvent("onExpand", function () {
            var icon = gantt['toggleIcon'];
            if (icon) {
                icon.className = icon.className.replace("fa-expand", "fa-compress");
            }
    
        });
        gantt.attachEvent("onCollapse", function () {
            var icon = gantt['toggleIcon'];
            if (icon) {
                icon.className = icon.className.replace("fa-compress", "fa-expand");
            }
        });

   
        this.loadGanttChart(projectid);
        this.subscribeToTaskUpdates(projectid);
        
        const todayMaker = gantt.addMarker({
            start_date: today,
            css: "today",
            text: dateToStr(today),
            title: "Today: " + dateToStr(today)
        });
    }

    ngOnDestroy(): void {
        gantt.clearAll();
    if (this.taskUpdateSubscription) {
      this.taskUpdateSubscription.unsubscribe();
    }
    this.projectid = null;
      }

    loadGanttChart(projectid: any){
        gantt.clearAll();
        if (!projectid) return;
        Promise.all([this.taskService.getTasks(projectid), this.linkService.get(projectid)])
        .then(([data, links]) => {
            console.log(data);
            console.log('Links:', JSON.stringify(links));
            gantt.parse({ data, links });
            gantt.sort("start_date", false);
        });
      }

    subscribeToTaskUpdates(projectid: any) {
        console.log("signalr handler");
        this.taskUpdateSubscription = this.signalRService.taskUpdateReceived.subscribe(() => {
          console.log("getting projects");
          this.loadGanttChart(projectid);
        });
      }
}

// adding baseline display
function drawBaseline(task: Task) {
    if (task.plannedStartDate && task.plannedEnd) {
        const sizes = gantt.getTaskPosition(task, gantt.date.parseDate(task.plannedStartDate, gantt.config.date_format), gantt.date.parseDate(task.plannedEnd, gantt.config.date_format));
        const el = document.createElement('div');
        el.className = 'baseline';
        el.style.left = sizes.left - 6 + 'px';
        el.style.width = sizes.width + 10 + 'px';
        el.style.height = sizes.height + 6 + 'px';
        el.style.top = sizes.top + 1 + 'px';
        return el;
    }
    return false;
};

