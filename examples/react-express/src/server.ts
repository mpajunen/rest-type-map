import { addServerApi, ServerHandlers } from '@mpajunen/rest-type-map'
import bodyParser from 'body-parser'
import express, { Router } from 'express'
import { Ship, ShipApi, shipRoutes } from './Model'
import { createStore, Store } from './serverStore'

const createHandlers = (store: Store<Ship>): ServerHandlers<ShipApi> => ({
  getShips: async () => store.getAll(),
  getShip: async ({ path }) => store.get(parseInt(path.id)),
  addShip: async ({ body }) => store.add(body),
  editShip: async ({ path, body }) => store.edit(parseInt(path.id), body),
  removeShip: async ({ path }) => store.remove(parseInt(path.id)),
})

const initialShips: Omit<Ship, 'id'>[] = [
  { name: 'Millennium Falcon', size: 'medium' },
]

function startApp() {
  const router = Router()
  const store = createStore(initialShips)

  addServerApi(router, shipRoutes, createHandlers(store))

  express()
    .use(bodyParser.json())
    .use('/api/ships', router)
    .listen(3101)
}

startApp()
