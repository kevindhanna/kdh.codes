import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
} from "preact-iso";
import { renderToReadableStream } from "preact-render-to-string/stream";

import { Navbar } from "./components/Navbar";
import { Experience } from "./pages/Experience";
import { NotFound } from "./pages/_404.jsx";
import "./style.css";
import { ThemeProvider } from "./components/ThemeProvider";

export function App() {
  return (
    <LocationProvider>
      <ThemeProvider>
        <main>
          <Navbar />
          <div className="body">
            <div className="bodyContent">
              <Router>
                <Route path="/bio" component={NotFound} />
                <Route path="/" component={Experience} />
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
