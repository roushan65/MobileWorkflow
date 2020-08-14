module.exports = {
    onClick: function () {
        console.log("Internal Event!!");
        console.log("this=", this.vars);
        console.log("window=", window);
        console.log("fetch=", fetch);
    },
    onOk: function() {
        console.log("onOk");
    }
};