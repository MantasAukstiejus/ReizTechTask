import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CountryCard, {
  CountryProps,
} from '../../components/CountryCard/CountryCard'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import FilterButton from '../../components/FilterButton/FilterButton'
import './ListContainer.css'
import '../../components/FilterButton/FilterButton.css'

type AlphabeticalSorting = 'ascending' | 'descending'

const ListContainer = () => {
  const [filterableCountries, setFilterableCountries] = useState<
    CountryProps[]
  >([])
  const [allCountries, setAllCountries] = useState<CountryProps[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setIsLoading] = useState<boolean>(false)
  const [alphabeticalSortDirection, setAlphabeticalSortDirection] =
    useState<AlphabeticalSorting>('ascending')
  const [itemsPerPage, setItemsPerPage] = useState<string>()
  const [pages, setPages] = useState<number>()
  const [currentPage, setCurrentPage] = useState<CountryProps[]>()

  useEffect(() => {
    const getCountries = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(
          'https://restcountries.com/v2/all?fields=name,region,area'
        )
        setAllCountries(response.data)
        setFilterableCountries(response.data)
        setItemsPerPage('10')
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
    getCountries()
    sortByPage(0)
  }, [])

  useEffect(() => {
    const pages =
      !!itemsPerPage && ~~(filterableCountries.length / parseInt(itemsPerPage))
    !!pages && setPages(pages)
    sortByPage(0)
  }, [itemsPerPage, filterableCountries])

  const sortCountriesAlphabetically = (): void => {
    if (alphabeticalSortDirection === 'descending') {
      setCurrentPage(undefined)
      setFilterableCountries(allCountries)
      filterableCountries?.sort((a, b) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }
        return 0
      })
      setAlphabeticalSortDirection('ascending')
      sortByPage(0)
    }
    if (alphabeticalSortDirection === 'ascending') {
      setCurrentPage(undefined)
      setFilterableCountries(allCountries)
      filterableCountries?.sort((a, b) => {
        if (a.name > b.name) {
          return -1
        }
        if (a.name < b.name) {
          return 1
        }
        return 0
      })
      setAlphabeticalSortDirection('descending')
      sortByPage(0)
    }
  }

  const filterCountriesSmallerThanLtu = (): void => {
    const filterableArray = [...allCountries]

    const LithuaniaObject = filterableArray.find((o) => o.name === 'Lithuania')
    const LithuaniaAreaSize = LithuaniaObject?.area

    const countriesSmallerThanLtu =
      !!LithuaniaAreaSize &&
      filterableArray.filter((country) => country.area < LithuaniaAreaSize)

    setCurrentPage(undefined)
    !!countriesSmallerThanLtu && setFilterableCountries(countriesSmallerThanLtu)
  }

  const filterCountriesInOceanicRegion = () => {
    const filterableArray = [...allCountries]

    const countriesInOceanicRegion = filterableArray.filter(
      (country) => country.region === 'Oceania'
    )

    setCurrentPage(undefined)
    setFilterableCountries(countriesInOceanicRegion)
  }

  const sortByPage = (index: number): void => {
    const getPagePortionOfAllCountries =
      !!itemsPerPage &&
      filterableCountries.slice(
        index * parseInt(itemsPerPage),
        index * parseInt(itemsPerPage) + parseInt(itemsPerPage)
      )
    !!getPagePortionOfAllCountries &&
      setCurrentPage(getPagePortionOfAllCountries)
    window.scroll(0, 0)
  }

  return (
    <div>
      {loading ? (
        <div id='Spinner'>
          <LoadingSpinner />
        </div>
      ) : (
        <div className='ListContainer'>
          <div className='FilterOptionsContainer'>
            <div className='FilterButtonsContainer'>
              <FilterButton
                title='Sort by name: '
                onClick={sortCountriesAlphabetically}
                sortingDirection={
                  alphabeticalSortDirection === 'ascending'
                    ? ' ascending'
                    : ' descending'
                }
              />
              <FilterButton
                title='Smaller than LT'
                onClick={filterCountriesSmallerThanLtu}
              />
              <FilterButton
                title='Oceania region'
                onClick={filterCountriesInOceanicRegion}
              />
            </div>
            <div className='ItemPerPageContainer'>
              <p>items per page:</p>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className='ListGrid'>
            {!!currentPage
              ? currentPage.map((country, index: number) => {
                  return (
                    <CountryCard
                      key={index}
                      name={country.name}
                      region={country.region}
                      area={country.area}
                    />
                  )
                })
              : !!filterableCountries &&
                filterableCountries?.map((country, index: number) => {
                  return (
                    <CountryCard
                      key={index}
                      name={country.name}
                      region={country.region}
                      area={country.area}
                    />
                  )
                })}
          </div>
          <div className='PageButtonsContainer'>
            {Array.from(Array(pages)).map((_, index) => {
              return (
                <button
                  className='numButton'
                  key={index}
                  onClick={() => sortByPage(index)}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ListContainer
