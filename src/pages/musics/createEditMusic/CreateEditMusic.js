
import React, { useState, useEffect, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Messages } from 'primereact/messages'
import { Button } from 'primereact/button'
import { RadioButton } from 'primereact/radiobutton'
import { InputMask } from 'primereact/inputmask'
import { InputNumber } from 'primereact/inputnumber'
import StringUtils from '../../../utils/StringUtils'
import './style.css'
import MusicService from '../services/MusicService'
import BehaviorSubjectService from '../../../services/BehaviorSubjectService'
import { UPDATE_MUSIC_LIST } from '../../../utils/Consts'
import ValidatorUtils from '../../../utils/ValidatorUtils'

const CreateEditMusic = (props) => {

  const [music, setMusic] = useState({
    id: null,
    title: '',
    artist: '',
    launchDate: '',
    duration: '',
    viewsNumber: null,
    feat: false
  })

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
  const fieldsNotRequired = ['viewsNumber', 'feat']
  const musicService = new MusicService()
  const behaviorSubjectService = new BehaviorSubjectService()
  const validatorUtils = new ValidatorUtils()

  useEffect(() => {
    clearAllInputFieldsRequired()
    setMusic(props.musicEdit)
  }, [])

  const clearAllInputFieldsRequired = () => {
    for (let key of Object.keys(music)) {
      clearInputFieldRequired(key);
    }
  }

  const validFields = () => {

    let valid = true

    for (let [key, value] of Object.entries(music)) {
      if (!value && fieldsNotRequired.indexOf(key) === -1) {
        addInputFieldRequired(key)
        valid = false;
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

  const addInputFieldRequired = (field) => {
    let capitalizedField = StringUtils.capitalizeField(field)
    changeTextFieldRequired(field, `${capitalizedField} is required!`, 'p-invalid')
  }

  const changeTextFieldRequired = (field, value, cssClass) => {
    setRequiredFields(prevState => {
      return { ...prevState, [`${field}`]: value }
    })
    setRequiredStyle(prevState => {
      return { ...prevState, [`${field}`]: cssClass }
    })
  }

  const clearInputFieldRequired = (field) => {
    changeTextFieldRequired(field, '', '');
  }

  const sendMessage = (message) => {
    msgs.current.state.messages = []
    msgs.current.show(message)
  }

  const editMusic = () => {
    setLoader(true)
    musicService.edit(music).then(() => {
      setLoader(false)
      sendMessage({
        severity: 'success', summary: 'Success',
        detail: 'Music edited successfully!', sticky: true
      })
      behaviorSubjectService.sendMessage(UPDATE_MUSIC_LIST);
    }).catch(res => {
      setLoader(false)
      sendMessage({
        severity: 'error', summary: 'Error',
        detail: res.error.message, sticky: true
      })
    })
  }

  const saveMusic = () => {
    setLoader(true)
    musicService.save(music).then(() => {
      setLoader(false)
      sendMessage({
        severity: 'success', summary: 'Success',
        detail: 'Music added successfully!', sticky: true
      })
      behaviorSubjectService.sendMessage(UPDATE_MUSIC_LIST);
      setMusic({})
    }).catch(res => {
      setLoader(false)
      sendMessage({
        severity: 'error', summary: 'Error',
        detail: res.error.message, sticky: true
      })
    })
  }

  const saveOrEditMusic = () => {
    if (validFields()) {
      if (music.id) {
        editMusic();
      } else {
        saveMusic();
      }
    }
  }

  return (
    <div>

      <form>
        <div className="card">

          <Messages ref={msgs} />

          <div className="p-grid">
            <div className="p-col-12">
              <div className="p-fluid">
                <label htmlFor="title" className="p-d-block">Title</label>
                <div className="p-field form-input">
                  <InputText id="title" value={music.title}
                    onChange={e => {
                      setMusic(prevState => {
                        return { ...prevState, title: e.target.value }
                      })
                    }}
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
                  <InputText id="artist" value={music.artist}
                    onChange={e => {
                      setMusic(prevState => {
                        return { ...prevState, artist: e.target.value }
                      })
                    }}
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
                  <InputMask id="launchDate" value={music.launchDate} mask="99/99/9999"
                    onChange={e => {
                      setMusic(prevState => {
                        return { ...prevState, launchDate: e.value }
                      })
                    }}
                    aria-describedby="launchDate-help" className={requiredStyle['launchDate']} />
                </div>
                <small id="launchDate-help" className={requiredStyle['launchDate']}>{requiredFields['launchDate']}</small>
              </div>
            </div>

            <div className="p-col-6">
              <div className="p-fluid form-field">
                <label htmlFor="duration" className="p-d-block">Duration</label>
                <div className="p-field form-input">
                  <InputMask id="duration" value={music.duration} mask="99:99"
                    onChange={e => {
                      setMusic(prevState => {
                        return { ...prevState, duration: e.value }
                      })
                    }}
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
                  <InputNumber id="viewsNumber" value={music.viewsNumber}
                    onChange={e => {
                      setMusic(prevState => {
                        return { ...prevState, viewsNumber: e.value }
                      })
                    }}
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
                      onChange={e => {
                        setMusic(prevState => {
                          return { ...prevState, feat: e.value }
                        })
                      }}
                      checked={music.feat} />
                    <label htmlFor="feat-yes">Yes</label>
                  </div>
                  <div className="p-field-checkbox">
                    <RadioButton inputId="feat-no" name="feat-no" value={false}
                      onChange={e => {
                        setMusic(prevState => {
                          return { ...prevState, feat: e.value }
                        })
                      }}
                      checked={!music.feat} />
                    <label htmlFor="feat-no">No</label>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </form>

      <div className="p-grid">
        <div className="p-col-2">
          <div className="form-button">
            <Button onClick={saveOrEditMusic} label="Save" className="p-button-success"
              icon="pi pi-save" />
          </div>
        </div>
        {loader && <div className="loader" style={{ marginTop: '30', marginRight: '0', marginBottom: '0', marginLeft: '20' }}></div>}
      </div>

    </div>
  )

}

export default CreateEditMusic