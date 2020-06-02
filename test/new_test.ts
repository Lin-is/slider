import { Observable } from '../src/index'  //++++++
import { Observer } from '../src/index'
import { Model } from '../src/index'       //++++++
import { Controller } from '../src/index'
import { View } from '../src/index'
import { SliderInterface } from '../src/index'




describe ('Observable', () => {     //!100%

    let observable: Observable;

    beforeEach (function () {
        observable = new Observable();
    });  

    it('can create', () => {
        expect(observable).not.toBe(null);
        expect(observable.observers).toEqual([]);
    });

    it('can add observer to array of observers', () => {
        let testObserver = jasmine.createSpyObj('testObserver', ['notify', 'constructor']);

        observable.addObserver(testObserver);

        expect(observable.observers.includes(testObserver)).toEqual(true);
    });

    it('observable can send message to observers', () => {
        let testObserver = jasmine.createSpyObj('testObserver', ['notify', 'constructor']);
        for (let i = 0; i < 10; i++) {
            observable.addObserver(testObserver);
        }

        observable.sendMessage("msg");

        expect(testObserver.notify.calls.count()).toEqual(observable.observers.length);
    });
});


describe ('Observer', () => {      //! < 100%
    let testMsg = "Hello, it's test msg";
    it('can create', () => {
        const observer: Observer = new Observer(console.log(testMsg));
        expect(observer).not.toBe(null);
        expect(observer.notify).not.toBeUndefined;
    })
});


describe('Model', () => {

    let testModel: Model = new Model();
    testModel.sliders = [];
    let testModel2: Model = new Model();

    it('can create', () => {
        expect(testModel).not.toBe(null);
        expect(testModel2).not.toBe(null);
    })

    describe('can add new slider to array of sliders', () => {

        it("can push new slider to array", () => { 
            testModel2.addSlider(-5, 145, 2);
            expect(testModel2.sliders).toContain({
                idNum: 3,
                minScaleValue: -5,
                maxScaleValue: 145,
                step: 2,
                handleNumber: 1,
            });
        });

        it("can add first slider to empty array with id = 1", () => {
            testModel.sliders = [];
            testModel.addSlider(-5, 145, 2);
            expect(testModel.sliders[0]).not.toBeUndefined;
            expect(testModel.sliders[0].idNum).toEqual(1);
        });

        it("can add new slider to not empty arraywith correct id = id of prev slider + 1", () => {
            let idOfPrev = testModel2.sliders[testModel2.sliders.length - 1].idNum;
            testModel2.addSlider(3, 298, 1);
            expect(testModel2.sliders[testModel2.sliders.length - 1].idNum).toEqual(idOfPrev + 1);
        });

    });

    describe('getters', () => {

        it('can find slider in array by id', () => {
            let idNumToSearch = 2;
            let foundedSlider = testModel2.findSliderById(idNumToSearch);
            expect(foundedSlider).not.toBeUndefined;
            expect(foundedSlider).toEqual({
                idNum: 2,
                minScaleValue: -30,
                maxScaleValue: 200,
                step: 5,
                handleNumber: 2
            });
        });

        it("will inform if slider not found", () => {
            let idNumToSearch = 12;
            let foundedSlider = testModel2.findSliderById(idNumToSearch);
            expect(foundedSlider).toEqual(undefined);
            expect(Error);
        });
        

        it('can get minimum value by id', () => {
            let expectedVal = -30;
            let foundedVal = testModel2.getMinScaleValue(2);
            expect(foundedVal).toEqual(expectedVal);
        });

        it('can get maximum value by id', () => {
            let expectedVal = 200;
            let foundedVal = testModel2.getMaxScaleValue(2);
            expect(foundedVal).toEqual(expectedVal);
        });

        it('can get step value by id', () => {
            let expectedVal = 5;
            let foundedVal = testModel2.getStep(2);
            expect(foundedVal).toEqual(expectedVal);
        });

        it('can get number of toggles by id', () => {
            let expectedVal = 2;
            let foundedVal = testModel2.getHandleNumberValue(2);
            expect(foundedVal).toEqual(expectedVal);
        });

    });

    describe('setters', () => {
        
        it('can set new minimum value for slider with chosen id', () => {
            let newMin = -20;
            let idNum = 1;
            testModel2.setMinScaleValue(idNum, newMin);
            expect(testModel2.getMinScaleValue(idNum)).toEqual(newMin);
            expect(testModel2.sliders[idNum - 1].minScaleValue).toEqual(newMin);
        });

        it('can set new maximum value for slider with chosen id', () => {
            let newMax = 143;
            let idNum = 1;
            testModel2.setMaxScaleValue(idNum, newMax);
            expect(testModel2.getMaxScaleValue(idNum)).toEqual(newMax);
            expect(testModel2.sliders[idNum - 1].maxScaleValue).toEqual(newMax);
        });

        it('can set new step value for slider with chosen id', () => {
            let newStep = 1;
            let idNum = 1;
            testModel2.setStep(idNum, newStep);
            expect(testModel2.getStep(idNum)).toEqual(newStep);
            expect(testModel2.sliders[idNum - 1].step).toEqual(newStep);
        });

        it('can set new toggle number for slider with chosen id', () => {
            let newNumber = 2;
            let idNum = 1;
            testModel2.setHandleNumberValue(idNum, newNumber);
            expect(testModel2.getHandleNumberValue(idNum)).toEqual(newNumber);
            expect(testModel2.sliders[idNum - 1].handleNumber).toEqual(newNumber);
        });
    });

    
});


