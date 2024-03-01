import { Task } from "dhtmlx-gantt";
import { Link } from "./link";

export interface Project{
    id: number;
    name: string;
    tasks: Task[];
    links: Link[];
}