import {
  Keyword,
  Link,
  Indent,
  ClassName,
  Comment,
  StringEl,
  Syntax,
} from "../Code";
import { Employer as EmployerType } from "../../models/Employer";
import { Project } from "../Project";
import styles from "./style.module.css";

export const Employer = ({
  name,
  website,
  description,
  duration,
  projects,
  technologies,
}: EmployerType) => (
  <div className={styles.Employer}>
    <text>
      <Keyword>{"emp "}</Keyword>
      <ClassName>{name}</ClassName>(<StringEl>{duration}</StringEl>)
      <Syntax>{": "}</Syntax>
      <Link>
        <a href={`https://${website}`} target="blank">
          {website}
        </a>
      </Link>
      <Syntax>{" {"}</Syntax>
    </text>
    <Indent>
      <Comment>{description}</Comment>
      <br />
      <br />
      <div className={styles.projectList}>
        {projects.map((p) => (
          <Project {...p} />
        ))}
      </div>
      <br />
      <text>
        <Keyword>{"tech"}</Keyword>
        <Syntax>{" = ["}</Syntax>
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
        <Syntax>{"]"}</Syntax>
      </text>
    </Indent>
    <Syntax>{"}"}</Syntax>
  </div>
);
