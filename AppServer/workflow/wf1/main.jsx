let controller = require("./controller.jsx");
// console.lo("controller=",controller);
movilizer.exports = (
  <Workflow id="wf1" name="Workflow1" startView="view1">

    <State>{{
      asd: "qwe"
    }}</State>

    <Controller>{{
      navigateToView: function (id) {
        //console.log(this);
        this.loadView(id);
      }
    }}</Controller>

    <MovView id="view1" name="Movelet View ONE" onNext={function () { this.controller.navigateToView("view2"); }}>

      <State>{{
        asd: "qwe"
      }}</State>

      <Controller>{controller}</Controller>

      <Native.Button onPress={function () { this.controller.onOk(); }} title="OK" color="green" />
      <Native.Text></Native.Text>

      <Native.Button onPress={function () { this.controller.onClick("view1"); }} title="Write DataContainer" color="red" />
      <Native.Text></Native.Text>

    </MovView>

    <MovView id="view2" name="Movelet View TWO" onNext={function () { this.controller.navigateToView("view1"); }}>

      <Controller>{{
        onClick: function () {
          console.log("Internal View Event!!");
        }
      }}</Controller>

      <Native.Button onPress={function () { this.controller.onClick() }} title="Do Action2" />
      <Native.Text></Native.Text>
    </MovView>

  </Workflow>
);
