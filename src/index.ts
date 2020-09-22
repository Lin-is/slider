import './index.css'
import { valHooks } from 'jquery';
"use strict";

interface sliderInfo {
    idNum?: number,
    minValue?: number,
    maxValue?: number,
    step?: number,
    isRange?: boolean,
    startTogVals?: Array<number>,
    measure?: string,
    isVertical?: boolean,
}

class InterfaceElement {
    container: HTMLElement;
    info: sliderInfo;
    createElement(tag: string, className: string, idNum: number | string): Element {
        if (!tag || !className) {
            return;
        }
        let newElem = document.createElement(tag);
        newElem.className = className;
        newElem.id = className + '-' + idNum;
        return newElem as HTMLElement;
    };
    getCoords() {
        let coords = {
            top: this.container.getBoundingClientRect().top,
            bottom: this.container.getBoundingClientRect().bottom,
            left: this.container.getBoundingClientRect().left,
            right: this.container.getBoundingClientRect().right
        }
        return coords;
    };
}

class Observable {
    observers: Observer[];

    constructor() {
        this.observers = [];
    }
    sendMessage(msg: any) {
        for (var i = 0, len = this.observers.length; i < len; i++) {
            this.observers[i].notify(msg);
        }
        console.log("message sended", msg);
    };
    addObserver(observer: Observer) {
        this.observers.push(observer);
    };
}

class Observer {
    notify: any;
    constructor(behavior: any) {
        this.notify = function (msg: any) {
            behavior(msg);
        };
    }
}

class Model extends Observable {
    sliderData: sliderInfo;

    constructor(sliderData: sliderInfo) {
        super();
        this.sliderData = sliderData;
    }
    getMinValue(): number {
        return +this.sliderData.minValue;
    };
    getMaxValue(): number {
        return +this.sliderData.maxValue;
    };
    getStep(): number {
        return +this.sliderData.step;
    };
    getIsRangeInfo(): boolean {
        return this.sliderData.isRange;
    };
    getStartVals(): Array<number>{
        return this.sliderData.startTogVals;
    }
    getMeasure(): string {
        return this.sliderData.measure;
    }
    getIsVerticalInfo(): boolean {
        return this.sliderData.isVertical;
    }

    setMinValue(newMin: number) {
        this.sliderData.minValue = newMin;
        this.sendMessage({ "min": this.getMinValue() });
    }
    setMaxValue(newMax: number) {
        this.sliderData.maxValue = newMax;
        this.sendMessage({ "max": this.getMaxValue() });
    }
    setStep(newStep: number) {
        this.sliderData.step = newStep;
        this.sendMessage({ "step": this.getStep() });
    }
    updateIsRangeInfo(newData: boolean) {
        this.sliderData.isRange = newData;
        this.sendMessage({ "isRange": this.getIsRangeInfo() });
    }
    setMeasure(newMeasure: string) {
        this.sliderData.measure = newMeasure;
        this.sendMessage({ "measure": this.getMeasure() });
    }
    updateIsVerticalInfo(newData: boolean) {
        this.sliderData.isVertical = newData;
        this.sendMessage({ "isVertical": this.getIsVerticalInfo() });
    }

}
class Controller {
    view: View;
    model: Model;
    constructor(model: Model, view: View){
        this.model = model;
        this.view = view;
    }
}


class View {
    // model: Model;
    info: sliderInfo;
    scale: Scale;
    controlPanel: ControlPanel;
    container: HTMLElement;

    constructor(info: sliderInfo, parentElement: Element) {
        this.info = info;
        this.scale = new Scale(this.info);
        console.log(this.scale);
        this.controlPanel = new ControlPanel;
        this.render(parentElement);
        this.scale.renderSecStage();
    }
    render(parentElement: Element) {
        this.container = document.createElement("div");
        this.container.classList.add("slider__mainContainer");
        this.container.setAttribute("id", "slider__mainContainer-" + this.info.idNum);


        this.container.append(this.scale.container);
        this.container.append(this.controlPanel.container);
        

        parentElement.append(this.container);
        console.log(this.container);

        
    }



}

class Scale extends InterfaceElement {
    scale: Element;
    scaleID: string;
    info: sliderInfo;
    toggles: Array<Toggle>;
    progressBar: HTMLElement;

    constructor(info: sliderInfo) {
        super();
        this.toggles = [];
        this.info = info; 
        console.log("slider info", this.info);
        this.renderFirstStage();
    }

    renderFirstStage() {
        this.container = this.createElement("div", "slider__scaleContainer", this.info.idNum) as HTMLElement;
        this.scale = this.createElement("div", "slider__scale", this.info.idNum);
        if (this.info.isVertical) {
            this.container.classList.add("vertical");
            this.scale.classList.add("vertical");
        }
        this.container.append(this.scale);
        this.scaleID = this.scale.getAttribute("id");
    }

    renderSecStage() {
        let that = this;
        this.addToggles();
        this.toggles.forEach((toggle, index) => {
            let togCoord = that.calculateToggleValToCoord(that.info.startTogVals[index]);
            toggle.setPosition(togCoord, that.info.startTogVals[index]);
        })
    }

