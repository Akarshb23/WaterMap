/**
 * Controlled search input. Pair it with `useDebounce` in the caller when
 * the query drives an API request.
 */
const SearchBar = ({ value, onChange, placeholder = 'Search', className = '', ...rest }) => {
  const classes = ['search-bar', className].filter(Boolean).join(' ')
  return (
    <input
      type="search"
      className={classes}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
    />
  )
}

export default SearchBar
