import React from 'react';
import { State } from './State';
import { Controller } from './Controller';
import { MovView } from './MovView';

export class WFComponent extends React.Component{
    
    constructor(props){
        super(props)
        this.initState();
        this.initController();
        this.initViews();
    }

    initState(){
        if(this.props.children){
            if(this.props.children.type === State){
                //console.log("State Found");
                this.vars = this.props.children.props.children;
            }
            else if(Array.isArray(this.props.children))
            {
                //console.log("State Found in list");
                this.props.children.forEach((child)=>{
                    if(child.type === State){
                        this.vars = child.props.children;
                    }
                });
            }
            else{
                this.vars = {};
            }
        }
    }

    initController(){
        if(this.props.children){
            if(this.props.children.type === Controller){
                //console.log("Controller Found");
                this.controller = this.props.children.props.children;
            }
            else if(Array.isArray(this.props.children))
            {
                //console.log("Controller Found in list");
                this.props.children.forEach((child)=>{
                    if(child.type === Controller){
                        this.controller = child.props.children;
                    }
                });
            }
            else{
                this.controller = {};
            }
        }
        for(var key in this.controller){
            //console.log("binding ", key, this.controller[key]);
            this.controller[key] = this.controller[key].bind(this);
        }
    }

    initViews(){
        this.views = {};    //Make it an empty object
        if(this.props.children){
            if(this.props.children.type === MovView){
                //console.log("Views Found");
                this.views[this.props.children.props.id] = React.cloneElement(this.props.children,{_parent:this});
                //this.views[this.props.children.props.id]._parent = this;
            }
            else if(Array.isArray(this.props.children))
            {
                //console.log("Views Found in list");
                this.props.children.forEach((child)=>{
                    if(child.type === MovView){
                        this.views[child.props.id] = React.cloneElement(child,{_parent:this});
                        //this.views[child.props.id]._parent = this;
                        ////console.log(this.views[child.props.id]);
                    }
                });
            }
        }
    }
}