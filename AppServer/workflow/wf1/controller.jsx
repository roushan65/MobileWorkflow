module.exports = {
    onClick: function () {
        debugger;
        console.lo("Internal Event!!");
        console.log("this=", this.vars);
        console.log("window=", window);
        console.log("fetch=", fetch);
    },
    onOk: function() {
        console.log("onOk");
    }
};