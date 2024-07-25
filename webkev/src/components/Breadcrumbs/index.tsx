import { useLocation } from "preact-iso";
import { ChevronRightIcon } from "../Icon";
import styles from "./style.module.css";

const locationPathMap = {
  "/cv": "cv",
  "/": "about",
  "/contact": "contact",
};

export const Breadcrumbs = () => {
  const location = useLocation();
  console.log(location.path, "FART");
  return (
    <text class={styles.breadcrumbs}>
      kevin
      <ChevronRightIcon className={styles.breadcrumbsIcon} />
      {locationPathMap[location.path] ?? "lost"}.code
    </text>
  );
};
