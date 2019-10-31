import React, { useState } from 'react'
import { api } from './api'
import './App.css'
import { Ship, shipSizes } from './Model'

interface Props {
  setShip: (ship: Ship) => void
  ship: Ship | undefined
}

type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>

const ShipForm: React.FC<Props> = ({ setShip, ship }) => {
  const [values, setValues] = useState<Omit<Ship, 'id'>>(ship || { name: '', size: 'small' })

  const setField = (fieldName: keyof Ship) => (e: ChangeEvent) => {
    const { value } = e.target

    setValues(previous => ({ ...previous, [fieldName]: value }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (ship) {
      api.editShip({ id: ship.id }, values).then(setShip)
    } else {
      api.addShip(undefined, values).then(setShip)
    }
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="ship-name">Name</label>
        <input id="ship-name" onChange={setField('name')} value={values.name} />
      </div>
      <div>
        <label htmlFor="ship-size">Size</label>
        <select id="ship-size" onChange={setField('size')} value={values.size}>
          {shipSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <div>
        <button type="submit">Save</button>
      </div>
    </form>
  )
}

export default ShipForm
