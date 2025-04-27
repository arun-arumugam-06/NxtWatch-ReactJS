import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {formatDistanceToNow} from 'date-fns'
import Loader from 'react-loader-spinner'

import {GoPrimitiveDot} from 'react-icons/go'
import {HiFire} from 'react-icons/hi'

import Header from '../Header'
import FiltersSection from '../FiltersSection'
import FailureViewComponent from '../FailureViewComponent'

import NxtWatchContext from '../../context/NxtWatchContext'

import {
  NavigationAndTrendingPartContainer,
  LoaderOrFailureContainer,
  TrendingComponentContainer,
  LoaderComponent,
  TrendingTopHeadContainer,
  TrendingLogo,
  TrendingVideoAndDetailsContainer,
  TrendingsContainer,
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

const dataFetchStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class TrendingRoute extends Component {
  state = {
    listOfVideosDetails: [],
    dataFetchStatus: dataFetchStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getListOfVideosData()
  }

  getListOfVideosData = async () => {
    this.setState({dataFetchStatus: dataFetchStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const trendingUrl = 'https://apis.ccbp.in/videos/trending'
    const options = {
      method: 'GET',
      headers: {authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(trendingUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      this.setState({
        dataFetchStatus: dataFetchStatusConstants.success,
        listOfVideosDetails: data.videos,
      })
    } else {
      this.setState({dataFetchStatus: dataFetchStatusConstants.failure})
    }
  }

  renderRoutePartOnDataResponse = lightTheme => {
    const {dataFetchStatus, listOfVideosDetails} = this.state

    switch (dataFetchStatus) {
      case dataFetchStatusConstants.loading:
        return (
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
      case dataFetchStatusConstants.failure:
        return (
          <LoaderOrFailureContainer value={lightTheme}>
            <FailureViewComponent retryFunction={this.getListOfVideosData} />
          </LoaderOrFailureContainer>
        )
      case dataFetchStatusConstants.success:
        return (
          <div>
            <TrendingTopHeadContainer theme={lightTheme}>
              <TrendingLogo as={HiFire} />
              <h1>Trending</h1>
            </TrendingTopHeadContainer>

            <TrendingsContainer theme={lightTheme} data-testid="trending">
              {listOfVideosDetails.map(each => {
                const {channel} = each

                return (
                  <TrendingVideoAndDetailsContainer key={each.id}>
                    <LinkContainer as={Link} to={`/videos/${each.id}`}>
                      <EachVideoThumbnailImage
                        src={each.thumbnail_url}
                        alt="video thumbnail"
                      />
                      <ChannelLogoVideoTitleInformationContainer>
                        <ChannelLogoImage
                          src={channel.profile_image_url}
                          alt="channel logo"
                        />
                        <VideoTitleInformationContainer>
                          <VideoTitle value={lightTheme}>
                            {each.title}
                          </VideoTitle>
                          <VideoInformation>
                            <ChannelTitle>{channel.name}</ChannelTitle>
                            <ChannelViewAndUpdatedTimeContainer>
                              <PrimitiveDotChangingScreens
                                as={GoPrimitiveDot}
                              />
                              <ChannesViewsAndUpdatedTime>
                                {each.view_count} views
                              </ChannesViewsAndUpdatedTime>
                              <PrimitiveDot as={GoPrimitiveDot} />
                              <ChannesViewsAndUpdatedTime>
                                {/* each.published_at */}
                                {formatDistanceToNow(
                                  new Date(each.published_at),
                                  {
                                    addSuffix: true,
                                  },
                                )
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
                  </TrendingVideoAndDetailsContainer>
                )
              })}
            </TrendingsContainer>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <NavigationAndTrendingPartContainer>
          <FiltersSection />
          <NxtWatchContext.Consumer>
            {value => {
              const {lightTheme} = value

              return (
                <TrendingComponentContainer>
                  {this.renderRoutePartOnDataResponse(lightTheme)}
                </TrendingComponentContainer>
              )
            }}
          </NxtWatchContext.Consumer>
        </NavigationAndTrendingPartContainer>
      </div>
    )
  }
}

export default TrendingRoute
