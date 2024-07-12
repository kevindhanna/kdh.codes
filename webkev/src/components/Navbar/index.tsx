import { useLocation } from "preact-iso";
import styles from "./style.module.css";
import { KIcon, SpeakIcon, CodeIcon } from "../Icon";
import { JSXInternal } from "preact";

const NavLink = ({
  name,
  icon: Icon,
  path,
}: {
  name: string;
  icon: JSXInternal.Element;
  path: string;
}) => (
  <a href={path}>
    <div className={styles.navLink}>
      <div className={styles.navIcon}>
        <Icon />
      </div>
      <text>{name}</text>
    </div>
  </a>
);

export function Navbar() {
  const { url } = useLocation();

  return (
    <div className={styles.navbar}>
      <a href="/">
        <div className={styles.navHeader}>
          <div className={styles.navLogo}>
            <KIcon />
          </div>
          <text className={styles.navTitle}>kdh.codes</text>
        </div>
      </a>
      <nav>
        <NavLink name="What I've been up to" icon={CodeIcon} path="/" />
        <NavLink name="Contact me" icon={SpeakIcon} path="/contact" />
      </nav>
    </div>
  );
}
