import React, { useEffect, useState } from 'react'
import { api } from './api'
import './App.css'
import { Ship } from './Model'
import ShipForm from './ShipForm'
import ShipList from './ShipList'

const App: React.FC = () => {
  const [ships, setShips] = useState<Record<number, Ship>>({})
  const [activeId, setActive] = useState<number | undefined>()

  useEffect(
    () => {
      api.getShips().then(all => setShips(Object.fromEntries(all.map((s: Ship) => [s.id, s]))))
    },
    [],
  )

  const setShip = (ship: Ship) => {
    setShips(previous => ({ ...previous, [ship.id]: ship }))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rest Type Map Example</h1>
      </header>
      <div>
        <h2>Ships</h2>
        <button onClick={() => setActive(undefined)}>Add new</button>
      </div>
      <div>
        <ShipList activate={setActive} ships={Object.values(ships)} />
        <ShipForm key={activeId} setShip={setShip} ship={activeId ? ships[activeId] : undefined} />
      </div>
    </div>
  )
}

export default App
