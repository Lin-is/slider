import './index.css'
import { valHooks } from 'jquery';
"use strict";



interface sliderInfo {
    idNum?: number,
    minValue?: number,
    maxValue?: number,
    step?: number,
    isRange?: boolean,
    togVals?: Array<number | string>,
    measure?: string,
    isVertical?: boolean,
}

interface toggleMsg {
    order: number,
    newCoord: number,
}

interface scaleMsg {
    order: number,
    newVal: string,

    firstTogVal: number,
    secTogVal: number,
}

interface viewMsg {
    name: string,
    newVal: string | boolean,
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
            right: this.container.getBoundingClientRect().right,
            height: this.container.getBoundingClientRect().height,
            width: this.container.getBoundingClientRect().width,
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
            this.observers[i].update(msg);
        }
    };
    addObserver(observer: Observer) {
        this.observers.push(observer);
    };
}

class Observer {
    update: any;
    constructor(behavior: any) {
        this.update = function (msg: any) {
            behavior(msg);
        };
    }
}





/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */





//*--------------------------------------------------------------------------------------------
//*----MODEL-----------------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------


class Model extends Observable {
    sliderData: sliderInfo;

    constructor(sliderData: sliderInfo) {
        super();
        this.sliderData = sliderData;
    }

    updateInfo(msg: viewMsg) {
        switch (msg.name) {
            case "minValue": {
                this.setMinValue(+msg.newVal);
                break;
            }
            case "maxValue": {
                this.setMaxValue(+msg.newVal);
                break;
            }
            case "step": {
                this.setStep(+msg.newVal);
                break;
            }
            case "isRange": {
                if (typeof(msg.newVal) === "boolean") {
                    this.updateIsRangeInfo(msg.newVal);
                }
                break;
            }
            case "measure": {
                if (typeof (msg.newVal) === "string") {
                    this.setMeasure(msg.newVal);
                }
                break;
            }
            case "isVertical": {
                if (typeof (msg.newVal) === "boolean") {
                    this.updateIsVerticalInfo(msg.newVal);
                }
                break;
            }
            default: {
                console.log("Error: wrong name");
                break;
            }
        }
        console.log("UPDATED MODEL",this.sliderData);
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
    getStartVals(): Array<number | string>{
        return this.sliderData.togVals;
    }
    getMeasure(): string {
        return this.sliderData.measure;
    }
    getIsVerticalInfo(): boolean {
        return this.sliderData.isVertical;
    }
    getSliderData(): sliderInfo {
        return this.sliderData;
    }

    setMinValue(newMin: number) {
        this.sliderData.minValue = newMin;
    }
    setMaxValue(newMax: number) {
        this.sliderData.maxValue = newMax;
    }
    setStep(newStep: number) {
        this.sliderData.step = newStep;
    }
    updateIsRangeInfo(newData: boolean) {
        this.sliderData.isRange = newData;
    }
    setMeasure(newMeasure: string) {
        this.sliderData.measure = newMeasure;
    }
    updateIsVerticalInfo(newData: boolean) {
        this.sliderData.isVertical = newData;
    }

}

//*--------------------------------------------------------------------------------------------
//*----CONTROLLER------------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------

class Controller {
    view: View;
    model: Model;
    viewObserver: Observer;

    constructor(model: Model, view: View){
        this.model = model;
        this.view = view;
        this.viewObserver = new Observer(this.viewObserverFunc.bind(this));
        this.view.addObserver(this.viewObserver);
    }
    viewObserverFunc(newMsg: viewMsg) {
        this.model.updateInfo(newMsg);
        this.updateViewInfo();
    }
    updateViewInfo() {
        let newInfo = this.model.getSliderData();
        this.view.updateInfo(newInfo);
    }
}


//*--------------------------------------------------------------------------------------------
//*----VIEW------------------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------

class View {
    // model: Model;
    info: sliderInfo;
    scale: Scale;
    controlPanel: ControlPanel;
    container: HTMLElement;
    observers: Array<Observer>;
    scaleObserver: Observer;

    constructor(info: sliderInfo, parentElement: Element) {
        this.info = info;
        this.observers = [];
        this.scale = new Scale(this.info);
        this.controlPanel = new ControlPanel(info);
        this.scaleObserver = new Observer(this.scaleObserverFunc.bind(this));
        this.render(parentElement);
        this.scale.renderSecStage();
        this.scale.addDragAndDrop();
        this.controlPanel.addToggleInput(this.scale.toggles[0].info.order, this.info.togVals[0] + "", this.togInputListener.bind(this));
        if (this.info.isRange) {
            this.controlPanel.addToggleInput(this.scale.toggles[1].info.order, this.info.togVals[1] + "", this.togInputListener.bind(this));
        }
        this.addListeners();
        this.scale.addObserver(this.scaleObserver);
    };

