// Static BigIron.com header for design system preview
// Shows what the Find My Sales Rep page would look like on the live site

export default function BigIronHeader() {
  return (
    <div className="w-full">
      {/* Top bar - black */}
      <div className="bg-black text-white px-4">
        <div className="max-w-[1500px] h-[60px] gap-10 flex items-center w-full justify-between">
          {/* Logo */}
          <div className="flex items-center w-auto">
            <svg
              className="h-7 w-auto"
              viewBox="0 0 348 116.43"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M348,87.31h-19v-33.32c0-4.89-3.29-9.82-9.5-9.82-5.58,0-9.5,4.17-9.5,8.64v34.5h-19V29.31h18l.16,7.96s5.24-8.91,17.98-8.91c17.57,0,20.86,15.36,20.86,20.46v38.5h0ZM268.37,29.44h-22.73l-17.5,17.5v23.73l16.5,16.5h24.73l16.5-16.5.16-22.89s-17.66-18.34-17.66-18.34ZM257.04,72.74c-7.81,0-14.15-6.33-14.15-14.15s6.33-14.15,14.15-14.15,14.15,6.33,14.15,14.15-6.33,14.15-14.15,14.15ZM167,2.31v85h20.04V2.31h-20.04ZM193,29.81v57.5h19v-30.94c0-9.37,9.72-14.69,15.03-14.53,5.65-5.68,10.06-10.44,11.34-11.79-9.55-3.92-19.1-3.07-26.36,4.26v-4.6l-19,.1h0Z"
                fill="white"
              />
              <path
                d="M26.48,2.31c21.14,0,24.41,2.78,26.86,4.17,11.09,6.27,13.32,23.96,3.18,31.85-2.83,2.2-8.52,4.98-8.52,4.98,0,0,18.49,2.87,18.49,20.87s-18.2,23.13-25.99,23.13H0V2.31h26.48ZM19,36.31h15.5c5.31,0,9.61-4.5,9.55-9s-4.67-9-10.81-9h-14.24s0,18,0,18ZM19,71.31h18.94c6.37,0,10.53-4.75,10.27-9.5s-4.16-9.5-12.31-9.5h-16.9s0,19,0,19ZM72,29.31v58h18V29.31h-18ZM81.29,0c-5.83,0-10.56,4.73-10.56,10.56s4.73,10.56,10.56,10.56,10.56-4.73,10.56-10.56S87.13,0,81.29,0ZM158,83.81V28.31h-16v8c-14.06-14.89-37.58-10.76-44.78,8.72-4.63,12.54-2.63,28.71,8.27,37.29,10.06,7.93,25.17,8.25,34.51-1.01,1.73,13.48-5.89,19.11-15.47,19.11-13.58,0-19.27-7.38-19.27-7.38l-10.25,14.77s6.6,8.62,28.67,8.62c34.8,0,34.32-24.42,34.32-32.63h0ZM127.22,72.37c-8.02,0-14.53-6.5-14.53-14.53s6.5-14.53,14.53-14.53,14.53,6.5,14.53,14.53-6.5,14.53-14.53,14.53Z"
                fill="#Fbbf24"
              />
            </svg>
          </div>

          {/* Search bar */}
          <div className="flex-1 flex items-center max-w-full hidden md:block">
            <div className="flex items-stretch w-full rounded-md overflow-hidden">
              <button className="h-9 bg-gray-200 text-gray-900 px-3 flex items-center justify-between min-w-[130px] rounded-l-md">
                <span className="text-xs font-medium">All categories</span>
                <svg
                  className="ml-2 h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </button>
              <input
                type="search"
                placeholder="Search our auctions…"
                className="flex-1 h-9 bg-white text-gray-900 px-4 text-sm placeholder:text-gray-500 border-none outline-none"
                readOnly
              />
              <button className="h-9 w-9 bg-amber-400 hover:bg-amber-500 grid place-items-center rounded-r-md">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    d="M15.71,14.29l-4.5-4.5c-.11-.11-.25-.18-.39-.23.74-1,1.18-2.23,1.18-3.56,0-3.31-2.69-6-6-6S0,2.69,0,6s2.69,6,6,6c1.33,0,2.56-.44,3.56-1.18.05.14.12.28.23.39l4.5,4.5c.2.2.45.29.71.29s.51-.1.71-.29c.39-.39.39-1.02,0-1.41ZM6,10c-2.21,0-4-1.79-4-4S3.79,2,6,2s4,1.79,4,4-1.79,4-4,4Z"
                    fill="#000000"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Sell CTA */}
          <button className="items-center gap-2 h-6 rounded-sm border border-gray-300 bg-white px-2 text-xs font-semibold text-gray-900 hover:bg-gray-50 whitespace-nowrap inline-flex sm:hidden">
            <svg viewBox="0 0 640 640" className="h-4 w-4">
              <path
                d="M96.5 160L96.5 309.5C96.5 326.5 103.2 342.8 115.2 354.8L307.2 546.8C332.2 571.8 372.7 571.8 397.7 546.8L547.2 397.3C572.2 372.3 572.2 331.8 547.2 306.8L355.2 114.8C343.2 102.7 327 96 310 96L160.5 96C125.2 96 96.5 124.7 96.5 160zM208.5 176C226.2 176 240.5 190.3 240.5 208C240.5 225.7 226.2 240 208.5 240C190.8 240 176.5 225.7 176.5 208C176.5 190.3 190.8 176 208.5 176z"
                fill="#60B450"
              />
            </svg>
            Sell with Us
          </button>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Notifications */}
            <button className="relative grid place-items-center h-10 w-10 rounded-md hover:bg-gray-800">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* User dropdown */}
            <button className="inline-flex items-center gap-1.5 h-9 rounded-md px-0 sm:px-2.5 hover:bg-gray-800">
              <svg
                className="h-5 w-5 text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
              </svg>
              <span className="text-sm hidden sm:inline-flex font-medium">
                jpeters
              </span>
              <svg
                className="h-4 w-4 text-gray-300 hidden sm:block"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-nav - dark gray */}
      <div className="bg-neutral-700 border-t py-0.5 border-neutral-700">
        <nav className="max-w-[1500px] mx-auto h-[42px] flex items-center gap-3 px-4 py-3 text-xs font-semibold text-gray-200">
          {/* Auctions */}
          <button className="inline-flex items-center border-neutral-500 h-full gap-1.5 px-0 pr-3 hover:text-white border-r">
            <svg
              className="h-4 w-4 block lg:hidden xl:block"
              fill="currentColor"
              stroke="none"
              viewBox="0 0 576 512"
            >
              <path d="M169.6 153.4l-18.7-18.7c-12.5-12.5-12.5-32.8 0-45.3L265.6-25.4c12.5-12.5 32.8-12.5 45.3 0L329.6-6.6c12.5 12.5 12.5 32.8 0 45.3L214.9 153.4c-12.5 12.5-32.8 12.5-45.3 0zM276 211.7l-31.4-31.4 112-112 119.4 119.4-112 112-31.4-31.4-232 232c-15.6 15.6-40.9 15.6-56.6 0s-15.6-40.9 0-56.6l232-232zM390.9 374.6c-12.5-12.5-12.5-32.8 0-45.3L505.6 214.6c12.5-12.5 32.8-12.5 45.3 0l18.7 18.7c12.5 12.5 12.5 32.8 0 45.3L454.9 393.4c-12.5 12.5-32.8 12.5-45.3 0l-18.7-18.7z" />
            </svg>
            <span className="hidden lg:inline">Auctions</span>
            <svg
              className="h-4 w-4 text-gray-300 hidden xl:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>

          {/* Farm Equipment */}
          <button className="inline-flex items-center border-neutral-500 h-full gap-1.5 px-0 pr-3 hover:text-white border-r">
            <svg
              className="h-4 w-4 block lg:hidden xl:block"
              fill="currentColor"
              viewBox="0 0 576 512"
            >
              {' '}
              <path d="M160 96l0 96 133.4 0-57.6-96-75.8 0zM96 223L96 64c0-17.7 14.3-32 32-32l107.8 0c22.5 0 43.3 11.8 54.9 31.1l77.4 128.9 64 0 0-72c0-13.3 10.7-24 24-24s24 10.7 24 24l0 72 48 0c26.5 0 48 21.5 48 48l0 41.5c0 14.2-6.3 27.8-17.3 36.9l-35 29.2c26.5 15.2 44.3 43.7 44.3 76.4 0 48.6-39.4 88-88 88s-88-39.4-88-88c0-14.4 3.5-28 9.6-40l-101.2 0c-3 13.4-7.9 26-14.4 37.7 7.7 9.4 7.2 23.4-1.6 32.2l-22.6 22.6c-8.8 8.8-22.7 9.3-32.2 1.6-9.3 5.2-19.3 9.3-29.8 12.3-1.2 12.1-11.4 21.6-23.9 21.6l-32 0c-12.4 0-22.7-9.5-23.9-21.6-10.5-3-20.4-7.2-29.8-12.3-9.4 7.7-23.4 7.2-32.2-1.6L35.5 453.8c-8.8-8.8-9.3-22.7-1.6-32.2-5.2-9.3-9.3-19.3-12.3-29.8-12.1-1.2-21.6-11.4-21.6-23.9l0-32c0-12.4 9.5-22.7 21.6-23.9 3-10.5 7.2-20.4 12.3-29.8-7.7-9.4-7.2-23.4 1.6-32.2l22.6-22.6c8.8-8.8 22.7-9.3 32.2-1.6 1.9-1 3.7-2 5.7-3zm64 65a64 64 0 1 0 0 128 64 64 0 1 0 0-128zM440 424a40 40 0 1 0 80 0 40 40 0 1 0 -80 0z" />
            </svg>
            <span className="hidden lg:inline">Farming</span>
            <svg
              className="h-4 w-4 text-gray-300 hidden xl:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>

          {/* Construction */}
          <button className="inline-flex items-center border-neutral-500 h-full gap-1.5 px-0 pr-3 hover:text-white border-r">
            <svg
              className="h-4 w-4 block lg:hidden xl:block"
              fill="currentColor"
              viewBox="0 0 576 512"
            >
              {' '}
              <path d="M352 264l0-200c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 200c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-185.9C90 109.8 32 191.8 32 288l0 64 512 0 0-64c-1-95.2-58.4-177.7-144-209.8L400 264c0 13.3-10.7 24-24 24s-24-10.7-24-24zM40 400c-22.1 0-40 17.9-40 40s17.9 40 40 40l496 0c22.1 0 40-17.9 40-40s-17.9-40-40-40L40 400z" />
            </svg>
            <span className="hidden lg:inline">Construction</span>
            <svg
              className="h-4 w-4 text-gray-300 hidden xl:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>

          {/* Transportation */}
          <button className="inline-flex items-center border-neutral-500 h-full gap-1.5 px-0 pr-3 hover:text-white border-r">
            <svg
              className="h-4 w-4 block lg:hidden xl:block"
              fill="currentColor"
              viewBox="0 0 576 512"
            >
              <path d="M96 0C43 0 0 43 0 96L0 352c0 23.7 12.9 44.4 32 55.4L32 448c0 17.7 14.3 32 32 32l16 0c17.7 0 32-14.3 32-32l0-32 32 0 0-64.1c0-34.2 15.4-64.8 39.4-85.3L195.6 224 96 224c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l192 0c11.9 0 22.3 6.5 27.8 16.2 2.9-.2 5.8-.3 8.7-.3l59.5 .1 0-16c0-53-43-96-96-96L96 0zm0 288a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm228.2-64l119.6 .3c7.1 0 13.4 4.7 15.3 11.6l15 52.1-180.3 0 15-52.4c2-6.9 8.3-11.6 15.4-11.6zm-99 71.1l-.3 .9c-19.7 10.9-33 31.9-33 56l0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-16 256 0 0 16c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128c0-24.1-13.3-45.1-33-56l-.3-.9-22.1-76.9c-9.8-34.2-41.1-57.8-76.7-57.9L324.4 160c-35.8-.1-67.3 23.6-77.1 58l-22 77.1zM288 351.5a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm160 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
            </svg>
            <span className="hidden lg:inline">Transportation</span>
            <svg
              className="h-4 w-4 text-gray-300 hidden xl:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>

          {/* Industrial */}
          <button className="inline-flex items-center border-neutral-500 h-full gap-1.5 px-0 pr-3 hover:text-white border-r">
            <svg
              className="h-4 w-4 block lg:hidden xl:block"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M416 384c0-26.3-10.6-50.2-27.8-67.5l187.8-156.5 0 144-128 128 0 48 112 0c44.2 0 80-35.8 80-80l0-368-64 0-192 160-96-160-160 0 0 160-96 0 0 120.4C12.4 330 0 355.6 0 384 0 437 43 480 96 480l224 0c53 0 96-43 96-96zM309.4 192l-117.4 0 0-96 59.8 0 57.6 96zM64 384c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 416c-17.7 0-32-14.3-32-32z" />
            </svg>
            <span className="hidden lg:inline">Industrial</span>
            <svg
              className="h-4 w-4 text-gray-300 hidden xl:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>

          {/* Real Estate */}
          <button className="inline-flex items-center border-neutral-500 h-full gap-1.5 px-0 pr-3 hover:text-white border-r">
            <svg
              className="h-4 w-4 block lg:hidden xl:block"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              {' '}
              <path d="M96 0c17.7 0 32 14.3 32 32l0 32 352 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-352 0 0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352-32 0C14.3 128 0 113.7 0 96S14.3 64 32 64l32 0 0-32C64 14.3 78.3 0 96 0zM208 176l240 0c17.7 0 32 14.3 32 32l0 144c0 17.7-14.3 32-32 32l-240 0c-17.7 0-32-14.3-32-32l0-144c0-17.7 14.3-32 32-32z" />
            </svg>
            <span className="hidden lg:inline">Real Estate</span>
            <svg
              className="h-4 w-4 text-gray-300 hidden xl:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>

          {/* Livestock */}
          <button className="inline-flex items-center border-neutral-500 h-full gap-1.5 px-0 pr-3 hover:text-white border-r">
            <svg
              className="h-4 w-4 block lg:hidden xl:block"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M96 224v32V416c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V327.8c9.9 6.6 20.6 12 32 16.1V368c0 8.8 7.2 16 16 16s16-7.2 16-16V351.1c5.3 .6 10.6 .9 16 .9s10.7-.3 16-.9V368c0 8.8 7.2 16 16 16s16-7.2 16-16V343.8c11.4-4 22.1-9.4 32-16.1V416c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V256l32 32v49.5c0 9.5 2.8 18.7 8.1 26.6L530 427c8.8 13.1 23.5 21 39.3 21c22.5 0 41.9-15.9 46.3-38l20.3-101.6c2.6-13-.3-26.5-8-37.3l-3.9-5.5V184c0-13.3-10.7-24-24-24s-24 10.7-24 24v14.4l-52.9-74.1C496 86.5 452.4 64 405.9 64H272 256 192 144C77.7 64 24 117.7 24 184v54C9.4 249.8 0 267.8 0 288v17.6c0 8 6.4 14.4 14.4 14.4C46.2 320 72 294.2 72 262.4V256 224 184c0-24.3 12.1-45.8 30.5-58.9C98.3 135.9 96 147.7 96 160v64zM560 336a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM166.6 166.6c-4.2-4.2-6.6-10-6.6-16c0-12.5 10.1-22.6 22.6-22.6H361.4c12.5 0 22.6 10.1 22.6 22.6c0 6-2.4 11.8-6.6 16l-23.4 23.4C332.2 211.8 302.7 224 272 224s-60.2-12.2-81.9-33.9l-23.4-23.4z" />
            </svg>
            <span className="hidden lg:inline">Livestock</span>
            <svg
              className="h-4 w-4 text-gray-300 hidden xl:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>

          {/* Collector Cars */}
          <button className="inline-flex items-center border-neutral-500 h-full gap-1.5 px-0 pr-3 hover:text-white border-r">
            <svg
              className="h-4 w-4 block lg:hidden xl:block"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
            </svg>
            <span className="hidden lg:inline">Collector Cars</span>
            <svg
              className="h-4 w-4 text-gray-300 hidden xl:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>

          {/* Services */}
          <button className="inline-flex items-center border-neutral-500 h-full gap-1.5 px-0 pr-4 hover:text-white border-r">
            <svg
              className="h-4 w-4 block lg:hidden xl:block"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              {' '}
              <path d="M216 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l16 0 0 33.3C124.8 156.7 40.2 243.7 32.6 352l446.9 0C471.8 243.7 387.2 156.7 280 145.3l0-33.3 16 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0zM24 400c-13.3 0-24 10.7-24 24s10.7 24 24 24l464 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 400z" />
            </svg>
            <span className="hidden lg:inline">Services</span>
            <svg
              className="h-4 w-4 text-gray-300 hidden xl:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>

          {/* IronExchange */}
          <button className="inline-flex items-center border-neutral-500 h-full gap-1.5 px-0 pr-4 hover:text-white">
            <svg
              className="h-4 w-4 block lg:hidden xl:block"
              fill="currentColor"
              viewBox="0 0 432 540"
            >
              <path d="M76.5 50.5c-14.3 0-28.1 5.7-38.2 15.8L12.8 91.8C2.7 101.9-3 115.7-3 130S2.7 158 12.8 168.2l89.1 89.1c7 7 7 18.4 0 25.5L12.8 371.8C2.7 382-3 395.7-3 410s5.7 28.1 15.8 38.2l25.5 25.5c10.1 10.1 23.9 15.8 38.2 15.8s28.1-5.7 38.2-15.8l89.1-89.1c7-7 18.4-7 25.5 0l89.1 89.1c21.1 21.1 55.3 21.1 76.4 0l25.5-25.5c10.1-10.1 15.8-23.9 15.8-38.2s-5.7-28.1-15.8-38.2L331 282.7c-7-7-7-18.4 0-25.5l89.1-89.1c21.1-21.1 21.1-55.3 0-76.4L394.7 66.4c-10.1-10.1-23.9-15.8-38.2-15.8s-28.1 5.7-38.2 15.8l-89.1 89.1c-7 7-18.4 7-25.5 0L114.6 66.4C104.5 56.2 90.8 50.5 76.5 50.5zm0 54L51 130c-5.3 5.3-13.8 5.3-19.1 0s-5.3-13.8 0-19.1L57.4 85.4c5.3-5.3 13.8-5.3 19.1 0s5.3 13.8 0 19.1zm280 0l-89.1 89.1c-14.1 14.1-32.5 21.1-50.9 21.1-7.5 0-13.5-6-13.5-13.5s6-13.5 13.5-13.5c11.5 0 23-4.4 31.8-13.2l89.1-89.1c5.3-5.3 13.8-5.3 19.1 0s5.3 13.8 0 19.1zM161.2 270c0 18.4-7 36.9-21.1 50.9L51 410c-5.3 5.3-13.8 5.3-19.1 0s-5.3-13.8 0-19.1L121 301.8c8.8-8.8 13.2-20.3 13.2-31.8 0-7.5 6-13.5 13.5-13.5s13.5 6 13.5 13.5z" />
            </svg>
            <span className="hidden sm:inline">IronExchange</span>
          </button>

          {/* Sell CTA */}
          <button className="items-center gap-2 h-6 rounded-sm border border-gray-300 bg-white px-2 ml-auto text-xs font-semibold text-gray-900 hover:bg-gray-50 whitespace-nowrap hidden sm:inline-flex">
            <svg viewBox="0 0 640 640" className="h-4 w-4">
              <path
                d="M96.5 160L96.5 309.5C96.5 326.5 103.2 342.8 115.2 354.8L307.2 546.8C332.2 571.8 372.7 571.8 397.7 546.8L547.2 397.3C572.2 372.3 572.2 331.8 547.2 306.8L355.2 114.8C343.2 102.7 327 96 310 96L160.5 96C125.2 96 96.5 124.7 96.5 160zM208.5 176C226.2 176 240.5 190.3 240.5 208C240.5 225.7 226.2 240 208.5 240C190.8 240 176.5 225.7 176.5 208C176.5 190.3 190.8 176 208.5 176z"
                fill="#60B450"
              />
            </svg>
            Sell with Us
          </button>
        </nav>
      </div>
    </div>
  )
}
