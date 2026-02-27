// Static BigIron.com header for design system preview
// Shows what the Find My Sales Rep page would look like on the live site

export default function BigIronHeader() {
  return (
    <div className="w-full">
      {/* Top bar - black */}
      <div className="bg-black text-white px-4">
        <div className="max-w-[1500px] mx-auto h-[60px] flex items-center gap-10">
          {/* Logo */}
          <div className="flex items-center">
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
          <div className="flex-1 flex items-center max-w-full">
            <div className="flex items-stretch w-full rounded-md overflow-hidden">
              <button className="h-9 bg-gray-200 text-gray-900 px-3 flex items-center justify-between min-w-[120px] rounded-l-md">
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

          {/* Right side actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notifications */}
            <button className="relative grid place-items-center h-10 w-10 rounded-md hover:bg-gray-800">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
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
            <button className="inline-flex items-center gap-1.5 h-9 rounded-md px-2.5 hover:bg-gray-800">
              <svg
                className="h-5 w-5 text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
              </svg>
              <span className="text-sm font-medium">jpeters</span>
              <svg
                className="h-4 w-4 text-gray-300"
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
        <nav className="max-w-[1500px] mx-auto h-[42px] flex items-center gap-6 px-2 py-3 text-xs font-semibold text-gray-200">
          {[
            'Auctions',
            'Farm Equipment',
            'Construction',
            'Transportation',
            'Industrial',
            'Real Estate',
            'Livestock',
            'Collector Cars',
            'Services',
          ].map((item, index, array) => (
            <button
              key={item}
              className={`inline-flex items-center border-neutral-500 h-full gap-1 px-0 pr-5 hover:text-white ${
                index < array.length - 1 ? 'border-r' : ''
              }`}
            >
              <span>{item}</span>
              <svg
                className="h-4 w-4 text-gray-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>
          ))}

          {/* Sell CTA */}
          <button className="inline-flex items-center gap-2 h-6 rounded-sm border border-gray-300 bg-white px-2 ml-auto text-xs font-semibold text-gray-900 hover:bg-gray-50 whitespace-nowrap">
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
