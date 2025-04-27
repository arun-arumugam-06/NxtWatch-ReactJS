import React from 'react'

const NxtWatchContext = React.createContext({
  lightTheme: true,
  likedList: [],
  dislikedList: [],
  savedList: [],
  addAsLikedVideos: () => {},
  addAsDislikedVideos: () => {},
  addOrRemoveAsOrFromSavedList: () => {},
  changeThemeAndAttributes: () => {},
  changedAttributesOnThemeChange: () => {},
})

export default NxtWatchContext
