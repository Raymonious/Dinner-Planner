import render from "./teacherRender.js";

const VueRoot=require("./"+TEST_PREFIX+"VueRoot.js").default;

const preamble= <div>
                  <p>This is the final TW2 test! It shows the whole Dinner Planner, with full functionality</p>
                  <p>You can access and manipulate the model using myModel. Changing the model should be visible in the user interface.</p>
                  <p>In TW3, we will show only one of Search, Summary and Details and define navigation between them</p>
                  <p>You will also learn about component state, and move e.g. the search parameters in the Search presenter instead of them being kept in the model (application state)</p>
                  <p>You can also define React Presenters using component state. The React Views and Model are the same as for Vue.</p>
                  <p>Finally, you will learn how to persist your data to the cloud, so it is not lost when the user closes the browser page</p>
                  <hr/>
                </div>;
render(<div>{preamble}
       <VueRoot/>
       </div>,
    document.getElementById('root')
);

window.myModel= require("./"+TEST_PREFIX+"VueRoot.js").proxyModel;
