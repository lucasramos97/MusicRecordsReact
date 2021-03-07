
import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Messages } from 'primereact/messages'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'

import MusicService from '../services/MusicService'
import StringUtils from '../../../utils/StringUtils'

export default function DeletedMusics() {

  const [musics, setMusics] = useState([])
  const [musicsSelected, setMusicsSelected] = useState(null)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [first, setFirst] = useState(0)
  const [page, setPage] = useState(0)
  const [rows] = useState(5)

  const msgs = useRef(null)

  const history = useHistory()

  const musicService = new MusicService()
  const stringUtils = new StringUtils()

  useEffect(() => {
    loadMusicList()
  }, [])

  function loadMusicList() {
    setLoading(true)

    setTimeout(() => {
      musicService.getAllDeletedMusic(page).then(res => {
        setMusics(res.data.content)
        setTotalElements(res.data.totalElements)
        setLoading(false)
      })
    }, 1000)
  }

  function sendMessage(message) {
    msgs.current.state.messages = []
    msgs.current.show(message)
  }

  function recoverSelectedMusics() {

    if (!musicsSelected || musicsSelected.length === 0) {
      sendMessage({ severity: 'error', summary: 'Error', detail: 'It is necessary to select at least one music!', sticky: true })
      return
    }

    confirmDialog({
      message: 'Do you really want to recover the selected songs',
      header: 'Recover Confirmation',
      icon: 'pi pi-question-circle',
      acceptClassName: 'p-button-success',
      accept: () => {
        musicService.recoverDeletedMusics(musicsSelected).then(() => {
          sendMessage({ severity: 'success', summary: 'Success', detail: 'Musics recovered successfully!', sticky: true })
          setMusicsSelected(null)
          loadMusicList()
        }).catch(() => sendMessage({ severity: 'error', summary: 'Error', detail: 'Error when recovered musics!', sticky: true }))
      }
    })
  }

  function comeBack() {
    history.push('/musics')
  }

  function onPage(event) {
    setLoading(true)
    let localPage = event.first / event.rows

    setTimeout(() => {
      musicService.getAllMusics(localPage).then(res => {
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

  return (
    <div>

      <h1 className="title">Deleted Music Records</h1>

      <Messages ref={msgs} />

      <div className="table-top-button">
        <Button onClick={recoverSelectedMusics} label="Recover Music"
          icon="pi pi-refresh" />
        <Button onClick={comeBack} label="Come Back" icon="pi pi-chevron-right"
          iconPos="right" />
      </div>

      <DataTable value={musics} paginator rows={rows} totalRecords={totalElements} dataKey="id"
        selection={musicsSelected} onSelectionChange={e => setMusicsSelected(e.value)}
        lazy first={first} onPage={onPage} loading={loading} emptyMessage="No records found!"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
        <Column field="Index" header="#" body={onIndexTemplate} style={{ width: '5%' }} />
        <Column field="title" header="Title" style={{ width: '20%' }} />
        <Column field="artist" header="Artist" style={{ width: '20%' }} />
        <Column field="launchDate" header="Launch Date" style={{ width: '15%' }} body={launchDateBodyTemplate} />
        <Column field="duration" header="Duration" style={{ width: '10%' }} body={durationBodyTemplate} />
        <Column field="viewsNumber" header="Views Number" style={{ width: '15%' }} body={viewsNumberBodyTemplate} />
        <Column field="feat" header="Feat" style={{ width: '5%' }} body={featBodyTemplate} />
      </DataTable>

    </div>
  )
}