    render(parentElement: Element) {
        this.container = document.createElement("div");
        this.container.classList.add("slider__mainContainer");
        this.container.setAttribute("id", "slider__mainContainer-" + this.info.idNum);

        this.container.append(this.scale.container);
        this.container.append(this.controlPanel.container);
        parentElement.append(this.container);
    };

    addListeners() {
        this.controlPanel.showToggleLabelsCheckbox.addEventListener("change", this.togLabelsCheckListener.bind(this))
        this.controlPanel.isVerticalRadio.addEventListener("change", this.rotateVerticalListener.bind(this));
        this.controlPanel.isHorizontalRadio.addEventListener("change", this.rotateHorizontalListener.bind(this));
        this.controlPanel.isSingleValRadio.addEventListener("change", this.singleValListener.bind(this));
        this.controlPanel.isRangeValRadio.addEventListener("change", this.rangeValListener.bind(this));
        this.controlPanel.minInput.addEventListener("change", this.minInputListener.bind(this));
        this.controlPanel.maxInput.addEventListener("change", this.maxInputListener.bind(this));
        this.controlPanel.stepInput.addEventListener("change", this.stepInputListener.bind(this));
    };



    togLabelsCheckListener(e: MouseEvent) {
        let checkbox = e.currentTarget as HTMLInputElement;
        if (checkbox.checked) {
            this.scale.showTogLabels(checkbox.checked);
        } else {
            this.scale.showTogLabels(checkbox.checked);
        }
    };
    rotateVerticalListener(e: MouseEvent) {
        let radio = e.currentTarget as HTMLInputElement;
        if (radio.checked) {
            this.sendMessage("isVertical", true);
            this.scale.rotateVertical();
        }
    };
    rotateHorizontalListener(e: MouseEvent) { 
        let radio = e.currentTarget as HTMLInputElement;
        if (radio.checked) {
            this.sendMessage("isVertical", false);
            this.scale.rotateHorizontal();
        }
    };
    singleValListener(e: MouseEvent) {
        let radio = e.currentTarget as HTMLInputElement;
        if (radio.checked) {
            this.sendMessage("isRange", false);
            this.updateAllTogInputs();
            this.scale.updateScale();
            if (this.info.togVals.length === 2) {
                this.info.togVals.pop();
            }
        }
        let check = this.controlPanel.showToggleLabelsCheckbox as HTMLInputElement;
        if (check.checked) {
            this.scale.showTogLabels(true);
        }
    };
    rangeValListener(e: MouseEvent) {   //!
        let radio = e.currentTarget as HTMLInputElement;
        let that = this;
        if (radio.checked && this.controlPanel.toggleInputsContainer.children.length === 1) {
            this.sendMessage("isRange", true);
            this.controlPanel.addToggleInput(1, this.info.maxValue + "", this.togInputListener.bind(this));
            this.info.togVals.push(this.info.maxValue);
            this.scale.updateScale();
        }
        let check = this.controlPanel.showToggleLabelsCheckbox as HTMLInputElement;
        if (check.checked) {
            this.scale.showTogLabels(true);
        }
    };
    togInputListener(e: MouseEvent) {
        let input = e.currentTarget as HTMLInputElement;
        let newVal = input.value;
        this.scale.moveToggle(+newVal, +input.getAttribute("data-toggleNum"));
    };

    minInputListener(e: MouseEvent) {
        let input = e.target as HTMLInputElement;
        let newVal = input.value;
        this.sendMessage("minValue", newVal);
        this.scale.recalcTogCoords();
        this.scale.recalcTogPositions();
    }
    maxInputListener(e: MouseEvent) {
        let input = e.target as HTMLInputElement;
        let newVal = input.value;
        this.sendMessage("maxValue", newVal);
        this.scale.recalcTogCoords();
        this.scale.recalcTogPositions();
    }
    stepInputListener(e: MouseEvent) {
        let input = e.target as HTMLInputElement;
        let newVal = input.value;
        this.sendMessage("step", newVal);
    }


