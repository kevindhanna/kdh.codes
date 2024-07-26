import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
} from "preact-iso";

import { Navbar } from "./components/Navbar";
import { CV } from "./pages/CV";
import { NotFound } from "./pages/_404";
import "./style.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

export function App() {
  return (
    <LocationProvider>
      <ThemeProvider>
        <main>
          <Navbar />
          <div className="body">
            <div className="bodyContent">
              <Router>
                <Route path="/" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/cv" component={CV} />
                <Route default component={NotFound} />
              </Router>
            </div>
          </div>
        </main>
      </ThemeProvider>
    </LocationProvider>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender() {
  return await ssr(<App />);
}
