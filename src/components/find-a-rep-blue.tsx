import { useEffect, useMemo, useRef, useState } from 'react'

// ─── Image helper ─────────────────────────────────────────────────────────────
const img = (filename: string) => `${import.meta.env.BASE_URL}${filename}`

// ─── Types ────────────────────────────────────────────────────────────────────
type RepType = 'Equipment' | 'Real Estate' | 'Livestock' | 'Classic Car'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const REPRESENTATIVES = [
  // Nebraska - 5 reps
  {
    id: 1,
    name: 'Tyler Hanson',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(402) 555-0182',
    email: 't.hanson@bigiron.com',
    states: ['NE'],
    counties: ['Lancaster', 'Seward', 'Saline', 'Cass'],
    photo: img('sales1.jpg'),
    bio: '15 years in ag equipment auctions across southeast Nebraska.',
    lat: 40.8136,
    lng: -96.7026,
  },
  {
    id: 2,
    name: 'Sara Mitchell',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(402) 555-0247',
    email: 's.mitchell@bigiron.com',
    states: ['NE'],
    counties: ['Douglas', 'Sarpy', 'Washington'],
    photo: img('sales6.jpg'),
    bio: 'Specializing in farmland and rural property sales in the Omaha area.',
    lat: 41.2565,
    lng: -95.9345,
  },
  {
    id: 3,
    name: 'Derek Olson',
    title: 'Livestock Auctioneer',
    type: 'Livestock' as RepType,
    phone: '(402) 555-0319',
    email: 'd.olson@bigiron.com',
    states: ['NE'],
    counties: ['Lancaster', 'Seward', 'Saline', 'Cass'],
    photo: img('sales2.jpg'),
    bio: 'Certified livestock auctioneer with experience in cattle markets.',
    lat: 40.8136,
    lng: -96.7026,
  },
  {
    id: 4,
    name: 'Jennifer Walsh',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(308) 555-0891',
    email: 'j.walsh@bigiron.com',
    states: ['NE'],
    counties: ['Hall', 'Buffalo', 'Adams'],
    photo: img('sales7.jpg'),
    bio: 'Central Nebraska farmland specialist with 200+ transactions closed.',
    lat: 40.9264,
    lng: -98.3421,
  },
  {
    id: 5,
    name: 'Marcus Reid',
    title: 'Equipment & Livestock Specialist',
    type: 'Equipment' as RepType,
    phone: '(308) 555-0234',
    email: 'm.reid@bigiron.com',
    states: ['NE'],
    counties: ['Scotts Bluff', 'Banner', 'Morrill'],
    photo: img('sales3.jpg'),
    bio: 'Dual-certified for equipment and livestock in western Nebraska.',
    lat: 41.8667,
    lng: -103.6672,
  },
  {
    id: 6,
    name: 'Marcus Reid',
    title: 'Equipment & Livestock Specialist',
    type: 'Livestock' as RepType,
    phone: '(308) 555-0234',
    email: 'm.reid@bigiron.com',
    states: ['NE'],
    counties: ['Scotts Bluff', 'Banner', 'Morrill'],
    photo: img('sales3.jpg'),
    bio: 'Dual-certified for equipment and livestock in western Nebraska.',
    lat: 41.8667,
    lng: -103.6672,
  },
  // Nebraska Classic Car
  {
    id: 56,
    name: 'Dave Kincaid',
    title: 'Classic Car Specialist',
    type: 'Classic Car' as RepType,
    phone: '(402) 555-0611',
    email: 'd.kincaid@bigiron.com',
    states: ['NE'],
    counties: ['Lancaster', 'Seward', 'Saline', 'Cass', 'Douglas', 'Sarpy'],
    photo: img('sales4.jpg'),
    bio: 'Vintage and collector vehicle auction expert across Nebraska.',
    lat: 40.8136,
    lng: -96.7026,
  },

  // Iowa - 5 reps
  {
    id: 7,
    name: 'Brett Caldwell',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(515) 555-0128',
    email: 'b.caldwell@bigiron.com',
    states: ['IA'],
    counties: ['Polk', 'Warren', 'Dallas', 'Madison'],
    photo: img('sales4.jpg'),
    bio: 'Central Iowa equipment expert with deep knowledge in row crop machinery.',
    lat: 41.5868,
    lng: -93.625,
  },
  {
    id: 8,
    name: 'Donna Trevino',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(515) 555-0364',
    email: 'd.trevino@bigiron.com',
    states: ['IA'],
    counties: ['Polk', 'Warren', 'Dallas', 'Madison'],
    photo: img('sales6.jpg'),
    bio: 'Des Moines area farmland specialist with 200+ transactions closed.',
    lat: 41.5868,
    lng: -93.625,
  },
  {
    id: 9,
    name: 'Marc Stein',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(563) 555-0091',
    email: 'm.stein@bigiron.com',
    states: ['IA'],
    counties: ['Scott', 'Clinton', 'Jackson', 'Cedar'],
    photo: img('sales5.jpg'),
    bio: 'Eastern Iowa rural real estate with expertise in transitional land.',
    lat: 41.5236,
    lng: -90.5776,
  },
  {
    id: 10,
    name: 'Angie Voss',
    title: 'Livestock Coordinator',
    type: 'Livestock' as RepType,
    phone: '(515) 555-0573',
    email: 'a.voss@bigiron.com',
    states: ['IA'],
    counties: ['Story', 'Boone', 'Hamilton'],
    photo: img('sales7.jpg'),
    bio: 'North-central Iowa livestock auction coordination and consulting.',
    lat: 42.0308,
    lng: -93.6319,
  },
  {
    id: 11,
    name: 'Robert Chen',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(319) 555-0672',
    email: 'r.chen@bigiron.com',
    states: ['IA'],
    counties: ['Linn', 'Johnson', 'Iowa'],
    photo: img('sales8.jpg'),
    bio: 'Eastern Iowa corridor specialist focusing on premium farmland.',
    lat: 41.9779,
    lng: -91.6656,
  },
  // Iowa Classic Car
  {
    id: 57,
    name: 'Pete Hollingsworth',
    title: 'Classic Car Specialist',
    type: 'Classic Car' as RepType,
    phone: '(515) 555-0811',
    email: 'p.hollingsworth@bigiron.com',
    states: ['IA'],
    counties: ['Polk', 'Warren', 'Dallas', 'Story', 'Boone'],
    photo: img('sales9.jpg'),
    bio: 'Iowa classic and collector car auction specialist.',
    lat: 41.5868,
    lng: -93.625,
  },

  // Kansas - 4 reps
  {
    id: 12,
    name: 'Phil Garrett',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(785) 555-0238',
    email: 'p.garrett@bigiron.com',
    states: ['KS'],
    counties: ['Riley', 'Geary', 'Pottawatomie'],
    photo: img('sales9.jpg'),
    bio: 'Kansas wheat and dryland farming equipment authority.',
    lat: 39.0558,
    lng: -96.8278,
  },
  {
    id: 13,
    name: 'Lori Ashton',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(785) 555-0147',
    email: 'l.ashton@bigiron.com',
    states: ['KS'],
    counties: ['Shawnee', 'Douglas', 'Johnson'],
    photo: img('sales6.jpg'),
    bio: 'Northeast Kansas real estate with focus on large acre transactions.',
    lat: 39.0473,
    lng: -95.6752,
  },
  {
    id: 14,
    name: 'Curtis Webb',
    title: 'Livestock Specialist',
    type: 'Livestock' as RepType,
    phone: '(316) 555-0492',
    email: 'c.webb@bigiron.com',
    states: ['KS'],
    counties: ['Sedgwick', 'Harvey', 'Butler', 'Reno', 'McPherson'],
    photo: img('sales10.jpg'),
    bio: 'South-central Kansas cattle and stocker markets specialist.',
    lat: 37.6872,
    lng: -97.3301,
  },
  {
    id: 15,
    name: 'Amanda Price',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(620) 555-0823',
    email: 'a.price@bigiron.com',
    states: ['KS'],
    counties: ['Finney', 'Ford', 'Gray'],
    photo: img('sales7.jpg'),
    bio: 'Western Kansas irrigated farmland expert.',
    lat: 37.9467,
    lng: -100.8696,
  },

  // South Dakota - 3 reps
  {
    id: 16,
    name: 'Janet Krueger',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(605) 555-0381',
    email: 'j.krueger@bigiron.com',
    states: ['SD'],
    counties: ['Minnehaha', 'Lincoln', 'Turner'],
    photo: img('sales7.jpg'),
    bio: 'Southeast South Dakota farm equipment specialist.',
    lat: 43.546,
    lng: -96.7313,
  },
  {
    id: 17,
    name: 'Ray Halverson',
    title: 'Real Estate & Livestock Agent',
    type: 'Real Estate' as RepType,
    phone: '(605) 555-0204',
    email: 'r.halverson@bigiron.com',
    states: ['SD'],
    counties: ['Brown', 'Day', 'Marshall'],
    photo: img('sales11.jpg'),
    bio: 'Dual-licensed for SD real estate and livestock in northeast region.',
    lat: 45.4611,
    lng: -98.4865,
  },
  {
    id: 18,
    name: 'Ray Halverson',
    title: 'Real Estate & Livestock Agent',
    type: 'Livestock' as RepType,
    phone: '(605) 555-0204',
    email: 'r.halverson@bigiron.com',
    states: ['SD'],
    counties: ['Brown', 'Day', 'Marshall'],
    photo: img('sales11.jpg'),
    bio: 'Dual-licensed for SD real estate and livestock in northeast region.',
    lat: 45.4611,
    lng: -98.4865,
  },

  // Missouri - 3 reps
  {
    id: 19,
    name: 'David Morrison',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(816) 555-0445',
    email: 'd.morrison@bigiron.com',
    states: ['MO'],
    counties: ['Jackson', 'Clay', 'Platte'],
    photo: img('sales1.jpg'),
    bio: 'Kansas City area equipment specialist with 12 years experience.',
    lat: 39.0997,
    lng: -94.5786,
  },
  {
    id: 20,
    name: 'Patricia Lee',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(573) 555-0912',
    email: 'p.lee@bigiron.com',
    states: ['MO'],
    counties: ['Boone', 'Callaway', 'Cole'],
    photo: img('sales6.jpg'),
    bio: 'Central Missouri farmland and hunting property specialist.',
    lat: 38.9517,
    lng: -92.3341,
  },
  {
    id: 21,
    name: 'James Tucker',
    title: 'Livestock Specialist',
    type: 'Livestock' as RepType,
    phone: '(417) 555-0334',
    email: 'j.tucker@bigiron.com',
    states: ['MO'],
    counties: ['Greene', 'Christian', 'Webster'],
    photo: img('sales2.jpg'),
    bio: 'Southwest Missouri cattle auction expert.',
    lat: 37.209,
    lng: -93.2923,
  },

  // Minnesota - 2 reps
  {
    id: 22,
    name: 'Eric Bergstrom',
    title: 'Equipment & Livestock Specialist',
    type: 'Equipment' as RepType,
    phone: '(507) 555-0778',
    email: 'e.bergstrom@bigiron.com',
    states: ['MN'],
    counties: ['Blue Earth', 'Nicollet', 'Le Sueur'],
    photo: img('sales3.jpg'),
    bio: 'Southern Minnesota equipment and livestock dual specialist.',
    lat: 44.0721,
    lng: -94.0033,
  },
  {
    id: 23,
    name: 'Eric Bergstrom',
    title: 'Equipment & Livestock Specialist',
    type: 'Livestock' as RepType,
    phone: '(507) 555-0778',
    email: 'e.bergstrom@bigiron.com',
    states: ['MN'],
    counties: ['Blue Earth', 'Nicollet', 'Le Sueur'],
    photo: img('sales3.jpg'),
    bio: 'Southern Minnesota equipment and livestock dual specialist.',
    lat: 44.0721,
    lng: -94.0033,
  },
  {
    id: 24,
    name: 'Lisa Anderson',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(320) 555-0556',
    email: 'l.anderson@bigiron.com',
    states: ['MN'],
    counties: ['Stearns', 'Benton', 'Sherburne'],
    photo: img('sales7.jpg'),
    bio: 'Central Minnesota dairy and crop farmland specialist.',
    lat: 45.5608,
    lng: -94.1622,
  },

  // North Dakota - 2 reps
  {
    id: 25,
    name: 'Tom Nielsen',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(701) 555-0923',
    email: 't.nielsen@bigiron.com',
    states: ['ND'],
    counties: ['Cass', 'Richland', 'Ransom'],
    photo: img('sales4.jpg'),
    bio: 'Southeast North Dakota grain equipment specialist.',
    lat: 46.8772,
    lng: -96.7898,
  },
  {
    id: 26,
    name: 'Rachel Foster',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(701) 555-0667',
    email: 'r.foster@bigiron.com',
    states: ['ND'],
    counties: ['Burleigh', 'Morton', 'Emmons'],
    photo: img('sales6.jpg'),
    bio: 'Central North Dakota farmland and ranch specialist.',
    lat: 46.8083,
    lng: -100.7837,
  },

  // Wisconsin - 2 reps
  {
    id: 27,
    name: 'Michael Schmidt',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(608) 555-0445',
    email: 'm.schmidt@bigiron.com',
    states: ['WI'],
    counties: ['Dane', 'Columbia', 'Sauk'],
    photo: img('sales5.jpg'),
    bio: 'South-central Wisconsin dairy equipment specialist.',
    lat: 43.0731,
    lng: -89.4012,
  },
  {
    id: 28,
    name: 'Susan Miller',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(920) 555-0778',
    email: 's.miller@bigiron.com',
    states: ['WI'],
    counties: ['Brown', 'Outagamie', 'Winnebago'],
    photo: img('sales7.jpg'),
    bio: 'Northeast Wisconsin farmland and recreational property expert.',
    lat: 44.5133,
    lng: -88.0133,
  },

  // Illinois - 3 reps
  {
    id: 29,
    name: 'Brian Carter',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(309) 555-0889',
    email: 'b.carter@bigiron.com',
    states: ['IL'],
    counties: ['McLean', 'Tazewell', 'Woodford'],
    photo: img('sales8.jpg'),
    bio: 'Central Illinois row crop equipment authority.',
    lat: 40.4842,
    lng: -88.9937,
  },
  {
    id: 30,
    name: 'Karen Johnson',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(217) 555-0334',
    email: 'k.johnson@bigiron.com',
    states: ['IL'],
    counties: ['Champaign', 'Vermilion', 'Douglas'],
    photo: img('sales6.jpg'),
    bio: 'East-central Illinois prime farmland specialist.',
    lat: 40.1164,
    lng: -88.2434,
  },
  {
    id: 31,
    name: 'Daniel Brooks',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(618) 555-0992',
    email: 'd.brooks@bigiron.com',
    states: ['IL'],
    counties: ['Madison', 'St. Clair', 'Monroe'],
    photo: img('sales9.jpg'),
    bio: 'Southern Illinois farmland and transitional property expert.',
    lat: 38.5906,
    lng: -90.1994,
  },

  // Indiana - 2 reps
  {
    id: 32,
    name: 'Mark Davis',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(574) 555-0556',
    email: 'm.davis@bigiron.com',
    states: ['IN'],
    counties: ['Elkhart', 'St. Joseph', 'Marshall'],
    photo: img('sales10.jpg'),
    bio: 'Northern Indiana equipment specialist.',
    lat: 41.6764,
    lng: -85.9767,
  },
  {
    id: 33,
    name: 'Nancy White',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(765) 555-0223',
    email: 'n.white@bigiron.com',
    states: ['IN'],
    counties: ['Tippecanoe', 'Clinton', 'Fountain'],
    photo: img('sales7.jpg'),
    bio: 'West-central Indiana farmland specialist.',
    lat: 40.4167,
    lng: -86.8753,
  },

  // Ohio - 2 reps
  {
    id: 34,
    name: 'Steven Martin',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(419) 555-0667',
    email: 's.martin@bigiron.com',
    states: ['OH'],
    counties: ['Wood', 'Hancock', 'Seneca'],
    photo: img('sales11.jpg'),
    bio: 'Northwest Ohio grain equipment expert.',
    lat: 41.3542,
    lng: -83.6133,
  },
  {
    id: 35,
    name: 'Michelle Brown',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(614) 555-0445',
    email: 'm.brown@bigiron.com',
    states: ['OH'],
    counties: ['Franklin', 'Delaware', 'Union'],
    photo: img('sales6.jpg'),
    bio: 'Central Ohio farmland and development property specialist.',
    lat: 40.015,
    lng: -83.0758,
  },

  // Michigan - 2 reps
  {
    id: 36,
    name: 'Robert Wilson',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(989) 555-0778',
    email: 'r.wilson@bigiron.com',
    states: ['MI'],
    counties: ['Saginaw', 'Bay', 'Tuscola'],
    photo: img('sales1.jpg'),
    bio: 'Mid-Michigan equipment and grain handling specialist.',
    lat: 43.4195,
    lng: -83.9508,
  },
  {
    id: 37,
    name: 'Jennifer Taylor',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(517) 555-0889',
    email: 'j.taylor@bigiron.com',
    states: ['MI'],
    counties: ['Ingham', 'Eaton', 'Clinton'],
    photo: img('sales7.jpg'),
    bio: 'South-central Michigan farmland specialist.',
    lat: 42.7325,
    lng: -84.5555,
  },

  // Oklahoma - 3 reps
  {
    id: 38,
    name: 'Chris Anderson',
    title: 'Equipment & Livestock Specialist',
    type: 'Equipment' as RepType,
    phone: '(580) 555-0334',
    email: 'c.anderson@bigiron.com',
    states: ['OK'],
    counties: ['Kay', 'Grant', 'Garfield'],
    photo: img('sales2.jpg'),
    bio: 'North-central Oklahoma wheat and cattle specialist.',
    lat: 36.7156,
    lng: -97.0784,
  },
  {
    id: 39,
    name: 'Chris Anderson',
    title: 'Equipment & Livestock Specialist',
    type: 'Livestock' as RepType,
    phone: '(580) 555-0334',
    email: 'c.anderson@bigiron.com',
    states: ['OK'],
    counties: ['Kay', 'Grant', 'Garfield'],
    photo: img('sales2.jpg'),
    bio: 'North-central Oklahoma wheat and cattle specialist.',
    lat: 36.7156,
    lng: -97.0784,
  },
  {
    id: 40,
    name: 'Linda Martinez',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(405) 555-0556',
    email: 'l.martinez@bigiron.com',
    states: ['OK'],
    counties: ['Oklahoma', 'Canadian', 'Cleveland'],
    photo: img('sales6.jpg'),
    bio: 'Central Oklahoma farmland and ranch property expert.',
    lat: 35.4676,
    lng: -97.5164,
  },

  // Texas - 3 reps
  {
    id: 41,
    name: 'John Rodriguez',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(806) 555-0667',
    email: 'j.rodriguez@bigiron.com',
    states: ['TX'],
    counties: ['Lubbock', 'Hale', 'Floyd'],
    photo: img('sales3.jpg'),
    bio: 'Texas panhandle cotton and grain equipment specialist.',
    lat: 33.5779,
    lng: -101.8552,
  },
  {
    id: 42,
    name: 'Maria Garcia',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(254) 555-0445',
    email: 'm.garcia@bigiron.com',
    states: ['TX'],
    counties: ['McLennan', 'Bell', 'Coryell'],
    photo: img('sales7.jpg'),
    bio: 'Central Texas farmland and ranch specialist.',
    lat: 31.5493,
    lng: -97.1467,
  },
  {
    id: 43,
    name: 'Thomas Wright',
    title: 'Livestock Specialist',
    type: 'Livestock' as RepType,
    phone: '(325) 555-0778',
    email: 't.wright@bigiron.com',
    states: ['TX'],
    counties: ['Tom Green', 'Concho', 'Irion'],
    photo: img('sales4.jpg'),
    bio: 'West Texas cattle and sheep auction expert.',
    lat: 31.4638,
    lng: -100.437,
  },

  // Arkansas - 2 reps
  {
    id: 44,
    name: 'William Harris',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(870) 555-0889',
    email: 'w.harris@bigiron.com',
    states: ['AR'],
    counties: ['Craighead', 'Poinsett', 'Mississippi'],
    photo: img('sales5.jpg'),
    bio: 'Northeast Arkansas row crop equipment specialist.',
    lat: 35.8423,
    lng: -90.7043,
  },
  {
    id: 45,
    name: 'Barbara Clark',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(501) 555-0334',
    email: 'b.clark@bigiron.com',
    states: ['AR'],
    counties: ['Pulaski', 'Lonoke', 'Faulkner'],
    photo: img('sales6.jpg'),
    bio: 'Central Arkansas farmland and hunting property expert.',
    lat: 34.7465,
    lng: -92.2896,
  },

  // Louisiana - 1 rep
  {
    id: 46,
    name: 'Joseph Lewis',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(318) 555-0556',
    email: 'j.lewis@bigiron.com',
    states: ['LA'],
    counties: ['Ouachita', 'Morehouse', 'Richland'],
    photo: img('sales8.jpg'),
    bio: 'Northeast Louisiana farmland and timberland specialist.',
    lat: 32.5093,
    lng: -92.1193,
  },

  // Mississippi - 1 rep
  {
    id: 47,
    name: 'Charles King',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(662) 555-0667',
    email: 'c.king@bigiron.com',
    states: ['MS'],
    counties: ['Bolivar', 'Sunflower', 'Washington'],
    photo: img('sales9.jpg'),
    bio: 'Mississippi Delta cotton equipment specialist.',
    lat: 33.7073,
    lng: -90.8957,
  },

  // Alabama - 1 rep
  {
    id: 48,
    name: 'Sarah Moore',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(256) 555-0778',
    email: 's.moore@bigiron.com',
    states: ['AL'],
    counties: ['Madison', 'Limestone', 'Morgan'],
    photo: img('sales7.jpg'),
    bio: 'North Alabama farmland and rural property specialist.',
    lat: 34.7304,
    lng: -86.5861,
  },

  // Tennessee - 1 rep
  {
    id: 49,
    name: 'Paul Walker',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(731) 555-0445',
    email: 'p.walker@bigiron.com',
    states: ['TN'],
    counties: ['Dyer', 'Gibson', 'Obion'],
    photo: img('sales10.jpg'),
    bio: 'West Tennessee row crop equipment specialist.',
    lat: 36.0345,
    lng: -89.2623,
  },

  // Kentucky - 1 rep
  {
    id: 50,
    name: 'Dorothy Hall',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(270) 555-0889',
    email: 'd.hall@bigiron.com',
    states: ['KY'],
    counties: ['Christian', 'Todd', 'Logan'],
    photo: img('sales6.jpg'),
    bio: 'South-central Kentucky farmland and tobacco base specialist.',
    lat: 36.8356,
    lng: -87.4886,
  },

  // Colorado - 2 reps
  {
    id: 51,
    name: 'Andrew Young',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(970) 555-0334',
    email: 'a.young@bigiron.com',
    states: ['CO'],
    counties: ['Weld', 'Logan', 'Morgan'],
    photo: img('sales11.jpg'),
    bio: 'Northeast Colorado dryland and irrigated equipment specialist.',
    lat: 40.4233,
    lng: -104.7091,
  },
  {
    id: 52,
    name: 'Elizabeth Allen',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(719) 555-0556',
    email: 'e.allen@bigiron.com',
    states: ['CO'],
    counties: ['El Paso', 'Pueblo', 'Fremont'],
    photo: img('sales7.jpg'),
    bio: 'South-central Colorado ranch and farmland expert.',
    lat: 38.8339,
    lng: -104.8214,
  },

  // Wyoming - 1 rep
  {
    id: 53,
    name: 'George Hernandez',
    title: 'Livestock Specialist',
    type: 'Livestock' as RepType,
    phone: '(307) 555-0667',
    email: 'g.hernandez@bigiron.com',
    states: ['WY'],
    counties: ['Laramie', 'Albany', 'Platte'],
    photo: img('sales1.jpg'),
    bio: 'Southeast Wyoming cattle and ranch livestock specialist.',
    lat: 41.3114,
    lng: -105.5911,
  },

  // Montana - 1 rep
  {
    id: 54,
    name: 'Sandra Scott',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(406) 555-0778',
    email: 's.scott@bigiron.com',
    states: ['MT'],
    counties: ['Yellowstone', 'Stillwater', 'Carbon'],
    photo: img('sales6.jpg'),
    bio: 'South-central Montana ranch and agricultural property expert.',
    lat: 45.7833,
    lng: -108.5007,
  },

  // Utah - 1 rep
  {
    id: 55,
    name: 'Kevin Green',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(435) 555-0445',
    email: 'k.green@bigiron.com',
    states: ['UT'],
    counties: ['Cache', 'Box Elder', 'Rich'],
    photo: img('sales2.jpg'),
    bio: 'Northern Utah irrigated farmland equipment specialist.',
    lat: 41.737,
    lng: -111.8338,
  },
]

