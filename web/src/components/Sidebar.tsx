import { FormEvent, useState, useContext, Dispatch } from 'react'
import {GlobalContext} from '../core/context';


interface SidebarProps {
  setSelectedID: Dispatch<React.SetStateAction<string>>
}

export const Sidebar = ({ setSelectedID }: SidebarProps) => {
  const [search, setSearch] = useState('')
  const { scrapeUrl, isScraping, newSearchField, data } = useContext(GlobalContext)

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!search) return

    const d = scrapeUrl(search)
    newSearchField(d)
    setSelectedID(d.id)
  }

  const searchHistory = () => (
    <>
      {
        Object.keys(data).map((id: string, idx: number) => {
          return (
            <div key={idx}>
              <button onClick={() => setSelectedID(id)} >{id}</button>
            </div>
          )
        })
      }
    </>
  )

  return (
    <div className="bg-black text-white">
      <form onSubmit={handleSearch}>
        <input value={search} onChange={(e) => { setSearch(e.currentTarget.value) }} />
        <input type='submit' value='search' disabled={isScraping.status} />
      </form>
      
      <div>
        {searchHistory()}
      </div>
    </div>
  )
}