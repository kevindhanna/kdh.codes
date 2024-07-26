import { Breadcrumbs } from "../../components/Breadcrumbs";
import styles from "./styles.module.css";

export function NotFound() {
  return (
    <div>
      <Breadcrumbs />
      <section class={styles.content}>
        <h1>404: Not Found</h1>
        <p>It's gone :(</p>
      </section>
    </div>
  );
}