const US_STATES = [
  { code: 'AL', name: 'Alabama', lat: 32.806671, lng: -86.79113 },
  { code: 'AK', name: 'Alaska', lat: 61.370716, lng: -152.404419 },
  { code: 'AZ', name: 'Arizona', lat: 33.729759, lng: -111.431221 },
  { code: 'AR', name: 'Arkansas', lat: 34.969704, lng: -92.373123 },
  { code: 'CA', name: 'California', lat: 36.116203, lng: -119.681564 },
  { code: 'CO', name: 'Colorado', lat: 39.059811, lng: -105.311104 },
  { code: 'CT', name: 'Connecticut', lat: 41.597782, lng: -72.755371 },
  { code: 'DE', name: 'Delaware', lat: 39.318523, lng: -75.507141 },
  { code: 'FL', name: 'Florida', lat: 27.766279, lng: -81.686783 },
  { code: 'GA', name: 'Georgia', lat: 33.040619, lng: -83.643074 },
  { code: 'HI', name: 'Hawaii', lat: 21.094318, lng: -157.498337 },
  { code: 'ID', name: 'Idaho', lat: 44.240459, lng: -114.478828 },
  { code: 'IL', name: 'Illinois', lat: 40.349457, lng: -88.986137 },
  { code: 'IN', name: 'Indiana', lat: 39.849426, lng: -86.258278 },
  { code: 'IA', name: 'Iowa', lat: 42.011539, lng: -93.210526 },
  { code: 'KS', name: 'Kansas', lat: 38.5266, lng: -96.726486 },
  { code: 'KY', name: 'Kentucky', lat: 37.66814, lng: -84.670067 },
  { code: 'LA', name: 'Louisiana', lat: 31.169546, lng: -91.867805 },
  { code: 'ME', name: 'Maine', lat: 44.693947, lng: -69.381927 },
  { code: 'MD', name: 'Maryland', lat: 39.063946, lng: -76.802101 },
  { code: 'MA', name: 'Massachusetts', lat: 42.230171, lng: -71.530106 },
  { code: 'MI', name: 'Michigan', lat: 43.326618, lng: -84.536095 },
  { code: 'MN', name: 'Minnesota', lat: 45.694454, lng: -93.900192 },
  { code: 'MS', name: 'Mississippi', lat: 32.741646, lng: -89.678696 },
  { code: 'MO', name: 'Missouri', lat: 38.456085, lng: -92.288368 },
  { code: 'MT', name: 'Montana', lat: 46.921925, lng: -110.454353 },
  { code: 'NE', name: 'Nebraska', lat: 41.12537, lng: -98.268082 },
  { code: 'NV', name: 'Nevada', lat: 38.313515, lng: -117.055374 },
  { code: 'NH', name: 'New Hampshire', lat: 43.452492, lng: -71.563896 },
  { code: 'NJ', name: 'New Jersey', lat: 40.298904, lng: -74.521011 },
  { code: 'NM', name: 'New Mexico', lat: 34.840515, lng: -106.248482 },
  { code: 'NY', name: 'New York', lat: 42.165726, lng: -74.948051 },
  { code: 'NC', name: 'North Carolina', lat: 35.630066, lng: -79.806419 },
  { code: 'ND', name: 'North Dakota', lat: 47.528912, lng: -99.784012 },
  { code: 'OH', name: 'Ohio', lat: 40.388783, lng: -82.764915 },
  { code: 'OK', name: 'Oklahoma', lat: 35.565342, lng: -96.928917 },
  { code: 'OR', name: 'Oregon', lat: 44.572021, lng: -122.070938 },
  { code: 'PA', name: 'Pennsylvania', lat: 40.590752, lng: -77.209755 },
  { code: 'RI', name: 'Rhode Island', lat: 41.680893, lng: -71.51178 },
  { code: 'SC', name: 'South Carolina', lat: 33.856892, lng: -80.945007 },
  { code: 'SD', name: 'South Dakota', lat: 44.299782, lng: -99.438828 },
  { code: 'TN', name: 'Tennessee', lat: 35.747845, lng: -86.692345 },
  { code: 'TX', name: 'Texas', lat: 31.054487, lng: -97.563461 },
  { code: 'UT', name: 'Utah', lat: 40.150032, lng: -111.862434 },
  { code: 'VT', name: 'Vermont', lat: 44.045876, lng: -72.710686 },
  { code: 'VA', name: 'Virginia', lat: 37.769337, lng: -78.169968 },
  { code: 'WA', name: 'Washington', lat: 47.400902, lng: -121.490494 },
  { code: 'WV', name: 'West Virginia', lat: 38.491226, lng: -80.954453 },
  { code: 'WI', name: 'Wisconsin', lat: 44.268543, lng: -89.616508 },
  { code: 'WY', name: 'Wyoming', lat: 42.755966, lng: -107.30249 },
]

