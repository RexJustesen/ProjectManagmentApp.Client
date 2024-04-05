export interface Task {
    id: number;
    startDate: string;
    plannedStartDate: string;
    text: string;
    progress: number;
    duration: number;
    plannedEnd: string;
    parent?: number;
    type: string;

}
