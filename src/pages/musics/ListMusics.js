import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Messages } from 'primereact/messages'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { confirmDialog } from 'primereact/confirmdialog'

import MusicService from './services/MusicService'
import CreateEditMusic from './createEditMusic/CreateEditMusic'
import BehaviorSubjectService from '../../services/BehaviorSubjectService'
import AuthService from '../auth/services/AuthService'
import StringUtils from '../../utils/StringUtils'
import { AUTHENTICATED_ERROR } from '../../utils/Consts'

export default function ListMusics() {
  const [musics, setMusics] = useState([])
  const [musicEdit, setMusicEdit] = useState({})
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [first, setFirst] = useState(0)
  const [page, setPage] = useState(0)
  const [rows] = useState(5)
  const [deletedMusicNumbers, setDeletedMusicNumbers] = useState(0)
  const [displayCreateEditMusic, setDisplayCreateEditMusic] = useState(false)

  const msgs = useRef(null)

  const history = useHistory()

  const musicService = new MusicService()
  const authService = new AuthService()
  const behaviorSubjectService = new BehaviorSubjectService()
  const stringUtils = new StringUtils()

  useEffect(() => {
    checkDeletedMusics()
    loadMusicList()
  }, [])

  function loadMusicList() {
    setLoading(true)

    setTimeout(() => {
      musicService
        .getAllMusics(page)
        .then((res) => {
          setMusics(res.data.content)
          setTotalElements(res.data.totalElements)
          setLoading(false)
        })
        .catch((error) => {
          if (error.response.status === 401) {
            authService.logout()
            behaviorSubjectService.sendMessage(
              `${AUTHENTICATED_ERROR}${error.response.data.message}`
            )
            history.push('/login')
          }
        })
    }, 1000)
  }

  function sendMessage(message) {
    msgs.current.state.messages = []
    msgs.current.show(message)
  }

  function checkDeletedMusics() {
    musicService
      .countDeletedMusics()
      .then((res) => {
        setDeletedMusicNumbers(Number.parseInt(res.data.message))
      })
      .catch((error) => {
        if (error.response.status === 401) {
          authService.logout()
          behaviorSubjectService.sendMessage(
            `${AUTHENTICATED_ERROR}${error.response.data.message}`
          )
          history.push('/login')
        }
      })
  }

  function showCreateMusic() {
    setMusicEdit({
      id: null,
      title: '',
      artist: '',
      launchDate: '',
      duration: '',
      viewsNumber: null,
      feat: false
    })
    setDisplayCreateEditMusic(true)
  }

  function buttonEditMusic(music) {
    return (
      <Button
        onClick={() => showEditMusic(music)}
        icon="pi pi-user-edit"
        className="p-button-rounded"
        tooltip="Edit Music"
        tooltipOptions={{ position: 'bottom' }}
      />
    )
  }

  function showDeletedMusic() {
    history.push('/musics/deleted')
  }

  function logoutUser() {
    authService.logout()
    history.push('/login')
  }

  function showEditMusic(music) {
    setMusicEdit(music)
    setDisplayCreateEditMusic(true)
  }

  function hideCreateEditMusic() {
    setDisplayCreateEditMusic(false)
  }

  function buttonDeleteMusic(music) {
    return (
      <Button
        onClick={() => confirmDeleteMusic(music)}
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        tooltip="Delete Music"
        tooltipOptions={{ position: 'bottom' }}
      />
    )
  }

  function confirmDeleteMusic(music) {
    confirmDialog({
      message: `Do you really want to delete this music: ${music.artist} - ${music.title}`,
      header: 'Delete Confirmation',
      icon: 'pi pi-question-circle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        musicService
          .delete(music.id)
          .then(() => {
            sendMessage({
              severity: 'success',
              summary: 'Success',
              detail: 'Music deleted successfully!',
              sticky: true
            })
            checkDeletedMusics()
            loadMusicList()
          })
          .catch(() => {
            sendMessage({
              severity: 'error',
              summary: 'Error',
              detail: 'Error when deleted music!',
              sticky: true
            })
          })
      }
    })
  }

  function onPage(event) {
    setLoading(true)
    let localPage = event.first / event.rows

    setTimeout(() => {
      musicService.getAllMusics(localPage).then((res) => {
        setMusics(res.data.content)
        setTotalElements(res.data.totalElements)
        setFirst(event.first)
        setPage(localPage)
        setLoading(false)
      })
    }, 1000)
  }

  function onIndexTemplate(data, props) {
    return props.rowIndex + 1
  }

  function launchDateBodyTemplate(music) {
    return stringUtils.transformLaunchDate(music.launchDate)
  }

  function durationBodyTemplate(music) {
    return `${music.duration} min`
  }

  function viewsNumberBodyTemplate(music) {
    return stringUtils.transformViewsNumber(music.viewsNumber)
  }

  function featBodyTemplate(music) {
    return music.feat ? 'Yes' : 'No'
  }

  function conclusionCreateEditMusic() {
    loadMusicList()
  }

  return (
    <div>
      <h1 className="title">Music Records</h1>

      <Messages ref={msgs} />

      <div className="table-top-button">
        <Button onClick={showCreateMusic} label="Add Music" icon="pi pi-plus" />
        {deletedMusicNumbers === 0 && (
          <Button label="Deleted Musics" icon="pi pi-trash" disabled={true} />
        )}
        {deletedMusicNumbers > 0 && (
          <Button
            onClick={showDeletedMusic}
            label="Deleted Musics"
            icon="pi pi-trash"
            badge={`${deletedMusicNumbers}`}
            badgeClassName="p-badge-danger"
          />
        )}
        <Button
          onClick={logoutUser}
          label="Logout"
          icon="pi pi-sign-out"
          iconPos="right"
        />
      </div>

      <DataTable
        value={musics}
        paginator
        rows={rows}
        totalRecords={totalElements}
        dataKey="id"
        lazy
        first={first}
        onPage={onPage}
        loading={loading}
        emptyMessage="No records found!"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      >
        <Column
          field="Index"
          header="#"
          body={onIndexTemplate}
          style={{ width: '5%' }}
        />
        <Column field="title" header="Title" style={{ width: '20%' }} />
        <Column field="artist" header="Artist" style={{ width: '20%' }} />
        <Column
          field="launchDate"
          header="Launch Date"
          style={{ width: '15%' }}
          body={launchDateBodyTemplate}
        />
        <Column
          field="duration"
          header="Duration"
          style={{ width: '10%' }}
          body={durationBodyTemplate}
        />
        <Column
          field="viewsNumber"
          header="Views Number"
          style={{ width: '15%' }}
          body={viewsNumberBodyTemplate}
        />
        <Column
          field="feat"
          header="Feat"
          style={{ width: '5%' }}
          body={featBodyTemplate}
        />
        <Column
          field=""
          header="Edit"
          style={{ width: '5%' }}
          body={buttonEditMusic}
        />
        <Column
          field=""
          header="Delete"
          style={{ width: '5%' }}
          body={buttonDeleteMusic}
        />
      </DataTable>

      <Dialog
        header="Add Music"
        visible={displayCreateEditMusic}
        style={{ width: '50vw' }}
        onHide={hideCreateEditMusic}
      >
        <CreateEditMusic
          musicEdit={musicEdit}
          conclusion={conclusionCreateEditMusic}
        />
      </Dialog>
    </div>
  )
}
