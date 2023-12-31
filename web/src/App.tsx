import { Sidebar } from "./components/Sidebar"
import { DataDisplay } from "./components/DataDisplay"
import { useState } from "react"

function App() {
  const [selectedID, setSelectedID] = useState('')

  return (
    <div className="flex h-screen">
      <Sidebar setSelectedID={setSelectedID} />
      <DataDisplay selectedID={selectedID} />
    </div>
  )
}

export default App
