import { type ComponentChildren } from "preact";
import styles from "./style.module.css";

export const Keyword = ({ children }: { children: ComponentChildren }) => (
  <text className={styles.keyword}>{children}</text>
);

export const ClassName = ({ children }: { children: ComponentChildren }) => (
  <text className={styles.className}>{children}</text>
);

export const Variable = ({ children }: { children: ComponentChildren }) => (
  <text className={styles.variable}>{children}</text>
);

export const StringEl = ({ children }: { children: ComponentChildren }) => (
  <text>
    <text className={styles.string}>'{children}'</text>
  </text>
);

export const Comment = ({ children }: { children: ComponentChildren }) => (
  <text className={styles.comment}>// {children}</text>
);

export const Link = ({ children }: { children: ComponentChildren }) => (
  <text className={styles.link}>{children}</text>
);

export const Indent = ({ children }: { children: ComponentChildren }) => (
  <div className={styles.indent}>{children}</div>
);
