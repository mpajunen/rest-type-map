import { Client } from '@mpajunen/rest-type-map'
import axios from 'axios'
import { shipRoutes } from './Model'

export const api = Client.createHandlers(axios.create({ baseURL: '/api/ships' }), shipRoutes)