    updateTogInput(order: number, newVal: string) {
        let input = this.controlPanel.toggleInputsContainer.children[order].lastElementChild as HTMLInputElement;
        input.value = newVal;
        this.info.togVals[order] = newVal;
    };
    updateInfo(info: sliderInfo) {
        this.info = info;
        this.scale.updateInfo(info);
        this.controlPanel.updateInfo(info);
        console.log("UPDATED VIEW", this.info);
    };
    updateAllTogInputs() {
        if (this.controlPanel.toggleInputsContainer.children.length === 2 && !this.info.isRange) {
            this.controlPanel.toggleInputsContainer.lastElementChild.remove();
        }
        if (this.controlPanel.toggleInputsContainer.children.length === 1 && this.info.isRange) {
            this.controlPanel.addToggleInput(this.scale.toggles[1].info.order, this.info.togVals[1] + "", this.togInputListener.bind(this));
        }
    };

    sendMessage(name: string, newVal: string | boolean) {
        let msg = {
            name:name,
            newVal: newVal,
        }
        for (let i = 0, len = this.observers.length; i < len; i++) {
            this.observers[i].update(msg);
        }
        console.log(`view message sended`, msg);
    };
    addObserver(observer: Observer) {
        this.observers.push(observer);
    };
    scaleObserverFunc(msg: scaleMsg) {
        this.updateTogInput(msg.order, msg.newVal);
    };
}




//*--------------------------------------------------------------------------------------------
//*----SCALE-----------------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------


class Scale extends InterfaceElement {
    scale: HTMLElement;
    scaleID: string;
    info: sliderInfo;
    toggles: Array<Toggle>;
    observers: Array<Observer>;
    togCoords: {
        firstTog: number,
        secTog: number,
    }
    progressBar: HTMLElement;
    togObserver: Observer;
    labelUpdateObserver: Observer;

    constructor(info: sliderInfo) {
        super();
        this.toggles = [];
        this.observers = [];
        this.info = info; 
        this.togCoords = {
            firstTog: undefined,
            secTog: undefined,
        };
        this.renderFirstStage();
        this.labelUpdateObserver = new Observer(this.togObserverUpdateLabelFunc.bind(this));
        this.togObserver = new Observer(this.togObserverFunc.bind(this));
    };
    sendMessage(order: number, newVal: string, firstTogVal?: number | string, secTogVal?: number | string) {
        let msg ={
            order: order,
            newVal: newVal,
        }
        for (let i = 0, len = this.observers.length; i < len; i++) {
            this.observers[i].update(msg);
        }
    };
    addObserver(observer: Observer) {
        this.observers.push(observer);
    };

    updateInfo(newInfo: sliderInfo) {
        this.info = newInfo;
        this.updateDradAndDropInfo();
        this.toggles.forEach(toggle => {
            toggle.updateInfo(newInfo);
        });
        console.log("UPDATED SCALE", this.info);
    };
    updateDradAndDropInfo() {  //update info about start and fin coords for every toggle drag and drop function
        let scaleSize = this.info.isVertical ? this.scale.getBoundingClientRect().height : this.scale.getBoundingClientRect().width,
            togSize = this.info.isVertical ? this.toggles[0].container.offsetHeight : this.toggles[0].container.offsetWidth,
            scaleStart = this.info.isVertical ? this.scale.getBoundingClientRect().top : this.scale.getBoundingClientRect().left,
            finEdge = scaleSize - togSize,
            startEdge = 0,
            that = this;

        for (let i = 0; i < this.toggles.length; i++) {
            finEdge = scaleSize - togSize;
            startEdge = 0;

            if (i === 0 && this.info.isRange) {
                finEdge = that.togCoords.secTog - togSize;
            }
            if (i === 1) {
                startEdge = that.togCoords.firstTog + togSize;
            }
            this.toggles[i].updateDragAndDropInfo(startEdge, finEdge, scaleStart, this.calcStepSize());
        }
    };
    updateScale() {  //remove toggles and create again
        this.removeToggles();
        this.renderSecStage();
        this.addDragAndDrop();
    };

