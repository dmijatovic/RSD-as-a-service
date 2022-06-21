import React, {useEffect, useState} from 'react'
import {ClickAwayListener} from '@mui/base'
import {useRouter} from 'next/router'
import {getGlobalSearch} from '~/components/GlobalSearchAutocomplete/getGlobalSearch.api'
import {useAuth} from '~/auth'

export default function GlobalSearchAutocomplete() {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [selected, setSelected] = useState(0)
  const [searchResults, setSearchResults] = useState([])

  const {session} = useAuth()

  useEffect(() => {
    // when value changes, request autocomplete
    // Call function to find matches
    if (value === '') {
      setOpen(false)
      setSelected(0)
      return
    }
  }, [value])

  function handleClick() {
    router.push('/'+ searchResults[selected].source + '/' + searchResults[selected].slug)
    setSelected(0)
    setOpen(false)
    setValue('')
  }

  // Handle keyup
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setOpen(true)
    // Handle arrow up and down
    switch (e.keyCode) {
      // Backspace
      case 8:
        // Remove selection
        setSelected(-1)
        break
      // Up arrow
      case 38:
        e.preventDefault() // Disallows the cursor to move to the end of the input
        selected > 0 && setSelected(selected - 1)
        break
      // Down arrow
      case 40:
        e.preventDefault() // Disallows the cursor to move to the end of the input
        searchResults.length - 1 > selected && setSelected(selected + 1)
        break
      // Enter
      case 13:
        handleClick()
        break
      // Escape key
      case 27:
        setOpen(false)
        break
    }
  }

  const handleChange = async (e: React.FormEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value
    // Update state
    setValue(search)
    // Fetch api
    const data = await getGlobalSearch(search, session.token) || []
    setSearchResults([...data])
  }
  return (
    <ClickAwayListener onClickAway={() => {
      setOpen(false)
    }}>

      <div
        className="ml-24 peer group z-10 flex relative ml-auto max-w-24  transition-all duration-700">
        <input className="px-5 py-3 bg-transparent rounded-sm border focus:outline-0
                          text-white
                          w-36 focus:w-full focus:bg-white focus:text-black
                          duration-500
                          "
               placeholder="Search or jump to"
               autoComplete="off"
               value={value}
               onChange={handleChange}
               onKeyDown={handleKeyDown}
               type="search"
        />


        {isOpen &&
          <div
            className="shadow-xl absolute top-[50px] w-full left-0 min-w-max bg-white text-black py-2 rounded">
            {searchResults.map((item, index) =>
              <div key={index}
                   className={`${selected === index && 'bg-[#09A1E3]'} flex gap-2 p-2 cursor-pointer transition justify-between items-center`}
                   onClick={handleClick}
                   onMouseEnter={() => setSelected(index)}
              >
                <div className="flex gap-3">
                  {/*<pre>{JSON.stringify(searchResults, null, 2)}</pre>*/}
                  {item.source === 'software' &&
                    <svg className="" width="22" viewBox="0 0 18 18" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8.98438" cy="9.10718" r="8.22705" stroke="currentColor"/>
                    </svg>
                  }
                  {item.source === 'projects' &&
                    <svg width="18" height="18" viewBox="0 0 28 28" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" y="0.5" width="27" height="27" stroke="black"/>
                    </svg>
                  }
                  {item.source === 'organisations' &&
                    <svg width="21" height="18" viewBox="0 0 21 18" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.40673 16.75L10.5 1L19.5933 16.75H1.40673Z" stroke="black"/>
                    </svg>
                  }
                  {item.source} - {item.name}
                </div>

                {selected === index &&
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 0C5.28261 0 4.69565 0.586957 4.69565 1.30435V4.69565H1.30435C0.586957 4.69565 0 5.28261 0 6V10.6957C0 11.413 0.586957 12 1.30435 12H10.6957C11.413 12 12 11.413 12 10.6957V1.30435C12 0.586957 11.413 0 10.6957 0H6ZM6 0.521739H10.6957C11.1308 0.521739 11.4783 0.869225 11.4783 1.30435V10.6957C11.4783 11.1308 11.1308 11.4783 10.6957 11.4783H1.30435C0.869225 11.4783 0.521739 11.1308 0.521739 10.6957V6C0.521739 5.56488 0.869225 5.21739 1.30435 5.21739H4.69565C4.98098 5.21739 5.21739 4.98098 5.21739 4.69565V1.30435C5.21739 0.869225 5.56488 0.521739 6 0.521739ZM8.32337 3.38315C8.31216 3.38519 8.30095 3.38825 8.29076 3.3913C8.1695 3.41882 8.0839 3.52785 8.08696 3.65217V6.78261C8.08696 7.50611 7.50611 8.08696 6.78261 8.08696H2.9837L4.10054 6.97011C4.18512 6.89164 4.20754 6.76732 4.15659 6.6644C4.10666 6.56046 3.99355 6.5034 3.88043 6.52174C3.82235 6.52785 3.76732 6.55435 3.72554 6.59511L2.20109 8.12772C2.18682 8.13689 2.17255 8.1481 2.16033 8.16033C2.15421 8.16542 2.14912 8.17052 2.14402 8.17663C2.13179 8.19192 2.12058 8.20822 2.11141 8.22554C2.10836 8.23064 2.1053 8.23675 2.10326 8.24185C2.10326 8.2449 2.10326 8.24694 2.10326 8.25C2.1002 8.25509 2.09715 8.26121 2.09511 8.2663C2.09205 8.27649 2.08899 8.2877 2.08696 8.29891C2.08288 8.32643 2.08288 8.35292 2.08696 8.38043C2.08696 8.38553 2.08696 8.39164 2.08696 8.39674C2.08696 8.3998 2.08696 8.40183 2.08696 8.40489C2.08899 8.40999 2.09205 8.4161 2.09511 8.4212C2.09511 8.42425 2.09511 8.42629 2.09511 8.42935C2.09715 8.43444 2.1002 8.44056 2.10326 8.44565C2.1053 8.45075 2.10836 8.45686 2.11141 8.46196C2.11141 8.46501 2.11141 8.46705 2.11141 8.47011C2.12058 8.48743 2.13179 8.50374 2.14402 8.51902C2.14912 8.52514 2.15421 8.53023 2.16033 8.53533C2.16848 8.54144 2.17663 8.54654 2.18478 8.55163L3.72554 10.1005C3.82948 10.2045 3.9966 10.2045 4.10054 10.1005C4.20448 9.9966 4.20448 9.82948 4.10054 9.72554L2.9837 8.6087H6.78261C7.78838 8.6087 8.6087 7.78838 8.6087 6.78261V3.65217C8.61175 3.57677 8.58118 3.50442 8.52717 3.45346C8.47215 3.40149 8.39776 3.37602 8.32337 3.38315Z"
                      fill="black"/>
                  </svg>
                }
              </div>
            )}
          </div>
        }
      </div>


    </ClickAwayListener>
  )
}
