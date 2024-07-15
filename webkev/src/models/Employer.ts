import { Project } from "./Project";

export interface Employer {
    description: string;
    duration: string;
    name: string;
    projects: Project[];
    technologies: string[];
    website: string;
}
