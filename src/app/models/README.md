# 🚀 Project Management Interfaces in TypeScript 🚀

Welcome to our repository! Here, we've defined some key interfaces in TypeScript that will help you manage and organize tasks, projects, and links. Let's dive in! 🏊‍♂️

## 📁 Files Overview 📁

### 📄 task.ts 📄

This file is your go-to for defining a Task object. It's a simple interface with properties like `id`, `startDate`, `plannedStartDate`, `text`, `progress`, `duration`, `plannedEnd`, `parent`, and `type`. 📝

No functions or methods here, just a clean, straightforward interface. And no external dependencies either! Just make sure you've got a TypeScript compiler handy. 🛠️

Here's a quick peek at how you might use the Task interface:

```typescript
let task: Task = {
    id: 1,
    startDate: '2021-01-01',
    plannedStartDate: '2021-01-02',
    text: 'This is a task',
    progress: 50,
    duration: 2,
    plannedEnd: '2021-01-03',
    parent: 0,
    type: 'task'
};
```

### 📄 project.ts 📄

Next up, we have `project.ts`. This file defines the structure of a Project object, which is used to manage and organize tasks and links within a project. 🏗️

Again, no functions or methods here, just a neat interface. This file does depend on two external libraries: "dhtmlx-gantt" for the Task object and "./link" for the Link object. 📚

Here's an example of how you might use the Project interface:

```typescript
let project: Project = {
    id: 1,
    name: "New Project",
    tasks: [],
    links: []
};
```

### 📄 link.ts 📄

Last but not least, we have `link.ts`. This file defines an interface for a Link object, which represents a connection between two entities. 🔗

No functions, methods, or external dependencies here either. Just a simple interface for your linking needs.

Here's a quick example of how to use the Link interface:

```typescript
let link: Link = {
    id: 1,
    source: 2,
    target: 3,
    type: 'direct'
};
```

## 🎉 Wrapping Up 🎉

And that's it! With these interfaces, you're well on your way to managing tasks, projects, and links like a pro. Happy coding! 🎈🎈🎈
