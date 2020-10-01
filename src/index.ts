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

interface toggleMsg {
    order: number,
    newCoord: number,
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
        console.log("message sended", msg);
    };
    addObserver(observer: Observer) {
        this.observers.push(observer);
    };
}

class Observer {
    update: any;
    constructor(behavior: any) {
        this.update = function (msg: any) {
            console.log("observer update");
            console.log(msg);
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
        console.log("MODEL UPDATED", this.sliderData)
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
    getSliderData(): sliderInfo {
        return this.sliderData;
    }

    setMinValue(newMin: number) {
        this.sliderData.minValue = newMin;
        // this.sendMessage({ "min": this.getMinValue() });
    }
    setMaxValue(newMax: number) {
        this.sliderData.maxValue = newMax;
        // this.sendMessage({ "max": this.getMaxValue() });
    }
    setStep(newStep: number) {
        this.sliderData.step = newStep;
        // this.sendMessage({ "step": this.getStep() });
    }
    updateIsRangeInfo(newData: boolean) {
        this.sliderData.isRange = newData;
        // this.sendMessage({ "isRange": this.getIsRangeInfo() });
    }
    setMeasure(newMeasure: string) {
        this.sliderData.measure = newMeasure;
        // this.sendMessage({ "measure": this.getMeasure() });
    }
    updateIsVerticalInfo(newData: boolean) {
        this.sliderData.isVertical = newData;
        // this.sendMessage({ "isVertical": this.getIsVerticalInfo() });
    }

}

class Controller {
    view: View;
    model: Model;
    viewObserver: Observer;

    constructor(model: Model, view: View){
        console.log("controller is here");
        this.model = model;
        this.view = view;
        this.viewObserver = new Observer(this.viewObserverFunc.bind(this));
        this.view.addObserver(this.viewObserver);
        this.viewObserver.update({name: "isVertical", newVal: true});
        console.log(this.view.observers);
    }
    viewObserverFunc(newMsg: viewMsg) {
        console.log("from Controller observer");
        this.updateViewInfo();
        this.model.updateInfo(newMsg);
        
    }
    updateViewInfo() {
        let newInfo = this.model.getSliderData();
        this.view.updateInfo(newInfo);
    }
}


class View {
    // model: Model;
    info: sliderInfo;
    scale: Scale;
    controlPanel: ControlPanel;
    container: HTMLElement;
    observers: Array<Observer>;

    constructor(info: sliderInfo, parentElement: Element) {
        this.info = info;
        this.observers = [];
        this.scale = new Scale(this.info);
        this.controlPanel = new ControlPanel(info);
        this.render(parentElement);
        this.scale.renderSecStage();
        this.scale.addDragAndDrop();
        this.controlPanel.addToggleInput(this.scale.toggles[0].info.order, this.info.startTogVals[0] + "");
        if (this.info.isRange) {
            this.controlPanel.addToggleInput(this.scale.toggles[1].info.order, this.info.startTogVals[1] + "");
        }
        this.addListeners();
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
        let msg: viewMsg;
        msg = {
            name: "isVertical",
            newVal: true,
        }
        this.sendMessage(msg);
        let radio = e.currentTarget as HTMLInputElement;
        if (radio.checked) {
            this.scale.rotateVertical();
        }
    }
    rotateHorizontalListener(e: MouseEvent) {
        let msg: viewMsg;
        msg = {
            name: "isVertical",
            newVal: false,
        }
        this.sendMessage(msg);
        let radio = e.currentTarget as HTMLInputElement;
        if (radio.checked) {
            this.scale.rotateHorizontal();
        }
    }

    updateInfo(info: sliderInfo) {
        this.info = info;
        console.log("VIEW UPDATED", this.info);
        this.scale.updateInfo(info);
        this.controlPanel.updateInfo(info);
    }

    sendMessage(msg: viewMsg) {
        console.log(this.observers);
        for (var i = 1, len = this.observers.length; i < len; i++) {
            this.observers[i].update(msg);
        }
        console.log(`view message sended`, msg);
    };
    addObserver(observer: Observer) {
        this.observers.push(observer);
    };
}

class Scale extends InterfaceElement {
    scale: Element;
    scaleID: string;
    info: sliderInfo;
    toggles: Array<Toggle>;
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
        this.info = info; 
        this.togCoords = {
            firstTog: undefined,
            secTog: undefined,
        };
        console.log("slider info", this.info);
        this.renderFirstStage();
        this.labelUpdateObserver = new Observer(this.togObserverUpdateLabelFunc.bind(this));
        this.togObserver = new Observer(this.togObserverFunc.bind(this));
    };

    renderFirstStage() {
        this.container = this.createElement("div", "slider__scaleContainer", this.info.idNum) as HTMLElement;
        this.scale = this.createElement("div", "slider__scale", this.info.idNum);
        if (this.info.isVertical) {
            this.container.classList.add("vertical");
            this.scale.classList.add("vertical");
        }
        this.container.append(this.scale);
        this.scaleID = this.scale.getAttribute("id");
    };
    renderSecStage() {
        let that = this;
        this.addToggles();
        this.toggles.forEach((toggle, index) => {
            let togCoord = that.calculateToggleValToCoord(that.info.startTogVals[index]);
            toggle.setPosition(togCoord);
            toggle.updateLabel(that.info.startTogVals[index]);
        })
    };
    addToggles(){
        let progBarStartCoord = this.info.isVertical ? this.getCoords().left : this.getCoords().top,
            firstTog = new Toggle(this.info, this.info.startTogVals[0], 0);
            firstTog.addObserver(this.labelUpdateObserver);
            firstTog.addObserver(this.togObserver);
        this.toggles.push(firstTog);
        let firstTogCoord = this.calculateToggleValToCoord(this.info.startTogVals[0]);
        this.togCoords.firstTog = firstTogCoord;

        if (this.info.isRange) {
            let secTogCoord = this.calculateToggleValToCoord(this.info.startTogVals[1]),
                secTog = new Toggle(this.info, this.info.startTogVals[1], 1);
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

    addDragAndDrop(){
        let that = this;
        that.updateDradAndDropInfo();
        this.toggles.forEach((toggle) => {
            toggle.addDragAndDrop();
        });
    };

    updateDradAndDropInfo() {
        let scaleSize = this.info.isVertical ? this.scale.getBoundingClientRect().height : this.scale.getBoundingClientRect().width,
            togSize = this.info.isVertical ? this.toggles[0].getCoords().height : this.toggles[0].getCoords().width,
            scaleStart = this.info.isVertical ? this.scale.getBoundingClientRect().top : this.scale.getBoundingClientRect().left,
            finEdge = scaleSize, 
            startEdge = 0,
            that = this;

        for (let i = 0; i < this.toggles.length; i++) {
            finEdge = scaleSize;
            startEdge = 0;

            if (i === 0 && this.info.isRange) {
                finEdge = that.togCoords.secTog - togSize; 
            }
            if (i === 1) {
                startEdge = that.togCoords.firstTog + togSize;
            }
            this.toggles[i].updateDragAndDropInfo(startEdge, finEdge, scaleStart);
        }
    };

    removeToggles(){
        this.toggles.forEach((toggle) => {
            toggle.remove();
        });
        this.toggles = [];
    };

    updateInfo(newInfo: sliderInfo) {
        this.info = newInfo;
        console.log("SCALE UPDATED", this.info);
        this.toggles.forEach(toggle => {
            toggle.updateInfo(newInfo);
        });
    };

    addProgressBar(startCoord: number, endCoord: number){
        this.progressBar = this.createElement("div", "slider__progressBar", this.info.idNum) as HTMLElement;
        if (this.info.isVertical) {
            this.progressBar.classList.add("vertical");
        }
        this.scale.append(this.progressBar);
        this.progressBarSetCoords(startCoord, endCoord);
    };

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
    };

    calculateToggleValToCoord(val: number): number {
        let scaleSize = this.info.isVertical ? this.scale.getBoundingClientRect().height : this.scale.getBoundingClientRect().width;
        let toggleSize = this.info.isVertical ? this.toggles[0].container.getBoundingClientRect().height : this.toggles[0].container.getBoundingClientRect().width;
        let coord = ((val - this.info.minValue) * (scaleSize - toggleSize)) / (this.info.maxValue - this.info.minValue);
        return coord;
    };

    calculateToggleCoordToVal(coord: number): number {
        let scaleSize = this.info.isVertical ? this.scale.getBoundingClientRect().height : this.scale.getBoundingClientRect().width;
        let toggleSize = this.info.isVertical ? this.scale.lastElementChild.getBoundingClientRect().height : this.scale.lastElementChild.getBoundingClientRect().width;
        let val = Math.round(((coord * (this.info.maxValue - this.info.minValue)) / (scaleSize - toggleSize)) + this.info.minValue);
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
        this.info.isRange ? this.progressBarSetCoords(this.togCoords.firstTog, this.togCoords.secTog) : this.progressBarSetCoords(this.getCoords().top, this.togCoords.firstTog);
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
        this.info.isRange ? this.progressBarSetCoords(this.togCoords.firstTog, this.togCoords.secTog) : this.progressBarSetCoords(this.getCoords().left, this.togCoords.firstTog);
    };

    togObserverUpdateLabelFunc(msg: toggleMsg) {
        let val = this.calculateToggleCoordToVal(msg.newCoord);
        this.toggles[msg.order].updateLabel(val);
        if (msg.order === 0) {
            this.togCoords.firstTog = msg.newCoord;
        } else if (msg.order === 1) {
            this.togCoords.secTog = msg.newCoord;
        }
        let start = this.info.isRange ? this.togCoords.firstTog : 0;
        let fin = this.info.isRange ? this.togCoords.secTog : this.togCoords.firstTog;
        this.progressBarSetCoords(start, fin);
    };

    moveToggle(newVal: number, togOrder: number) {
        let newCoord = this.calculateToggleValToCoord(newVal);
        this.toggles[togOrder].setPosition(newCoord);
        this.toggles[togOrder].updateLabel(newVal);
    };

    recalcTogPositions() {
        this.moveToggle(this.togCoords.firstTog, 0);
        if (this.info.isRange) {
            this.moveToggle(this.togCoords.secTog, 1);
            this.progressBarSetCoords(this.togCoords.firstTog, this.togCoords.secTog);
        } else {
            this.info.isVertical ? this.progressBarSetCoords(this.getCoords().top, this.togCoords.firstTog) : this.progressBarSetCoords(this.getCoords().left, this.togCoords.firstTog)
        }
    };

    showTogLabels(toShow: boolean) {
        this.toggles.forEach(toggle => {
            if (toShow) {
                toggle.showLabel(); 
            } else {
                toggle.hideLabel();
            }
        });
    };

    togObserverFunc(msg: toggleMsg) {
//! оповестить Вид
        console.log(this.togCoords);
        this.updateDradAndDropInfo();
    };
};

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
    }

