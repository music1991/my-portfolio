import { Fragment } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { LanguageProvider } from "./context/Language";
import { ThemeProvider } from "./context/Theme";
import HomePage from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContactPage from "./pages/Contact";
import ScrollToTop from "./components/ScrollToTop";
import AboutPage from "./pages/AboutMe";
import { Seo } from "./seo/Seo";

function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <Seo />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <LanguageProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* Spanish at the root, English under /en (see src/seo/site.ts) */}
              {["", "/en"].map((prefix) => (
                <Fragment key={prefix || "es"}>
                  <Route path={prefix || "/"} element={<HomePage />} />
                  <Route path={`${prefix}/about`} element={<AboutPage />} />
                  <Route path={`${prefix}/contact`} element={<ContactPage />} />
                </Fragment>
              ))}
            </Route>
          </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}