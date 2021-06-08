import { Routes } from '@mpajunen/rest-type-map'

export const shipSizes = ['small', 'medium', 'large', 'huge'] as const

export type ShipSize = typeof shipSizes[number]

export type ShipFeatures = {
  name: string
  size: ShipSize
}

export type Ship = { id: number } & ShipFeatures

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
    body: ShipFeatures
    result: Ship
  }
  editShip: {
    path: { id: number }
    body: ShipFeatures
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
