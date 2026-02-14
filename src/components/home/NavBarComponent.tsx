import { useState, useEffect } from "react";

function NavBarComponent({ currentPath }: { currentPath: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isActive = (route: string) =>
    currentPath === route || currentPath.startsWith(route + "/")
      ? "text-blue-600 dark:text-blue-400 font-semibold"
      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blogs", label: "Blogs" },
    { href: "/contact", label: "Contact" },
    { href: "/my-resume", label: "Resume" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md" 
          : "bg-white dark:bg-slate-900"
      } border-b border-gray-200/50 dark:border-gray-700/50`}
    >
      <div className="max-w-5xl flex flex-wrap items-center justify-between mx-auto py-4 px-5 md:px-7 lg:px-8">
        {/* Logo */}
        <a 
          href="/" 
          className="flex items-center space-x-3 rtl:space-x-reverse group"
        >
          <span className="self-center text-xl font-bold whitespace-nowrap text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            thiruna<span className="text-blue-600 dark:text-blue-400">.com</span>
          </span>
        </a>

        <div className="flex items-center gap-2 md:order-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            type="button"
            className="p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-all duration-300"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div className="relative w-5 h-5">
              {/* Sun Icon */}
              <svg
                className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
                  isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {/* Moon Icon */}
              <svg
                className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
                  isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
          </button>

          {/* Hamburger button for mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-all duration-300"
            aria-controls="navbar-default"
            aria-expanded={isOpen}
          >
            <span className="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
            <div className="relative w-5 h-5">
              {/* Close Icon */}
              <svg
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {/* Hamburger Icon */}
              <svg
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  isOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </button>
        </div>

        {/* Menu Items */}
        <div
          className={`${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 md:max-h-none opacity-0 md:opacity-100"
          } w-full md:block md:w-auto overflow-hidden transition-all duration-300 ease-in-out md:order-1`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-800 md:flex-row md:space-x-1 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`block py-2 px-3 rounded-lg transition-all duration-300 ${isActive(item.href)} hover:bg-gray-100 dark:hover:bg-gray-700 md:hover:bg-gray-100/50 md:dark:hover:bg-gray-700/50`}
                  aria-current={currentPath === item.href ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBarComponent;