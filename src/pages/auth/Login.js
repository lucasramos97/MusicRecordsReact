
import React, { useState, useEffect, useRef } from 'react'
import { Redirect } from 'react-router-dom'

import { Messages } from 'primereact/messages'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import BehaviorSubjectService from '../../services/BehaviorSubjectService'
import AuthService from './services/AuthService'
import { USER_CREATED_SUCCESSFULLY, AUTHENTICATED_ERROR } from '../../utils/Consts'
import ValidatorUtils from '../../utils/ValidatorUtils'
import StringUtils from '../../utils/StringUtils'
import './style.css'
import CreateUser from './createUser/CreateUser'

const Login = (props) => {

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
  
  const authService = new AuthService()
  const behaviorSubjectService = new BehaviorSubjectService()
  const validatorUtils = new ValidatorUtils()
  const stringUtils = new StringUtils()

  useEffect(() => {
    listenMessages()
  }, [])

  const listenMessages = () => {
    behaviorSubjectService.listenMessage().subscribe(message => {
      if (message === USER_CREATED_SUCCESSFULLY) {
        setDisplayCreateUser(false)
        sendMessage({
          severity: 'success', summary: 'Success',
          detail: 'User created successfully!', sticky: true
        })
      }
      if (message.startsWith(AUTHENTICATED_ERROR)) {
        let errorMessage = message.substr(AUTHENTICATED_ERROR.length);
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

  const sendMessage = (message) => {
    msgs.current.state.messages = []
    msgs.current.show(message)
  }

  const loginUser = () => {
    if (validFields()) {
      setLoader(true)
      authService.logout()
      authService.login(user).then(res => {
        setLoader(false)
        authService.setUserEmail(user.email)
        authService.setToken(res.data.message)
        authService.setUsername(res.data.username)
        authService.setExpiredToken(false)
        return <Redirect to={{ pathname: '/musics', state: { from: props.location } }} />
      }).catch(res => {
        setLoader(false)
        let errorMessage = res.data.message
        if (res.status !== 0) {
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

  const validFields = () => {
    let valid = true

    for (let [key, value] of Object.entries(user)) {
      if (!value) {
        addInputFieldRequired(key);
        valid = false;
      } else {
        clearInputFieldRequired(key);
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

  const addInputFieldRequired = (field) => {
    let capitalizedField = stringUtils.capitalizeField(field);
    changeTextFieldRequired(field, `${capitalizedField} is required!`, 'p-invalid');
  }

  const clearInputFieldRequired = (field) => {
    changeTextFieldRequired(field, '', '')
  }

  const changeTextFieldRequired = (field, value, cssClass) => {
    setRequiredFields(prevState => {
      return { ...prevState, [`${field}`]: value }
    })
    setRequiredStyle(prevState => {
      return { ...prevState, [`${field}`]: cssClass }
    })
  }

  const showCreateUser = () => {
    setDisplayCreateUser(true)
  }

  const hideCreateEditMusic = () => {
    setDisplayCreateUser(false)
  }

  return (
    <div>
      <div className="container">

        <div className="message">
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
            {loader && <div className="loader" style={{ marginTop: '10px' }}></div>}
          </div>

        </div>
      </div>

      <Dialog header="Create User" visible={displayCreateUser} style={{ width: '35vw' }}
        onHide={hideCreateEditMusic}>
        <CreateUser />
      </Dialog>

    </div>
  )

}

export default Login