    renderFirstStage() {    //add scale container and scale
        this.container = this.createElement("div", "slider__scaleContainer", this.info.idNum) as HTMLElement;
        this.scale = (this.createElement("div", "slider__scale", this.info.idNum)) as HTMLElement;
        if (this.info.isVertical) {
            this.container.classList.add("vertical");
            this.scale.classList.add("vertical");
        }
        this.container.append(this.scale);
        this.scaleID = this.scale.getAttribute("id");
    };
    renderSecStage() {  //add toggles, set toggles first positions
        let that = this;
        this.addToggles();
        this.toggles.forEach((toggle, index) => {
            let togCoord = that.calculateToggleValToCoord(that.info.togVals[index]);
            toggle.setPosition(togCoord);
            toggle.updateLabel(that.info.togVals[index]);
            index === 0 ? that.togCoords.firstTog = togCoord : that.togCoords.secTog = togCoord;
        });
    };
    addToggles() {  // create toggles and progress bar
        let progBarStartCoord = this.info.isVertical ? this.getCoords().left : this.getCoords().top,
            firstTog = new Toggle(this.info, this.info.togVals[0], 0);
            firstTog.addObserver(this.labelUpdateObserver);
            firstTog.addObserver(this.togObserver);
        this.toggles.push(firstTog);
        let firstTogCoord = this.calculateToggleValToCoord(this.info.togVals[0]);
        this.togCoords.firstTog = firstTogCoord;

        if (this.info.isRange) {
            let secTogCoord = this.calculateToggleValToCoord(this.info.togVals[1]),
                secTog = new Toggle(this.info, this.info.togVals[1], 1);
                secTog.addObserver(this.labelUpdateObserver);
                secTog.addObserver(this.togObserver);

            this.toggles.push(secTog);
            this.togCoords.secTog = secTogCoord;
            this.scale.append(firstTog.container);
            this.addProgressBar(firstTogCoord, secTogCoord);
            this.scale.append(secTog.container);

        } else {
            this.addProgressBar(progBarStartCoord, firstTogCoord);
            this.scale.append(firstTog.container);
            this.togCoords.secTog = undefined;
        }
    };
    moveToggle(newVal: number | string, togOrder: number) {
        if (newVal > this.info.maxValue ) {
            newVal = this.info.maxValue;
        }
        if (newVal < this.info.minValue) {
            newVal = this.info.minValue;
        }
        let newCoord = this.calculateToggleValToCoord(newVal);
        this.toggles[togOrder].setPosition(newCoord);
        this.toggles[togOrder].updateLabel(newVal);
        this.updateProgressBar();
    };
    recalcTogCoords() {//after changing min or max vals
        this.togCoords.firstTog = this.calculateToggleValToCoord(this.info.togVals[0]);
        if (this.info.isRange) {
            this.togCoords.secTog = this.calculateToggleValToCoord(this.info.togVals[1]);
        }
    };
    recalcTogPositions() { //set new positions for toggles and update progress bar
        this.recalcTogCoords();
        this.moveToggle(this.info.togVals[0], 0);
        if (this.info.isRange) {
            this.moveToggle(this.info.togVals[1], 1);
            this.progressBarSetCoords(this.togCoords.firstTog, this.togCoords.secTog);
        } else {
            this.info.isVertical ? this.progressBarSetCoords(this.getCoords().top, this.togCoords.firstTog) : this.progressBarSetCoords(this.getCoords().left, this.togCoords.firstTog)
        }
    };
    showTogLabels(toShow: boolean) { //show or hide tog labels
        this.toggles.forEach(toggle => {
            if (toShow) {
                toggle.showLabel();
            } else {
                toggle.hideLabel();
            }
        });
    };
    addDragAndDrop() {  


        // stepSize = Math.round((scale.offsetWidth - toggle.offsetWidth) / stepNumber);
        // if (isVertical) {
        //     stepSize = (scale.getBoundingClientRect().height - toggle.getBoundingClientRect().height) / stepNumber;
        // }
        // let finCoord = Math.round(newCoord / stepSize) * stepSize;

        let that = this;
        that.updateDradAndDropInfo();
        this.toggles.forEach((toggle) => {
            toggle.addDragAndDrop();
        });
    };
    removeToggles(){
        this.toggles = [];
        while (this.scale.children.length > 0) {
            this.scale.lastElementChild.remove();
        }
    };
    calcStepSize(): number {
        let stepSize: number;
        let stepNumber = (this.info.maxValue - this.info.minValue) / this.info.step;
        stepSize = (this.scale.getBoundingClientRect().width - this.toggles[0].container.offsetWidth) / stepNumber;
        if (this.info.isVertical) {
            stepSize = (this.scale.getBoundingClientRect().height - this.toggles[0].container.offsetHeight) / stepNumber;
        }
        return stepSize;
    }
    addProgressBar(startCoord: number, endCoord: number){
        this.progressBar = this.createElement("div", "slider__progressBar", this.info.idNum) as HTMLElement;
        if (this.info.isVertical) {
            this.progressBar.classList.add("vertical");
        }
        this.scale.append(this.progressBar);
        this.progressBarSetCoords(startCoord, endCoord);
    };
    progressBarSetCoords(startCoord: number, endCoord: number){
        let halfTogSize = (this.info.isVertical ? this.toggles[0].container.offsetHeight : this.toggles[0].container.offsetWidth) / 2;
        if (this.info.isRange) {
            if (this.info.isVertical) {
                this.progressBar.style.top = startCoord + halfTogSize + "px";
                this.progressBar.style.height = endCoord - startCoord + halfTogSize + "px";
            } else {
                this.progressBar.style.left = startCoord + halfTogSize + "px";
                this.progressBar.style.width = endCoord - startCoord + halfTogSize + "px";
            }
        } else {
            if (this.info.isVertical) {
                this.progressBar.style.top = "0px";
                this.progressBar.style.height = endCoord + halfTogSize + "px";
            } else {
                this.progressBar.style.left = "0px";
                this.progressBar.style.width = endCoord + halfTogSize + "px";
            }
        }
    };
    updateProgressBar() {
        let start = this.info.isRange ? this.togCoords.firstTog : 0;
        let fin = this.info.isRange ? this.togCoords.secTog : this.togCoords.firstTog;
        this.progressBarSetCoords(start, fin);
    };

