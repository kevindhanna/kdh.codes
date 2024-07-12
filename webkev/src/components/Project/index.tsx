import { Keyword, Variable, Indent, StringEl } from "../Code";
import { Project as ProjectType } from "../../models/Project";
import styles from "./style.module.css";

export const Project = ({ name, description }: ProjectType) => (
  <div className={styles.Project}>
    <Keyword>{"proj "}</Keyword>
    <Variable>{name}</Variable>
    <text>{" -> {"}</text>
    <Indent>
      <StringEl>{description}</StringEl>
    </Indent>
    <text>{"}"}</text>
  </div>
);
