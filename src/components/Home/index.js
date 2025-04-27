import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {formatDistanceToNow} from 'date-fns'

import {GrFormClose} from 'react-icons/gr'
import {BsSearch} from 'react-icons/bs'
import {GoPrimitiveDot} from 'react-icons/go'

import Header from '../Header'
import FiltersSection from '../FiltersSection'

import FailureViewComponent from '../FailureViewComponent'

import NxtWatchContext from '../../context/NxtWatchContext'

import {
  NavigationSideBarHomeComponentContainer,
  HomeComponentContainer,
  BannerContainer,
  BannerContentsContainer,
  BannerNxtWatchLogo,
  BannerText,
  GetItNowBannerButton,
  BannerCloseButton,
  HomeComponent,
  SearchInputField,
  SearchButton,
  SearchFieldContainer,
  LoaderOrFailureContainer,
  LoaderComponent,
  NoSearchResultsImage,
  NoSearchResultsText,
  TryDifferentText,
  RetryButton,
  SearchResultsContainer,
  EachVideoThumbnailContainer,
  EachVideoThumbnailImage,
  LinkContainer,
  ChannelLogoVideoTitleInformationContainer,
  ChannelLogoImage,
  VideoTitleInformationContainer,
  VideoTitle,
  VideoInformation,
  ChannelTitle,
  ChannesViewsAndUpdatedTime,
  PrimitiveDotChangingScreens,
  PrimitiveDot,
  ChannelViewAndUpdatedTimeContainer,
} from './styledComponents'

const requestStatus = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  IN_PROGRESS: 'inProgress',
  INITIAL: 'initial',
}

class Home extends Component {
  state = {
    showBanner: true,
    allVideosList: [],
    searchInput: '',
    apiStatus: requestStatus.INITIAL,
  }

  componentDidMount() {
    this.getAllVideosList()
  }

  takingSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getUpdatedVidsList = videosList => {
    const updatedVideosList = videosList.map(eachItem => ({
      id: eachItem.id,
      title: eachItem.title,
      thumbnailUrl: eachItem.thumbnail_url,
      channel: {
        name: eachItem.channel.name,
        profileImageUrl: eachItem.channel.profile_image_url,
      },
      viewCount: eachItem.view_count,
      publishedAt: eachItem.published_at,
    }))
    this.setState({
      allVideosList: updatedVideosList,
      apiStatus: requestStatus.SUCCESS,
    })
  }

  getAllVideosList = async () => {
    this.setState({apiStatus: requestStatus.IN_PROGRESS})
    const {searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/all?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.getUpdatedVidsList(data.videos)
    } else {
      this.setState({apiStatus: requestStatus.FAILURE})
    }
  }

  closeBanner = () => {
    this.setState({showBanner: false})
  }

  getApiSuccessView = lightTheme => {
    const {allVideosList} = this.state
    return (
      <>
        {allVideosList.length === 0 ? (
          <LoaderOrFailureContainer>
            <NoSearchResultsImage
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
              alt="no videos"
            />
            <NoSearchResultsText value={lightTheme}>
              No Search Results Found
            </NoSearchResultsText>
            <TryDifferentText>
              Try different key words or remove search filter
            </TryDifferentText>
            <RetryButton type="button" onClick={this.getAllVideosList}>
              Retry
            </RetryButton>
          </LoaderOrFailureContainer>
        ) : (
          <SearchResultsContainer>
            {allVideosList.map(each => {
              const {channel} = each

              return (
                <EachVideoThumbnailContainer key={each.id}>
                  <LinkContainer as={Link} to={`/videos/${each.id}`}>
                    <EachVideoThumbnailImage
                      src={each.thumbnailUrl}
                      alt="video thumbnail"
                    />
                    <ChannelLogoVideoTitleInformationContainer>
                      <ChannelLogoImage
                        src={channel.profileImageUrl}
                        alt="channel logo"
                      />
                      <VideoTitleInformationContainer>
                        <VideoTitle value={lightTheme}>{each.title}</VideoTitle>
                        <VideoInformation>
                          <ChannelTitle>{channel.name}</ChannelTitle>
                          <ChannelViewAndUpdatedTimeContainer>
                            <PrimitiveDotChangingScreens as={GoPrimitiveDot} />
                            <ChannesViewsAndUpdatedTime>
                              {each.viewCount} views
                            </ChannesViewsAndUpdatedTime>
                            <PrimitiveDot as={GoPrimitiveDot} />
                            <ChannesViewsAndUpdatedTime>
                              {/* each.published_at */}
                              {formatDistanceToNow(new Date(each.publishedAt), {
                                addSuffix: true,
                              })
                                .split(' ')
                                .reverse()
                                .slice(0, 3)
                                .reverse()
                                .join(' ')}
                            </ChannesViewsAndUpdatedTime>
                          </ChannelViewAndUpdatedTimeContainer>
                        </VideoInformation>
                      </VideoTitleInformationContainer>
                    </ChannelLogoVideoTitleInformationContainer>
                  </LinkContainer>
                </EachVideoThumbnailContainer>
              )
            })}
          </SearchResultsContainer>
        )}
      </>
    )
  }

  getApiFailureView = lightTheme => (
    <LoaderOrFailureContainer value={lightTheme}>
      <FailureViewComponent retryFunction={this.getAllVideosList} />
    </LoaderOrFailureContainer>
  )

  getLoadingView = lightTheme => (
    <LoaderOrFailureContainer data-testid="loader" value={lightTheme}>
      <LoaderComponent
        as={Loader}
        type="ThreeDots"
        color="#4f46e5"
        height="50"
        width="50"
      />
    </LoaderOrFailureContainer>
  )

  getApiRequestViews = lightTheme => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case requestStatus.SUCCESS:
        return this.getApiSuccessView(lightTheme)
      case requestStatus.FAILURE:
        return this.getApiFailureView(lightTheme)
      case requestStatus.IN_PROGRESS:
        return this.getLoadingView(lightTheme)
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    const {showBanner} = this.state

    return (
      <div>
        <Header />
        <NavigationSideBarHomeComponentContainer>
          <FiltersSection />
          <NxtWatchContext.Consumer>
            {value => {
              const {lightTheme} = value
              return (
                <HomeComponentContainer>
                  {showBanner && (
                    <BannerContainer data-testid="banner">
                      <BannerContentsContainer>
                        <BannerNxtWatchLogo
                          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                          alt="nxt watch logo"
                        />
                        <BannerText>
                          Buy Nxt Watch Premium prepaid plans with UPI
                        </BannerText>
                        <GetItNowBannerButton type="button">
                          GET IT NOW
                        </GetItNowBannerButton>
                      </BannerContentsContainer>
                      <div>
                        <BannerCloseButton
                          type="button"
                          data-testid="close"
                          onClick={this.closeBanner}
                        >
                          <GrFormClose />
                        </BannerCloseButton>
                      </div>
                    </BannerContainer>
                  )}
                  <HomeComponent data-testid="home" value={lightTheme}>
                    <SearchFieldContainer>
                      <SearchInputField
                        type="search"
                        placeholder="Search"
                        onChange={this.takingSearchInput}
                      />
                      <SearchButton
                        type="button"
                        data-testid="searchButton"
                        onClick={this.getAllVideosList}
                      >
                        <BsSearch />
                      </SearchButton>
                    </SearchFieldContainer>
                    <>{this.getApiRequestViews(lightTheme)}</>
                  </HomeComponent>
                </HomeComponentContainer>
              )
            }}
          </NxtWatchContext.Consumer>
        </NavigationSideBarHomeComponentContainer>
      </div>
    )
  }
}

export default Home