    calculateToggleValToCoord(val: number | string): number {
        let calcVal = +val;
        let scaleSize = this.info.isVertical ? this.scale.getBoundingClientRect().height : this.scale.getBoundingClientRect().width;
        let toggleSize = this.info.isVertical ? this.toggles[0].container.getBoundingClientRect().height : this.toggles[0].container.getBoundingClientRect().width;
        let coord = ((calcVal - this.info.minValue) * (scaleSize - toggleSize)) / (this.info.maxValue - this.info.minValue);
        return coord;
    };
    calculateToggleCoordToVal(coord: number): number {
        let scaleSize = this.info.isVertical ? this.scale.getBoundingClientRect().height : this.scale.getBoundingClientRect().width;
        let toggleSize = this.info.isVertical ? this.scale.lastElementChild.getBoundingClientRect().height : this.scale.lastElementChild.getBoundingClientRect().width;
        let val = Math.round(((coord * (this.info.maxValue - this.info.minValue)) / (scaleSize - toggleSize)) + this.info.minValue);
        // let val = ((coord * (this.info.maxValue - this.info.minValue)) / (scaleSize - toggleSize)) + this.info.minValue;
        return val;
    };
    rotateVertical() {
        this.container.classList.add("vertical");
        this.scale.classList.add("vertical");
        this.progressBar.classList.add("vertical");
        this.toggles.forEach((toggle) => {
            toggle.rotateVertical();
        });
        this.progressBar.style.width = "100%";
        this.progressBar.style.left = "0px";
        this.updateProgressBar();
    };
    rotateHorizontal() {
        this.container.classList.remove("vertical");
        this.scale.classList.remove("vertical");
        this.progressBar.classList.remove("vertical");
        this.toggles.forEach((toggle) => {
            toggle.rotateHorizontal();
        });
        this.progressBar.style.height = "100%";
        this.progressBar.style.top = "0px";
        this.updateProgressBar();
    };


    //updating data about tog positions in movement; using for updating tog labels and vals of tog inputs
    togObserverUpdateLabelFunc(msg: toggleMsg) { 
        let val = this.calculateToggleCoordToVal(msg.newCoord);
        this.toggles[msg.order].updateLabel(val);
        if (msg.order === 0) {
            this.togCoords.firstTog = msg.newCoord;
        } else if (msg.order === 1) {
            this.togCoords.secTog = msg.newCoord;
        }
        this.updateProgressBar();
        this.sendMessage(msg.order, val + "");
    };

    togObserverFunc(msg: toggleMsg) {
        let val = this.calculateToggleCoordToVal(msg.newCoord);
        if (msg.order === 0) {
            this.togCoords.firstTog = msg.newCoord;
        } else if (msg.order === 1) {
            this.togCoords.secTog = msg.newCoord;
        }
        this.sendMessage(msg.order, val + "", "");
        this.updateDradAndDropInfo();
        this.updateProgressBar();
    };
};



//*--------------------------------------------------------------------------------------------
//*----TOGGLE----------------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------


class Toggle extends InterfaceElement {
    label: HTMLElement;
    info: {
        idNum: number,
        isVertical: boolean,
        order: number,
    };
    dragAndDropInfo: {
        startEdge: number,
        finEdge: number,
        scaleStart: number,
        stepSize: number,
    }

