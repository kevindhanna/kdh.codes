import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
} from "preact-iso";

import { Navbar } from "./components/Navbar";
import { Experience } from "./pages/Experience";
import { NotFound } from "./pages/_404.jsx";
import "./style.css";
import { Header } from "./components/Header";

export function App() {
  return (
    <LocationProvider>
      <main>
        <Navbar />
        <div className="bodyContent">
          <Header />
          <Router>
            <Route path="/" component={Experience} />
            <Route default component={NotFound} />
          </Router>
        </div>
      </main>
    </LocationProvider>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
