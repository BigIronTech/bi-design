import { useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCarSide,
  faCow,
  faSignHanging,
  faTractor,
} from '@fortawesome/free-solid-svg-icons'

// ─── Image helper ─────────────────────────────────────────────────────────────
const img = (filename: string) => `${import.meta.env.BASE_URL}${filename}`

// ─── Types ────────────────────────────────────────────────────────────────────
type RepType = 'Equipment' | 'Real Estate' | 'Livestock' | 'Classic Car'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const REPRESENTATIVES = [
  {
    id: 1,
    name: 'Tyler Hanson',
    title: 'Equipment Regional Manager',
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
    title: 'Livestock Regional Manager',
    type: 'Livestock' as RepType,
    phone: '(402) 555-0319',
    email: 'd.olson@bigiron.com',
    states: ['NE'],
    counties: ['Lancaster', 'Seward', 'Saline', 'Cass'],
    photo: img('sales2.jpg'),
    bio: 'Certified livestock Regional Manager with experience in cattle markets.',
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
  {
    id: 7,
    name: 'Brett Caldwell',
    title: 'Equipment Regional Manager',
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
  {
    id: 12,
    name: 'Phil Garrett',
    title: 'Equipment Regional Manager',
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
  {
    id: 16,
    name: 'Janet Krueger',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(605) 555-0381',
    email: 'j.krueger@bigiron.com',
    states: ['SD'],
    counties: ['Minnehaha', 'Lincoln', 'Turner'],
    photo: img('sales7.jpg'),
    bio: 'Southeast South Dakota farm Equipment Regional Manager.',
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
  {
    id: 19,
    name: 'David Morrison',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(816) 555-0445',
    email: 'd.morrison@bigiron.com',
    states: ['MO'],
    counties: ['Jackson', 'Clay', 'Platte'],
    photo: img('sales1.jpg'),
    bio: 'Kansas City area Equipment Regional Manager with 12 years experience.',
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
  {
    id: 25,
    name: 'Tom Nielsen',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(701) 555-0923',
    email: 't.nielsen@bigiron.com',
    states: ['ND'],
    counties: ['Cass', 'Richland', 'Ransom'],
    photo: img('sales4.jpg'),
    bio: 'Southeast North Dakota grain Equipment Regional Manager.',
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
  {
    id: 27,
    name: 'Michael Schmidt',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(608) 555-0445',
    email: 'm.schmidt@bigiron.com',
    states: ['WI'],
    counties: ['Dane', 'Columbia', 'Sauk'],
    photo: img('sales5.jpg'),
    bio: 'South-central Wisconsin dairy Equipment Regional Manager.',
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
  {
    id: 29,
    name: 'Brian Carter',
    title: 'Equipment Regional Manager',
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
  {
    id: 32,
    name: 'Mark Davis',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(574) 555-0556',
    email: 'm.davis@bigiron.com',
    states: ['IN'],
    counties: ['Elkhart', 'St. Joseph', 'Marshall'],
    photo: img('sales10.jpg'),
    bio: 'Northern Indiana Equipment Regional Manager.',
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
  {
    id: 34,
    name: 'Steven Martin',
    title: 'Equipment Regional Manager',
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
  {
    id: 36,
    name: 'Robert Wilson',
    title: 'Equipment Regional Manager',
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
  {
    id: 41,
    name: 'John Rodriguez',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(806) 555-0667',
    email: 'j.rodriguez@bigiron.com',
    states: ['TX'],
    counties: ['Lubbock', 'Hale', 'Floyd'],
    photo: img('sales3.jpg'),
    bio: 'Texas panhandle cotton and grain Equipment Regional Manager.',
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
  {
    id: 44,
    name: 'William Harris',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(870) 555-0889',
    email: 'w.harris@bigiron.com',
    states: ['AR'],
    counties: ['Craighead', 'Poinsett', 'Mississippi'],
    photo: img('sales5.jpg'),
    bio: 'Northeast Arkansas row crop Equipment Regional Manager.',
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
  {
    id: 47,
    name: 'Charles King',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(662) 555-0667',
    email: 'c.king@bigiron.com',
    states: ['MS'],
    counties: ['Bolivar', 'Sunflower', 'Washington'],
    photo: img('sales9.jpg'),
    bio: 'Mississippi Delta cotton Equipment Regional Manager.',
    lat: 33.7073,
    lng: -90.8957,
  },
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
  {
    id: 49,
    name: 'Paul Walker',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(731) 555-0445',
    email: 'p.walker@bigiron.com',
    states: ['TN'],
    counties: ['Dyer', 'Gibson', 'Obion'],
    photo: img('sales10.jpg'),
    bio: 'West Tennessee row crop Equipment Regional Manager.',
    lat: 36.0345,
    lng: -89.2623,
  },
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
  {
    id: 51,
    name: 'Andrew Young',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(970) 555-0334',
    email: 'a.young@bigiron.com',
    states: ['CO'],
    counties: ['Weld', 'Logan', 'Morgan'],
    photo: img('sales11.jpg'),
    bio: 'Northeast Colorado dryland and irrigated Equipment Regional Manager.',
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
  {
    id: 55,
    name: 'Kevin Green',
    title: 'Equipment Regional Manager',
    type: 'Equipment' as RepType,
    phone: '(435) 555-0445',
    email: 'k.green@bigiron.com',
    states: ['UT'],
    counties: ['Cache', 'Box Elder', 'Rich'],
    photo: img('sales2.jpg'),
    bio: 'Northern Utah irrigated farmland Equipment Regional Manager.',
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
    icon: string
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
    icon: '🚜',
  },
  'Real Estate': {
    accent: 'text-emerald-700 dark:text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-400',
    icon: '🏡',
  },
  Livestock: {
    accent: 'text-yellow-900 dark:text-yellow-700',
    bg: 'bg-yellow-900/10 dark:bg-yellow-950/20',
    border: 'border-yellow-900/25 dark:border-yellow-800',
    badge:
      'bg-yellow-900/10 text-yellow-900 border-yellow-900/25 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-800',
    dot: 'bg-yellow-900',
    ring: 'ring-yellow-700',
    icon: '🐄',
  },
  'Classic Car': {
    accent: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    badge:
      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800',
    dot: 'bg-blue-500',
    ring: 'ring-blue-400',
    icon: '🚗',
  },
}

const SELL_CATEGORIES: Array<{
  value: RepType
  label: string
  description: string
}> = [
  {
    value: 'Equipment',
    label: 'Equipment',
    description: 'Tractors, combines, tillage & more',
  },
  {
    value: 'Real Estate',
    label: 'Real Estate',
    description: 'Farmland, ranches & rural property',
  },
  {
    value: 'Livestock',
    label: 'Livestock',
    description: 'Cattle, hogs, sheep & more',
  },
  {
    value: 'Classic Car',
    label: 'Classic Cars',
    description: 'Vintage & collector vehicles',
  },
]

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
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
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

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const filtered = useMemo(() => {
    if (!inputValue.trim()) return counties
    const lower = inputValue.toLowerCase()
    return counties.filter((c) => c.toLowerCase().includes(lower))
  }, [inputValue, counties])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
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

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      ;(listRef.current.children[activeIndex] as HTMLElement).scrollIntoView({
        block: 'nearest',
      })
    }
  }, [activeIndex])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setInputValue(val)
    onChange(val)
    setOpen(true)
    setActiveIndex(-1)
  }
  function handleSelect(name: string) {
    setInputValue(name)
    onChange(name)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }
  function handleClear() {
    setInputValue('')
    onChange('')
    setOpen(false)
    inputRef.current?.focus()
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
      if (activeIndex >= 0 && filtered[activeIndex])
        handleSelect(filtered[activeIndex])
      else if (filtered.length === 1) handleSelect(filtered[0])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    } else if (e.key === 'Tab') {
      if (activeIndex >= 0 && filtered[activeIndex])
        handleSelect(filtered[activeIndex])
      setOpen(false)
    }
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
      {showDropdown && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="County options"
          className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md overflow-auto max-h-52 py-1 text-sm"
        >
          {filtered.map((countyName, index) => {
            const isActive = index === activeIndex
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
                  e.preventDefault()
                  handleSelect(countyName)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center px-3 py-1.5 cursor-pointer select-none transition-colors ${isActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50'}`}
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
        className={`w-20 aspect-square rounded-full flex-shrink-0 ring-4 ${c.ring} ring-offset-2 mb-3`}
        style={{
          background:
            'linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <div className="w-full space-y-2 flex flex-col items-center">
        <div
          className="h-4 w-28 rounded"
          style={{
            background:
              'linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
        <div
          className="h-3 w-20 rounded"
          style={{
            background:
              'linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%)',
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
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  )
}

// ─── Rep Card ─────────────────────────────────────────────────────────────────
function RepCard({ rep }: { rep: RepWithDistance | Rep }) {
  const c = TYPE_CONFIG[rep.type]
  return (
    <div
      className={`rounded-lg border ${c.border} ${c.bg} px-4 pt-5 pb-4 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-150 h-full`}
    >
      <div
        className={`w-20 aspect-square rounded-full overflow-hidden bg-muted mb-3 ring-4 ${c.ring} ring-offset-2 flex-shrink-0`}
      >
        <img
          src={rep.photo}
          alt={`Photo of ${rep.name}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const t = e.currentTarget
            t.style.display = 'none'
            const p = t.parentElement
            if (p) {
              p.classList.add('flex', 'items-center', 'justify-center')
              p.innerHTML = `<span class="text-xl font-bold text-muted-foreground">${rep.name
                .split(' ')
                .map((n) => n[0])
                .join('')}</span>`
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
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${c.badge} whitespace-nowrap`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {rep.type}
      </span>
    </div>
  )
}

// ─── Classic Car SVG icon ─────────────────────────────────────────────────────
function ClassicCarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <path d="M6 20 C6 20 8 12 16 10 L26 8 C28 8 30 6 34 6 L42 6 C46 6 50 9 52 12 L58 14 C60 15 62 17 62 20 L62 22 C62 23 61 24 60 24 L56 24 C56 27.3 53.3 30 50 30 C46.7 30 44 27.3 44 24 L20 24 C20 27.3 17.3 30 14 30 C10.7 30 8 27.3 8 24 L4 24 C3 24 2 23 2 22 L2 20 Z" />
      {/* Windshield cutout */}
      <path d="M28 9 L26 19 L46 19 L44 9 Z" fill="white" opacity="0.3" />
      {/* Rear window */}
      <path d="M46 9 L44.5 19 L52 19 L50 11 Z" fill="white" opacity="0.2" />
      {/* Front wheel */}
      <circle
        cx="14"
        cy="24"
        r="5"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <circle cx="14" cy="24" r="2" fill="white" opacity="0.4" />
      {/* Rear wheel */}
      <circle
        cx="50"
        cy="24"
        r="5"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <circle cx="50" cy="24" r="2" fill="white" opacity="0.4" />
    </svg>
  )
}

// ─── Sell Category Selector ───────────────────────────────────────────────────
const CATEGORY_ICONS = {
  Equipment: faTractor,
  'Real Estate': faSignHanging,
  Livestock: faCow,
  'Classic Car': faCarSide,
} as const

function SellCategorySelector({
  selected,
  onChange,
}: {
  selected: Array<RepType>
  onChange: (val: Array<RepType>) => void
}) {
  function toggle(val: RepType) {
    onChange(
      selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val],
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {SELL_CATEGORIES.map((cat) => {
        const isSelected = selected.includes(cat.value)
        const c = TYPE_CONFIG[cat.value]
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => toggle(cat.value)}
            className={`cursor-pointer relative flex flex-row items-center gap-3 rounded-lg border-2 p-3 text-left transition-all duration-150 ${
              isSelected
                ? `${c.border} ${c.bg} shadow-sm`
                : 'border-border bg-background hover:border-muted-foreground/30 hover:bg-muted/40'
            }`}
          >
            {/* Checkbox indicator */}
            <span
              className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                isSelected
                  ? 'border-current opacity-90 bg-current'
                  : 'border-muted-foreground/30 bg-transparent'
              }`}
            >
              {isSelected && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>

            {/* FA Icon — left side */}
            <div className="flex-shrink-0 flex items-center justify-center w-9 h-9">
              <FontAwesomeIcon
                icon={CATEGORY_ICONS[cat.value]}
                className={`text-2xl ${isSelected ? c.accent : 'text-muted-foreground'}`}
              />
            </div>

            {/* Text — right side */}
            <div className="flex flex-col gap-0.5 min-w-0 pr-5">
              <span
                className={`text-xs font-semibold leading-tight ${
                  isSelected ? c.accent : 'text-foreground'
                }`}
              >
                {cat.label}
              </span>
              <span className="text-[11px] text-muted-foreground leading-snug">
                {cat.description}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ─── Success Panel ────────────────────────────────────────────────────────────
function SuccessPanel({
  matchedReps,
  firstName,
}: {
  matchedReps: Array<RepWithDistance>
  firstName: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900/40 dark:border-slate-700 overflow-hidden">
      {/* Confirmation header */}
      <div className="px-5 pt-5 pb-5 flex flex-col items-center text-center gap-2 border-b border-slate-200 dark:border-slate-700">
        <div className="w-11 h-11 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold !mb-2 text-neutral-900 dark:text-green-100">
            {firstName ? `Thanks, ${firstName}` : "You're all set"} — your{' '}
            {matchedReps.length === 1 ? 'rep' : 'reps'} will be in touch very
            shortly.
          </p>
          <p className="text-sm text-neutral-700 dark:text-green-300 mt-1 max-w-sm mx-auto leading-relaxed">
            {matchedReps.length === 1
              ? `Can't wait? Feel free to give ${matchedReps[0].name} a call directly.`
              : "Can't wait? Feel free to call any of your local reps directly."}
          </p>
        </div>
      </div>

      {/* Rep cards with full color scheme */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {matchedReps.map((rep) => {
          const c = TYPE_CONFIG[rep.type]
          return (
            <div
              key={`${rep.id}-${rep.type}`}
              className={`rounded-lg border ${c.border} ${c.bg} px-3 pt-4 pb-3 flex flex-col items-center text-center gap-2`}
            >
              {/* Photo */}
              <div
                className={`w-16 aspect-square rounded-full overflow-hidden bg-muted ring-4 ${c.ring} ring-offset-2 flex-shrink-0`}
              >
                <img
                  src={rep.photo}
                  alt={rep.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.currentTarget
                    t.style.display = 'none'
                    const p = t.parentElement
                    if (p) {
                      p.classList.add('flex', 'items-center', 'justify-center')
                      p.innerHTML = `<span class="text-lg font-bold text-muted-foreground">${rep.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}</span>`
                    }
                  }}
                />
              </div>
              {/* Name + title */}
              <div>
                <p className="font-semibold text-foreground text-xs leading-tight">
                  {rep.name}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {rep.title}
                </p>
              </div>
              {/* Type badge */}
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${c.badge} whitespace-nowrap`}
              >
                <span className={`w-1 h-1 rounded-full ${c.dot}`} />
                {rep.type}
              </span>
              {/* Call button */}
              <a
                href={`tel:${rep.phone.replace(/\D/g, '')}`}
                className="w-full inline-flex items-center justify-center gap-1.5 h-7 px-2 rounded-md bg-primary hover:bg-primary/90 text-white text-[11px] font-medium transition-colors whitespace-nowrap"
              >
                <svg
                  className="w-2.5 h-2.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                >
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                </svg>
                {rep.phone}
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm({
  reps,
  onSubmitted,
}: {
  reps: Array<RepWithDistance>
  onSubmitted: (matched: Array<RepWithDistance>, firstName: string) => void
}) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [sellTypes, setSellTypes] = useState<Array<RepType>>([])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const matchedReps =
    sellTypes.length > 0 ? reps.filter((r) => sellTypes.includes(r.type)) : reps

  function formatPhone(val: string) {
    const d = val.replace(/\D/g, '').slice(0, 10)
    if (d.length <= 3) return d
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onSubmitted(matchedReps, firstName)
    }, 1400)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Get in Touch
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tell us a little about yourself and what you'd like to sell — your
          local rep will reach out shortly.
        </p>
      </div>

      {matchedReps.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/40 border border-border">
          <div className="flex -space-x-2 flex-shrink-0">
            {matchedReps.map((rep) => (
              <div
                key={`${rep.id}-${rep.type}`}
                className="w-7 h-7 rounded-full ring-2 ring-background overflow-hidden bg-muted"
              >
                <img
                  src={rep.photo}
                  alt={rep.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.currentTarget
                    t.style.display = 'none'
                    const p = t.parentElement
                    if (p) {
                      p.classList.add('flex', 'items-center', 'justify-center')
                      p.innerHTML = `<span class="text-[10px] font-bold text-muted-foreground">${rep.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}</span>`
                    }
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {matchedReps.length === 1
                ? matchedReps[0].name
                : `${matchedReps.length} local reps`}
            </span>{' '}
            will receive your request
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              First Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Jane"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Last Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Smith"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Phone <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              required
              placeholder="(555) 000-0000"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            What would you like to sell?{' '}
          </label>
          <SellCategorySelector selected={sellTypes} onChange={setSellTypes} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Additional details{' '}
            <span className="text-xs font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Describe what you're selling, timeline, any other details…"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!firstName || !lastName || !email || !phone || submitting}
          className="cursor-pointer w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {submitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            <>
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
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
              Send My Info to My Rep{matchedReps.length > 1 ? 's' : ''}
            </>
          )}
        </button>
      </form>
    </div>
  )
}

// ─── Results Panel ────────────────────────────────────────────────────────────
function ResultsPanel({
  loading,
  hasSearched,
  results,
  onSubmitted,
}: {
  loading: boolean
  hasSearched: boolean
  results: Array<RepWithDistance>
  onSubmitted: () => void
}) {
  const [submittedReps, setSubmittedReps] =
    useState<Array<RepWithDistance> | null>(null)
  const [submittedFirstName, setSubmittedFirstName] = useState('')
  const contactFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSubmittedReps(null)
    setSubmittedFirstName('')
  }, [results])

  function handleSubmitted(matched: Array<RepWithDistance>, firstName: string) {
    setSubmittedReps(matched)
    setSubmittedFirstName(firstName)
    onSubmitted()
  }

  // Smooth scroll to the contact form section
  function scrollToForm() {
    contactFormRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        <SkeletonCard type="Equipment" />
        <SkeletonCard type="Livestock" />
        <SkeletonCard type="Real Estate" />
        <SkeletonCard type="Classic Car" />
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-border bg-muted/30 self-stretch">
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
    <div>
      {/* Rep cards + intro — fade out after submit */}
      <div
        className="transition-all duration-500 ease-in-out"
        style={
          submittedReps
            ? {
                opacity: 0,
                maxHeight: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                marginBottom: 0,
              }
            : { opacity: 1, marginBottom: '1.25rem' }
        }
      >
        <div className="space-y-5">
          <div>
            <p className="text-md !mb-2 font-medium text-foreground">
              Meet your local BigIron reps
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              These specialists serve your area —{' '}
              {/* ── Scroll-to-form link ── */}
              <button
                type="button"
                onClick={scrollToForm}
                className="cursor-pointer text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:no-underline font-medium transition-colors"
              >
                fill out the form below
              </button>{' '}
              to connect.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
            {sorted.map((rep) => (
              <RepCard key={`${rep.id}-${rep.type}`} rep={rep} />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                />
              </svg>
              <span>Ready to connect?</span>
            </div>
            <div className="flex-1 border-t border-border" />
          </div>
        </div>
      </div>

      {/* Contact form or success state */}
      <div ref={contactFormRef}>
        {submittedReps ? (
          <SuccessPanel
            matchedReps={submittedReps}
            firstName={submittedFirstName}
          />
        ) : (
          <ContactForm reps={results} onSubmitted={handleSubmitted} />
        )}
      </div>
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

    let matchingReps = REPRESENTATIVES.filter(
      (rep) =>
        rep.states.includes(selectedState) &&
        rep.counties.some((c) => c.toLowerCase() === ct),
    ).map((rep) => ({
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

    return Array.from(
      new Map(
        matchingReps.map((rep) => [`${rep.id}-${rep.type}`, rep]),
      ).values(),
    ).sort((a, b) => a.distance - b.distance)
  }, [searched, selectedState, county])

  const hasSearched = searched && !!selectedState && !!county.trim()
  const availableCounties = useMemo(
    () =>
      !selectedState
        ? []
        : (STATE_COUNTIES[selectedState] || []).slice().sort(),
    [selectedState],
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearched(false)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSearched(true)
      if (window.innerWidth < 1024)
        setTimeout(
          () =>
            resultsRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            }),
          50,
        )
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
      ({ coords: { latitude, longitude } }) => {
        let closest = US_STATES[0]
        let minDist = calculateDistance(
          latitude,
          longitude,
          closest.lat,
          closest.lng,
        )
        US_STATES.forEach((s) => {
          const d = calculateDistance(latitude, longitude, s.lat, s.lng)
          if (d < minDist) {
            minDist = d
            closest = s
          }
        })
        setSelectedState(closest.code)
        setCounty('')
        setSearched(false)
        setLoading(false)
        setGettingLocation(false)
        setTimeout(
          () =>
            formRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            }),
          500,
        )
      },
      (err) => {
        console.error(err)
        alert(
          'Unable to get your location. Please ensure location permissions are enabled.',
        )
        setGettingLocation(false)
      },
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="px-4 sm:px-6 max-w-[1500px] mx-auto w-full">
        <h1 className="!text-3xl font-semibold tracking-tight text-foreground">
          Find My Sales Rep
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select your state and county to meet the BigIron specialists in your
          area — then fill out the quick form to get connected. With{' '}
          <span className="font-bold">
            sales reps serving all upper 48 states
          </span>
          , there's a knowledgeable local expert ready to help you sell.
        </p>
      </div>

      <div className="px-4 sm:px-6 max-w-[1500px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
          <div className="flex flex-col gap-6">
            {/* Quick Find */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800 p-4">
              <div className="flex items-center justify-between gap-4 flex-row lg:flex-col xl:flex-row">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center flex-shrink-0 hidden sm:flex">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 448 512"
                    >
                      <path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z" />
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
                  className="cursor-pointer inline-flex items-center gap-2 h-9 px-4 rounded-md bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
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
                        viewBox="0 0 576 512"
                      >
                        <path d="M288-16c13.3 0 24 10.7 24 24l0 25.3C416.5 44.4 499.6 127.5 510.7 232l25.3 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-25.3 0C499.6 384.5 416.5 467.6 312 478.7l0 25.3c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-25.3C159.5 467.6 76.4 384.5 65.3 280L40 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l25.3 0C76.4 127.5 159.5 44.4 264 33.3L264 8c0-13.3 10.7-24 24-24zM464 256a176 176 0 1 0 -352 0 176 176 0 1 0 352 0zm-112 0a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zm-176 0a112 112 0 1 1 224 0 112 112 0 1 1 -224 0z" />
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
                    <h2 className="text-lg">Best Match</h2>
                    <p className="text-sm text-foreground">
                      Enter your{' '}
                      <strong>
                        <u>county</u>
                      </strong>{' '}
                      for the most accurate rep match
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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

          {/* Right: Results */}
          <div ref={resultsRef} className="lg:col-span-2 scroll-mt-4">
            <ResultsPanel
              loading={loading}
              hasSearched={hasSearched}
              results={results}
              onSubmitted={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
