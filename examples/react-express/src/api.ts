import { createClientApi } from '@mpajunen/rest-type-map'
import axios from 'axios'
import { shipRoutes } from './Model'

export const api = createClientApi(axios.create({ baseURL: '/api/ships' }), shipRoutes)
