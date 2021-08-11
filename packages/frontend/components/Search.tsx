import React, { createRef, useEffect } from 'react'
import { request } from '../fetcher/graphql'
import Styles from '../styles/Search.module.scss'
import SongCard from './SongCard'
import { FaTimes, FaSearch, FaSpinner, FaArrowLeft } from 'react-icons/fa'
import debounce from 'debounce'
import { Suggestion } from '@gym/ytm-api/src/api/parse/suggestions'

type State = {
  value: string
  results: null | any[]
  showSearch: boolean
  loading: boolean
  suggestions: Suggestion[]
}
export default class Search extends React.Component {
  state: State = {
    value: '',
    results: null,
    showSearch: false,
    loading: false,
    suggestions: [],
  }

  private searchRef = createRef<HTMLFormElement>()

  submit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

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
      results: null,
    })

    this.delayPopulateSuggestions()
  }

  addSongToQueue = async (song) => {
    this.resetSearch()

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
      suggestions: [],
    })
  }

  resetSearchAndFocus = () => {
    this.setState({
      value: '',
      results: null,
      suggestions: [],
    })

    this.searchRef.current.focus()
  }

  populateSuggestions = async () => {
    const response = await request(`query($input: String!) {
      suggestions(input: $input) {
        runs {
          text
          bold
        }
        query
      }
    }`, {input: this.state.value})

    this.setState({
      suggestions: response.suggestions,
    })
  }

  delayPopulateSuggestions = debounce(this.populateSuggestions, 150)

  showSearch = () => {
    console.log('hi')
    this.setState({
      showSearch: true,
    })
  }

  componentDidMount() {
    // document.addEventListener('click', this.resetSearch)
  }

  componentWillUnmount() {
    // document.removeEventListener('click', this.resetSearch)
  }

  prefix () {
    if (!this.state.showSearch) {
      return
    }

    return (
      <div className={Styles.searchFormPrefix}>
        <FaArrowLeft onClick={this.resetSearch} />
      </div>
    )
  }

  suffix () {
    if (!this.state.showSearch) {
      return
    }

    return (
      <div className={Styles.searchFormSuffix}>
        <FaTimes onClick={this.resetSearchAndFocus} />
      </div>
    )
  }

  results () {
    if (!this.state.showSearch || (!this.state.results && !this.state.loading)) {
      return
    }

    return (
      <div className={Styles.searchResults}>
        {this.getResults()}
      </div>
    )
  }

  setAndSearch (value: string) {
    this.setState({
      value,
      suggestions: [],
    }, this.submit.bind(this))
  }

  suggestions () {
    if (!this.state.showSearch || this.state.results) {
      return
    }

    return (
      <div className={Styles.searchSuggestions}>
        {this.state.suggestions.map(suggestion => (
          <div className={Styles.searchSuggestionsItem} key={suggestion.query} onClick={() => this.setAndSearch(suggestion.query)}>
            <FaSearch className="mr-4" />
            <div>
              {suggestion.runs.map(run => {
                return run.bold ? <strong>{run.text}</strong> : <span>{run.text}</span>
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  render() {
    return (
      <div className={Styles.searchContainer}>
        <form onSubmit={this.submit} className={Styles.searchForm}>
          {this.prefix()}
          <input
            placeholder="Search music"
            onFocus={this.showSearch}
            className={`input-text ${Styles.searchInput} ${this.state.showSearch ? Styles.searchInputOpen : Styles.searchInputClosed}`}
            type="text"
            value={this.state.value}
            onChange={this.setSearchValue}
            ref={this.searchRef}
          />

          {this.suffix()}
        </form>

        {this.results()}
        {this.suggestions()}
      </div>
    )
  }

  getResults = () => {
    if (this.state.loading) {
      return <div className="pl-4 pt-2"><FaSpinner className="spinner" style={{width: '1rem', height: '1rem'}} /></div>
    }
    if (this.state.results) {
      if (this.state.results.length === 0) {
        return 'no results, :('
      }

      return this.state.results.map((result, index) => (
        <div
          onClick={() => this.addSongToQueue(result)}
          className={`cursor-pointer ${Styles.searchResultsItem}`}
          key={index}
        >
          <SongCard {...result} />
        </div>
      ))
    }
  }
}
