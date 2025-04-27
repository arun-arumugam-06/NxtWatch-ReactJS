import Header from '../Header'
import FiltersSection from '../FiltersSection'
import NxtWatchContext from '../../context/NxtWatchContext'

import {
  NavigationAndComponentContainer,
  LoaderOrFailureContainer,
  FailureViewImage,
  NotFoundTitle,
} from './styledComponents'

const NotFound = () => (
  <div>
    <Header />
    <NavigationAndComponentContainer>
      <FiltersSection />
      <NxtWatchContext.Consumer>
        {value => {
          const {lightTheme, changedAttributesOnThemeChange} = value
          const {notFoundImage} = changedAttributesOnThemeChange()

          return (
            <LoaderOrFailureContainer value={lightTheme}>
              <FailureViewImage
                src={notFoundImage}
                alt="not found"
                value={lightTheme}
              />
              <NotFoundTitle value={lightTheme}>Page Not Found</NotFoundTitle>
              <NotFoundTitle value={lightTheme} as="p">
                we are sorry, the page you requested could not be found.
              </NotFoundTitle>
            </LoaderOrFailureContainer>
          )
        }}
      </NxtWatchContext.Consumer>
    </NavigationAndComponentContainer>
  </div>
)

export default NotFound
