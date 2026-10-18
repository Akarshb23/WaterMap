import { useId } from 'react'

/** Lightweight, self-contained illustrative ward map matching WaterMap's visual language. */
const WardRiskIllustration = ({ variant = 'city', satellite = false }) => {
  const id = useId().replace(/:/g, '')
  const cells = [
    [ [184,42,238,30,258,66,220,84], [238,30,292,39,303,76,258,66], [292,39,334,67,320,104,303,76], [334,67,365,104,338,132,320,104] ],
    [ [160,78,220,84,214,126,174,142], [220,84,258,66,276,108,214,126], [258,66,303,76,315,118,276,108], [303,76,320,104,315,145,276,108], [320,104,338,132,315,163,315,145] ],
    [ [174,142,214,126,226,166,184,188], [214,126,276,108,280,152,226,166], [276,108,315,145,292,184,280,152], [315,145,315,163,292,184], [338,132,365,104,379,146,346,171] ],
    [ [184,188,226,166,238,205,202,229], [226,166,280,152,292,184,238,205], [292,184,315,163,328,204,292,222], [238,205,292,222,274,252,232,245], [292,222,328,204,342,238,302,260] ],
    [ [202,229,238,205,232,245,216,276], [232,245,274,252,270,287,234,302], [274,252,302,260,306,294,270,287], [302,260,342,238,351,276,306,294] ],
  ]
  const colors = ['#44c89b', '#9bdc9d', '#ffd166', '#ffad66', '#fa6b58', '#35c79a', '#ffcc69']
  return (
    <div className={`ward-risk-illustration${satellite ? ' ward-risk-illustration--satellite' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 440 330" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <pattern id={`${id}-blocks`} width="34" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
            <rect width="34" height="28" fill={satellite ? '#b9c7b8' : '#f7f7ee'} />
            <path d="M0 8H34 M10 0V28" stroke={satellite ? '#829687' : '#d8e2d9'} strokeWidth="1.1" />
            <path d="M22 8V20 M0 20H22" stroke={satellite ? '#91a596' : '#e4e9df'} strokeWidth="2" />
          </pattern>
          <linearGradient id={`${id}-river`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a6e1f8"/><stop offset="1" stopColor="#57bce8"/></linearGradient>
        </defs>
        <rect width="440" height="330" fill={satellite ? '#d6dfd0' : '#f3f5e9'} />
        <rect width="440" height="330" fill={`url(#${id}-blocks)`} opacity=".96" />
        <path d="M0 46 C85 64 112 2 178 34 S278 91 440 10 M0 255 C90 218 116 286 208 248 S340 210 440 266 M68 0 C82 92 45 152 102 210 S145 286 126 330 M350 0 C312 84 378 128 338 194 S375 279 354 330" fill="none" stroke="#fff" strokeWidth="8" opacity=".9" />
        <path d="M353 -10 C328 38 362 65 346 101 S365 160 341 194 S360 252 333 340 L390 340 C414 269 390 237 408 198 S395 130 415 95 S393 34 423 -10Z" fill={`url(#${id}-river)`} opacity=".92" />
        <path d="M369 -10 C344 40 378 65 362 101 S381 160 357 194 S376 252 349 340" fill="none" stroke="#e7f8ff" strokeWidth="3" />
        <g stroke="#fff" strokeWidth="2.2" strokeLinejoin="round">
          {cells.flatMap((row, ri) => row.map((points, ci) => {
            const value = (ri * 3 + ci * 2) % colors.length
            const shifted = points.map((n, i) => i % 2 === 0 ? n + (ri % 2 ? -18 : 0) : n + (ci % 2 ? 5 : 0))
            return <polygon key={`${ri}-${ci}`} points={Array.from({ length: shifted.length / 2 }, (_, i) => `${shifted[i * 2]},${shifted[i * 2 + 1]}`).join(' ')} fill={colors[value]} fillOpacity={satellite ? '.72' : '.9'} />
          }))}
        </g>
        <path d="M144 84 L220 58 L291 76 L332 132 L314 204 L286 248 L230 275 L184 240 L154 184Z" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
        <path d="M144 84 L220 58 L291 76 L332 132 L314 204 L286 248 L230 275 L184 240 L154 184Z" fill="#f04444" fillOpacity=".08" />
        <g fill="#344b5b" fontSize="10" fontWeight="700" letterSpacing=".8"><text x="202" y="18">NORTH DELHI</text><text x="16" y="172">WEST DELHI</text><text x="351" y="174">EAST DELHI</text><text x="172" y="315">SOUTH DELHI</text><text x="195" y="187">CENTRAL</text><text x="202" y="199">DELHI</text></g>
      </svg>
    </div>
  )
}

export default WardRiskIllustration