describe('Controller', () => {     //!
    let controller: Controller
    beforeEach(() => {
        let model = jasmine.createSpyObj("Model", ['sliders', 'constructor', 'addSlider',
            'getHandleNumberValue', 'setMinScaleValue', 'setMaxScaleValue',
            'setStep', 'setHandleNumberValue']);

        let view = jasmine.createSpyObj("View", ['displaySliders', 'clear', 'displaySliders', 'addObserver']);
        controller = new Controller(model, view);
    }) 

    it('can create', () => {
        expect(controller).not.toBe(undefined);
        expect(controller).not.toBe(null);
        expect(controller.model).not.toBe(undefined);
        expect(controller.view).not.toBe(undefined);
    });

    describe('Controller can display sliders', () => {
        it('can call method "displaySliders"', ()=> {
            expect(controller.view.displaySliders).toHaveBeenCalledWith(controller.model.sliders);
        });
    });

    describe('Controller can create correct observer', () => {
        let info: any;
        beforeEach(() => {
            info = jasmine.createSpyObj("info", ['elemId', 'idNum', 'newValue', 'handleNum']);
        });
        it('will change minimum value if info.elemId containes "minInput"', () => {
            info.elemId = 'minInput';
            controller.observerFunc(info);
            expect(controller.model.setMinScaleValue).toHaveBeenCalledWith(info.idNum, info.newValue);
        });
        it('will change maximum value if info.elemId containes "maxInput"', () => {
            info.elemId = 'maxInput';
            controller.observerFunc(info);
            expect(controller.model.setMaxScaleValue).toHaveBeenCalledWith(info.idNum, info.newValue);
        });
        it('will change step value if info.elemId containes "stepInput"', () => {
            info.elemId = 'stepInput';
            controller.observerFunc(info);
            expect(controller.model.setStep).toHaveBeenCalledWith(info.idNum, info.newValue);
        });

        it('will clear the page after changing model', () => {
            expect(controller.view.clear).toHaveBeenCalled;
        });
        it('will display sliders with renewed data', () => {
            expect(controller.view.displaySliders).toHaveBeenCalledWith(controller.model.sliders);
        })
        it('can add Observer to View', () => {
            expect(controller.view.addObserver).toHaveBeenCalledWith(controller.observer);
        });
    });


    describe('Controller can change Model', () => {
        it('can change minimum value', () => {
            let newMin = 0;
            let idNum = 1;
            controller.changeMinValue(idNum, newMin);
            expect(controller.model.setMinScaleValue).toHaveBeenCalledWith(idNum, newMin);
        });
        it('can change maximum value', () => {
            let newMax = 300;
            let idNum = 1;
            controller.changeMaxValue(idNum, newMax);
            expect(controller.model.setMaxScaleValue).toHaveBeenCalledWith(idNum, newMax);
        });
        it('can change step value', () => {
            let newStep = 5;
            let idNum = 1;
            controller.changeStepValue(idNum, newStep);
            expect(controller.model.setStep).toHaveBeenCalledWith(idNum, newStep);
        });
        it('can change number of toggles', () => {
            let newNumber = 2;
            let idNum = 1;
            controller.changeHandleNumberValue(idNum, newNumber);
            expect(controller.model.setHandleNumberValue).toHaveBeenCalledWith(idNum, newNumber);
        });
    });
});


describe ('View', () => {
    let view : View;

    beforeEach(() => {
        let model: Model = jasmine.createSpyObj("Model", ['sliders', 'constructor', 'addSlider',
            'getHandleNumberValue', 'setMinScaleValue', 'setMaxScaleValue',
            'setStep', 'setHandleNumberValue']);
            let newSlider: SliderInterface = jasmine.createSpyObj("SliderInterface", ['render']);
        view = new View(model);
    }) 

    it('can create', () => {
        expect(view).not.toBe(null);
        expect(view.model).not.toBe(undefined);
        expect(view.renderedSliders).toEqual([]);
    });

    describe('View can display sliders', () => {
        it('it will render every slider in the array', () => {
            let sliders = [{ idNum: 1, minScaleValue: 2, maxScaleValue: 150, step: 2, handleNumber: 1 },
            { idNum: 2, minScaleValue: -10, maxScaleValue: 40, step: 1, handleNumber: 2 }];

            view.displaySliders(sliders);

            expect(view.renderedSliders.length).toEqual(sliders.length);

        });
        it('it will call function to add listeners for inputs', () => {
            
        });
    });

    describe('View can remove all sliders', () => {
        it('function clear() will remove every slider on the page', () => {
            let allSliders = document.querySelectorAll('.slider__mainContainer');
            expect(allSliders.length).not.toEqual(0);
            
            view.clear();

            expect(document.querySelectorAll('.slider__mainContainer').length).toEqual(0);
        });

    });


    



});



describe('SliderInterface', () => {
    it('can create', () => {
        let info = {
            idNum: 1,
            min: 9,
            max: 112,
            hanNum: 1
        }
        const inter: SliderInterface = new SliderInterface(info);
        expect(inter).not.toBe(null);
    });
});

