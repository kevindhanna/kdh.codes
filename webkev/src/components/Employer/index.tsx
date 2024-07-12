import { Keyword, Link, Indent, ClassName, Comment } from "../Code";
import { Employer as EmployerType } from "../../models/Employer";
import { Project } from "../Project";
import styles from "./style.module.css";

export const Employer = ({
  name,
  website,
  description,
  projects,
}: EmployerType) => (
  <div className={styles.Employer}>
    <text className={styles.definition}>
      <Keyword>{"emp "}</Keyword>
      <ClassName>{name}</ClassName>
      <text>{": "}</text>
      <Link>
        <a href={`https://${website}`}>{website}</a>
      </Link>
      <text>{" {"}</text>
    </text>
    <Indent>
      <Comment>{description}</Comment>

      <div className={styles.projectList}>
        {projects.map((p) => (
          <Project name={p.name} description={p.description} />
        ))}
      </div>
    </Indent>
    <text>{"}"}</text>
  </div>
);
