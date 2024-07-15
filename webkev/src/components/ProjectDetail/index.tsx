import { Project } from "../../models/Project";
import styles from "./style.module.css";

export const ProjectDetail = ({
  content,
  visible,
}: {
  content?: string;
  visible: boolean;
}) =>
  visible ? (
    <div className={styles.pane}>
      {content?.split("\n\n").map((p) => <p>{p}</p>)}
    </div>
  ) : (
    <></>
  );
