package com.mov_rct_ntv;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.mov_rct_ntv.appman.AppManager;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "movilizer_core_component";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState){
    super.onCreate(savedInstanceState);
//    AppManager appMgr = new AppManager(this);
//    appMgr.syncApps("app1");
  }
}
