
import React from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Messages } from 'primereact/messages'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import MusicService from './services/MusicService'

class ListMusics extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      musics: [],
      totalElements: 0,
      loading: true,
      first: 0,
      rows: 5,
      deletedMusicNumbers: 0,
      displayCreateEditMusic: false,
      displayDeleteMusic: false
    }
    this.musicService = new MusicService()
    this.msgs = new Messages()
  }

  componentDidMount() {
    this.musicService.getAllMusics(this.state.first).then(res => {
      this.setState({
        musics: res.data.content,
        totalElements: res.data.totalElements,
        loading: false
      })
    })
  }

  showCreateMusic = () => {
    this.setState({
      displayCreateEditMusic: true
    })
  }

  showDeletedMusic = () => {
    console.log('this.showDeletedMusic()')
  }

  logoutUser = () => {
    console.log('this.logoutUser()')
  }

  buttonEditMusic = () => {
    return (
      <Button onClick={this.showEditMusic} icon="pi pi-user-edit" 
        className="p-button-rounded" tooltip="Edit Music" 
        tooltipOptions={{ position: 'bottom' }} />
    )
  }

  showEditMusic = () => {
    console.log('this.showEditMusic()')
  }

  saveOrEditMusic = () => {
    this.msgs.state.messages = []
    this.msgs.show({ severity: 'success', summary: 'Success', detail: 'Music added successfully!', sticky: true })
  }

  hideCreateEditMusic = () => {
    this.setState({
      displayCreateEditMusic: false
    })
  }

  footerCreateEditMusic() {
    return (
      <div>
        <Button label="Yes" icon="pi pi-check" onClick={this.saveOrEditMusic} />
        <Button label="No" icon="pi pi-times" onClick={this.hideCreateEditMusic} />
      </div>
    )
  }

  buttonDeleteMusic = () => {
    return (
      <Button onClick={this.confirmDeleteMusic} icon="pi pi-trash" 
        className="p-button-rounded p-button-danger" tooltip="Delete Music"
        tooltipOptions={{ position: 'bottom' }} />
    )
  }

  confirmDeleteMusic = () => {
    this.setState({
      displayDeleteMusic: true
    })
  }

  hideDeleteMusic = () => {
    this.setState({
      displayDeleteMusic: false
    })
  }

  footerDeleteMusic = () => {
    return (
      <div>
        <Button label="Yes" icon="pi pi-check" />
        <Button label="No" icon="pi pi-times" onClick={this.hideDeleteMusic} />
      </div>
    )
  }

  onIndexTemplate = (data, props) => {
    return props.rowIndex + 1;
  }

  onPage = (event) => {

    this.setState({
      loading: true
    })

    setTimeout(() => {

      this.musicService.getAllMusics(event.first).then(res =>
        this.setState({
          musics: res.data.content,
          totalElements: res.data.totalElements,
          first: event.first,
          loading: false
        })
      )
    }, 1000)
  }

  render() {

    let deleteMusicMessage = 'Do you really want to delete this music: Test - Test 1'
    let deletedMusicButton;
    let {
      musics,
      totalElements,
      loading,
      first,
      rows,
      deletedMusicNumbers,
      displayCreateEditMusic,
      displayDeleteMusic
    } = this.state

    if (deletedMusicNumbers === 0) {
      deletedMusicButton = <Button label="Deleted Musics" icon="pi pi-trash" disabled="true" />
    } else {
      deletedMusicButton = <Button label="Deleted Musics" onClick={this.showDeletedMusic} icon="pi pi-trash" badge="1"
        badgeClass="p-badge-danger" />
    }

    return (
      <div>

        <h1 className="title">Music Records</h1>

        <div>
          <Messages ref={(el) => this.msgs = el} />
        </div>

        <div className="table-top-button">
          <Button label="Add Music" onClick={this.showCreateMusic} icon="pi pi-plus" />
          {deletedMusicButton}
          <Button label="Logout" onClick={this.logoutUser} icon="pi pi-sign-out" iconPos="right" />
        </div>

        <DataTable value={musics} paginator rows={rows} totalRecords={totalElements} dataKey="id"
          lazy first={first} onPage={this.onPage} loading={loading} emptyMessage="No records found!" >
          <Column field="Index" header="#" body={this.onIndexTemplate} style={{ width: '5%' }} />
          <Column field="title" header="Title" style={{ width: '20%' }} />
          <Column field="artist" header="Artist" style={{ width: '20%' }} />
          <Column field="launchDate" header="Launch Date" style={{ width: '15%' }} />
          <Column field="duration" header="Duration" style={{ width: '10%' }} />
          <Column field="viewsNumber" header="Views Number" style={{ width: '15%' }} />
          <Column field="feat" header="Feat" style={{ width: '5%' }} />
          <Column field="" header="Edit" style={{ width: '5%' }} body={this.buttonEditMusic} />
          <Column field="" header="Delete" style={{ width: '5%' }} body={this.buttonDeleteMusic} />
        </DataTable>

        <Dialog header="Add Music" footer={this.footerCreateEditMusic()} visible={displayCreateEditMusic} style={{ width: '50vw' }} onHide={this.hideCreateEditMusic}>
          <p>CreateEditMusicContent</p>
        </Dialog>

        <Dialog header="Delete Confirmation" visible={displayDeleteMusic} style={{ width: '50vw' }} footer={this.footerDeleteMusic()} onHide={this.hideDeleteMusic}>
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
            <span>{deleteMusicMessage}</span>
          </div>
        </Dialog>

      </div>
    )
  }

}

export default ListMusics