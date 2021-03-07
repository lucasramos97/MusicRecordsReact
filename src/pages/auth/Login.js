
import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { Messages } from 'primereact/messages'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import BehaviorSubjectService from '../../services/BehaviorSubjectService'
import AuthService from './services/AuthService'
import ValidatorUtils from '../../utils/ValidatorUtils'
import StringUtils from '../../utils/StringUtils'
import CreateUser from './createUser/CreateUser'
import { AUTHENTICATED_ERROR } from '../../utils/Consts'

import './style.css'

export default function Login() {

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const [requiredStyle, setRequiredStyle] = useState({
    email: '',
    password: ''
  })

  const [requiredFields, setRequiredFields] = useState({
    email: '',
    password: ''
  })

  const [loader, setLoader] = useState(false)
  const [displayCreateUser, setDisplayCreateUser] = useState(false)

  const msgs = useRef(null)

  const history = useHistory()

  const authService = new AuthService()
  const behaviorSubjectService = new BehaviorSubjectService()
  const validatorUtils = new ValidatorUtils()
  const stringUtils = new StringUtils()

  useEffect(() => {
    listenMessages()
  }, [])

  function listenMessages() {
    behaviorSubjectService.listenMessage().subscribe(message => {
      if (message.startsWith(AUTHENTICATED_ERROR)) {
        let errorMessage = message.substr(AUTHENTICATED_ERROR.length)
        if (errorMessage !== 'undefined') {
          sendMessage({
            severity: 'error', summary: 'Error',
            detail: errorMessage, sticky: true
          })
        } else {
          sendMessage({
            severity: 'error', summary: 'Error',
            detail: 'Server not reached!', sticky: true
          })
        }
      }
    })
  }

  function conclusionCreateUser() {
    setDisplayCreateUser(false)
    sendMessage({
      severity: 'success', summary: 'Success',
      detail: 'User created successfully!', sticky: true
    })
  }

  function sendMessage(message) {
    msgs.current.state.messages = []
    msgs.current.show(message)
  }

  function loginUser() {
    if (validFields()) {
      setLoader(true)
      authService.logout()
      authService.login(user).then(res => {
        setLoader(false)
        authService.setUserEmail(user.email)
        authService.setToken(res.data.message)
        authService.setUsername(res.data.username)
        authService.setExpiredToken(false)
        history.push('/musics')
      }).catch(error => {
        setLoader(false)
        let errorMessage = error.response.data.message
        if (error.response.status !== 0) {
          sendMessage({
            severity: 'error', summary: 'Error',
            detail: errorMessage, sticky: true
          })
        } else {
          sendMessage({
            severity: 'error', summary: 'Error',
            detail: 'Server not reached!', sticky: true
          })
        }
      })
    }
  }

  function validFields() {
    let valid = true

    for (let [key, value] of Object.entries(user)) {
      if (!value) {
        addInputFieldRequired(key)
        valid = false
      } else {
        clearInputFieldRequired(key)
      }
    }

    if (valid && validatorUtils.isNotEmail(user.email)) {
      sendMessage({
        severity: 'error', summary: 'Error',
        detail: 'Valid E-Mail format is required!', sticky: true
      })
      valid = false
    }

    return valid
  }

  function addInputFieldRequired(field) {
    let capitalizedField = stringUtils.capitalizeField(field)
    changeTextFieldRequired(field, `${capitalizedField} is required!`, 'p-invalid')
  }

  function clearInputFieldRequired(field) {
    changeTextFieldRequired(field, '', '')
  }

  function changeTextFieldRequired(field, value, cssClass) {
    setRequiredFields(prevState => {
      return { ...prevState, [`${field}`]: value }
    })
    setRequiredStyle(prevState => {
      return { ...prevState, [`${field}`]: cssClass }
    })
  }

  function showCreateUser() {
    setDisplayCreateUser(true)
  }

  function hideCreateEditMusic() {
    setDisplayCreateUser(false)
  }

  return (
    <div>
      <div className="container">

        <div style={{ width: '750px' }}>
          <Messages ref={msgs} />
        </div>

        <div className="box">

          <h1 className="title" style={{ marginTop: '20px' }}>Login</h1>

          <div className="card">

            <div className="p-grid grid">
              <div className="p-col-12">
                <div className="p-fluid">
                  <label htmlFor="email" className="p-d-block">E-Mail</label>
                  <div className="p-field form-input">
                    <InputText id="email" type="email"
                      onChange={e => {
                        setUser(prevState => {
                          return { ...prevState, email: e.target.value }
                        })
                      }}
                      aria-describedby="email-help" className={requiredStyle['email']} />
                  </div>
                  <small id="email-help" className={requiredStyle['email']}>{requiredFields['email']}</small>
                </div>
              </div>
            </div>

            <div className="p-grid grid">
              <div className="p-col-12">
                <div className="p-fluid form-field">
                  <label htmlFor="password" className="p-d-block">Password</label>
                  <div className="p-field form-input">
                    <InputText id="passwordLogin" type="password"
                      onChange={e => {
                        setUser(prevState => {
                          return { ...prevState, password: e.target.value }
                        })
                      }}
                      aria-describedby="password-help" className={requiredStyle['password']} />
                  </div>
                  <small id="password-help" className={requiredStyle['password']}>{requiredFields['password']}</small>
                </div>
              </div>
            </div>

          </div>

          <div className="link">
            <a href="#/" onClick={showCreateUser}>Don't have an account yet?</a>
          </div>

          <div className="p-grid" style={{ marginTop: '10px' }}>
            <div className="p-col-5">
              <div className="form-button button">
                <Button onClick={loginUser} label="Login" disabled={loader} icon="pi pi-sign-in" iconPos="right" />
              </div>
            </div>
            {loader && <div className="loader" style={{ marginTop: '20px' }}></div>}
          </div>

        </div>
      </div>

      <Dialog header="Create User" visible={displayCreateUser} style={{ width: '35vw' }}
        onHide={hideCreateEditMusic}>
        <CreateUser conclusion={conclusionCreateUser} />
      </Dialog>

    </div>
  )
}