import React, { useEffect } from 'react'
import { request } from '../fetcher/graphql'
import search from '../styles/Search.module.scss'
import SongCard from './SongCard'
import { FaSearch, FaSpinner } from 'react-icons/fa'
import debounce from 'debounce'

export default class Search extends React.Component {
  state = {
    value: '',
    results: null,
    showSearch: false,
    loading: false,
  }



  submit = async (e: React.FormEvent) => {
    e.preventDefault()

    this.setState({
      loading: true,
    })

    const response = await request(`query($input: String!) {
      search(input: $input) {
        youtubeId
        title
        album
        albumArt
        artist
      }
    }`, {input: this.state.value})

    this.setState({
      results: response.search,
      loading: false,
    })
  }

  setSearchValue = (e: React.SyntheticEvent) => {
    this.setState({
      value: (e.target as HTMLTextAreaElement).value,
    })
  }

  addSongToQueue = async (song) => {
    this.delayReset.flush()

    await request(`mutation($artist: String!, $album: String!, $albumArt: String!, $title: String!, $youtubeId: String!) {
      play(artist: $artist, album: $album, albumArt: $albumArt, title: $title, youtubeId: $youtubeId) {
        currentSong {
          youtubeId
          title
          album
          albumArt
          artist
        }
      }
    }`, song)
  }

  resetSearch = () => {
    this.setState({
      showSearch: false,
      value: '',
      results: null,
    })
  }

  delayReset = debounce(this.resetSearch, 300)

  showSearch = (e: React.MouseEvent) => {
    e.stopPropagation()
    this.setState({
      showSearch: true,
    })
  }

  renderSearchButton() {
    return (
      <div className={search['search-button']} onClick={this.showSearch}>
        <FaSearch className="mr-2" /> Search
      </div>
    )
  }

  componentDidMount() {
    document.addEventListener('click', this.resetSearch)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.resetSearch)
  }

  render() {
    return this.state.showSearch ? this.renderSearchBar() : this.renderSearchButton()
  }

  renderSearchBar() {
    return (
      <div className={search['search-container']}>
        <form onSubmit={this.submit}>
          <input autoFocus={true} className={`input-text ${search['search-input']}`} type="text" value={this.state.value} onChange={this.setSearchValue} />
        </form>
        <div className={search['search-results']}>
          {this.getResults()}
        </div>
      </div>
    )
  }

  getResults = () => {
    if (this.state.loading) {
      return <div className="p-2"><FaSpinner className="spinner" style={{width: '1rem', height: '1rem'}} /></div>
    }
    if (this.state.results) {
      if (this.state.results.length === 0) {
        return 'no results, :('
      }

      return this.state.results.map((result, index) => (
        <div onClick={() => this.addSongToQueue(result)} className={`cursor-pointer ${search['search-results-item']}`} key={index}>
          <SongCard {...result} />
        </div>
      ))
    }
  }
}
