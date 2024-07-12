import { Project } from "./Project";

export interface Employer {
    name: string;
    description: string;
    website: string;
    projects: Project[];
}
