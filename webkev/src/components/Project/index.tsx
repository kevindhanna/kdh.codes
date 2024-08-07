import { Keyword, Variable, Indent, StringEl, Syntax } from "../Code";
import { Project as ProjectType } from "../../models/Project";
import styles from "./style.module.css";

export const Project = ({
  name,
  description,
  onTouchStart,
  onMouseEnter,
  onMouseLeave,
}: ProjectType & {
  onTouchStart: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  return (
    <div
      className={styles.Project}
      onTouchStart={onTouchStart}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Keyword>{"proj "}</Keyword>
      <Variable>{name}</Variable>
      <Syntax>{" -> {"}</Syntax>
      <Indent>
        <StringEl>{description}</StringEl>
      </Indent>
      <Syntax>{"}"}</Syntax>
    </div>
  );
};
