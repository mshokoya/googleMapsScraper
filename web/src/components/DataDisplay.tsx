import {useContext} from 'react'
import {GlobalContext} from '../core/context';

interface DataDisplayProps {
  selectedID: string
}

export const DataDisplay = ({selectedID}: DataDisplayProps) => {
  const { data } = useContext(GlobalContext);


  if (!data[selectedID]) {
    console.log('eeyyaa')
    return (<div className="bg-[#3c3c50] flex-auto"> Start Scraping </div>)
  }


  const tableColTitle = data[selectedID].length 
    ? <tr>{ Object.keys(data[selectedID][0]).map(c => <th>{ c }</th>) }</tr>
    : "... Getting Results, Beep Boop ..."

  const tableRowsData = data[selectedID].map((dataObj) => {
    // const data = Object.keys(dataObj).map(v => <td>{dataObj[v]}</td>)
    const data = Object.values(dataObj).map(v => <td>{ v }</td>)
    
    return <tr>{ data }</tr>
  })

  return (
    <div className="bg-[#3c3c50] flex-auto overflow-scroll">
      <table>
        {tableColTitle}
        {tableRowsData}
      </table>
    </div>
  )
}