import React, { Component } from 'react';
import './App.css';
import { LeapProvider } from 'react-leap'
import MyApp from "./MyApp";

class App extends Component {

    constructor(props){
        super(props);
        this.state={
            json:[]
        };
    }

    render() {
        return (
            <div>
                <LeapProvider options={{enableGestures: true, optimizeHMD: true}}>
                    <MyApp json={this.state.json} />
                </LeapProvider>
            </div>
        );
    }
}

export default App;
