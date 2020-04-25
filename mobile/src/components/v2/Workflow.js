import { WFComponent } from './WFComponent';
import React from 'react';
import { Text } from 'react-native';

export class Workflow extends WFComponent{
    state = {};

    constructor(props){
        super(props)
        this.state.currentView = props.startView; //Set the startup view
    }

    loadView(id){
        this.setState({
            currentView:id
        });
    }

    render(){
        if(this.state.currentView !== null){
            return (
                <React.Fragment key={this.state.currentView}>
                    <Text>{"Workflow v2"}</Text>
                    {this.views[this.state.currentView]}
                </React.Fragment>
            );
        }
    }
}