import { useLocation } from "preact-iso";
import { ChevronRightIcon } from "../Icon";
import styles from "./style.module.css";

const locationPathMap = {
  "/": "experience",
  bio: "bio",
};

export const Breadcrumbs = () => {
  const location = useLocation();
  return (
    <text class={styles.breadcrumbs}>
      kevin
      <ChevronRightIcon className={styles.breadcrumbsIcon} />
      {locationPathMap[location.path] ?? "lost"}.code
    </text>
  );
};
