
import axios from 'axios'

import AuthService from '../../auth/services/AuthService'

const urlBase = 'http://localhost:8080/musics'
const api = axios.create()
const authService = new AuthService()

api.interceptors.request.use(req => {
  req.headers.Authorization = `Bearer ${authService.getToken()}`
  return req
}, error => {
  return Promise.reject(error)
})

export default class MusicService {

  getAllMusics(page) {
    return api.get(`${urlBase}?page=${page}&size=5`)
  }

  save(music) {
    return api.post(urlBase, music)
  }

  edit(music) {
    return api.put(`${urlBase}/${music.id}`, music)
  }

  delete(id) {
    return api.delete(`${urlBase}/${id}`)
  }

  countDeletedMusics() {
    return api.get(`${urlBase}/deleted/count`)
  }

  getAllDeletedMusic(page) {
    return api.get(`${urlBase}/deleted?page=${page}&size=5`)
  }

  recoverDeletedMusics(musics) {
    return api.post(`${urlBase}/recover`, musics)
  }

}