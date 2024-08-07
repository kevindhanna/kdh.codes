import { JSXInternal } from "preact";
import { useLocation } from "preact-iso";
import githubDark from "../../assets/github-mark-white.svg";
import github from "../../assets/github-mark.svg";
import linkedinDark from "../../assets/linkedin-dark.png";
import linkedin from "../../assets/linkedin.png";
import { useTheme } from "../../hooks/useTheme";
import { CodeIcon, KIcon, MagnifierIcon, SpeakIcon } from "../Icon";
import { Theme } from "../ThemeProvider";
import styles from "./style.module.css";

const ExternalLink = ({
  logoPath,
  name,
  href,
}: {
  logoPath: string;
  name: string;
  href: string;
}) => (
  <a className={styles.navLink} href={href}>
    <img src={logoPath} className={styles.linkLogo} />
    <text className={styles.linkText}>{name}</text>
  </a>
);

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
      <text className={styles.navText}>{name}</text>
    </div>
  </a>
);

export function Navbar() {
  const { url } = useLocation();
  const theme = useTheme();

  return (
    <div className={styles.navbar}>
      <a href="/">
        <div className={styles.navHeader}>
          <div className={styles.headerLogo}>
            <KIcon />
          </div>
          <text className={styles.headerTitle}>kdh.codes</text>
        </div>
      </a>

      <nav>
        <NavLink name="About me" icon={MagnifierIcon} path="/" />
        <NavLink name="History" icon={CodeIcon} path="/cv" />
        <NavLink name="Let's talk" icon={SpeakIcon} path="/contact" />
        <ExternalLink
          name="github.com/kevindhanna"
          href="https://github.com/kevindhanna"
          logoPath={theme === Theme.dark ? githubDark : github}
        />
        <ExternalLink
          name="linkedin.com"
          href="https://www.linkedin.com/in/kevin-hanna-56033785/"
          logoPath={theme === Theme.dark ? linkedinDark : linkedin}
        />
      </nav>
    </div>
  );
}
