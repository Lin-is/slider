import { SliderInterface } from '../src/index'
import { Observer } from '../src/index'
import { Observable } from '../src/index'
import { Model } from '../src/index'
import { Controller } from '../src/index'
import { View } from '../src/index'

describe('SliderInterface', () => {
    it('can create', () => {
        let info = {
            idNum: 1,
            min: 9, 
            max: 112,
            hanNum: 1
        }
        const inter: SliderInterface  = new SliderInterface(info);
        expect(inter).not.toBe(null);
    });
});

describe ('Observable', () => {
    it('can create', () => {
        const observable: Observable = new Observable();
        expect(observable).not.toBe(null);

    });
});

describe ('View', () => {
    it('can create', () => {
        let model = 'model';
        const view: View = new View(model);
        expect(view).not.toBe(null);
    })
})

