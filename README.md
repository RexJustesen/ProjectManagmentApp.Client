# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.8.

## Development server

After cloning the repository navigate to the root of the cloned repository and run the following command to install the required dependencies: 
```bash
npm install
```

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

This application uses the project management api developed by Rex justesen. The project management api is developed in C# using .Net 7. This api needs to be running in order to render the components correctly. here is the link: https://github.com/RexJustesen/ProjectManagmentApp

## Note
I am using DHTMLX (https://dhtmlx.com) for the gantt chart component. This has created a commonjs dependency so the application compiles with a warning which I have suppressed in the angular.json file. Currently dhtmlx does not have an es6 module and so for this specific application I am using it as a commonjs dependency. 

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


# How this application works

This application is a simple project management application. It has a way to create new projects and delete projects. It also has a gantt chart for each project where you can add project tasks, subtasks, milestones and linke tasks to other tasks. Here is how to use it. 

1. On the main page if there are no existing projects there will be a single card with "Create New Project" as its label. If you click on this card a new page will open which will allow you to create a new project with a given project name. 

2. Once a project is created it will be a new card next to the "Create New Project" card with the name given to it. If you click on this card it will go to the gantt chart page. In the gantt chart page you can create new tasks with the following labels 

- Project: This does not take into account a start date or duration given to it by the user but rather subtasks can be created underneath and its duration will be the total duration of all subtasks. To add subtask to any project or task in the gantt chart you need to click the blue "+" sign next to that task's name. 
- Task: This is the standard task component and it takes into account the start date and duration and will extend from the start date to the end date determined by the duration. It automatically accounts for weekends and so if the duration extends into a weekend it will automatically jump to the next available work day. 
- Milestone: This will a daimond and typically is indicative of a project end data. It only takes into account the start date and the start date is the milestone due date as the milestone is only for one day. 

3. You can also create links. Links are arrows from one task to another. You can create links by clicking on the end of a task (indicated by a circle) and dragging it to the beginning of another task. 

4. You can update task as much as you want (except projects as their start date and duration is the determined by the earliest start date and latest end date of all tasks). You can also delete tasks. If you delete a task or project with subtasks the subtasks will be deleted as well. 

