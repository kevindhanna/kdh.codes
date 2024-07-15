import { Keyword, Variable, Indent, StringEl } from "../Code";
import { Project as ProjectType } from "../../models/Project";
import styles from "./style.module.css";

export const Project = ({
  name,
  description,
  onMouseEnter,
  onMouseLeave,
}: ProjectType & { onMouseEnter: () => void; onMouseLeave: () => void }) => (
  <div
    className={styles.Project}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <Keyword>{"proj "}</Keyword>
    <Variable>{name}</Variable>
    <text>{" -> {"}</text>
    <Indent>
      <StringEl>{description}</StringEl>
    </Indent>
    <text>{"}"}</text>
  </div>
);
