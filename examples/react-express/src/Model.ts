import { Routes } from '@mpajunen/rest-type-map'

export const shipSizes = ['small', 'medium', 'large', 'huge'] as const

export type ShipSize = typeof shipSizes[number]

export interface Ship {
  id: number
  name: string
  size: ShipSize
}

const routes = {
  addShip: { method: 'post', path: '' },
  editShip: { method: 'put', path: '/:id' },
  getShip: { method: 'get', path: '/:id' },
  getShips: { method: 'get', path: '' },
  removeShip: { method: 'delete', path: '/:id' },
} as const

export const shipRoutes: Routes<ShipApi> = routes

export type ShipApi = typeof routes & {
  addShip: {
    params: { path: undefined, body: Omit<Ship, 'id'> }
    result: Ship
  }
  editShip: {
    params: { path: { id: number }, body: Omit<Ship, 'id'> }
    result: Ship
  }
  getShip: {
    params: { path: { id: number }, body: undefined }
    result: Ship
  }
  getShips: {
    params: { path: undefined, body: undefined }
    result: Ship[]
  }
  removeShip: {
    params: { path: { id: number }, body: undefined }
    result: void
  }
}
