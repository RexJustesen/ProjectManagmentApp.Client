import { Task } from "./task";
import { Link } from "./link";

export interface Project{
    projectService: any;
    id: number;
    name: string;
    tasks: Task[];
    links: Link[];
}