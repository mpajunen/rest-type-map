import React from 'react'
import { Ship } from '../common/model'
import './App.css'

interface Props {
  activate: (shipId: number) => void
  ships: Ship[]
}

const ShipList: React.FC<Props> = ({ activate, ships }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {ships.map(s => (
          <tr key={s.id}>
            <td>{s.name}</td>
            <td>{s.size}</td>
            <td><button onClick={() => activate(s.id)}>Edit</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ShipList
