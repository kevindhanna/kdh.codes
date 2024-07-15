import { Keyword, Link, Indent, ClassName, Comment, StringEl } from "../Code";
import { Employer as EmployerType } from "../../models/Employer";
import { Project } from "../Project";
import styles from "./style.module.css";
import { Project as ProjectType } from "../../models/Project";

export const Employer = ({
  name,
  website,
  description,
  duration,
  projects,
  technologies,
  setActiveProject,
}: EmployerType & { setActiveProject: (project: ProjectType) => void }) => (
  <div className={styles.Employer}>
    <text>
      <Keyword>{"emp "}</Keyword>
      <ClassName>{name}</ClassName>(<StringEl>{duration}</StringEl>)
      <text>{": "}</text>
      <Link>
        <a href={`https://${website}`} target="blank">
          {website}
        </a>
      </Link>
      <text>{" {"}</text>
    </text>
    <Indent>
      <Comment>{description}</Comment>
      <br />
      <br />
      <div className={styles.projectList}>
        {projects.map((p) => (
          <Project
            name={p.name}
            description={p.description}
            onMouseEnter={() => setActiveProject(p)}
            onMouseLeave={() => setActiveProject(undefined)}
          />
        ))}
      </div>
      <br />
      <text>
        <Keyword>{"tech"}</Keyword>
        {" = ["}
        <br />
        <Indent>
          {technologies.map((t) => (
            <>
              <StringEl>{t}</StringEl>
              <text>{", "}</text>
              <br />
            </>
          ))}
        </Indent>
        {"]"}
      </text>
    </Indent>
    <text>{"}"}</text>
  </div>
);
