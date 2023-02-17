import { expect,assert } from "chai";

let DinnerModel;
describe("TW3.1 DinnerModel as Observable  [test](/tw3.1.html)", function tw3_1_10() {
  this.timeout(200000);

    let model;
    before(function(){
        DinnerModel = require("../src/" + TEST_PREFIX + "DinnerModel.js").default;
        try{
            model = new DinnerModel();
        }catch(e){ console.error(e); }
        if(model && !model.addObserver) this.skip();
    });
    this.beforeEach(function tw3_1_10_before(){
        const DinnerModel= require('../src/'+TEST_PREFIX+'DinnerModel.js').default;
        try{
            model = new DinnerModel();
        }catch(e){ console.error(e);}
    });
 /*   it("observers array is initialized correctly (set observers in the constructor to enable)", function tw3_1_10_1() {
      this._runnable.title= "observers array is initialized correctly";
      expect(model, "Model could not be built, error in model constructor, please check the top of your Console!").to.be.ok;  
      const DinnerModel= require('../src/'+TEST_PREFIX+'DinnerModel.js').default;
      model = new DinnerModel(2, [], [null,null], [null,null], [null,null], [null,null]);
      expect(model.observers, "expected model.observers property to be initialized").to.be.ok;
      expect(model.observers, "expect model.observers to be array").to.be.an("array");
      expect(model.observers.length, "expect model.observers to always be an empty array and not depend on constructor parameters").to.equal(0);
  });*/

    it("can add observers to model which are invoked at notifyObservers. Define addObserver to enable", function tw3_1_10_2() {
        this._runnable.title= "can add observers to model which are invoked at notifyObservers";
        let invoked1 = false;
        let invoked2 = false;
        let invoked3 = false;
        let obs1 = () => invoked1=true;
        let obs2 = () => invoked2=true;
        let obs3 = () => invoked3=true;
    model.addObserver(obs1);
/*    expect(
      model.observers.includes(obs1),
      "observer was not added to model.observers when calling addObserver"
    ).to.equal(true);
*/
        model.addObserver(obs2);
        model.addObserver(obs3);
/*    expect(
      model.observers.includes(obs2),
      "observer was not added to model.observers when calling addObserver"
    ).to.equal(true);
*/
    expect(
      invoked1, 
      "did not expect observer to be invoked before calling notifyObservers"
    ).to.equal(false);
    expect(
      invoked2, 
      "did not expect observer to be invoked before calling notifyObservers"
    ).to.equal(false);

        expect(
      invoked3, 
      "did not expect observer to be invoked before calling notifyObservers"
    ).to.equal(false);

        model.notifyObservers();
    expect(
      invoked1, 
      "expected observer to be invoked when calling notifyObservers"
    ).to.equal(true);
    expect(
      invoked2, 
      "expected observer to be invoked when calling notifyObservers"
    ).to.equal(true);
    expect(
      invoked3, 
      "expected observer to be invoked when calling notifyObservers"
    ).to.equal(true);

        invoked1 = false;
        invoked2 = false;
        invoked3 = false;
        model.notifyObservers();
    expect(
      invoked1, 
      "expected observer to be invoked when calling notifyObservers"
    ).to.equal(true);
    expect(
      invoked2, 
      "expected observer to be invoked when calling notifyObservers"
    ).to.equal(true);
    expect(
      invoked3, 
      "expected observer to be invoked when calling notifyObservers"
    ).to.equal(true);

    });


 
  
  it("can remove observers from model so that they are not invoked at notifyObservers", function tw3_1_10_3() {
    let invoked1 = false;
    let invoked2 = false;
    let obs1 = () => invoked1=true;
    let obs2 = () => invoked2=true;
    model.addObserver(obs1);
    model.addObserver(obs2);
      model.notifyObservers();
      invoked1= false;
      invoked2=false;
      
    model.removeObserver(obs1);
      model.notifyObservers();
      


    expect(
      invoked1, 
      "did not expect observer to be invoked after removing it from model"
    ).to.equal(false);
    expect(
      invoked2, 
      "expected observer to still be invoked after another observer was removed"
    ).to.equal(true);
 
      invoked1= false;
      invoked2=false;
    model.removeObserver(obs2);
    model.notifyObservers();

    expect(
      invoked1, 
      "did not expect observer to be invoked after removing it from model"
    ).to.equal(false);
    expect(
      invoked2, 
      "did not expect observer to be invoked after removing it from model"
    ).to.equal(false);
  });

  it("error in observer does not prevent other observers from being invoked", function tw3_1_10_4() {
      
   let executed=false;   
   expect(function tw3_1_10_4_shouldNotThrow(){
      const oldConsoleLog=console.log;
      const oldConsoleError=console.error;
      console.log=console.error=function(){};

      try{              
        model.addObserver(function() {throw new Error("test error");});
        model.addObserver(function() { executed=true; });
        model.notifyObservers();
      }finally{
        console.log=oldConsoleLog;
        console.error=oldConsoleError;
      }
   }, "did not expect error to be thrown").to.not.throw();
      expect(executed, "error in first observer should not prevent second observer from executing. try/catch on individual observer execution!").to.equal(true);   
  });

  it("error in observer is logged in Console", function tw3_1_10_5() {
    let obs = () => {throw new Error("");};
    model.addObserver(obs);

    const oldConsole = console;
    let errorLog;

      try{
          window.console = {error: msg => errorLog=msg, log: msg => errorLog=msg};
          model.notifyObservers();
          expect(errorLog, "expected error log from error-throwing observer").to.be.ok;
      }finally{
          console = oldConsole;
          model.removeObserver(obs);
      }

    model.addObserver(() => {});
      errorLog = undefined;
      try{
          window.console = {error: msg => errorLog=msg, log: msg => errorLog=msg};
          
          model.notifyObservers();
      }finally{
          console = oldConsole;
      }
      expect(errorLog, "did not expect log from non-erroneous observer").to.be.undefined;

      errorLog = undefined;
      try{
          window.console = {error: msg => errorLog=msg, log: msg => errorLog=msg};
          new DinnerModel();
      }finally{
          console = oldConsole;
      }
      expect(errorLog, "we do not expect DinnerModel constructor to log anything (clean Console encouraged). Please check the Developer Tools Console, you may have errors during constructor execution").to.be.undefined;
  });

        it("parameter of notifyObservers (payload) is sent to each observer", function tw3_1_10_6() {
    let invoked1 = false;
    let invoked2 = false;
    let obs1 = p => invoked1=p;
    let obs2 = p  => invoked2=p;
    model.addObserver(obs1);

    model.addObserver(obs2);
    expect(
      invoked1, 
      "did not expect observer to be invoked before calling notifyObservers"
    ).to.equal(false);
    expect(
      invoked2, 
      "did not expect observer to be invoked before calling notifyObservers"
    ).to.equal(false);
    model.notifyObservers("the_payload");
    expect(
      invoked1, 
      "expected observer to be invoked when calling notifyObservers"
    ).to.equal("the_payload");
    expect(
      invoked2, 
      "expected observer to be invoked when calling notifyObservers"
    ).to.equal("the_payload");
    });
  

});
