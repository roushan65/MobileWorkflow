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

    <Controller>{{
      onClick: function () {
        console.log("Internal Event!!");
        console.log("this=", this.vars);
        console.log("window=", window);
        console.log("fetch=", fetch);
        cont = {
          prop1:"prop1Value",
          prop2:"prop2Value"
        };
        Native.NativeModules.Movilizer.writeDataContainer("KEY1",cont,1);
        alert("DataContainer sent!!");
      },
      onOk: function(){
        Native.NativeModules.Movilizer.triggerOKEvent();
      }
    }}</Controller>

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