    observers: Observer[];
    sendMessage(msg: toggleMsg) {
        for (var i = 1, len = this.observers.length; i < len; i++) {
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

    constructor(info: sliderInfo, value: number, order: number) {
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
        }
        this.create(value, order);
    }


    create(value: number, order: number) {
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
        this.container.style.left = -4 + "px";
    };
    rotateHorizontal() {
        this.container.classList.remove("vertical");
        this.label.classList.remove("vertical");
        this.container.style.left = this.container.style.top;
        this.container.style.top = -5 + "px";
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
        console.log(`TOGGLE ${this.info.order} UPDATED`, this.info);
    };
    updateDragAndDropInfo(startEdge: number, finEdge: number, scaleStart: number) {
        this.dragAndDropInfo.startEdge = startEdge;
        this.dragAndDropInfo.finEdge = finEdge;
        this.dragAndDropInfo.scaleStart = scaleStart;
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

                if (that.info.isVertical) {
                    toggle.style.top = newCoord + "px";
                } else {
                    toggle.style.left = newCoord + "px";
                }
                
                msg = {
                    order: that.info.order,
                    newCoord: newCoord,
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
}

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
        this.isSingleValRadio = this.createInput("slider__isRangeRadio slider__isRangeRadio_single", "radio", "slider__isRangeRadio-" + this.info.idNum, "single", "", !this.info.isRange);
        this.isRangeValRadio = this.createInput("slider__isRangeRadio slider__isRangeRadio_range", "radio", "slider__isRangeRadio-" + this.info.idNum, "range", "", this.info.isRange);
        
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

    addToggleInput(toggleOrder: number, placeholder: string) {
        let idPostfix = toggleOrder + 1;
        let toggleControl = document.createElement("div");
        toggleControl.setAttribute("class", "slider__toggleControl");
        toggleControl.setAttribute("id", "slider__toggleControl-" + this.info.idNum + "-" + idPostfix);

        let toggleValueField = this.createInput("slider__toggleValueField", "text", "", "", placeholder);
        toggleValueField.setAttribute("id", toggleValueField.getAttribute("id") + "-" + idPostfix);
        toggleValueField.setAttribute("data-toggleNum", toggleOrder + "");
    
        let toggleValueFieldLabel = this.createLabel("slider__toggleValueFieldLabel", idPostfix + ": ", toggleValueField.id);
        toggleValueFieldLabel.setAttribute("id", toggleValueFieldLabel.getAttribute("id") + "-" + idPostfix);

        this.toggleInputsContainer.append(toggleControl);
        toggleControl.append(toggleValueFieldLabel);
        toggleControl.append(toggleValueField);
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
        console.log("PANEL UPDATED", this.info);
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
        startTogVals: [25, 75],
        measure: "standard",
        isVertical: false,
    }, elem);
}

function createSlider(info: sliderInfo,
    parentElement: Element) {
    // const newModel = new Model(info);
    // const newView = new View(info, parentElement);
    const app = new Controller(new Model(info), new View(info, parentElement));
}

