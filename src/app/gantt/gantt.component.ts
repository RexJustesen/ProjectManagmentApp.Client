import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TaskService } from '../services/task.service';
import { LinkService } from '../services/link.service';
import { Task } from '../models/task';
import { Link } from '../models/link';
import { gantt } from 'dhtmlx-gantt';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  private taskUpdateSubscription: Subscription | undefined;
  private routeSubscription: Subscription | undefined;
  private projectid: string | null = null;

  constructor(
    private taskService: TaskService,
    private linkService: LinkService,
    private route: ActivatedRoute,
    private router: Router,
    private signalRService: SignalRService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.projectid = params.get('id');
      if (this.projectid) {
        this.initializeGantt(this.projectid);
      }
    });
  }

  initializeGantt(projectid: string | null) {
    if (!projectid) {
        return; // If projectid is null, exit the function early
      }
    const opts = [
      { key: 'project', label: 'Project' },
      { key: 'task', label: 'Task' },
      { key: 'milestone', label: 'Milestone' },
    ];

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
      tooltip: true,
      marker: true,
      overlay: true,
      auto_scheduling: true,
      fullscreen: true,
    });

    const dateToStr = gantt.date.date_to_str(gantt.config.task_date);
    const today = new Date();

    gantt.config.columns = [
      { name: 'id', label: 'ID', align: 'center', width: 75, resize: true },
      { name: 'text', label: 'Task name', align: 'center', tree: true, width: 150, resize: true },
      { name: 'start_date', label: 'Start date', align: 'center', width: 150, resize: true },
      { name: 'duration', label: 'Duration', align: 'center', width: 70, resize: true },
      { name: 'add', width: 44, resize: true },
    ];

    gantt.config.scale_height = 50;
    gantt.config.scales = [
      { unit: 'day', step: 1, format: '%j, %D' },
      { unit: 'month', step: 1, format: '%F, %Y' },
    ];

    gantt.config.lightbox.sections = [
      { name: 'Description', height: 38, map_to: 'text', type: 'textarea', focus: true },
      { name: 'description', height: 45, map_to: 'text', type: 'textarea' },
      { name: 'type', height: 38, map_to: 'type', type: 'select', options: opts },
      { name: 'time', height: 72, map_to: 'auto', type: 'duration' },
    ];

    gantt.templates.timeline_cell_class = function (task, date) {
      if (!gantt.isWorkTime(date)) {
        return 'weekend';
      }
      return '';
    };

    gantt.templates.scale_cell_class = function (date) {
      if (!gantt.isWorkTime(date)) {
        return 'weekend';
      }
      return '';
    };

    gantt.attachEvent('onBeforeAutoSchedule', function () {
      gantt.message('Recalculating project schedule...');
      return true;
    });
    gantt.attachEvent('onAfterTaskAutoSchedule', function (task, new_date, constraint, predecessor) {
      if (task && predecessor) {
        gantt.message({
          text: `<b>${task.text}</b> has been rescheduled to ${gantt.templates.task_date(new_date)} due to <b>${predecessor.text}</b> constraint`,
          expire: 4000,
        });
      }
    });

    gantt.init(this.ganttContainer.nativeElement);

    if (!(gantt as any).$_initOnce) {
      (gantt as any).$_initOnce = true;
      const dp = gantt.createDataProcessor({
        task: {
          update: (data: Task) => this.taskService.update(projectid as string, data),
          create: (data: Task) => this.taskService.insert(projectid as string, data),
          delete: (id: any) => this.taskService.remove(projectid as string, id),
        },
        link: {
          update: (data: Link) => this.linkService.update(projectid as string, data),
          create: (data: Link) => this.linkService.insert(projectid as string, data),
          delete: (id: any) => this.linkService.remove(projectid as string, id),
        },
      });
    }

    gantt.attachEvent('onAfterTaskUpdate', function () {
      gantt.refreshData();
    });

    gantt.attachEvent('onTemplatesReady', function () {
      const toggle = document.createElement('i');
      toggle.className = 'fa fa-expand gantt-fullscreen';
      gantt['toggleIcon'] = toggle;
      gantt.$container.appendChild(toggle);
      toggle.onclick = function () {
        gantt.ext.fullscreen.toggle();
      };
    });
    gantt.attachEvent('onExpand', function () {
      const icon = gantt['toggleIcon'];
      if (icon) {
        icon.className = icon.className.replace('fa-expand', 'fa-compress');
      }
    });
    gantt.attachEvent('onCollapse', function () {
      const icon = gantt['toggleIcon'];
      if (icon) {
        icon.className = icon.className.replace('fa-compress', 'fa-expand');
      }
    });

    this.loadGanttChart(projectid);
    this.subscribeToTaskUpdates(projectid);

    gantt.addMarker({
      start_date: today,
      css: 'today',
      text: dateToStr(today),
      title: 'Today: ' + dateToStr(today),
    });
  }

  ngOnDestroy(): void {
    gantt.clearAll();
    if (this.taskUpdateSubscription) {
      this.taskUpdateSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.projectid = null;
  }

  loadGanttChart(projectid: string) {
    gantt.clearAll();
    if (!projectid) return;
    Promise.all([this.taskService.getTasks(projectid), this.linkService.get(projectid)])
      .then(([data, links]) => {
        gantt.parse({ data, links });
        gantt.sort('start_date', false);
      });
  }

  subscribeToTaskUpdates(projectid: string) {
    this.taskUpdateSubscription = this.signalRService.taskUpdateReceived.subscribe(() => {
      this.loadGanttChart(projectid);
    });
  }
}

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
