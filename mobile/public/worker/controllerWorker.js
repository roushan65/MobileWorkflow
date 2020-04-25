window = "Hello";

self.onmessage = (e)=>{
  let codeStr = "var code = " + e.data + ";";
  //console.log(codeStr);
  eval(codeStr);
  console.log(code);
  self.controller = code.context.controller;
  let handler = code.handler.bind(self);
  handler();
};