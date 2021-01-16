
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/musics'
})

export default class MusicService {

  getAllMusics(page) {
    return api.get(`?page=${page}&size=5`)
  }

}