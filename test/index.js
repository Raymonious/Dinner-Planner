// https://survivejs.com/webpack/techniques/testing/
if (module.hot) {
  const context = require.context(
    "mocha-loader!./", // Process through mocha-loader
    false, // Skip recursive processing
    /\.test.js$/ // Pick only files ending with .test.js
  );
  context.keys().forEach(context);
}

const backendURL = "http://standup.eecs.kth.se:3000/";
// fetch is overriden somewhere in the tests...
const normalFetch = window.fetch;
const normalConsole= window.console;

class TestAnalyzer {
  // mochaTestSuites is the default structure
  // in the mocha test runner (this.suite.suites)
  constructor(mochaTestSuites) {
    // a list of all test suites
    this.allSuites = [];
    // a list of all test suites that have been completed
    this.completedSuites = [];

    mochaTestSuites.forEach((suite) => {
      // if one of the tests has a state, the suite is complete
      let isCompletedSuite = suite.tests.some(
        (test) => test.state && test.state !== "pending"
      );

      // cleaning up the tests from mocha
      let suiteTests = suite.tests.map((test) => ({
        name: test.title,
        state: test.state,
        error: test.err ? test.err.message : null,
      }));

      suiteTests = suiteTests.filter((test) => test.state !== "pending");

      // cleaning up the suite from mocha
      let cleanSuite = {
        name: suite.title,
        tests: suiteTests,
      };

      // pushing to correct suite arrays
      this.allSuites.push(cleanSuite);
      if (isCompletedSuite) this.completedSuites.push(cleanSuite);
    });
  }

  formatAndPostTestResults() {
    // generate a mapping between an ID and a suite name
    // to save bandwidth
    let suiteToID = {};
    let IDtoSuite = {};

    this.completedSuites.forEach((suite, index) => {
      suiteToID[suite.name] = index;
      IDtoSuite[index] = suite.name;
    });

    // put all tests in a single array
    let tests = [];
    this.completedSuites.forEach((suite) => {
      suite.tests.forEach((test) => {
        tests.push({
          name: test.name,
          state: test.state,
          error: test.error,
          suiteID: suiteToID[suite.name],
        });
      });
    });

    // include username, suite mapping and completed tests
    // username from webpack DefinePlugin
    console.log("Username: " + USERNAME)
    console.log("Semester: " + SEMESTER)
    let body = {
      username: TELEMETRY === "full" && USERNAME ? USERNAME : "anonymous",
      semester: SEMESTER ? SEMESTER : "unknown",
      suiteIDMapping: IDtoSuite,
      tests: tests,
    };

    // POST data to backend server
    if (TELEMETRY !== "none") this.postData(body);
  }

  postData(data) {
    // has to have content type application/json header
    // to be accepted by the backend server
    normalFetch(backendURL, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }
}

// extend the default mocha runner to
// post test results to backend after the tests are completed
const runnerClass = mocha._runnerClass;

class MyRunner extends runnerClass {
  constructor(suite, opts) {
    super(suite, opts);
  }
  runAsync(...params) {
    return super.runAsync(...params).then((result) => {
      let testanalyzer = new TestAnalyzer(this.suite.suites);
      testanalyzer.formatAndPostTestResults();
      return result;
    });
  }
}

mocha._runnerClass = MyRunner;

const testURL= mocha._reporter.prototype.testURL;
mocha._reporter.prototype.testURL= function(test){
    // we hijack the testURL method to modify the test stacktrace in case of error
    if(test.err){
        console.error(test.err.stack);
        test.err.originalStack=test.err.stack;
        test.err.stack="";
    }
    return testURL(test);
};


const regexMdLinks =   /\[([^\[\]]*)\]\((.*?)\)/gm;
const singleMatch = /\[([^\[]+)\]\((.*)\)/;

function makeLink(match){
    const mtch=  singleMatch.exec(match);
    const link= document.createElement("a");
    link.setAttribute("href", mtch[2]);
    link.setAttribute("target","_blank");
    link.setAttribute("style", "color: blue;");
    link.setAttribute("onClick", "event.stopPropagation()");
    link.append(mtch[1]);
    return link;
}

function text2Link(node){
    const text= node.firstChild?.textContent;
    const matches=text.match(regexMdLinks);
    if(matches)
        setTimeout(()=>{                        
            matches.forEach(function eachMatchCB(match, index, array){
                node.append(makeLink(match));
                if(index!=array.length-1)
                    node.append(", ");
            });
            node.firstChild.textContent=text.replace(regexMdLinks, "");
        }, 0);
}

const observer = new MutationObserver(function mutationCB(mutationList, observer){
    mutationList.forEach(function(mutation){
        if (mutation.type === 'childList' && mutation.target==document.getElementById("mocha-report"))
            mutation.addedNodes.forEach(function eachNodeAddedCB(node){
                const h1=  node?.firstElementChild;
                if(h1?.tagName=="H1")
                    text2Link(h1);

            });
        if (mutation.type === 'childList' && mutation.target.tagName=="LI")
            mutation.addedNodes.forEach(function eachNodeAddedCB(node){
                if(node.tagName!== "UL")
                    return;
                node.children?.forEach(function(li){
                    const h2= li.firstElementChild;
                    if(h2?.tagName=="H2")
                        text2Link(h2);
                });
            });
    });
});

observer.observe(document.getElementById("mocha"), { childList: true, subtree: true });

