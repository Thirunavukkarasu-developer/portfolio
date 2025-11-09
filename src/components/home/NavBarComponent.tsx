function NavBarComponent() {
  return <nav className="bg-white dark:bg-gray-900">
    <div
      className="max-w-5xl flex flex-wrap items-center justify-between mx-auto p-4 border border-green-500"
    >
      <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <span className="self-center text-xl font-mono font-medium whitespace-nowrap dark:text-white">thiruna.com</span>
      </a>

      <div className="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul
          className="font-mono font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <a
              href="#"
              className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
              aria-current="page">Home</a
            >
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >Projects</a
            >
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >Blogs</a
            >
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >Contact</a
            >
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >My Resume</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
};

export default NavBarComponent