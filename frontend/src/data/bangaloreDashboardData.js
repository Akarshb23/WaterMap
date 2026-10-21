/**
 * Bangalore District Geo & Metric Data for City Dashboard.
 * 42 districts forming a seamless interlocking choropleth of Bangalore (Bengaluru)
 * with exact risk distribution:
 * - 12 High Risk districts (red, 29%)
 * - 18 Moderate Risk districts (amber/yellow, 43%)
 * - 12 Low Risk districts (green, 28%)
 * Total: 42 Districts
 */

export const CITY_DASHBOARD_HEADER = {
  title: 'City Dashboard',
  subtitle: 'An overview of urban water stress and key insights for Karnataka.',
  dateRanges: [
    { value: '12m', label: 'Last 12 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '90d', label: 'Last 90 days' },
    { value: '30d', label: 'Last 30 days' },
  ],
}

export const BANGALORE_DASHBOARD_REGIONS = [
  {
    "id": "north-bangalore",
    "label": "NORTH BANGALORE",
    "x": 288,
    "y": 92
  },
  {
    "id": "west-bangalore",
    "label": "WEST BANGALORE",
    "x": 172,
    "y": 242
  },
  {
    "id": "central-bangalore",
    "label": "CENTRAL BANGALORE",
    "x": 282,
    "y": 295
  },
  {
    "id": "east-bangalore",
    "label": "EAST BANGALORE",
    "x": 422,
    "y": 285
  },
  {
    "id": "south-bangalore",
    "label": "SOUTH BANGALORE",
    "x": 292,
    "y": 436
  }
]

export const BANGALORE_DASHBOARD_DISTRICTS = [
  {
    "id": "district-12",
    "legacyId": "district-12",
    "districtNumber": 12,
    "wardNumber": 12,
    "name": "Koramangala",
    "zone": "Central Bangalore",
    "zoneKey": "central",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.87,
    "population": "240,000",
    "rainfall": "520 mm",
    "demand": "124 MLD",
    "groundwater": "-18.4 m",
    "shape": "292,202 322,198 335,226 308,232 292,216",
    "center": [
      312,
      214
    ],
    "fill": "#dc2626"
  },
  {
    "id": "district-8",
    "legacyId": "district-8",
    "districtNumber": 8,
    "wardNumber": 8,
    "name": "Whitefield",
    "zone": "East Bangalore",
    "zoneKey": "east",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.82,
    "population": "198,000",
    "rainfall": "525 mm",
    "demand": "112 MLD",
    "groundwater": "-17.5 m",
    "shape": "266,204 292,202 292,216 308,232 284,242 262,228",
    "center": [
      284,
      222
    ],
    "fill": "#ef4444"
  },
  {
    "id": "district-21",
    "legacyId": "district-21",
    "districtNumber": 21,
    "wardNumber": 21,
    "name": "Indiranagar",
    "zone": "Central Bangalore",
    "zoneKey": "central",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.76,
    "population": "175,000",
    "rainfall": "518 mm",
    "demand": "102 MLD",
    "groundwater": "-16.9 m",
    "shape": "284,242 308,232 326,248 304,260",
    "center": [
      305,
      245
    ],
    "fill": "#ea580c"
  },
  {
    "id": "district-4",
    "legacyId": "district-4",
    "districtNumber": 4,
    "wardNumber": 4,
    "name": "Electronic City",
    "zone": "South Bangalore",
    "zoneKey": "south",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.73,
    "population": "210,000",
    "rainfall": "530 mm",
    "demand": "116 MLD",
    "groundwater": "-17.1 m",
    "shape": "262,228 284,242 278,266 254,252",
    "center": [
      270,
      246
    ],
    "fill": "#f87171"
  },
  {
    "id": "district-17",
    "legacyId": "district-17",
    "districtNumber": 17,
    "wardNumber": 17,
    "name": "Bellandur",
    "zone": "East Bangalore",
    "zoneKey": "east",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.71,
    "population": "190,000",
    "rainfall": "515 mm",
    "demand": "108 MLD",
    "groundwater": "-16.5 m",
    "shape": "308,232 335,226 348,252 326,248",
    "center": [
      329,
      239
    ],
    "fill": "#f87171"
  },
  {
    "id": "district-13",
    "legacyId": "district-13",
    "districtNumber": 13,
    "wardNumber": 13,
    "name": "HSR Layout",
    "zone": "South Bangalore",
    "zoneKey": "south",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.85,
    "population": "215,000",
    "rainfall": "515 mm",
    "demand": "118 MLD",
    "groundwater": "-17.8 m",
    "shape": "272,176 304,172 322,198 292,202",
    "center": [
      297,
      187
    ],
    "fill": "#dc2626"
  },
  {
    "id": "district-14",
    "legacyId": "district-14",
    "districtNumber": 14,
    "wardNumber": 14,
    "name": "Marathahalli",
    "zone": "East Bangalore",
    "zoneKey": "east",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.81,
    "population": "195,000",
    "rainfall": "525 mm",
    "demand": "110 MLD",
    "groundwater": "-17.2 m",
    "shape": "246,182 272,176 292,202 266,204",
    "center": [
      269,
      191
    ],
    "fill": "#ef4444"
  },
  {
    "id": "district-15",
    "legacyId": "district-15",
    "districtNumber": 15,
    "wardNumber": 15,
    "name": "BTM Layout",
    "zone": "South Bangalore",
    "zoneKey": "south",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.79,
    "population": "180,000",
    "rainfall": "510 mm",
    "demand": "105 MLD",
    "groundwater": "-16.8 m",
    "shape": "304,172 338,170 354,196 322,198",
    "center": [
      329,
      184
    ],
    "fill": "#ea580c"
  },
  {
    "id": "district-16",
    "legacyId": "district-16",
    "districtNumber": 16,
    "wardNumber": 16,
    "name": "Sarjapur Road",
    "zone": "East Bangalore",
    "zoneKey": "east",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.74,
    "population": "205,000",
    "rainfall": "522 mm",
    "demand": "114 MLD",
    "groundwater": "-17.0 m",
    "shape": "322,198 354,196 362,224 335,226",
    "center": [
      343,
      211
    ],
    "fill": "#ef4444"
  },
  {
    "id": "district-18",
    "legacyId": "district-18",
    "districtNumber": 18,
    "wardNumber": 18,
    "name": "Varthur",
    "zone": "East Bangalore",
    "zoneKey": "east",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.69,
    "population": "165,000",
    "rainfall": "535 mm",
    "demand": "98 MLD",
    "groundwater": "-16.2 m",
    "shape": "278,266 304,260 298,284 270,286",
    "center": [
      287,
      274
    ],
    "fill": "#f87171"
  },
  {
    "id": "district-19",
    "legacyId": "district-19",
    "districtNumber": 19,
    "wardNumber": 19,
    "name": "Mahadevapura",
    "zone": "East Bangalore",
    "zoneKey": "east",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.67,
    "population": "155,000",
    "rainfall": "540 mm",
    "demand": "95 MLD",
    "groundwater": "-15.8 m",
    "shape": "304,260 326,248 340,270 318,280",
    "center": [
      322,
      264
    ],
    "fill": "#f87171"
  },
  {
    "id": "district-20",
    "legacyId": "district-20",
    "districtNumber": 20,
    "wardNumber": 20,
    "name": "Bommanahalli",
    "zone": "South Bangalore",
    "zoneKey": "south",
    "risk": "high",
    "riskLabel": "High Risk",
    "wsi": 0.65,
    "population": "170,000",
    "rainfall": "530 mm",
    "demand": "100 MLD",
    "groundwater": "-15.5 m",
    "shape": "254,252 278,266 270,286 244,272",
    "center": [
      261,
      269
    ],
    "fill": "#f87171"
  },
  {
    "id": "district-1",
    "legacyId": "district-1",
    "districtNumber": 1,
    "wardNumber": 1,
    "name": "Jayanagar",
    "zone": "South Bangalore",
    "zoneKey": "south",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.58,
    "population": "185,000",
    "rainfall": "570 mm",
    "demand": "94 MLD",
    "groundwater": "-14.8 m",
    "shape": "215,160 246,155 246,182 218,188",
    "center": [
      231,
      171
    ],
    "fill": "#f59e0b"
  },
  {
    "id": "district-3",
    "legacyId": "district-3",
    "districtNumber": 3,
    "wardNumber": 3,
    "name": "JP Nagar",
    "zone": "South Bangalore",
    "zoneKey": "south",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.55,
    "population": "172,000",
    "rainfall": "565 mm",
    "demand": "89 MLD",
    "groundwater": "-14.2 m",
    "shape": "188,185 218,188 224,218 194,215",
    "center": [
      206,
      201
    ],
    "fill": "#f59e0b"
  },
  {
    "id": "district-5",
    "legacyId": "district-5",
    "districtNumber": 5,
    "wardNumber": 5,
    "name": "Malleshwaram",
    "zone": "West Bangalore",
    "zoneKey": "west",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.52,
    "population": "168,000",
    "rainfall": "580 mm",
    "demand": "85 MLD",
    "groundwater": "-13.9 m",
    "shape": "218,188 246,182 266,204 262,228 232,224 224,218",
    "center": [
      241,
      207
    ],
    "fill": "#fbbf24"
  },
  {
    "id": "district-6",
    "legacyId": "district-6",
    "districtNumber": 6,
    "wardNumber": 6,
    "name": "Rajajinagar",
    "zone": "West Bangalore",
    "zoneKey": "west",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.49,
    "population": "160,000",
    "rainfall": "590 mm",
    "demand": "82 MLD",
    "groundwater": "-13.5 m",
    "shape": "194,215 224,218 232,224 222,252 192,246",
    "center": [
      213,
      231
    ],
    "fill": "#fbbf24"
  },
  {
    "id": "district-7",
    "legacyId": "district-7",
    "districtNumber": 7,
    "wardNumber": 7,
    "name": "Hebbal",
    "zone": "North Bangalore",
    "zoneKey": "north",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.48,
    "population": "155,000",
    "rainfall": "595 mm",
    "demand": "80 MLD",
    "groundwater": "-13.2 m",
    "shape": "222,252 232,224 254,252 244,272 220,274",
    "center": [
      234,
      255
    ],
    "fill": "#fcd34d"
  },
  {
    "id": "district-9",
    "legacyId": "district-9",
    "districtNumber": 9,
    "wardNumber": 9,
    "name": "Banaswadi",
    "zone": "North Bangalore",
    "zoneKey": "north",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.54,
    "population": "178,000",
    "rainfall": "575 mm",
    "demand": "91 MLD",
    "groundwater": "-14.0 m",
    "shape": "246,155 278,148 272,176 246,182",
    "center": [
      260,
      165
    ],
    "fill": "#f59e0b"
  },
  {
    "id": "district-10",
    "legacyId": "district-10",
    "districtNumber": 10,
    "wardNumber": 10,
    "name": "Basavanagudi",
    "zone": "South Bangalore",
    "zoneKey": "south",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.51,
    "population": "166,000",
    "rainfall": "585 mm",
    "demand": "86 MLD",
    "groundwater": "-13.7 m",
    "shape": "278,148 312,145 304,172 272,176",
    "center": [
      292,
      160
    ],
    "fill": "#fcd34d"
  },
  {
    "id": "district-11",
    "legacyId": "district-11",
    "districtNumber": 11,
    "wardNumber": 11,
    "name": "Vijayanagar",
    "zone": "West Bangalore",
    "zoneKey": "west",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.47,
    "population": "158,000",
    "rainfall": "590 mm",
    "demand": "83 MLD",
    "groundwater": "-13.1 m",
    "shape": "312,145 344,142 338,170 304,172",
    "center": [
      324,
      157
    ],
    "fill": "#fde68a"
  },
  {
    "id": "district-22",
    "legacyId": "district-22",
    "districtNumber": 22,
    "wardNumber": 22,
    "name": "KR Puram",
    "zone": "East Bangalore",
    "zoneKey": "east",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.59,
    "population": "192,000",
    "rainfall": "560 mm",
    "demand": "96 MLD",
    "groundwater": "-15.1 m",
    "shape": "338,170 374,166 384,198 354,196",
    "center": [
      362,
      182
    ],
    "fill": "#f59e0b"
  },
  {
    "id": "district-23",
    "legacyId": "district-23",
    "districtNumber": 23,
    "wardNumber": 23,
    "name": "Shivajinagar",
    "zone": "Central Bangalore",
    "zoneKey": "central",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.56,
    "population": "184,000",
    "rainfall": "570 mm",
    "demand": "92 MLD",
    "groundwater": "-14.6 m",
    "shape": "354,196 384,198 392,230 362,224",
    "center": [
      373,
      212
    ],
    "fill": "#fbbf24"
  },
  {
    "id": "district-24",
    "legacyId": "district-24",
    "districtNumber": 24,
    "wardNumber": 24,
    "name": "Yeshwanthpur",
    "zone": "North Bangalore",
    "zoneKey": "north",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.53,
    "population": "176,000",
    "rainfall": "575 mm",
    "demand": "88 MLD",
    "groundwater": "-14.1 m",
    "shape": "335,226 362,224 372,256 348,252",
    "center": [
      354,
      239
    ],
    "fill": "#fcd34d"
  },
  {
    "id": "district-25",
    "legacyId": "district-25",
    "districtNumber": 25,
    "wardNumber": 25,
    "name": "Dasarahalli",
    "zone": "West Bangalore",
    "zoneKey": "west",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.46,
    "population": "152,000",
    "rainfall": "600 mm",
    "demand": "78 MLD",
    "groundwater": "-12.8 m",
    "shape": "348,252 372,256 380,288 352,284",
    "center": [
      363,
      270
    ],
    "fill": "#fde68a"
  },
  {
    "id": "district-26",
    "legacyId": "district-26",
    "districtNumber": 26,
    "wardNumber": 26,
    "name": "Hennur",
    "zone": "North Bangalore",
    "zoneKey": "north",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.5,
    "population": "164,000",
    "rainfall": "585 mm",
    "demand": "84 MLD",
    "groundwater": "-13.4 m",
    "shape": "326,248 348,252 352,284 340,270",
    "center": [
      341,
      263
    ],
    "fill": "#fcd34d"
  },
  {
    "id": "district-27",
    "legacyId": "district-27",
    "districtNumber": 27,
    "wardNumber": 27,
    "name": "Thanisandra",
    "zone": "North Bangalore",
    "zoneKey": "north",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.45,
    "population": "148,000",
    "rainfall": "605 mm",
    "demand": "76 MLD",
    "groundwater": "-12.6 m",
    "shape": "318,280 340,270 352,284 336,306",
    "center": [
      336,
      285
    ],
    "fill": "#fde68a"
  },
  {
    "id": "district-28",
    "legacyId": "district-28",
    "districtNumber": 28,
    "wardNumber": 28,
    "name": "Richmond Town",
    "zone": "Central Bangalore",
    "zoneKey": "central",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.57,
    "population": "188,000",
    "rainfall": "565 mm",
    "demand": "95 MLD",
    "groundwater": "-14.9 m",
    "shape": "298,284 318,280 336,306 312,314",
    "center": [
      316,
      296
    ],
    "fill": "#f59e0b"
  },
  {
    "id": "district-29",
    "legacyId": "district-29",
    "districtNumber": 29,
    "wardNumber": 29,
    "name": "Frazer Town",
    "zone": "Central Bangalore",
    "zoneKey": "central",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.54,
    "population": "174,000",
    "rainfall": "580 mm",
    "demand": "89 MLD",
    "groundwater": "-14.3 m",
    "shape": "270,286 298,284 312,314 286,322",
    "center": [
      291,
      301
    ],
    "fill": "#fbbf24"
  },
  {
    "id": "district-30",
    "legacyId": "district-30",
    "districtNumber": 30,
    "wardNumber": 30,
    "name": "CV Raman Nagar",
    "zone": "East Bangalore",
    "zoneKey": "east",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.51,
    "population": "162,000",
    "rainfall": "590 mm",
    "demand": "83 MLD",
    "groundwater": "-13.8 m",
    "shape": "244,272 270,286 286,322 258,312",
    "center": [
      264,
      298
    ],
    "fill": "#fcd34d"
  },
  {
    "id": "district-31",
    "legacyId": "district-31",
    "districtNumber": 31,
    "wardNumber": 31,
    "name": "Domlur",
    "zone": "Central Bangalore",
    "zoneKey": "central",
    "risk": "moderate",
    "riskLabel": "Moderate Risk",
    "wsi": 0.44,
    "population": "145,000",
    "rainfall": "610 mm",
    "demand": "74 MLD",
    "groundwater": "-12.4 m",
    "shape": "220,274 244,272 258,312 232,308",
    "center": [
      238,
      291
    ],
    "fill": "#fde68a"
  },
  {
    "id": "district-2",
    "legacyId": "district-2",
    "districtNumber": 2,
    "wardNumber": 2,
    "name": "Yelahanka",
    "zone": "North Bangalore",
    "zoneKey": "north",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.28,
    "population": "135,000",
    "rainfall": "640 mm",
    "demand": "68 MLD",
    "groundwater": "-10.5 m",
    "shape": "248,118 285,112 278,148 246,155",
    "center": [
      264,
      133
    ],
    "fill": "#10b981"
  },
  {
    "id": "district-32",
    "legacyId": "district-32",
    "districtNumber": 32,
    "wardNumber": 32,
    "name": "Kengeri",
    "zone": "West Bangalore",
    "zoneKey": "west",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.24,
    "population": "128,000",
    "rainfall": "660 mm",
    "demand": "62 MLD",
    "groundwater": "-9.8 m",
    "shape": "285,112 322,110 312,145 278,148",
    "center": [
      299,
      128
    ],
    "fill": "#10b981"
  },
  {
    "id": "district-33",
    "legacyId": "district-33",
    "districtNumber": 33,
    "wardNumber": 33,
    "name": "RR Nagar",
    "zone": "West Bangalore",
    "zoneKey": "west",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.22,
    "population": "120,000",
    "rainfall": "675 mm",
    "demand": "58 MLD",
    "groundwater": "-9.2 m",
    "shape": "322,110 358,112 344,142 312,145",
    "center": [
      334,
      127
    ],
    "fill": "#34d399"
  },
  {
    "id": "district-34",
    "legacyId": "district-34",
    "districtNumber": 34,
    "wardNumber": 34,
    "name": "Vidyaranyapura",
    "zone": "North Bangalore",
    "zoneKey": "north",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.29,
    "population": "140,000",
    "rainfall": "630 mm",
    "demand": "70 MLD",
    "groundwater": "-11.0 m",
    "shape": "215,124 248,118 246,155 215,160",
    "center": [
      231,
      139
    ],
    "fill": "#10b981"
  },
  {
    "id": "district-35",
    "legacyId": "district-35",
    "districtNumber": 35,
    "wardNumber": 35,
    "name": "Jalahalli",
    "zone": "North Bangalore",
    "zoneKey": "north",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.26,
    "population": "132,000",
    "rainfall": "650 mm",
    "demand": "65 MLD",
    "groundwater": "-10.2 m",
    "shape": "182,140 215,124 215,160 185,172",
    "center": [
      199,
      149
    ],
    "fill": "#34d399"
  },
  {
    "id": "district-36",
    "legacyId": "district-36",
    "districtNumber": 36,
    "wardNumber": 36,
    "name": "Nagarbhavi",
    "zone": "West Bangalore",
    "zoneKey": "west",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.27,
    "population": "136,000",
    "rainfall": "645 mm",
    "demand": "67 MLD",
    "groundwater": "-10.7 m",
    "shape": "162,175 188,185 194,215 166,212",
    "center": [
      177,
      196
    ],
    "fill": "#34d399"
  },
  {
    "id": "district-37",
    "legacyId": "district-37",
    "districtNumber": 37,
    "wardNumber": 37,
    "name": "Bannerghatta",
    "zone": "South Bangalore",
    "zoneKey": "south",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.25,
    "population": "130,000",
    "rainfall": "655 mm",
    "demand": "64 MLD",
    "groundwater": "-10.0 m",
    "shape": "166,212 194,215 192,246 162,242",
    "center": [
      178,
      228
    ],
    "fill": "#45bd9b"
  },
  {
    "id": "district-38",
    "legacyId": "district-38",
    "districtNumber": 38,
    "wardNumber": 38,
    "name": "Kanakapura Road",
    "zone": "South Bangalore",
    "zoneKey": "south",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.23,
    "population": "124,000",
    "rainfall": "670 mm",
    "demand": "60 MLD",
    "groundwater": "-9.5 m",
    "shape": "162,242 192,246 188,276 158,268",
    "center": [
      175,
      258
    ],
    "fill": "#6ee7b7"
  },
  {
    "id": "district-39",
    "legacyId": "district-39",
    "districtNumber": 39,
    "wardNumber": 39,
    "name": "Magadi Road",
    "zone": "West Bangalore",
    "zoneKey": "west",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.28,
    "population": "138,000",
    "rainfall": "635 mm",
    "demand": "69 MLD",
    "groundwater": "-10.9 m",
    "shape": "258,312 286,322 280,356 250,348",
    "center": [
      268,
      334
    ],
    "fill": "#10b981"
  },
  {
    "id": "district-40",
    "legacyId": "district-40",
    "districtNumber": 40,
    "wardNumber": 40,
    "name": "Sadashivanagar",
    "zone": "North Bangalore",
    "zoneKey": "north",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.25,
    "population": "131,000",
    "rainfall": "655 mm",
    "demand": "63 MLD",
    "groundwater": "-10.1 m",
    "shape": "286,322 312,314 308,348 280,356",
    "center": [
      296,
      335
    ],
    "fill": "#34d399"
  },
  {
    "id": "district-41",
    "legacyId": "district-41",
    "districtNumber": 41,
    "wardNumber": 41,
    "name": "Ulsoor",
    "zone": "Central Bangalore",
    "zoneKey": "central",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.21,
    "population": "118,000",
    "rainfall": "680 mm",
    "demand": "56 MLD",
    "groundwater": "-9.0 m",
    "shape": "250,348 280,356 272,392 240,382",
    "center": [
      260,
      369
    ],
    "fill": "#6ee7b7"
  },
  {
    "id": "district-42",
    "legacyId": "district-42",
    "districtNumber": 42,
    "wardNumber": 42,
    "name": "Peenya Industrial",
    "zone": "West Bangalore",
    "zoneKey": "west",
    "risk": "low",
    "riskLabel": "Low Risk",
    "wsi": 0.19,
    "population": "112,000",
    "rainfall": "690 mm",
    "demand": "52 MLD",
    "groundwater": "-8.6 m",
    "shape": "280,356 308,348 300,385 272,392",
    "center": [
      290,
      370
    ],
    "fill": "#a7f3d0"
  }
]

// Backward-compatibility aliases:
export const DELHI_DASHBOARD_REGIONS = BANGALORE_DASHBOARD_REGIONS
export const DELHI_DASHBOARD_WARDS = BANGALORE_DASHBOARD_DISTRICTS

