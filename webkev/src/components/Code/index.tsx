import { type ComponentChildren } from "preact";
import { cn } from "../../helpers/cn";
import styles from "./style.module.css";

export const Syntax = ({ children }: { children: ComponentChildren }) => (
  <text className={styles.syntax}>{children}</text>
);

export const Keyword = ({ children }: { children: ComponentChildren }) => (
  <text className={styles.keyword}>{children}</text>
);

export const ClassName = ({ children }: { children: ComponentChildren }) => (
  <text className={styles.className}>{children}</text>
);

export const Variable = ({ children }: { children: ComponentChildren }) => (
  <text className={styles.variable}>{children}</text>
);

export const StringEl = ({
  children,
  className,
}: {
  children: ComponentChildren;
  className?: string;
}) => (
  <text>
    <text className={cn(styles.string, className)}>'{children}'</text>
  </text>
);

export const Comment = ({ children }: { children: string }) => {
  const parts = children.split("\n");

  if (parts.length > 1) {
    return (
      <div className={styles.multilineComment}>
        <text className={styles.comment}>/**</text>
        {parts.map((part) => (
          <>
            <br />
            <text className={cn(styles.comment, styles.multilineCommentBody)}>
              * {part}
            </text>
          </>
        ))}
        <br />
        <text className={cn(styles.comment, styles.multilineCommentBody)}>
          */
        </text>
      </div>
    );
  }
  return <text className={styles.comment}>// {children}</text>;
};

export const Link = ({ children }: { children: ComponentChildren }) => (
  <text className={styles.link}>{children}</text>
);

export const Indent = ({ children }: { children: ComponentChildren }) => (
  <div className={styles.indent}>{children}</div>
);
