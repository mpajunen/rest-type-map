import { Server } from '@mpajunen/rest-type-map'
import bodyParser from 'body-parser'
import express, { Router } from 'express'
import { ShipApi, ShipFeatures, shipRoutes } from '../common/model'
import { createStore, Store } from './store'

const createHandlers = (store: Store<ShipFeatures>): Server.Handlers<ShipApi> => ({
  getShips: async () => store.getAll(),
  getShip: async ({ path }) => store.get(parseInt(path.id)),
  addShip: async ({ body }) => store.add(body),
  editShip: async ({ path, body }) => store.edit(parseInt(path.id), body),
  removeShip: async ({ path }) => store.remove(parseInt(path.id)),
})

const initialShips: ShipFeatures[] = [
  { name: 'Millennium Falcon', size: 'medium' },
]

function startApp() {
  const router = Router()
  const store = createStore(initialShips)

  Server.addHandlers(router, shipRoutes, createHandlers(store))

  express()
    .use(bodyParser.json())
    .use('/api/ships', router)
    .listen(3101)
}

startApp()
