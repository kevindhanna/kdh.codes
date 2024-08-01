import { useLocation } from "preact-iso";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import styles from "./style.module.css";
import { useState } from "preact/hooks";

export const Contact = () => {
  const location = useLocation();
  const didSubmit = location.query.submitted;
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
        <br />
        <form
          action={import.meta.env.VITE_CONTACT_WEBKEV_INVOKE_URL}
          method="POST"
          class={styles.form}
        >
          <div class={styles.inputContainer}>
            <label for="name" hidden>
              name
            </label>
            <input
              required
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
              required
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
              required
              type="text"
              name="phone"
              class={styles.textInput}
              placeholder="phone"
            />
          </div>
          <div>
            <fieldset required class={styles.radioGroup}>
              <legend>How should I get back to you?</legend>
              <div class={styles.radioOption}>
                <input
                  required
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
              required
              id="body"
              name="body"
              class={styles.input}
              rows={15}
              placeholder="A cool fun message"
            />
          </div>
          <button type="submit">Go!</button>
        </form>
        {didSubmit && <div>Thanks! You'll hear back from me soon.</div>}
      </section>
    </div>
  );
};
