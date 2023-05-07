"use client";
import React, { useState, useEffect, useRef } from "react";
import party from "party-js";

function Footer() {
  const [show, setShow] = useState(false);

  const mailRef = useRef(null);

  useEffect(() => {
    if (show && mailRef.current) {
      party.confetti(mailRef.current);
    }
  }, [show]);

  return (
    <div className="max-w-4xl mx-auto mb-40">
      <div className="flex flex-col justify-center py-20">
        <div className="max-w-md mx-auto text-center space-y-5">
          <h2 className="text-2xl font-medium tracking-wider text-black">
            Lets Work!
          </h2>
          <p className="text-center text-gray-600 text-sm tracking-wide leading-6">
            I am always ready to consider your proposal.
            <br /> Let’s work together on your project. Connect with me <br />
            on social media
          </p>

          {show ? (
            <p
              ref={mailRef}
              className="rounded my-2 tracking-wider inline-block border border-green-700 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 shadow-sm hover:bg-green-100"
            >
              thiruna.developer@gmail.com
            </p>
          ) : (
            <button
              type="button"
              className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 shadow-sm hover:bg-indigo-100"
              onClick={() => setShow(true)}
            >
              View email address
            </button>
          )}

          <ul role="list" className="flex gap-x-6 justify-center">
            <li>
              <a
                href="https://twitter.com/Thiruna71130029"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/thirunavukkarasu-e-7178111ba"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Thirunavukkarasu-developer"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
              >
                <span className="sr-only">Github</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 96 96"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
