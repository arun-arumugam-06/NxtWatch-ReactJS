import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import NxtWatchContext from '../../context/NxtWatchContext'

import {
  LoginPage,
  LoginCard,
  LogoImage,
  Label,
  InputField,
  ShowPassword,
  LoginButton,
} from './styledComponents'

class Login extends Component {
  state = {
    showErrorMsg: false,
    showPassword: false,
    inputUsername: '',
    inputPassword: '',
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({inputUsername: event.target.value})
  }

  onChangePassword = event => {
    this.setState({inputPassword: event.target.value})
  }

  onChangeShowPassword = () => {
    this.setState(prevState => ({showPassword: !prevState.showPassword}))
  }

  renderInputUsername = lightTheme => {
    const {inputUsername} = this.setState

    return (
      <>
        <Label value={lightTheme} htmlFor="UserName">
          USERNAME
        </Label>
        <InputField
          type="text"
          id="UserName"
          value={inputUsername}
          placeholder="Username"
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderInputPassword = lightTheme => {
    const {inputPassword} = this.state
    const {showPassword} = this.state
    const inputType = showPassword ? 'text' : 'password'

    return (
      <>
        <Label value={lightTheme} htmlFor="PassWord">
          PASSWORD
        </Label>
        <InputField
          type={inputType}
          id="PassWord"
          value={inputPassword}
          placeholder="Password"
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderShowPassword = lightTheme => (
    <>
      <input
        type="checkbox"
        id="showPassword"
        onChange={this.onChangeShowPassword}
      />
      <ShowPassword value={lightTheme} htmlFor="showPassword">
        Show Password
      </ShowPassword>
    </>
  )

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      showErrorMsg: true,
      errorMsg,
    })
  }

  onSubmitEvent = async () => {
    const {inputUsername, inputPassword} = this.state
    const userDetails = {username: inputUsername, password: inputPassword}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <NxtWatchContext.Consumer>
        {value => {
          const {lightTheme, changedAttributesOnThemeChange} = value

          const {showErrorMsg, errorMsg} = this.state

          const {
            watchLogoImage,
            watchLogoImageAlt,
          } = changedAttributesOnThemeChange()

          return (
            <LoginPage>
              <LoginCard>
                <LogoImage src={watchLogoImage} alt={watchLogoImageAlt} />
                <form onSubmit={this.onSubmitEvent}>
                  <div>{this.renderInputUsername(lightTheme)}</div>
                  <div>{this.renderInputPassword(lightTheme)}</div>
                  <div>{this.renderShowPassword(lightTheme)}</div>
                  <LoginButton type="submit">Login</LoginButton>
                </form>
                {showErrorMsg && <p>{errorMsg}</p>}
              </LoginCard>
            </LoginPage>
          )
        }}
      </NxtWatchContext.Consumer>
    )
  }
}

export default Login
