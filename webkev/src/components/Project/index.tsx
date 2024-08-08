import { Keyword, Variable, Indent, StringEl, Syntax } from "../Code";
import { Project as ProjectType } from "../../models/Project";
import styles from "./style.module.css";
import { useState } from "preact/hooks";

interface Point {
  x: number;
  y: number;
}

const touchToPoint = (touch: Touch) => ({
  x: touch.clientX,
  y: touch.clientY,
});

const distanceBetween = (start: Point, end: Point) => {
  const xChange = Math.abs(start.x - end.x);
  const yChange = Math.abs(start.y - end.y);

  return Math.sqrt(xChange * xChange + yChange * yChange);
};

export const Project = ({
  name,
  description,
  onTouchEnd,
  onMouseEnter,
  onMouseLeave,
}: ProjectType & {
  onTouchEnd: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const [touchStart, setTouchStart] = useState<Point>();
  return (
    <div
      className={styles.Project}
      onTouchStart={(e) => {
        setTouchStart(touchToPoint(e.touches[0]));
      }}
      onTouchEnd={(e) => {
        const end = touchToPoint(e.changedTouches[0]);
        const diff = distanceBetween(touchStart, end);
        if (diff < 80) {
          onTouchEnd();
        }
      }}
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
