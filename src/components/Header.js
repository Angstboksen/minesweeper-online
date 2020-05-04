import React, { Component } from 'react'
import axios from 'axios'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { Navbar, Nav, Form, FormControl, Button, Image, OverlayTrigger, Tooltip } from 'react-bootstrap'
import REQUEST_FUNCTIONS from '../httprequests/RequestConfigs'
import '../styles/index.css'

export class Header extends Component {

    state = {
        onlineCount: 0,
        onlineUsers: []
    }

    constructor(props){
        super(props)
        this.interval = this.loadOnlineUsers()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    _logout = () => {
        const {useremail} = this.props.credentials
        let users = this.state.onlineUsers.filter(u => u.email !== useremail )
        this.setState({onlineUsers : users, onlineCount : this.state.onlineCount - 1})
        this.props._resetState()
        this.props.history.push("/")
    }

    _login = (response) => {
        this.props._login(response)
    }

    getUsersFromApi = async () => {
        const res = await axios(REQUEST_FUNCTIONS.GET_ONLINE_USERS())
        const users = res.data
        this.setState({ onlineCount: users.length, onlineUsers: users })
    }

    loadOnlineUsers = async () => {
        this.getUsersFromApi()
        return setInterval(async () => {
            this.getUsersFromApi()
        }, 2000)
    }

    getNavLinks = () => {
        switch (this.props.origin) {
            case "home":
                return (
                    <Nav className="mr-auto">
                        <Nav.Link href="/"></Nav.Link>
                        <Nav.Link href="/singleplayer">Singleplayer</Nav.Link>
                        <Nav.Link href="/multiplayer">Multiplayer</Nav.Link>
                    </Nav>
                )
            case "singleplayer":
                return (
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/multiplayer">Multiplayer</Nav.Link>
                    </Nav>
                )
            case "multiplayer":
                return (
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/singleplayer">Singleplayer</Nav.Link>
                    </Nav>
                )
            case "spectate":
                return (
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/singleplayer">Singleplayer</Nav.Link>
                        <Nav.Link href="/multiplayer">Multiplayer</Nav.Link>
                    </Nav>
                )
            default:
                return (
                    <Nav className="mr-auto">
                        <Nav.Link href="/">DEFAULT</Nav.Link>
                        <Nav.Link href="/">DEFAULT</Nav.Link>
                    </Nav>
                )
        }
    }

    stringifyUsers = () => {
        let txt = ""
        for (let user of this.state.onlineUsers) {
            txt += user.user + ' : ' + user.game + '\n'
        }
        return txt
    }

    gotoSpectate = () => {
        this.props.history.push("/spectate")
    }

    getContent = () => {
        const { isSignedIn, userimageurl } = this.props.credentials
        return (
            <>
                <Navbar expand="lg" bg="dark" variant="dark">
                    <p style={pstyle}>v0.3.2</p>
                    <Navbar.Brand href="/">Minesweeper Online</Navbar.Brand>
                    {this.getNavLinks()}
                    <OverlayTrigger
                        key='bottom'
                        placement='bottom'
                        overlay={
                            <Tooltip id={`tooltip-bottom`}>
                                <strong style={{ whiteSpace: 'pre-line' }}>{this.stringifyUsers()}</strong>
                            </Tooltip>}>
                        <Button onClick={this.gotoSpectate} variant="secondary">Players in game: {this.state.onlineCount}</Button>
                    </OverlayTrigger>{' '}
                    {isSignedIn &&
                        <>
                            <Form inline style={{ margin: "0 20px 0 20px" }}>
                                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                                <Button variant="outline-info">Search</Button>
                            </Form>
                            <Image id="headerpicture" src={userimageurl} roundedCircle />
                            <GoogleLogout
                                clientId="450224643692-epj8fht9ckfljd6pgr46g0gc0bts22jb.apps.googleusercontent.com"
                                buttonText="Logout"
                                onLogoutSuccess={this._logout}
                            />
                        </>
                    }
                    {
                        !isSignedIn &&
                        <>
                            <GoogleLogin
                                clientId="450224643692-epj8fht9ckfljd6pgr46g0gc0bts22jb.apps.googleusercontent.com"
                                buttonText="Login with Google"
                                onSuccess={this._login}
                                onFailure={this.props._loginerror}
                                cookiePolicy={'single_host_origin'}
                                isSignedIn={true}
                            />
                        </>
                    }
                </Navbar >
            </>
        )
    }

    render() {
        return this.getContent()
    }
}
const pstyle = {
    display: 'inline',
    color: 'white',
    margin: '10px 10px'
}


export default Header