    observers: Observer[];
    sendMessage(msg: toggleMsg) {
        for (let i = 1, len = this.observers.length; i < len; i++) {
            this.observers[i].update(msg);
        }
        console.log(`toggle ${this.info.order} message sended`, msg);
    };
    sendMessageToUpdateLabel(msg: toggleMsg) {
        this.observers[0].update(msg);
    }
    addObserver(observer: Observer) {
        this.observers.push(observer);
    };

    constructor(info: sliderInfo, value: number | string, order: number) {
        super();
        this.observers = [];
        this.info = {
            idNum: info.idNum,
            isVertical: info.isVertical,
            order: order,
        }
        this.dragAndDropInfo = {
            startEdge: undefined,
            finEdge: undefined,
            scaleStart: undefined,
            stepSize: undefined,
        }
        this.create(value, order);
    }

    create(value: number | string, order: number) {
        this.container = this.createElement("div", "slider__toggle", this.info.idNum) as HTMLElement;
        this.container.setAttribute("id", this.container.getAttribute("id") + "-" + (order + 1));
        this.label = (this.createElement("div", "slider__toggleLabel", this.info.idNum)) as HTMLElement;
        this.label.innerHTML = value + "";
        this.label.setAttribute("id", this.label.getAttribute("id") + "-" + (order + 1));
        this.label.classList.add("hidden");
        this.container.append(this.label);
        if (this.info.isVertical)  {
            this.container.classList.add("vertical");
            this.label.classList.add("vertical");
        }
    };

    rotateVertical() {
        this.container.classList.add("vertical");
        this.label.classList.add("vertical");
        this.container.style.top = this.container.style.left;
        this.container.style.left = -7 + "px";
        let msg = {
            order: this.info.order,
            newCoord: parseInt(this.container.style.top),
        } 
        this.sendMessage(msg);
    };
    rotateHorizontal() {
        this.container.classList.remove("vertical");
        this.label.classList.remove("vertical");
        this.container.style.left = this.container.style.top;
        this.container.style.top = -7 + "px";
        let msg = {
            order: this.info.order,
            newCoord: parseInt(this.container.style.left),
        }
        this.sendMessage(msg);
    };
    showLabel() {
        if (this.label.classList.contains("hidden")) {
            this.label.classList.remove("hidden");
        }
    };
    hideLabel() {
        if (!this.label.classList.contains("hidden")) {
            this.label.classList.add("hidden");
        }
    };
    remove() {
        this.container.remove;
    };
    setPosition(coord: number): void {
        if (this.info.isVertical) {
            this.container.style.top = coord + "px";
        } else {
            this.container.style.left = coord + "px";
        }
        let msg = {
            order: this.info.order,
            newCoord: coord,
        }
        this.sendMessage(msg);
    };
    getCoord(): number {
        let coord = this.container.getBoundingClientRect().left;
        if (this.info.isVertical) {
            coord = this.container.getBoundingClientRect().top;
        }
        return coord;
    };

    updateLabel(value: number | string) {
        this.label.innerText = value + "";
    };
    updateInfo(info: sliderInfo) {
        this.info.idNum = info.idNum;
        this.info.isVertical = info.isVertical;
        console.log("UPDATED TOGGLE", this.info);
    };
    updateDragAndDropInfo(startEdge: number, finEdge: number, scaleStart: number, stepSize: number) {
        this.dragAndDropInfo.startEdge = startEdge;
        this.dragAndDropInfo.finEdge = finEdge;
        this.dragAndDropInfo.scaleStart = scaleStart;
        this.dragAndDropInfo.stepSize = stepSize;
    };
    addDragAndDrop() {
        let that = this, 
            toggle = this.container;

        toggle.addEventListener('mousedown', function (event: MouseEvent) {
            let shift: number,
                newCoord: number,
                eventClient: number,
                msg: toggleMsg;

            event.preventDefault();

            if (that.info.isVertical) {
                shift = event.clientY - toggle.getBoundingClientRect().top;
            } else {
                shift = event.clientX - toggle.getBoundingClientRect().left;
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            function onMouseMove(event: MouseEvent) {
                if (that.info.isVertical) {
                    eventClient = event.clientY;
                } else {
                    eventClient = event.clientX;
                }
    
                newCoord = eventClient - shift - that.dragAndDropInfo.scaleStart;

                if (newCoord < that.dragAndDropInfo.startEdge) {
                    newCoord = that.dragAndDropInfo.startEdge;
                }
                if (newCoord > that.dragAndDropInfo.finEdge) {
                    newCoord = that.dragAndDropInfo.finEdge;
                }
                let finCoord = Math.round(newCoord / that.dragAndDropInfo.stepSize) * that.dragAndDropInfo.stepSize;

                if (that.info.isVertical) {
                    toggle.style.top = finCoord + "px";
                } else {
                    toggle.style.left = finCoord + "px";
                }
                
                msg = {
                    order: that.info.order,
                    newCoord: finCoord,
                }  
                that.sendMessageToUpdateLabel(msg);
            };
            function onMouseUp() {
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('mousemove', onMouseMove);
                that.sendMessage(msg);
            };
        });
        this.container.addEventListener("ondragstart", function () {
            return false;
        });
    };
};


//*--------------------------------------------------------------------------------------------
//*----CONTROL PANEL---------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------


class ControlPanel extends InterfaceElement {