const STATE_COUNTIES: Partial<Record<string, Array<string>>> = {
  NE: [
    'Lancaster',
    'Seward',
    'Saline',
    'Cass',
    'Douglas',
    'Sarpy',
    'Washington',
    'Hall',
    'Buffalo',
    'Adams',
    'Scotts Bluff',
    'Banner',
    'Morrill',
  ],
  IA: [
    'Polk',
    'Warren',
    'Dallas',
    'Madison',
    'Scott',
    'Clinton',
    'Jackson',
    'Cedar',
    'Story',
    'Boone',
    'Hamilton',
    'Linn',
    'Johnson',
    'Iowa',
  ],
  KS: [
    'Riley',
    'Geary',
    'Pottawatomie',
    'Shawnee',
    'Douglas',
    'Johnson',
    'Sedgwick',
    'Harvey',
    'Butler',
    'Reno',
    'McPherson',
    'Finney',
    'Ford',
    'Gray',
  ],
  SD: ['Minnehaha', 'Lincoln', 'Turner', 'Brown', 'Day', 'Marshall'],
  MO: [
    'Jackson',
    'Clay',
    'Platte',
    'Boone',
    'Callaway',
    'Cole',
    'Greene',
    'Christian',
    'Webster',
  ],
  MN: ['Blue Earth', 'Nicollet', 'Le Sueur', 'Stearns', 'Benton', 'Sherburne'],
  ND: ['Cass', 'Richland', 'Ransom', 'Burleigh', 'Morton', 'Emmons'],
  WI: ['Dane', 'Columbia', 'Sauk', 'Brown', 'Outagamie', 'Winnebago'],
  IL: [
    'McLean',
    'Tazewell',
    'Woodford',
    'Champaign',
    'Vermilion',
    'Douglas',
    'Madison',
    'St. Clair',
    'Monroe',
  ],
  IN: [
    'Elkhart',
    'St. Joseph',
    'Marshall',
    'Tippecanoe',
    'Clinton',
    'Fountain',
  ],
  OH: ['Wood', 'Hancock', 'Seneca', 'Franklin', 'Delaware', 'Union'],
  MI: ['Saginaw', 'Bay', 'Tuscola', 'Ingham', 'Eaton', 'Clinton'],
  OK: ['Kay', 'Grant', 'Garfield', 'Oklahoma', 'Canadian', 'Cleveland'],
  TX: [
    'Lubbock',
    'Hale',
    'Floyd',
    'McLennan',
    'Bell',
    'Coryell',
    'Tom Green',
    'Concho',
    'Irion',
  ],
  AR: ['Craighead', 'Poinsett', 'Mississippi', 'Pulaski', 'Lonoke', 'Faulkner'],
  LA: ['Ouachita', 'Morehouse', 'Richland'],
  MS: ['Bolivar', 'Sunflower', 'Washington'],
  AL: ['Madison', 'Limestone', 'Morgan'],
  TN: ['Dyer', 'Gibson', 'Obion'],
  KY: ['Christian', 'Todd', 'Logan'],
  CO: ['Weld', 'Logan', 'Morgan', 'El Paso', 'Pueblo', 'Fremont'],
  WY: ['Laramie', 'Albany', 'Platte'],
  MT: ['Yellowstone', 'Stillwater', 'Carbon'],
  UT: ['Cache', 'Box Elder', 'Rich'],
}

