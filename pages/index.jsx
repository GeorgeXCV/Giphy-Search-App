import Head from 'next/head'
import Link from "next/link";
import Image from 'next/image'
import {useEffect, useState} from 'react'
import { API_KEY } from '../utils/config'
import Footer from './components/Footer'

export default function Home(initialData) {
  const baseurl = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '';
  const [formInputs, setFormInputs] = useState({})
  const [searchTerm, setSearchTerm] = useState('dogs')
  const [searchResults, setSearchResults] = useState([])

  useEffect(()=>{
    setSearchResults(initialData.dogGiphys.data)
  }, [initialData])

  const handleInputs = (event) => {
    let {name, value} = event.target
    setFormInputs({ ...formInputs, [name]: value });
  }

  const search = async (event) => {
    event.preventDefault()
    let giphys = await fetch(`https://api.giphy.com/v1/gifs/search?q=${formInputs.searchTerm}&api_key=${API_KEY}&limit=6`)
    giphys = await giphys.json()
    setSearchResults(giphys.data)
    setSearchTerm(formInputs.searchTerm)
  }

  return (
    <>
    <div className="container">
      <Head>
        <title>Giphy Search App</title>
        <meta name="description" content="Love giphys? We do too. Use our advanced giphy search to find the perfect giphy for any occation"></meta>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles.css"/>
      </Head>
      <div className="logo-container">
        <Image
            src="/logo.png"
            alt="logo"
            layout="fixed"
            height="150"
            width="500"
        />
      </div>
      <form onSubmit={search}>
        <input name="searchTerm" onChange={handleInputs} type="text" required />
        <button>Search</button>
      </form>
      <h1>Search results for: {searchTerm}</h1>

      <p>Share this search with others:
        <Link
              href="/search/[pid]"
              as={`/search/${searchTerm}`}>
                <a> 
                  {`${baseurl}/search/${searchTerm}`}
                </a>
        </Link>
      </p>

      <div className="giphy-search-results-grid">
      {searchResults.map((each, index) => {
        return(
          <div key={index}>
            <h3>{each.title}</h3>
            <img src={each.images.original.url} alt={each.title}/>
          </div>
        )
      })}
      </div>
    </div>
    <Footer />
    </>
  )
}

export async function getStaticProps() {
  let dogGiphys = await fetch(`https://api.giphy.com/v1/gifs/search?q=dogs&api_key=${API_KEY}&limit=9`)
  dogGiphys = await dogGiphys.json()
  return {props: {dogGiphys: dogGiphys}}  
}