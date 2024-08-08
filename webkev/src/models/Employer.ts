import { Project } from "./Project";

export interface Employer {
    description: string;
    duration: string;
    durationShort: string;
    name: string;
    projects: Project[];
    technologies: string[];
    website: string;
}
