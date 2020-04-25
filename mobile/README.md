# client_core_3_0
Movilizer workflow engine based on react-native/react-native-web. this project demonstrates how we can create a workflow using our custom components and how we can embed react-native ui components into it.


# Sample Workflow
```xml
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
```

## How to run

from the project directory execute following
1) ```npm install``` to install all node_modules 
2) ```npm run debug-electron``` to start electron wrapper for desktop
3) ```npm run release-electron``` to release the electron wrapper for desktop
4) ```npm run debug-ios``` to debug the ios
5) ```npm run release-ios``` to build a release version of ios
7) ```npm run debug-android``` to debug in android
8) ```npm run release-android``` to biuld a release version in android
9) ```npm run pod-install``` to install all pods

