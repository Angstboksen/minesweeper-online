import React, { Component } from 'react'

export class Header extends Component {
    render() {
        return (
            <div>
                <div className="g-signin2" data-onsuccess="onSignIn"></div>
            </div>
        )
    }
}

export default Header