    showToggleLabelsCheckbox: HTMLElement;
    minInput: HTMLElement;
    maxInput: HTMLElement;
    stepInput: HTMLElement;
    isHorizontalRadio: HTMLElement;
    isVerticalRadio: HTMLElement;
    isSingleValRadio: HTMLElement;
    isRangeValRadio: HTMLElement
    toggleInputsContainer: HTMLElement;


    info: {
        idNum: number, 
        minValue: number,
        maxValue: number,
        step: number,
        isRange: boolean,
        isVertical: boolean,
    }

    constructor(info: sliderInfo) {
        super();
        this.info = {
            idNum: info.idNum,
            minValue: info.minValue,
            maxValue: info.maxValue,
            step: info.step,
            isRange: info.isRange,
            isVertical: info.isVertical,
        }
        this.render();
    }

    render(): void {
        this.container = this.createElement("div", "slider__controlElements", this.info.idNum) as HTMLElement;
        this.toggleInputsContainer = this.createElement("div", "slider__toggleControlContainer", this.info.idNum) as HTMLElement;
        let inputsContainer = this.createElement("div", "slider__inputsContainer", this.info.idNum);
        let viewRadioContainer = this.createElement("div", "slider__radioContainer", this.info.idNum);

        this.showToggleLabelsCheckbox = this.createInput("slider__showValsCheck", "checkbox");
        this.minInput = this.createInput("slider__input slider__input_min", "text", "", this.info.minValue + "");
        this.maxInput = this.createInput("slider__input slider__input_max", "text", "", this.info.maxValue + "");
        this.stepInput = this.createInput("slider__input slider__input_step", "text", "", this.info.step + "");
        this.isHorizontalRadio = this.createInput("slider__viewRadio slider__viewRadio_horizontal", "radio", "slider__viewRadio -" + this.info.idNum, "horizontal", "");
        this.isVerticalRadio = this.createInput("slider__viewRadio slider__viewRadio_vertical", "radio", "slider__viewRadio -" + this.info.idNum, "vertical", "");
        this.isSingleValRadio = this.createInput("slider__isRangeRadio slider__isRangeRadio_single", "radio", "slider__isRangeRadio-" + this.info.idNum, "single", "");
        this.isRangeValRadio = this.createInput("slider__isRangeRadio slider__isRangeRadio_range", "radio", "slider__isRangeRadio-" + this.info.idNum, "range", "");
        
        let checkboxLabel = this.createLabel("slider__showValsCheckLabel", "Показать значения ползунков", this.showToggleLabelsCheckbox.id);
        let minInputLabel = this.createLabel("slider__inputLabel slider__inputLabel_min", "Min:", this.minInput.id);
        let maxInputLabel = this.createLabel("slider__inputLabel slider__inputLabel_max", "Max:", this.maxInput.id);
        let stepInputLabel = this.createLabel("slider__inputLabel slider__inputLabel_step", "Шаг:", this.maxInput.id);
        let radioCommonLabel = this.createLabel("slider__radioCommonLabel", "Вид слайдера:");
        let radioHorizontalLabel = this.createLabel("slider__radioLabel", "Горизонтальный", this.isHorizontalRadio.id);
        let radioVerticalLabel = this.createLabel("slider__radioLabel", "Вертикальный", this.isVerticalRadio.id);
        let radioRangeLabel = this.createLabel("slider__radioCommonLabel", "Тип значения:"); //viewRadioValTypeLabel
        let radioSingleValLabel = this.createLabel("slider__radioLabel", "Значение", this.isSingleValRadio.id);
        let radioRangeValLabel = this.createLabel("slider__radioLabel", "Интервал", this.isRangeValRadio.id);

        this.info.isVertical ? this.isVerticalRadio.setAttribute("checked", "true") :  this.isHorizontalRadio.setAttribute("checked", "true");
        this.info.isRange ? this.isRangeValRadio.setAttribute("checked", "true") : this.isSingleValRadio.setAttribute("checked", "true");

        this.container.append(this.showToggleLabelsCheckbox);
        this.container.append(checkboxLabel);

        this.container.append(inputsContainer);
        inputsContainer.append(minInputLabel);
        minInputLabel.append(this.minInput);
        inputsContainer.append(maxInputLabel);
        maxInputLabel.append(this.maxInput);
        inputsContainer.append(stepInputLabel);
        stepInputLabel.append(this.stepInput);

        this.container.append(viewRadioContainer);
        viewRadioContainer.append(radioCommonLabel);
        viewRadioContainer.append(this.isHorizontalRadio);
        viewRadioContainer.append(radioHorizontalLabel);
        viewRadioContainer.append(this.isVerticalRadio);
        viewRadioContainer.append(radioVerticalLabel);
        viewRadioContainer.append(radioRangeLabel);
        viewRadioContainer.append(this.isSingleValRadio);
        viewRadioContainer.append(radioSingleValLabel);
        viewRadioContainer.append(this.isRangeValRadio);
        viewRadioContainer.append(radioRangeValLabel);

        this.container.append(this.toggleInputsContainer);
    }
    createInput(className: string, type = "text", name?: string, value?: string, placeholder?: string, isChecked?: boolean): HTMLElement {
        let newInput = this.createElement("input", className, this.info.idNum) as HTMLElement;
        newInput.setAttribute("type", type);
        if (name !== undefined && name !== "") {
            newInput.setAttribute("name", name);
        }
        if (value !== undefined && value !== "") {
            newInput.setAttribute("value", value);
        }
        if (placeholder !== undefined && placeholder !== "") {
            newInput.setAttribute("placeholder", placeholder);
        }
        if (isChecked !== undefined) {
            newInput.setAttribute("checked", isChecked + "");
        }
        return newInput;
    }
    createLabel(className: string, text?: string, forAttr?: string): HTMLElement {
        let newLabel = this.createElement("label", className, this.info.idNum) as HTMLElement;
        if (forAttr) {
            newLabel.setAttribute("for", forAttr);
        }
        if (text) {
            newLabel.innerHTML = text;
        }
        return newLabel;
    }
    addToggleInput(toggleOrder: number, value: string, listener: any) {
        let idPostfix = toggleOrder + 1;
        let toggleControl = document.createElement("div");
        toggleControl.setAttribute("class", "slider__toggleControl");
        toggleControl.setAttribute("id", "slider__toggleControl-" + this.info.idNum + "-" + idPostfix);

        let toggleValueField = this.createInput("slider__toggleValueField", "text", "", "");
        toggleValueField.setAttribute("id", toggleValueField.getAttribute("id") + "-" + idPostfix);
        toggleValueField.setAttribute("data-toggleNum", toggleOrder + "");
        toggleValueField.setAttribute("value", value);
    
        let toggleValueFieldLabel = this.createLabel("slider__toggleValueFieldLabel", idPostfix + ": ", toggleValueField.id);
        toggleValueFieldLabel.setAttribute("id", toggleValueFieldLabel.getAttribute("id") + "-" + idPostfix);

        this.toggleInputsContainer.append(toggleControl);
        toggleControl.append(toggleValueFieldLabel);
        toggleControl.append(toggleValueField);
        toggleValueField.addEventListener("change", listener)
    }
    updateInfo(info: sliderInfo) {
        this.info = {
            idNum: info.idNum,
            minValue: info.minValue,
            maxValue: info.maxValue,
            step: info.step,
            isRange: info.isRange,
            isVertical: info.isVertical,
        }
        console.log("UPDATED CONTROL PANEL", this.info);
    }
};





let containers = document.querySelectorAll(".slider-here");

for (let [index, elem] of containers.entries()) {
    createSlider({
        idNum: index + 1,
        minValue: 0,
        maxValue: 100,
        step: 5,
        isRange: true,
        togVals: [25, 75],
        measure: "standard",
        isVertical: true,
    }, elem);
}

function createSlider(info: sliderInfo,
    parentElement: Element) {
    let app = new Controller(new Model(info), new View(info, parentElement));
}

// let info = {
//     idNum: 1,
//         minValue: 0,
//         maxValue: 100,
//         step: 5,
//         isRange: true,
//         startTogVals: [25, 75],
//         measure: "standard",
//         isVertical: false,
// }
// let app = createSlider(info, containers[0]);
// app.view.scale.removeToggles();
