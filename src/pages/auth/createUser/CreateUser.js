
import React, { useState, useEffect, useRef } from 'react'

import { Messages } from 'primereact/messages'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox';
import AuthService from '../services/AuthService';
import { USER_CREATED_SUCCESSFULLY } from '../../../utils/Consts'
import ValidatorUtils from '../../../utils/ValidatorUtils';
import StringUtils from '../../../utils/StringUtils';
import BehaviorSubjectService from '../../../services/BehaviorSubjectService';
import './style.css'

const CreateUser = () => {

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [requiredStyle, setRequiredStyle] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [requiredFields, setRequiredFields] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [confirmPassword, setConfirmPassword] = useState('')
  const [seePasswordsChecked, setSeePasswordsChecked] = useState(false)
  const [loader, setLoader] = useState(false)
  const msgs = useRef(null)
  const authService = new AuthService()
  const behaviorSubjectService = new BehaviorSubjectService()
  const validatorUtils = new ValidatorUtils()
  const stringUtils = new StringUtils()

  useEffect(() => {
    clearAllInputFieldsRequired()
  }, [])

  const sendMessage = (message) => {
    msgs.current.state.messages = []
    msgs.current.show(message)
  }

  const createUser = () => {
    if (validFields()) {
      setLoader(true)
      authService.create(user).then(() => {
        setLoader(false)
        behaviorSubjectService.sendMessage(USER_CREATED_SUCCESSFULLY);
      }).catch(res => {
        setLoader(false)
        sendMessage({
          severity: 'error', summary: 'Error',
          detail: res.data.message, sticky: true
        })
      })
    }
  }

  const validFields = () => {
    let valid = true

    for (let [key, value] of Object.entries(user)) {
      if (!value) {
        addInputFieldRequired(key);
        valid = false
      } else {
        clearInputFieldRequired(key);
      }
    }

    if (valid && !confirmPassword) {
      addInputFieldRequired('confirmPassword');
      valid = false
    } else {
      clearInputFieldRequired('confirmPassword');
    }

    if (valid && validatorUtils.isNotEmail(user.email)) {
      sendMessage({
        severity: 'error', summary: 'Error',
        detail: 'Valid E-Mail format is required!', sticky: true
      })
      valid = false
    }

    if (valid && confirmPassword !== user.password) {
      sendMessage({
        severity: 'error', summary: 'Error',
        detail: 'Passwords must be the same!', sticky: true
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
    changeTextFieldRequired(field, '', '');
  }

  const changeTextFieldRequired = (field, value, cssClass) => {
    setRequiredFields(prevState => {
      return { ...prevState, [`${field}`]: value }
    })
    setRequiredStyle(prevState => {
      return { ...prevState, [`${field}`]: cssClass }
    })
  }

  const clearAllInputFieldsRequired = () => {
    for (let key of Object.keys(user)) {
      clearInputFieldRequired(key);
    }
    clearInputFieldRequired('confirmPassword')
  }

  const seePasswords = (checked) => {

    setSeePasswordsChecked(checked)
    let passwordCreate = document.getElementById('password')
    let confirmPassword = document.getElementById('confirmPassword')

    if (checked) {
      passwordCreate.type = 'text';
      confirmPassword.type = 'text';
    } else {
      passwordCreate.type = 'password';
      confirmPassword.type = 'password';
    }

  }

  return (
    <div>

      <div className="card">

        <div className="message">
          <Messages ref={msgs} />
        </div>

        <div className="p-grid">
          <div className="p-col-12">
            <div className="p-fluid">
              <label htmlFor="name">Name</label>
              <div className="p-field form-input">
                <InputText id="name"
                  onChange={e => {
                    setUser(prevState => {
                      return { ...prevState, name: e.target.value }
                    })
                  }}
                  aria-describedby="name-help" className={requiredStyle['name']} />
              </div>
              <small id="name-help" className={requiredStyle['name']}>{requiredFields['name']}</small>
            </div>
          </div>
        </div>

        <div className="p-grid">
          <div className="p-col-12">
            <div className="p-fluid">
              <label htmlFor="email">E-Mail</label>
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

        <div className="p-grid">
          <div className="p-col-12">
            <div className="p-fluid">
              <label htmlFor="password">Password</label>
              <div className="p-field form-input">
                <InputText id="password" type="password"
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

        <div className="p-grid">
          <div className="p-col-12">
            <div className="p-fluid">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="p-field form-input">
                <InputText id="confirmPassword" type="password"
                  onChange={e => {
                    setConfirmPassword(e.target.value)
                  }}
                  aria-describedby="confirmPassword-help" className={requiredStyle['confirmPassword']} />
              </div>
              <small id="confirmPassword-help" className={requiredStyle['confirmPassword']}>{requiredFields['confirmPassword']}</small>
            </div>
          </div>
        </div>

      </div>

      <div className="p-grid">
        <div className="p-col-5">
          <div className="form-button">
            <Button onClick={createUser} label="Create User" disabled={loader} className="p-button-success" icon="pi pi-save" />
          </div>
        </div>
        <div className="p-col-2" style={{ marginTop: '12px' }} >
          {loader && <div className="loader" ></div>}
        </div>
        <div className="p-col-5">
          <div className="p-field-checkbox field-checkbox">
            <label htmlFor="seePasswords" className="label-checkbox">See Passwords</label>
            <Checkbox inputId="seePasswords" checked={seePasswordsChecked} onChange={e => seePasswords(e.checked)} className="icon-checkbox" />
          </div>
        </div>
      </div>

    </div>
  )

}

export default CreateUser