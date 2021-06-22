import { Routes } from '@mpajunen/rest-type-map'

// Data model

export const shipSizes = ['small', 'medium', 'large', 'huge'] as const

export type ShipSize = typeof shipSizes[number]

export type ShipFeatures = {
  name: string
  size: ShipSize
}

export type Ship = { id: number } & ShipFeatures

// API model

const routes = {
  addShip: { method: 'post', pattern: '' },
  editShip: { method: 'put', pattern: '/:id' },
  getShip: { method: 'get', pattern: '/:id' },
  getShips: { method: 'get', pattern: '' },
  removeShip: { method: 'delete', pattern: '/:id' },
} as const

export const shipRoutes: Routes<ShipApi> = routes

type ShipHandlers = {
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

export type ShipApi = typeof routes & ShipHandlers
