import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { LanguageProvider } from "./context/Language";
import { ThemeProvider } from "./context/Theme";
import HomePage from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContactPage from "./pages/Contact";
import ScrollToTop from "./components/ScrollToTop";
import AboutPage from "./pages/AboutMe";

function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
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
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}