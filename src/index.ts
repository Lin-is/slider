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
        this.controlPanel = new ControlPanel;
        this.render(parentElement);
        this.scale.renderSecStage();
        this.scale.addDragAndDrop();
    };

    render(parentElement: Element) {
        this.container = document.createElement("div");
        this.container.classList.add("slider__mainContainer");
        this.container.setAttribute("id", "slider__mainContainer-" + this.info.idNum);

        this.container.append(this.scale.container);
        this.container.append(this.controlPanel.container);
    
        parentElement.append(this.container);
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
        })
    };

    rotateHorizontal() {
        this.container.classList.remove("vertical");
        this.scale.classList.remove("vertical");
        this.progressBar.classList.remove("vertical");
        this.toggles.forEach((toggle) => {
            toggle.rotateHorizontal();
        })
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
    togObserverFunc(msg: toggleMsg) {
//! оповестить Вид
        
        console.log(this.togCoords);
        this.updateDradAndDropInfo();
        
    }
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
        this.create(value);
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
    };
    rotateVertical() {
        this.container.classList.add("vertical");
        this.label.classList.add("vertical");
    };
    rotateHorizontal() {
        this.container.classList.remove("vertical");
        this.label.classList.remove("vertical");
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
    }
    updateInfo(info: sliderInfo) {
        this.info.idNum = info.idNum;
        this.info.isVertical = info.isVertical;
    };
    updateDragAndDropInfo(startEdge: number, finEdge: number, scaleStart: number) {
        this.dragAndDropInfo.startEdge = startEdge;
        this.dragAndDropInfo.finEdge = finEdge;
        this.dragAndDropInfo.scaleStart = scaleStart;
    }
    addDragAndDrop() {
        let that = this, 
            toggle = this.container;

        toggle.addEventListener('mousedown', function (event: MouseEvent) {
            let shift: number,
                newCoord: number,
                eventClient: number,
                // togSize = that.info.isVertical ? toggle.getBoundingClientRect().height : toggle.getBoundingClientRect().width,
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
                let scaleStart = that.info.isVertical ? toggle.parentElement.getBoundingClientRect().top : toggle.parentElement.getBoundingClientRect().left;
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
    constructor() {
        super();
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
    const newModel = new Model(info);
    const newView = new View(info, parentElement);
    const app = new Controller(newModel, newView);
}

