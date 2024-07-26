import { Breadcrumbs } from "../../components/Breadcrumbs";
import styles from "./style.module.css";

export const About = () => {
  return (
    <div>
      <Breadcrumbs />
      <section className={styles.content}>
        Hey there 👋
        <br />
        <br />
        I'm Kevin and I'm a software engineer currently working at{" "}
        <a class={styles.externalLink} href="https://whereby.com">
          Whereby
        </a>
        . I do some other stuff too, like play music, travel a bunch, generally
        fret about the state of the world and how it's slightly on fire. You
        know, normal stuff.
        <br />
        <br />
        Thanks for having a look at my cool 🤙 coder guy 🤙 website.
        <br />I mostly built it for fun to play around with a bunch of services
        and things I'd not touched yet (Pulumi IAC is the cool new toy at the
        mo) so I hope you like my <strong>totally original</strong> and{" "}
        <strong>not at all copied</strong> design.
        <br />
        <br />
        Maybe one day I'll add some blog-y style posts detailing how it all
        happens (obviously it's completely overengineered).
      </section>
    </div>
  );
};
