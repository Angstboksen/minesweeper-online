import React, { Component } from 'react'
import { GoogleLogout } from 'react-google-login'
import { Navbar, Nav, Form, FormControl, Button, Image } from 'react-bootstrap'

export class Header extends Component {

    _logout = () => {
        this.props._resetState()
        this.props.history.push("/")
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
            default:
                return (
                    <Nav className="mr-auto">
                        <Nav.Link href="/">DEFAULT</Nav.Link>
                        <Nav.Link href="/">DEFAULT</Nav.Link>
                    </Nav>
                )
        }
    }

    getContent = () => {
        const { isSignedIn, userimageurl } = this.props.credentials
        return (
            <>
                <Navbar expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="/">Minesweeper Online</Navbar.Brand>
                    {this.getNavLinks()}
                    {isSignedIn &&
                        <>
                            <Form inline style={{ marginRight: "20px" }}>
                                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                                <Button variant="outline-info">Search</Button>
                            </Form>
                            <span>
                                <Image id="headerpicture" src={userimageurl} roundedCircle />
                                <GoogleLogout
                                    clientId="450224643692-epj8fht9ckfljd6pgr46g0gc0bts22jb.apps.googleusercontent.com"
                                    buttonText="Logout"
                                    onLogoutSuccess={this._logout}
                                />
                            </span>
                        </>
                    }
                </Navbar>
            </>
        )
    }

    render() {
        return this.getContent()
    }
}

export default Header
