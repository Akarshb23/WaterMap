/**
 * WaterMap BrandMark - Official teardrop water-stress gradient brand logo
 * featuring a three-stop gradient (#2f8dff -> #12b2c0 -> #0ba984) and inner highlight arc.
 */
export const BrandMark = ({ id = 'wm-drop-mark', size = 26, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id={id} x1="5" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2f8dff" />
        <stop offset="0.55" stopColor="#12b2c0" />
        <stop offset="1" stopColor="#0ba984" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.2c-.4 0-.8.2-1 .5C8.4 6.2 4.8 10.4 4.8 14.6a7.2 7.2 0 0 0 14.4 0c0-4.2-3.6-8.4-6.2-11.9-.2-.3-.6-.5-1-.5Z"
      fill={`url(#${id})`}
    />
    <path
      d="M8.6 15.2a3.6 3.6 0 0 0 3.4 3.4"
      fill="none"
      stroke="#fff"
      strokeOpacity=".75"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

export default BrandMark
