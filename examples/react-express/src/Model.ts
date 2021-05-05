import { Routes } from '@mpajunen/rest-type-map'

export const shipSizes = ['small', 'medium', 'large', 'huge'] as const

export type ShipSize = typeof shipSizes[number]

export interface Ship {
  id: number
  name: string
  size: ShipSize
}

const routes = {
  addShip: { method: 'post', pattern: '' },
  editShip: { method: 'put', pattern: '/:id' },
  getShip: { method: 'get', pattern: '/:id' },
  getShips: { method: 'get', pattern: '' },
  removeShip: { method: 'delete', pattern: '/:id' },
} as const

export const shipRoutes: Routes<ShipApi> = routes

export type ShipApi = typeof routes & {
  addShip: {
    path: undefined
    body: Omit<Ship, 'id'>
    result: Ship
  }
  editShip: {
    path: { id: number }
    body: Omit<Ship, 'id'>
    result: Ship
  }
  getShip: {
    path: { id: number }
    body: undefined
    result: Ship
  }
  getShips: {
    path: undefined
    body: undefined
    result: Ship[]
  }
  removeShip: {
    path: { id: number }
    body: undefined
    result: void
  }
}
