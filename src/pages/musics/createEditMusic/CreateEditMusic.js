
import React, { useState, useEffect, useRef } from 'react'

import { InputText } from 'primereact/inputtext'
import { Messages } from 'primereact/messages'
import { Button } from 'primereact/button'
import { RadioButton } from 'primereact/radiobutton'
import { InputMask } from 'primereact/inputmask'
import { InputNumber } from 'primereact/inputnumber'

import StringUtils from '../../../utils/StringUtils'
import MusicService from '../services/MusicService'
import ValidatorUtils from '../../../utils/ValidatorUtils'

import './style.css'

export default function CreateEditMusic(props) {

  const [music, setMusic] = useState({})

  const [requiredStyle, setRequiredStyle] = useState({
    title: '',
    artist: '',
    launchDate: '',
    duration: ''
  })

  const [requiredFields, setRequiredFields] = useState({
    title: '',
    artist: '',
    launchDate: '',
    duration: ''
  })

  const [loader, setLoader] = useState(false)

  const msgs = useRef(null)

  const musicService = new MusicService()
  const validatorUtils = new ValidatorUtils()
  const stringUtils = new StringUtils()

  const fieldsNotRequired = ['id', 'viewsNumber', 'feat']

  useEffect(() => {
    clearAllInputFieldsRequired()
    setMusic(props.musicEdit)
  }, [])

  function clearAllInputFieldsRequired() {
    for (let key of Object.keys(music)) {
      clearInputFieldRequired(key)
    }
  }

  function validFields() {

    let valid = true

    for (let [key, value] of Object.entries(music)) {
      if (!value && fieldsNotRequired.indexOf(key) === -1) {
        addInputFieldRequired(key)
        valid = false
      } else {
        clearInputFieldRequired(key)
      }
    }

    if (valid && validatorUtils.isNotLaunchDateValid(music.launchDate)) {
      sendMessage({
        severity: 'error', summary: 'Error',
        detail: 'This Launch Date does not exist!', sticky: true
      })
      valid = false
    }

    return valid
  }

  function addInputFieldRequired(field) {
    let capitalizedField = stringUtils.capitalizeField(field)
    changeTextFieldRequired(field, `${capitalizedField} is required!`, 'p-invalid')
  }

  function changeTextFieldRequired(field, value, cssClass) {
    setRequiredFields(prevState => {
      return { ...prevState, [`${field}`]: value }
    })
    setRequiredStyle(prevState => {
      return { ...prevState, [`${field}`]: cssClass }
    })
  }

  function clearInputFieldRequired(field) {
    changeTextFieldRequired(field, '', '')
  }

  function handleChangeTitle(event) {
    setMusic({ ...music, title: event.target.value })
  }

  function handleChangeArtist(event) {
    setMusic({ ...music, artist: event.target.value })
  }

  function handleChangeLaunchDate(event) {
    setMusic({ ...music, launchDate: event.target.value })
  }

  function handleChangeDuration(event) {
    setMusic({ ...music, duration: event.target.value })
  }

  function handleChangeViewsNumber(event) {
    setMusic({ ...music, viewsNumber: event.value })
  }

  function handleChangeFeat(event) {
    setMusic({ ...music, feat: event.target.value })
  }

  function sendMessage(message) {
    msgs.current.state.messages = []
    msgs.current.show(message)
  }

  function editMusic() {
    setLoader(true)
    musicService.edit(music).then(() => {
      setLoader(false)
      sendMessage({
        severity: 'success', summary: 'Success',
        detail: 'Music edited successfully!', sticky: true
      })
      props.conclusion()
    }).catch(error => {
      setLoader(false)
      sendMessage({
        severity: 'error', summary: 'Error',
        detail: error.response.data.message, sticky: true
      })
    })
  }

  function saveMusic() {
    setLoader(true)
    musicService.save(music).then(() => {
      setLoader(false)
      sendMessage({
        severity: 'success', summary: 'Success',
        detail: 'Music added successfully!', sticky: true
      })
      props.conclusion()
      setMusic({
        id: null,
        title: '',
        artist: '',
        launchDate: '',
        duration: '',
        viewsNumber: null,
        feat: false
      })
    }).catch(error => {
      setLoader(false)
      sendMessage({
        severity: 'error', summary: 'Error',
        detail: error.response.data.message, sticky: true
      })
    })
  }

  function saveOrEditMusic() {
    if (validFields()) {
      if (music.id) {
        editMusic()
      } else {
        saveMusic()
      }
    }
  }

  return (
    <div>

      <div className="card">

        <Messages ref={msgs} />

        <div className="p-grid">
          <div className="p-col-12">
            <div className="p-fluid">
              <label htmlFor="title" className="p-d-block">Title</label>
              <div className="p-field form-input">
                <InputText id="title" value={music.title || ''}
                  onChange={handleChangeTitle}
                  aria-describedby="title-help" className={requiredStyle['title']} />
              </div>
              <small id="title-help" className={requiredStyle['title']}>{requiredFields['title']}</small>
            </div>
          </div>
        </div>

        <div className="p-grid">
          <div className="p-col-12">
            <div className="p-fluid form-field">
              <label htmlFor="artist" className="p-d-block">Artist</label>
              <div className="p-field form-input">
                <InputText id="artist" value={music.artist || ''}
                  onChange={handleChangeArtist}
                  aria-describedby="artist-help" className={requiredStyle['artist']} />
              </div>
              <small id="artist-help" className={requiredStyle['artist']}>{requiredFields['artist']}</small>
            </div>
          </div>
        </div>

        <div className="p-grid">

          <div className="p-col-6">
            <div className="p-fluid form-field">
              <label htmlFor="launchDate" className="p-d-block">Launch Date</label>
              <div className="p-field form-input">
                <InputMask id="launchDate" value={music.launchDate || ''} mask="99/99/9999"
                  onChange={handleChangeLaunchDate}
                  aria-describedby="launchDate-help" className={requiredStyle['launchDate']} />
              </div>
              <small id="launchDate-help" className={requiredStyle['launchDate']}>{requiredFields['launchDate']}</small>
            </div>
          </div>

          <div className="p-col-6">
            <div className="p-fluid form-field">
              <label htmlFor="duration" className="p-d-block">Duration</label>
              <div className="p-field form-input">
                <InputMask id="duration" value={music.duration || ''} mask="99:99"
                  onChange={handleChangeDuration}
                  aria-describedby="duration-help" className={requiredStyle['duration']} />
              </div>
              <small id="duration-help" className={requiredStyle['duration']}>{requiredFields['duration']}</small>
            </div>
          </div>

        </div>

        <div className="p-grid">

          <div className="p-col-6">
            <div className="p-fluid form-field">
              <label htmlFor="viewsNumber" className="p-d-block">Views Number</label>
              <div className="p-field form-input">
                <InputNumber id="viewsNumber" value={music.viewsNumber || null}
                  onChange={handleChangeViewsNumber}
                  aria-describedby="viewsNumber-help" className={requiredStyle['viewsNumber']} />
              </div>
              <small id="viewsNumber-help" className={requiredStyle['viewsNumber']}>{requiredFields['viewsNumber']}</small>
            </div>
          </div>

          <div className="p-col-6">
            <div className="p-fluid form-field">
              <label>Feat</label>
              <div className="p-formgroup-inline form-radio">
                <div className="p-field-checkbox">
                  <RadioButton inputId="feat-yes" name="feat-yes" value={true}
                    onChange={handleChangeFeat}
                    checked={music.feat} />
                  <label htmlFor="feat-yes">Yes</label>
                </div>
                <div className="p-field-checkbox">
                  <RadioButton inputId="feat-no" name="feat-no" value={false}
                    onChange={handleChangeFeat}
                    checked={!music.feat} />
                  <label htmlFor="feat-no">No</label>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className="p-grid">
        <div className="p-col-2">
          <div className="form-button">
            <Button onClick={saveOrEditMusic} label="Save" className="p-button-success"
              icon="pi pi-save" />
          </div>
        </div>
        {loader && <div className="loader" style={{ marginTop: '20px', marginLeft: '20px' }}></div>}
      </div>

    </div>
  )
}