//import { React, Workflow, Controller, MovView, State, Native } from './Movilizer';
import React from 'react';
import * as Native from 'react-native'
import * as Movilizer from './components/Movilizer';
import * as Babel from 'babel-standalone';

// let jsxServerURL = "http://10.0.2.2:8080/mov1.jsx";
// let jsxServerURL = "movelet/mov1.jsx";
let jsxServerURL = "http://localhost:3000/workflow/wf1/main.jsx?dev=true";

if(Native.Platform.OS == "android"){
  jsxServerURL = "http://10.0.2.2:3000/workflow/wf1/main.jsx?dev=true";
}

class MyReact{

  constructor(){
    this.version = "v2";
  }

  createElement(...args){
    if(args[1] && args[1].version)
      this.version = args[1].version;
    if(typeof args[0] === 'string'){
      args[0] = Movilizer[this.version][args[0]];
    }
    return React.createElement(...args);
  };

}
let MyReactImpl = new MyReact();

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.movilizer={exports:null};
    this.state = {
      jsx: 'movilizer.exports = React.createElement(Native.Text, null, "Loading Movelet from '+jsxServerURL+'...");',
      refreshing:false
    }
  }

  onRefresh=()=>{
    console.log("refereshing from \""+jsxServerURL+"\" ...");
    this.setState({
      refreshing:true
    });
    fetch(jsxServerURL,{
      method:"GET",
      headers:{
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0
      }
    }).then((resp)=>{
      return resp.text()
    }).then((text)=>{
      //console.log(text);
      this.setState({
        jsx:text,
        refreshing:false
      });
    }).catch((e)=>{
      console.log("Error: " + e );
      this.setState({
        refreshing:false
      });
    });
  }

  componentDidMount(){
    this.onRefresh();
  }

  render(){
    let code = this.state.jsx; //No need to transpile the code as it is already transpile from AppServer
    // let code = Babel.transform(this.state.jsx,{presets:["react"]}).code;
    let VMFun = Function("fetch","window","React","Native","Workflow","State","Controller","MovView","movilizer","eval(`"+code+"`);");
    VMFun(fetch,"CustomWindowObject",MyReactImpl,Native,"Workflow","State","Controller","MovView",this.movilizer);
    return (
      <Native.SafeAreaView style={styles.container}>
        <Native.ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <Native.RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
        >
        {React.cloneElement(this.movilizer.exports,{key:Math.random()})}
        </Native.ScrollView>
      </Native.SafeAreaView>
    );
  }
  
}

const styles = Native.StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
});
