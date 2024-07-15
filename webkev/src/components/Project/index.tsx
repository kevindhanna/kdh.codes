import { useState } from "preact/hooks";

import { Keyword, Variable, Indent, StringEl, Syntax } from "../Code";
import { Project as ProjectType } from "../../models/Project";
import { ProjectDetail } from "../../components/ProjectDetail";
import styles from "./style.module.css";

export const Project = ({ name, description, detail }: ProjectType) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <div
        className={styles.Project}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        <Keyword>{"proj "}</Keyword>
        <Variable>{name}</Variable>
        <Syntax>{" -> {"}</Syntax>
        <Indent>
          <StringEl>{description}</StringEl>
        </Indent>
        <Syntax>{"}"}</Syntax>
      </div>
      <ProjectDetail content={detail} visible={!!isActive} />
    </>
  );
};
