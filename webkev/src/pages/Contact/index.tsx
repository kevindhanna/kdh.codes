import { Breadcrumbs } from "../../components/Breadcrumbs";
import styles from "./style.module.css";

export const Contact = () => {
  return (
    <div>
      <Breadcrumbs />
      <section className={styles.content}>
        Is it wise to put an unsecured form on the internet that allows random
        people to just send me messages? Smells like a fun way to get a lot of
        bullshit sent to my inbox and a £10,000 SAAS bill.
        <br />
        <br />
        Anyway, here's the form.
        <form class={styles.form}>
          <div class={styles.inputContainer}>
            <label for="name" hidden>
              name
            </label>
            <input
              type="text"
              name="name"
              class={styles.textInput}
              placeholder="Who are you?"
            />
          </div>
          <div class={styles.inputContainer}>
            <label for="email" hidden>
              email
            </label>
            <input
              type="email"
              name="email"
              class={styles.textInput}
              placeholder="email"
            />
          </div>
          <div class={styles.inputContainer}>
            <label for="phone" hidden>
              email
            </label>
            <input
              type="text"
              name="phone"
              class={styles.textInput}
              placeholder="phone"
            />
          </div>
          <div>
            <fieldset class={styles.radioGroup}>
              <legend>How should I get back to you?</legend>
              <div class={styles.radioOption}>
                <input
                  class={styles.radio}
                  type="radio"
                  id="email"
                  name="contactPreference"
                  value="email"
                />
                <label for="email">email</label>
              </div>
              <div class={styles.radioOption}>
                <input
                  class={styles.radio}
                  type="radio"
                  id="phone"
                  name="contactPreference"
                  value="phone"
                />

                <label for="phone">phone</label>
              </div>
              <div class={styles.radioOption}>
                <input
                  class={styles.radio}
                  type="radio"
                  id="whatever"
                  name="contactPreference"
                  value="whatever"
                />
                <label for="whatever">Just go outside and start looking</label>
              </div>
            </fieldset>
          </div>
          <div class={styles.inputContainer}>
            <label for="body" hidden>
              body
            </label>
            <textarea
              id="body"
              class={styles.input}
              rows={15}
              placeholder="A cool fun message"
            />
          </div>
          <button type="submit">Go!</button>
        </form>
      </section>
    </div>
  );
};
