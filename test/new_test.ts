import { SliderInterface } from '../src/index'
import { Observer } from '../src/index'
import { Observable } from '../src/index'
import { Model } from '../src/index'
import { Controller } from '../src/index'
import { View } from '../src/index'


// describe ('Observable', () => {
//     it('can create', () => {
//         const observable: Observable = new Observable();
//         expect(observable).not.toBe(null);

//     });
// });


// describe ('Observer', () => {
//     let testMsg = "Hello, it's test msg";
//     let testNotify = function (testMsg: any): void {
//         console.log(testMsg);
//     }
//     it('can create', () => {
//         const observer: Observer = new Observer(testNotify(testMsg));
//         expect(observer).not.toBe(null);
//     })
// });


describe('Model', () => {

    let testModel: Model = new Model();

    it('can create', () => {
        expect(testModel).not.toBe(null);
    })

    it('can add new slider to array of sliders', () => {
        testModel.addSlider(-5, 145, 2);
        expect(testModel.sliders).toContain({
            idNum: 3,
            minScaleValue: -5,
            maxScaleValue: 145,
            step: 2,
            handleNumber: 1,
        });
    });

    

    describe('setters', () => {
        
        it('can set new minimum value for slider with chosen id', () => {
            let newMin = -20;
            let idNum = 1;
            testModel.setMinScaleValue(idNum, newMin);
            expect(testModel.getMinScaleValue(idNum)).toEqual(newMin);
            expect(testModel.sliders[idNum - 1].minScaleValue).toEqual(newMin);
        });

        it('can set new maximum value for slider with chosen id', () => {
            let newMax = 143;
            let idNum = 1;
            testModel.setMaxScaleValue(idNum, newMax);
            expect(testModel.getMaxScaleValue(idNum)).toEqual(newMax);
            expect(testModel.sliders[idNum - 1].maxScaleValue).toEqual(newMax);
        });

        it('can set new step value for slider with chosen id', () => {
            let newStep = 1;
            let idNum = 1;
            testModel.setStep(idNum, newStep);
            expect(testModel.getStep(idNum)).toEqual(newStep);
            expect(testModel.sliders[idNum - 1].step).toEqual(newStep);
        });

        it('can set new toggle number for slider with chosen id', () => {
            let newNumber = 2;
            let idNum = 1;
            testModel.setHandleNumberValue(idNum, newNumber);
            expect(testModel.getHandleNumberValue(idNum)).toEqual(newNumber);
            expect(testModel.sliders[idNum - 1].handleNumber).toEqual(newNumber);
        });
    });

    describe('getters', () => {

        it('can find slider in array by id', () => {
            let idNumToSearch = 2;
            let foundedSlider = testModel.findSliderById(idNumToSearch);
            expect(foundedSlider).toEqual({
                idNum: 2,
                minScaleValue: -30,
                maxScaleValue: 200,
                step: 5,
                handleNumber: 2
            });
        });

        it('can get minimum value by id', () => {
            let expectedVal = -30;
            let foundedVal = testModel.getMinScaleValue(2);
            expect(foundedVal).toEqual(expectedVal);
        });

        it('can get maximum value by id', () => {
            let expectedVal = 200;
            let foundedVal = testModel.getMaxScaleValue(2);
            expect(foundedVal).toEqual(expectedVal);
        });

        it('can get step value by id', () => {
            let expectedVal = 5;
            let foundedVal = testModel.getStep(2);
            expect(foundedVal).toEqual(expectedVal);
        });

        it('can get number of toggles by id', () => {
            let expectedVal = 2;
            let foundedVal = testModel.getHandleNumberValue(2);
            expect(foundedVal).toEqual(expectedVal);
        });
    });
});



// describe ('View', () => {
//     let testSlider ={
//         idNum: 4,
//         minScaleValue: 3,
//         maxScaleValue: 145,
//         step: 1,
//         handleNumber: 1,
//     }

//     let testModel: Model = new Model();

//     it('can create', () => {
//         const view: View = new View(testModel);
//         expect(view).not.toBe(null);
//     });
    

// });



// describe('SliderInterface', () => {
//     it('can create', () => {
//         let info = {
//             idNum: 1,
//             min: 9,
//             max: 112,
//             hanNum: 1
//         }
//         const inter: SliderInterface = new SliderInterface(info);
//         expect(inter).not.toBe(null);
//     });
// });

