import React from 'react';
import { State } from './State';
import { Controller } from './Controller';

export class ViewBase extends React.Component {

    constructor(props) {
        super(props)
        this.eventList = {};
        this.initState();
        this.initController();
        this.initChildren();
        this.initEvents();
    }

    initState() {
        if (this.props.children) {
            if (this.props.children.type === State) {
                //console.log("State Found");
                this.vars = this.props.children.props.children;
            }
            else if (Array.isArray(this.props.children)) {
                //console.log("State Found in list");
                this.props.children.forEach((child) => {
                    if (child.type === State) {
                        this.vars = child.props.children;
                    }
                });
            }
            else {
                this.vars = {};
            }
        }
    }

    initController() {
        if (this.props.children) {
            if (this.props.children.type === Controller) {
                //console.log("State Found");
                this.controller = this.props.children.props.children;
            }
            else if (Array.isArray(this.props.children)) {
                //console.log("View Controller Found in list");
                this.props.children.forEach((child) => {
                    if (child.type === Controller) {
                        this.controller = child.props.children;
                        //console.log(this.controller);
                    }
                });
            }
            else {
                this.controller = {};
            }
            for (let key in this.controller) {
                //console.log("binding ", key, this.controller[key]);
                this.controller[key] = this.controller[key].bind(this);
            }
        }
    }

    createSelfBindChild(child) {
        let newProps = {};
        for (let prop in child.props) {
            if (prop.startsWith("on"))   //bind the events
            {
                // newProps[prop] = () => {
                //     this.startWorker(child.props[prop]);
                // };
                //
                newProps[prop] = child.props[prop].bind(this);
            }
            else {
                newProps[prop] = child.props[prop]; //bind the attribute
            }
        }
        let newChild = React.cloneElement(child, newProps);
        return newChild;
    }

    initChildren() {
        this.controls = [];    //Make it an empty object
        if (this.props.children) {
            if (Array.isArray(this.props.children)) {
                this.props.children.forEach((child) => {
                    if (child.type !== Controller && child.type !== State) {
                        let newChild = this.createSelfBindChild(child);//React.cloneElement(child,newProps);
                        this.controls.push(newChild);
                    }
                });
            }
            else {
                let newChild = this.createSelfBindChild(this.props.children);//React.cloneElement(this.props.children,newProps);
                this.controls.push(newChild);
            }
        }
    }

    /*setParent(parent){
        this.props._parent = parent;
    }*/

    initEvents() {
        this.event = {};
        for (var key in this.props) {
            if (key !== "children") {
                if (key.startsWith("on")) {
                    this.event[key] = this.props[key].bind(this.props._parent);
                    ////console.log("Evt= ", key, "=", this.props[key]);
                    //this.addEventListener(key,this.props[key]);
                }
            }
        }
    }

    dispatchEvent(eventName, ...args) {
        this.event[eventName](args);
    }
}