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
