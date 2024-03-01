export interface Task {
    id: number;
    startDate: string;
    text: string;
    progress: number;
    duration: number;
    parent?: number;
    type: string;

}