// ─── Type Config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  RepType,
  {
    accent: string
    bg: string
    border: string
    badge: string
    dot: string
    ring: string
  }
> = {
  Equipment: {
    accent: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800',
    badge:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800',
    dot: 'bg-amber-500',
    ring: 'ring-amber-400',
  },
  'Real Estate': {
    accent: 'text-emerald-700 dark:text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-400',
  },
  Livestock: {
    accent: 'text-yellow-900 dark:text-yellow-700',
    bg: 'bg-yellow-900/10 dark:bg-yellow-950/20',
    border: 'border-yellow-900/20 dark:border-yellow-800',
    badge:
      'bg-yellow-900/10 text-yellow-900 border-yellow-900/20 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-800',
    dot: 'bg-yellow-900',
    ring: 'ring-yellow-700',
  },
  'Classic Car': {
    accent: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    badge:
      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800',
    dot: 'bg-blue-500',
    ring: 'ring-blue-400',
  },
}

type Rep = (typeof REPRESENTATIVES)[number]
type RepWithDistance = Rep & { distance: number }

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3959
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

// ─── County Typeahead ─────────────────────────────────────────────────────────
function CountyTypeahead({
  value,
  onChange,
  counties,
  disabled,
  required,
}: {
  value: string
  onChange: (val: string) => void
  counties: Array<string>
  disabled: boolean
  required: boolean
}) {
  const [inputValue, setInputValue] = useState(value)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync external value changes (e.g. reset)
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const filtered = useMemo(() => {
    if (!inputValue.trim()) return counties
    const lower = inputValue.toLowerCase()
    return counties.filter((c) => c.toLowerCase().includes(lower))
  }, [inputValue, counties])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement
      item.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setInputValue(val)
    onChange(val)
    setOpen(true)
    setActiveIndex(-1)
  }

  function handleSelect(countyName: string) {
    setInputValue(countyName)
    onChange(countyName)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true)
        setActiveIndex(0)
        e.preventDefault()
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex])
      } else if (filtered.length === 1) {
        handleSelect(filtered[0])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    } else if (e.key === 'Tab') {
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex])
      }
      setOpen(false)
    }
  }

  function handleClear() {
    setInputValue('')
    onChange('')
    setOpen(false)
    inputRef.current?.focus()
  }

  const showDropdown = open && !disabled && filtered.length > 0

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Select state first' : 'Type to search…'}
          required={required}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `county-option-${activeIndex}` : undefined
          }
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pr-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />

        {/* Clear button or chevron */}
        {inputValue && !disabled ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label="Clear county"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : (
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="County options"
          className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md overflow-auto max-h-52 py-1 text-sm"
        >
          {filtered.map((countyName, index) => {
            const isActive = index === activeIndex
            // Highlight matching portion
            const lower = inputValue.toLowerCase()
            const matchStart = countyName.toLowerCase().indexOf(lower)
            const hasMatch = inputValue.length > 0 && matchStart !== -1

            return (
              <li
                key={countyName}
                id={`county-option-${index}`}
                role="option"
                aria-selected={isActive}
                onMouseDown={(e) => {
                  // prevent input blur before click registers
                  e.preventDefault()
                  handleSelect(countyName)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center px-3 py-1.5 cursor-pointer select-none transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-accent/50'
                }`}
              >
                {hasMatch ? (
                  <>
                    {countyName.slice(0, matchStart)}
                    <span className="font-semibold">
                      {countyName.slice(
                        matchStart,
                        matchStart + inputValue.length,
                      )}
                    </span>
                    {countyName.slice(matchStart + inputValue.length)}
                  </>
                ) : (
                  countyName
                )}
              </li>
            )
          })}
        </ul>
      )}

      {/* No results hint */}
      {open &&
        !disabled &&
        inputValue.trim().length > 0 &&
        filtered.length === 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md px-3 py-2 text-sm text-muted-foreground">
            No counties found. You can still search with this name.
          </div>
        )}
    </div>
  )
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard({ type }: { type: RepType }) {
  const c = TYPE_CONFIG[type]
  return (
    <div
      className={`rounded-lg border ${c.border} ${c.bg} px-4 pt-6 pb-4 flex flex-col items-center h-full`}
    >
      <div
        className={`w-24 aspect-square rounded-full flex-shrink-0 ring-4 ${c.ring} ring-offset-2 mb-3 max-h-24`}
        style={{
          background:
            'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <div className="w-full space-y-2 flex flex-col items-center">
        <div
          className="h-4 w-28 rounded"
          style={{
            background:
              'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
        <div
          className="h-3 w-20 rounded"
          style={{
            background:
              'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite 0.1s',
          }}
        />
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${c.badge} opacity-60 whitespace-nowrap`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
          {type}
        </span>
        <div
          className="h-3 w-24 rounded"
          style={{
            background:
              'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite 0.2s',
          }}
        />
        <div
          className="h-3 w-28 rounded"
          style={{
            background:
              'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite 0.3s',
          }}
        />
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

// ─── Rep Card ─────────────────────────────────────────────────────────────────
function RepCard({ rep }: { rep: RepWithDistance | Rep }) {
  const c = TYPE_CONFIG[rep.type]
  return (
    <div
      className={`rounded-lg border ${c.border} ${c.bg} px-4 pt-6 pb-4 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-150 h-full`}
    >
      <div
        className={`w-24 aspect-square rounded-full overflow-hidden bg-muted mb-3 ring-4 ${c.ring} ring-offset-2 flex-shrink-0 max-h-24`}
      >
        <img
          src={rep.photo}
          alt={`Photo of ${rep.name}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.classList.add('flex', 'items-center', 'justify-center')
              const initials = rep.name
                .split(' ')
                .map((n) => n[0])
                .join('')
              parent.innerHTML = `<span class="text-2xl font-bold text-muted-foreground">${initials}</span>`
            }
          }}
        />
      </div>

      <div className="mb-2.5">
        <p className="font-semibold text-foreground text-sm leading-tight">
          {rep.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{rep.title}</p>
      </div>

      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${c.badge} whitespace-nowrap mb-3`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {rep.type}
      </span>

      <div className="flex flex-col gap-1.5 w-full mt-auto">
        <a
          href={`tel:${rep.phone}`}
          className={`cursor-pointer inline-flex items-center justify-center gap-1.5 text-xs font-medium ${c.accent} hover:underline`}
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
          {rep.phone}
        </a>
        <a
          href={`mailto:${rep.email}`}
          className={`cursor-pointer inline-flex items-center justify-center gap-1.5 text-xs font-medium ${c.accent} hover:underline`}
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          {rep.email}
        </a>
      </div>
    </div>
  )
}

// ─── Results Panel ────────────────────────────────────────────────────────────
function ResultsPanel({
  loading,
  hasSearched,
  results,
}: {
  loading: boolean
  hasSearched: boolean
  results: Array<RepWithDistance>
}) {
  if (loading) {
    return (
      <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        <SkeletonCard type="Equipment" />
        <SkeletonCard type="Livestock" />
        <SkeletonCard type="Real Estate" />
        <SkeletonCard type="Classic Car" />
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-border bg-muted/30 min-h-[320px]">
        <svg
          className="w-12 h-12 text-muted-foreground/40 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
        <p className="text-sm font-medium text-muted-foreground">
          Your reps will appear here
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Select a state and county to find your local representatives
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="h-full rounded-lg border border-border bg-card p-10 text-center flex flex-col items-center justify-center min-h-[320px]">
        <p className="text-sm font-medium text-foreground">
          No sales reps found
        </p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
          We don't have a rep assigned to your selected area yet. Please contact
          BigIron directly.
        </p>
      </div>
    )
  }

  const typeOrder: Array<RepType> = [
    'Equipment',
    'Livestock',
    'Real Estate',
    'Classic Car',
  ]
  const sorted = [...results].sort(
    (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type),
  )
  return (
    <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
      {sorted.map((rep) => (
        <RepCard key={`${rep.id}-${rep.type}`} rep={rep} />
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FindMySalesRepSidebar() {
  const [selectedState, setSelectedState] = useState('')
  const [county, setCounty] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const results = useMemo<Array<RepWithDistance>>(() => {
    if (!searched || !selectedState || !county.trim()) return []

    const stateInfo = US_STATES.find((s) => s.code === selectedState)
    if (!stateInfo) return []

    const ct = county.trim().toLowerCase()

    let matchingReps = REPRESENTATIVES.filter((rep) => {
      if (!rep.states.includes(selectedState)) return false
      return rep.counties.some((c) => c.toLowerCase() === ct)
    }).map((rep) => ({
      ...rep,
      distance: calculateDistance(
        stateInfo.lat,
        stateInfo.lng,
        rep.lat,
        rep.lng,
      ),
    }))

    if (matchingReps.length === 0) {
      matchingReps = REPRESENTATIVES.filter((rep) =>
        rep.states.includes(selectedState),
      ).map((rep) => ({
        ...rep,
        distance: calculateDistance(
          stateInfo.lat,
          stateInfo.lng,
          rep.lat,
          rep.lng,
        ),
      }))
    }

    matchingReps.sort((a, b) => a.distance - b.distance)

    const types: Array<RepType> = [
      'Real Estate',
      'Equipment',
      'Livestock',
      'Classic Car',
    ]
    for (const t of types) {
      if (!matchingReps.some((r) => r.type === t)) {
        const fallback = REPRESENTATIVES.filter(
          (rep) => rep.states.includes(selectedState) && rep.type === t,
        )
          .map((rep) => ({
            ...rep,
            distance: calculateDistance(
              stateInfo.lat,
              stateInfo.lng,
              rep.lat,
              rep.lng,
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
        if (fallback.length > 0) matchingReps.push(fallback[0])
      }
    }

    const uniqueReps = Array.from(
      new Map(
        matchingReps.map((rep) => [`${rep.id}-${rep.type}`, rep]),
      ).values(),
    )

    return uniqueReps.sort((a, b) => a.distance - b.distance)
  }, [searched, selectedState, county])

  const hasSearched = searched && !!selectedState && !!county.trim()

  const availableCounties = useMemo(() => {
    if (!selectedState) return []
    return (STATE_COUNTIES[selectedState] || []).slice().sort()
  }, [selectedState])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearched(false)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSearched(true)
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }, 50)
      }
    }, 1200)
  }

  function handleReset() {
    setSelectedState('')
    setCounty('')
    setSearched(false)
    setLoading(false)
  }

  function handleUseMyLocation() {
    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        let closestState = US_STATES[0]
        let minDistance = calculateDistance(
          latitude,
          longitude,
          closestState.lat,
          closestState.lng,
        )
        US_STATES.forEach((state) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            state.lat,
            state.lng,
          )
          if (distance < minDistance) {
            minDistance = distance
            closestState = state
          }
        })
        setSelectedState(closestState.code)
        setCounty('')
        setSearched(false)
        setLoading(false)
        setGettingLocation(false)
        setTimeout(() => {
          formRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }, 500)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert(
          'Unable to get your location. Please ensure location permissions are enabled.',
        )
        setGettingLocation(false)
      },
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="px-4 sm:px-6 max-w-[1500px] mx-auto w-full">
        <h1 className="!text-3xl font-semibold tracking-tight text-foreground">
          Find My Sales Rep
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select your state and county to quickly connect with the BigIron sales
          representative for Equipment, Real Estate, Livestock, or Classic Cars
          in your area. With <span className="font-bold">55+ sales reps</span>{' '}
          serving 24 states, there's a knowledgeable local expert ready to help.
        </p>
      </div>

      {/* Form (left) + Results (right) */}
      <div className="px-4 sm:px-6 max-w-[1500px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
          {/* Left: Quick Find + Form */}
          <div className="flex flex-col gap-6">
            {/* Quick Find */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800 p-4">
              <div className="flex items-center justify-between gap-4 flex-row lg:flex-col xl:flex-row">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center flex-shrink-0 hidden sm:flex">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 448 512"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold !mb-0.5 text-blue-900 dark:text-blue-100">
                      Quick Find Your Rep
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-300 mt-0.5">
                      Automatically detect{' '}
                      <span className="whitespace-nowrap">your location</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={gettingLocation}
                  className="cursor-pointer inline-flex items-center gap-2 h-9 px-4 rounded-md bg-blue-600 border-blue-200 dark:bg-blue-950/20 text-white dark:text-blue-400 text-sm font-medium shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {gettingLocation ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden xl:inline">Getting...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 576 512"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M288-16c13.3 0 24 10.7 24 24l0 25.3C416.5 44.4 499.6 127.5 510.7 232l25.3 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-25.3 0C499.6 384.5 416.5 467.6 312 478.7l0 25.3c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-25.3C159.5 467.6 76.4 384.5 65.3 280L40 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l25.3 0C76.4 127.5 159.5 44.4 264 33.3L264 8c0-13.3 10.7-24 24-24zM464 256a176 176 0 1 0 -352 0 176 176 0 1 0 352 0zm-112 0a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zm-176 0a112 112 0 1 1 224 0 112 112 0 1 1 -224 0z"
                        />
                      </svg>
                      <span>Use Location</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Search Form */}
            <form ref={formRef} onSubmit={handleSearch}>
              <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-xl">Best Match</h2>
                    <p className="text-md text-foreground">
                      Enter your{' '}
                      <strong>
                        <u>county</u>
                      </strong>{' '}
                      for the most accurate rep match
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* State */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">
                        State <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedState}
                          onChange={(e) => {
                            setSelectedState(e.target.value)
                            setCounty('')
                            setSearched(false)
                            setLoading(false)
                          }}
                          required
                          style={{
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                          }}
                          className="cursor-pointer flex h-9 w-full rounded-md border border-input bg-background pl-3 pr-9 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                        >
                          <option value="">Select a state…</option>
                          {US_STATES.map((s) => (
                            <option key={s.code} value={s.code}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* County Typeahead */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">
                        County <span className="text-destructive">*</span>
                      </label>
                      <CountyTypeahead
                        value={county}
                        onChange={(val) => {
                          setCounty(val)
                          setSearched(false)
                        }}
                        counties={availableCounties}
                        disabled={!selectedState}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!selectedState || !county.trim() || loading}
                    className="cursor-pointer inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring flex-1"
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    )}
                    {loading ? 'Searching…' : 'Find Reps'}
                  </button>
                  {(hasSearched || loading) && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="cursor-pointer inline-flex items-center h-9 px-4 rounded-md border border-input bg-background text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Right: Results (2 columns) */}
          <div ref={resultsRef} className="lg:col-span-2 flex scroll-mt-4">
            <div className="flex-1">
              <ResultsPanel
                loading={loading}
                hasSearched={hasSearched}
                results={results}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