    addToggles(){
        console.log(this.scale);
        let progBarStartCoord = this.info.isVertical ? this.getCoords().left : this.getCoords().top,
            firstTog = new Toggle(this.info, this.info.startTogVals[0]);
        this.toggles.push(firstTog);
        let firstTogCoord = this.calculateToggleValToCoord(this.info.startTogVals[0]),
            progBarFinCoord = firstTogCoord;

        if (this.info.isRange) {
            let secTogCoord = this.calculateToggleValToCoord(this.info.startTogVals[1]),
                secTog = new Toggle(this.info, this.info.startTogVals[1]);

            this.toggles.push(secTog);
            progBarStartCoord = firstTogCoord;
            progBarFinCoord = secTogCoord;

            this.scale.append(firstTog.container);
            this.addProgressBar(progBarStartCoord, progBarFinCoord);
            this.scale.append(secTog.container);

        } else {
            this.addProgressBar(progBarStartCoord, progBarFinCoord);
            this.scale.append(firstTog.container);
        }
    }

    removeToggles(){
        this.toggles.forEach((toggle) => {
            toggle.remove();
        });
        this.toggles = [];
    }

    updateInfo(newInfo: sliderInfo) {
        console.log(this.info);
        this.info = newInfo;
        console.log(this.info);

    }

    addProgressBar(startCoord: number, endCoord: number){
        this.progressBar = this.createElement("div", "slider__progressBar", this.info.idNum) as HTMLElement;
        if (this.info.isVertical) {
            this.progressBar.classList.add("vertical");
        }
        this.scale.append(this.progressBar);
        this.progressBarSetCoords(startCoord, endCoord);
    }

    progressBarSetCoords(startCoord: number, endCoord: number){
        if (this.info.isRange) {
            if (this.info.isVertical) {
                this.progressBar.style.top = startCoord + "px";
                this.progressBar.style.height = endCoord - startCoord + "px";
            } else {
                this.progressBar.style.left = startCoord + "px";
                this.progressBar.style.width = endCoord - startCoord + "px";
            }
        } else {
            if (this.info.isVertical) {
                this.progressBar.style.top = "0px";
                this.progressBar.style.height = endCoord + "px";
            } else {
                this.progressBar.style.left = "0px";
                this.progressBar.style.width = endCoord + "px";
            }
        }

    }
    calculateToggleValToCoord(val: number): number {
        let scaleSize = this.info.isVertical ? this.scale.getBoundingClientRect().height : this.scale.getBoundingClientRect().width;
        let toggleSize = this.info.isVertical ? this.toggles[0].container.getBoundingClientRect().height : this.toggles[0].container.getBoundingClientRect().width;
        let coord = ((val - this.info.minValue) * (scaleSize - toggleSize)) / (this.info.maxValue - this.info.minValue);
        return coord;
    }
    calculateToggleCoordToVal(coord: number): number {
        let scaleSize = this.info.isVertical ? this.scale.getBoundingClientRect().height : this.scale.getBoundingClientRect().width;
        let toggleSize = this.info.isVertical ? this.scale.lastElementChild.getBoundingClientRect().height : this.scale.lastElementChild.getBoundingClientRect().width;
        let val = Math.round(((coord * (this.info.maxValue - this.info.minValue)) / (scaleSize - toggleSize)) + this.info.minValue);
        return val;
    }
    rotateVertical() {
        this.container.classList.add("vertical");
        this.scale.classList.add("vertical");
        this.progressBar.classList.add("vertical");
        this.toggles.forEach((toggle) => {
            toggle.rotateVertical();
        })
    }
    rotateHorizontal() {
        this.container.classList.remove("vertical");
        this.scale.classList.remove("vertical");
        this.progressBar.classList.remove("vertical");
        this.toggles.forEach((toggle) => {
            toggle.rotateHorizontal();
        })
    }

}

class Toggle extends InterfaceElement {
    label: HTMLElement;
    info: {
        idNum: number,
        isVertical: boolean,
    };
    constructor(info: sliderInfo, value: number) {
        super();
        this.info = {
            idNum: info.idNum,
            isVertical: info.isVertical,
        }
        this.create(value);
        console.log("toggle info", this.info);
    }
    create(value: number) {
        this.container = this.createElement("div", "slider__toggle", this.info.idNum) as HTMLElement;
        this.label = (this.createElement("div", "slider__toggleLabel", this.info.idNum)) as HTMLElement;
        this.label.innerHTML = value + "";
        this.container.append(this.label);
        if (this.info.isVertical)  {
            this.container.classList.add("vertical");
            this.label.classList.add("vertical");
        }
    }
    replaceIdWithElem() {

    }
    rotateVertical() {
        this.container.classList.add("vertical");
        this.label.classList.add("vertical");
    }
    rotateHorizontal() {
        this.container.classList.remove("vertical");
        this.label.classList.remove("vertical");
    }
    remove() {
        this.container.remove;
    }
    setPosition(coord: number, value: number): void {
        if (this.info.isVertical) {
            this.container.style.top = coord + "px";
        } else {
            this.container.style.left = coord + "px";
        }
        this.label.innerText = value + "";
    };

    getCoord(): number {
        let coord = this.container.getBoundingClientRect().left;
        if (this.info.isVertical) {
            coord = this.container.getBoundingClientRect().top;
        }
        return coord;
    };
    updateInfo(info: sliderInfo) {
        this.info.idNum = info.idNum;
        this.info.isVertical = info.isVertical;
    }
}

class ControlPanel extends InterfaceElement {
    constructor() {
        super();
    }
}

let containers = document.querySelectorAll(".slider-here");

for (let [index, elem] of containers.entries()) {
    createSlider({
        idNum: index + 1,
        minValue: 0,
        maxValue: 100,
        step: 5,
        isRange: true,
        startTogVals: [12, 75],
        measure: "standard",
        isVertical: false,
    }, elem);
}

function createSlider(info: sliderInfo,
    parentElement: Element) {
    const newModel = new Model(info);
    const newView = new View(info, parentElement);
    const app = new Controller(newModel, newView);
}

