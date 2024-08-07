import styles from "./style.module.css";

export const ProjectDetail = ({
  content,
  onClose,
}: {
  content?: string;
  onClose: () => void;
}) => (
  <div className={styles.pane}>
    <button className={styles.closeButton} onClick={onClose}>
      x
    </button>
    {content?.split("\n\n").map((p) => <p>{p}</p>)}
  </div>
);
