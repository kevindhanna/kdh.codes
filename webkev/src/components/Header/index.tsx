import styles from "./style.module.css";
import logo from "../../assets/me.png";
import github from "../../assets/github-mark-white.svg";
import linkedin from "../../assets/linkedin-white.png";

const HeaderLink = ({
  logoPath,
  name,
  href,
}: {
  logoPath: string;
  name: string;
  href: string;
}) => (
  <div className={styles.headerLink}>
    <div>
      <img src={logoPath} className={styles.linkLogo} />
    </div>
    <a href={href}>{name}</a>
  </div>
);

export const Header = () => (
  <div className={styles.header}>
    <div className={styles.headerContent}>
      <img
        src={logo}
        alt="A simple black and white pencil drawn logo of Kevin"
        className={styles.logo}
      />
      <div className={styles.headerLinks}>
        <HeaderLink
          name="linkedin.com"
          href="https://www.linkedin.com/in/kevin-hanna-56033785/"
          logoPath={linkedin}
        />
        <HeaderLink
          name="github.com/kevindhanna"
          href="https://github.com/kevindhanna"
          logoPath={github}
        />
      </div>
    </div>
  </div>
);
