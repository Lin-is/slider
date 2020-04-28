import { SliderInterface } from '../src/slider'
import { Observer } from '../src/slider'
import { Observable } from '../src/slider'
import { Model } from '../src/slider'
import { Controller } from '../src/slider'
import { View } from '../src/slider'

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