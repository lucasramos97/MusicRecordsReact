import axios from 'axios'

const urlBase = 'http://localhost:8080/auth'
const api = axios.create()

const keyToken = 'token'
const keyUserEmail = 'userEmail'
const keyUsername = 'username'
const keyExpiredToken = 'expiredToken'

export default class AuthService {
  login(user) {
    return api.post(`${urlBase}/login`, user)
  }

  create(user) {
    return api.post(`${urlBase}/create`, user)
  }

  getToken() {
    let token = localStorage.getItem(keyToken)
    if (token) {
      return token
    }
    return ''
  }

  setToken(token) {
    localStorage.setItem(keyToken, token)
  }

  getUserEmail() {
    let userEmail = localStorage.getItem(keyUserEmail)
    if (userEmail) {
      return userEmail
    }
    return ''
  }

  setUserEmail(userEmail) {
    localStorage.setItem(keyUserEmail, userEmail)
  }

  getUsername() {
    let username = localStorage.getItem(keyUsername)
    if (username) {
      return username
    }
    return ''
  }

  setUsername(username) {
    localStorage.setItem(keyUsername, username)
  }

  isExpiredToken() {
    let valueExpiredToken = localStorage.getItem(keyExpiredToken)
    return valueExpiredToken === '1' ? true : false
  }

  setExpiredToken(expiredToken) {
    let valueExpiredToken = expiredToken ? '1' : '0'
    localStorage.setItem(keyExpiredToken, valueExpiredToken)
  }

  isAuthenticated() {
    return this.getToken() && !this.isExpiredToken()
  }

  logout() {
    this.setToken('')
    this.setUsername('')
    this.setUserEmail('')
    this.setExpiredToken(true)
  }
}
