import './index.css'
"use strict";




class InterfaceElement {
    container: Element;
    createElement(tag: string, className: string, idNum: number | string): Element {
        if (!tag || !className) {
            return;
        }
        let newElem = document.createElement(tag);
        newElem.className = className;
        newElem.id = className + '-' + idNum;
        return newElem;
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
    observers: any[];

    constructor() {
        this.observers = [];
    }
    sendMessage = function (msg: any) {
        for (var i = 0, len = this.observers.length; i < len; i++) {
            this.observers[i].notify(msg);
        }
        console.log("message sended", msg);
    };
    addObserver = function (observer: any) {
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

class Model extends Observable{
    sliderData: {
        idNum: number,
        minScaleValue: number,
        maxScaleValue: number,
        step: number,
        toggleNumber: number
    };

    constructor(sliderData: {idNum: number, minScaleValue: number, maxScaleValue: number, step: number, toggleNumber: number}) {
        super();
        this.sliderData = sliderData; 
    }

    getMinScaleValue(): number {
        return +this.sliderData.minScaleValue;
    };
    getMaxScaleValue(): number {
        return +this.sliderData.maxScaleValue;
    };
    getStep(): number {
        return +this.sliderData.step;
    };
    getToggleNumberValue(): number {
        return +this.sliderData.toggleNumber;
    };

    setMinScaleValue(newMin: number) {
        this.sliderData.minScaleValue = newMin;
        this.sendMessage({"min": this.getMinScaleValue()});
    }
    setMaxScaleValue(newMax: number) {
        this.sliderData.maxScaleValue = newMax;
        this.sendMessage({"max": this.getMaxScaleValue()});
    }
    setStep(newStep: number) {
        this.sliderData.step = newStep;
        this.sendMessage({"step": this.getStep()});
    }
    setHandleNumberValue(newNumber: number) {
        this.sliderData.toggleNumber = newNumber;
        this.sendMessage({"togNum": this.getToggleNumberValue()});
    }
}

class Controller {
    model: Model;
    view: View;
    notify: any;
    observers: Array<Observer>;
    constructor(model: Model, view: View) {
        this.model = model;
        this.view = view;

        this.view.scaleInfo.min = this.model.sliderData.minScaleValue;
        this.view.scaleInfo.max = this.model.sliderData.maxScaleValue;
        this.view.scaleInfo.step = this.model.sliderData.step;
        this.view.scaleInfo.measure = "standard";
        
        this.view.displaySlider();
        this.observers = [];
        this.observers.push(new Observer(this.observerViewFunc.bind(this)));
        this.observers.push(new Observer(this.observerModelFunc.bind(this)));
        this.view.addObserver(this.observers[0]);
        this.model.addObserver(this.observers[1]);
    };
    changeMinValue = (newValue: number) => {
        this.model.setMinScaleValue(newValue);
    };
    changeMaxValue = (newValue: number) => {
        this.model.setMaxScaleValue(newValue);
    };
    changeStepValue = (newValue: number) => {
        this.model.setStep(newValue);
    };
    changeHandleNumberValue = (newValue: number) => {
        this.model.setHandleNumberValue(newValue);
    };
    observerViewFunc(info: any) {
        if (info.elemId.includes('min')) {
            this.changeMinValue(info.newValue);
        } else if (info.elemId.includes('max')) {
            this.changeMaxValue(info.newValue);
        } else if (info.elemId.includes('step')) {
            this.changeStepValue(info.newValue);
        }
    };
    observerModelFunc(newValue: any){
        if ("min" in newValue) {
            this.view.scaleInfo.min = newValue.min;
        } else if ("max" in newValue) {
            this.view.scaleInfo.max = newValue.max;
        } else if ("step" in newValue) {
            this.view.scaleInfo.step = newValue.step;
        }
        this.view.connectInputsWithData();
    };
}

class View extends Observable {
    model: Model;
    sliderInterface: SliderInterface;
    scaleInfo: {
        min: number,
        max: number,
        step: number,
        scaleMax: number,
        measure: string,
    };

    constructor(model: Model, parentElement: Element) {
        super();
        this.model = model;
        this.sliderInterface = new SliderInterface(this.model.sliderData);
        parentElement.append(this.sliderInterface.container);
        this.createListeners();
        
        this.scaleInfo = {
            min: null,
            max: null,
            step: null,
            scaleMax: null,
            measure: ""
        };
    };

    displaySlider() {  
        this.connectInputsWithData();
        this.addDragAndDrop();     
    };

    clear() {
        this.sliderInterface.container.remove();
        this.sliderInterface.toggles = [];
    };

    connectInputsWithData() {
        let maxInput = document.getElementById(this.sliderInterface.controlPanel.maxInputID);
        maxInput.setAttribute("placeholder", this.scaleInfo.max.toString());

        let minInput = document.getElementById(this.sliderInterface.controlPanel.minInputID);
        minInput.setAttribute("placeholder", this.scaleInfo.min.toString());

        let stepInput = document.getElementById(this.sliderInterface.controlPanel.stepInputID);
        stepInput.setAttribute("placeholder", this.scaleInfo.step.toString());

        this.scaleInfo.scaleMax = this.scaleInfo.max - this.scaleInfo.min;
    };

    addDragAndDrop() {
        for (let toggleID of this.sliderInterface.toggles) {
            let toggle = document.getElementById(toggleID);
            this.addToggleDragAndDrop((this.sliderInterface.scale.scale) as HTMLElement, toggle)
        }
    };

    createListeners() {
        let that = this;

        let inputListener = function () {
            let thisHTML: HTMLInputElement = this as HTMLInputElement;
            let info = {
                elemId: thisHTML.getAttribute("id"),
                newValue: +thisHTML.value,
                handleNum: that.sliderInterface.toggles.length,
            }
            if (+thisHTML.value) {
                that.sendMessage(info);
            }
        }

        let checkboxListener = function() {
            let thisHTML: HTMLInputElement = this as HTMLInputElement;
            if (thisHTML.checked) {
                that.sliderInterface.hideToggleLabels(false);
            } else {
                that.sliderInterface.hideToggleLabels(true);
            }
        }

        let minInput = document.getElementById(that.sliderInterface.controlPanel.minInputID);
        minInput.addEventListener("change", inputListener);
        let maxInput = document.getElementById(that.sliderInterface.controlPanel.maxInputID);
        maxInput.addEventListener("change", inputListener);
        let stepInput = document.getElementById(that.sliderInterface.controlPanel.stepInputID);
        stepInput.addEventListener("change", inputListener);

        let checkbox = document.getElementById(that.sliderInterface.controlPanel.showToggleLabelsCheckboxID);
        checkbox.addEventListener("click", checkboxListener);
        let radioVertical = document.getElementById(that.sliderInterface.controlPanel.isVerticalRadioID);
        radioVertical.addEventListener("click", this.rotateVertical.bind(that));
        let radioHorizontal = document.getElementById(this.sliderInterface.controlPanel.isHorizontalRadioID);
        radioHorizontal.addEventListener("click", this.rotateHorizontal.bind(that));

    };

    rotateVertical() {
        this.sliderInterface.rotateSlider(true);
    }

    rotateHorizontal() {
        this.sliderInterface.rotateSlider(false);
    }

    addToggleDragAndDrop(scale: HTMLElement, toggle: HTMLElement) {

        let toggleLabel = toggle.firstElementChild;
        let that = this;
        let min = 0,
            shiftX: number;

        toggle.addEventListener('mousedown', function (event: MouseEvent) {
            event.preventDefault();

            let isVertical = that.sliderInterface.scale.scale.classList.contains("vertical");
            let coords = that.coordsForDragAndDrop(isVertical, scale, toggle);
            let eventClient: number;

            if (isVertical) {
                eventClient = event.clientY;
            } else {
                eventClient = event.clientX;
            }

            shiftX = eventClient - coords.togDistBord;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            function onMouseMove(event: MouseEvent) {
                
                let newCoord: number, finishEdge: number;

                if (isVertical) {
                eventClient = event.clientY;
                } else {
                eventClient = event.clientX;
                }

                newCoord = eventClient - shiftX - coords.scaleDistBord;
                finishEdge = coords.scaleSize - coords.togSize;

                if (toggle.previousElementSibling) {
                    min = coords.prevSiblingBorder - coords.scaleDistBord;
                }
                if (toggle.nextElementSibling) {
                    finishEdge = coords.nextSiblingBorder - coords.scaleDistBord - coords.nextSiblingSize;
                }

                if (newCoord < min) {
                    newCoord = min;
                }
                if (newCoord > finishEdge) {
                    newCoord = finishEdge;
                }
                if(isVertical) {
                    toggle.style.top = newCoord + 'px'
                } else {
                    toggle.style.left = newCoord + 'px'
                }
                

                //--------  расчет числа над ползунком  ---------------

                let val: number;
                val = Math.round(((newCoord * that.scaleInfo.scaleMax) / (coords.scaleSize - coords.togSize)) + that.scaleInfo.min);
                toggleLabel.innerHTML = val + "";
        
            };
            function onMouseUp() {
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('mousemove', onMouseMove);
            };
        });

        toggle.addEventListener("ondragstart", function () {
            return false;
        });
    };

    coordsForDragAndDrop(isVertical: boolean, scale: Element, toggle: Element) {
        let borderVals = {
            togDistBord: 0,
            togFirstBord: 0,
            togSize: 0,

            scaleDistBord: 0,
            scaleFirstBord: 0,
            scaleSize: 0,

            nextSiblingBorder: 0,
            nextSiblingSize:0,

            prevSiblingBorder: 0,
        }

        let nextSibling = toggle.nextElementSibling;
        let prevSibling = toggle.previousElementSibling;

        if (isVertical) {
            borderVals.togDistBord = toggle.getBoundingClientRect().top;
            borderVals.scaleDistBord = scale.getBoundingClientRect().top;

            borderVals.togFirstBord = toggle.getBoundingClientRect().bottom;
            borderVals.scaleFirstBord = scale.getBoundingClientRect().bottom;

            borderVals.togSize = toggle.getBoundingClientRect().height;
            borderVals.scaleSize = scale.getBoundingClientRect().height;

            if (nextSibling) {
                borderVals.nextSiblingBorder = nextSibling.getBoundingClientRect().top;
                borderVals.nextSiblingSize = nextSibling.getBoundingClientRect().height;
            }
            if (prevSibling) {
                borderVals.prevSiblingBorder = prevSibling.getBoundingClientRect().bottom;
            }
        } else {
            borderVals.togDistBord = toggle.getBoundingClientRect().left;
            borderVals.scaleDistBord = scale.getBoundingClientRect().left;

            borderVals.togFirstBord = toggle.getBoundingClientRect().right;
            borderVals.scaleFirstBord = scale.getBoundingClientRect().right;

            borderVals.togSize = toggle.getBoundingClientRect().width;
            borderVals.scaleSize = scale.getBoundingClientRect().width;

            if (nextSibling) {
                borderVals.nextSiblingBorder = nextSibling.getBoundingClientRect().left;
                borderVals.nextSiblingSize = nextSibling.getBoundingClientRect().width;
            }
            if (prevSibling) {
                borderVals.prevSiblingBorder = prevSibling.getBoundingClientRect().right;
            }
        }

        return borderVals;
    };
}

class SliderInterface extends InterfaceElement  {
    scale: Scale;
    controlPanel: controlPanel;
    toggles: Array<string>;

    sliderInfo: {
        idNum: number,
        toggleNumber: number
    };

    constructor(sliderInfo: any) {
        super();
        this.sliderInfo = {
            idNum: sliderInfo.idNum,
            toggleNumber: sliderInfo.toggleNumber
        };
        this.toggles = [];
        this.render();
    };

    render() {
        this.container = this.createElement("div", "slider__mainContainer", this.sliderInfo.idNum);

        this.scale = new Scale(this.sliderInfo.idNum);
        for (let i = 0; i < this.sliderInfo.toggleNumber; i++) {
            this.addToggle(this.scale.scale, i + 1);
        }  
        this.container.append(this.scale.container); 

        this.controlPanel = new controlPanel(this.sliderInfo.idNum);
        this.container.append(this.controlPanel.container);
    };

    addToggle(parentElement: Element, index: number) {
        let toggle = new Toggle(this.sliderInfo.idNum + '-' + index);
        parentElement.append(toggle.container);
        this.toggles.push(toggle.container.getAttribute("id"));
    };

    hideToggleLabels(isHidden: boolean) { 
        for (let toggle of this.toggles) {
            let toggleElem = document.getElementById(toggle);
            let label = toggleElem.firstChild as HTMLElement
            if (isHidden) {
                label.classList.add("hidden");
            } else {
                label.classList.remove("hidden");
            }
        }
    };

    rotateSlider(toVertical: boolean) {
        let scaleContainer = document.getElementById(this.scale.container.getAttribute("id"));
        let scale = document.getElementById(this.scale.scaleID);

        if (toVertical && !scaleContainer.classList.contains("vertical")) {
            scaleContainer.classList.add("vertical");
            scale.classList.add("vertical");
            for (let toggle of this.toggles) {
                let toggleElem = document.getElementById(toggle);
                let label = toggleElem.firstChild as HTMLElement
                label.classList.add("vertical");
                toggleElem.classList.add("vertical");
                let oldLeft = toggleElem.style.left;
                toggleElem.style.left = -4 + "px";
                toggleElem.style.top = oldLeft;
            }
        } else if (!toVertical && scale.classList.contains("vertical")) {
            scaleContainer.classList.remove("vertical");
            scale.classList.remove("vertical");
            for (let toggle of this.toggles) {
                let toggleElem = document.getElementById(toggle);
                let label = toggleElem.firstChild as HTMLElement
                label.classList.remove("vertical");
                toggleElem.classList.remove("vertical");
                let oldTop = toggleElem.style.top;
                toggleElem.style.top = -5 + "px";
                toggleElem.style.left = oldTop;
            }
        }
    }
};

class Scale extends InterfaceElement {
    scale: Element;
    scaleID: string;
    idNum: number;
    constructor(idNum: number) {
        super();
        this.idNum = idNum;
        this.render();
        
    }
    render() {
        this.container = this.createElement("div", "slider__scaleContainer", this.idNum);
        this.scale = this.createElement("div", "slider__scale", this.idNum);
        this.container.append(this.scale);
        this.scaleID = this.scale.getAttribute("id");
    }
};

class Toggle extends InterfaceElement {
    label: Element;
    idNum: number | string;
    constructor(idNum: number | string) {
        super();
        this.idNum = idNum;
        this.render();
    }
    render() {
        this.container = this.createElement("div", "slider__toggle", this.idNum);
        this.label = this.createElement("div", "slider__toggleLabel", this.idNum);
        this.label.classList.add("hidden")
        this.container.append(this.label);
    }
};

class controlPanel extends InterfaceElement {

    idNum: number;

    showToggleLabelsCheckboxID: string;
    minInputID: string;
    maxInputID: string;
    stepInputID: string;
    isHorizontalRadioID: string;
    isVerticalRadioID: string;
    addToggleButtonID: string;
    deleteAllTogglesButtonID: string;
    toggleInputsContainerID: string;

    constructor(idNum: number){
        super();
        this.idNum = idNum;
        this.render();   
    }

    render() {
        this.container = this.createElement("div", "slider__controlElements", this.idNum);


        let showToggleLabelsCheckbox = this.createElement("input", "slider__valueCheckbox", this.idNum);
        showToggleLabelsCheckbox.setAttribute("type", "checkbox");
        this.showToggleLabelsCheckboxID = showToggleLabelsCheckbox.getAttribute("id");

        let checkboxLabel = this.createElement("label", "slider__valueCheckboxLabel", this.idNum);
        checkboxLabel.innerHTML = "Показать значения ползунков";
        checkboxLabel.setAttribute("for", this.showToggleLabelsCheckboxID);
        
        let inputsContainer = this.createElement("div", "slider__inputsContainer", this.idNum);

        let minInputLabel = this.createElement("div", "slider__inputLabel slider__inputLabel_min", this.idNum);
        minInputLabel.innerHTML = "Min:";
        let minInput = this.createElement("input", "slider__input slider__input_min", this.idNum);
        minInput.setAttribute("type", "text");
        this.minInputID = minInput.getAttribute("id");

        let maxInputLabel = this.createElement("div", "slider__inputLabel slider__inputLabel_max", this.idNum);
        maxInputLabel.innerHTML = "Max:";
        let maxInput = this.createElement("input", "slider__input slider__input_max", this.idNum);
        maxInput.setAttribute("type", "text");
        this.maxInputID = maxInput.getAttribute("id");

        let stepInputLabel = this.createElement("div", "slider__inputLabel slider__inputLabel_step", this.idNum);
        stepInputLabel.innerHTML = "Шаг:";
        let stepInput = this.createElement("input", "slider__input slider__input_step", this.idNum);
        stepInput.setAttribute("type", "text");
        this.stepInputID = stepInput.getAttribute("id");

        let viewRadioContainer = this.createElement("div", "slider__viewRadioContainer", this.idNum);
        let viewRadioCommonLabel = this.createElement("label", "slider__viewRadioCommonLabel", this.idNum);
        viewRadioCommonLabel.innerHTML = "Вид слайдера:";

        let isHorizontalRadio = this.createElement("input", "slider__viewRadio-horizontal", this.idNum);
        isHorizontalRadio.setAttribute("type", "radio");
        isHorizontalRadio.setAttribute("name", "slider__viewRadio-" + this.idNum);
        isHorizontalRadio.setAttribute("value", "horizontal");
        isHorizontalRadio.setAttribute("checked", "true");
        this.isHorizontalRadioID = isHorizontalRadio.getAttribute("id");

        let viewRadioHorizontalLabel = this.createElement("label", "slider__viewRadioLabel", this.idNum);
        viewRadioHorizontalLabel.innerHTML = "Горизонтальный";
        viewRadioHorizontalLabel.setAttribute("for", this.isHorizontalRadioID);

        let isVerticalRadio = this.createElement("input", "slider__viewRadio-vertical", this.idNum);
        isVerticalRadio.setAttribute("type", "radio");
        isVerticalRadio.setAttribute("name", "slider__viewRadio-" + this.idNum);
        isVerticalRadio.setAttribute("value", "vertical");
        this.isVerticalRadioID = isVerticalRadio.getAttribute("id");


        let viewRadioVerticalLabel = this.createElement("label", "slider__viewRadioLabel", this.idNum);
        viewRadioVerticalLabel.innerHTML = "Вертикальный";
        viewRadioVerticalLabel.setAttribute("for", this.isVerticalRadioID);

        let addToggleButton = this.createElement("button", "slider__addHandleButton", this.idNum);
        addToggleButton.setAttribute("type", "button");
        addToggleButton.innerHTML = "+";
        this.addToggleButtonID = addToggleButton.getAttribute("id");

        let deleteAllTogglesButton = this.createElement("button", "slider__deleteAllHandlesButton", this.idNum);
        deleteAllTogglesButton.setAttribute("type", "button");
        deleteAllTogglesButton.innerHTML = "- all";
        deleteAllTogglesButton.classList.add('hidden');
        this.deleteAllTogglesButtonID = deleteAllTogglesButton.getAttribute("id");

        let toggleInputsContainer = this.createElement("div", "slider__handleControlContainer", this.idNum);

        this.container.append(showToggleLabelsCheckbox);
        this.container.append(checkboxLabel);

        this.container.append(inputsContainer);
        inputsContainer.append(minInputLabel);
        minInputLabel.append(minInput);
        inputsContainer.append(maxInputLabel);
        maxInputLabel.append(maxInput);
        inputsContainer.append(stepInputLabel);
        stepInputLabel.append(stepInput);

        this.container.append(viewRadioContainer);
        viewRadioContainer.append(viewRadioCommonLabel);
        viewRadioContainer.append(isHorizontalRadio);
        viewRadioContainer.append(viewRadioHorizontalLabel);
        viewRadioContainer.append(isVerticalRadio);
        viewRadioContainer.append(viewRadioVerticalLabel);
        
        this.container.append(addToggleButton);
        this.container.append(deleteAllTogglesButton);
        this.container.append(toggleInputsContainer);
    }
}


let containers = document.querySelectorAll(".slider-here");

for (let [index, elem] of containers.entries()) {
    createSlider({
        idNum: index + 1,
        minScaleValue: 0,
        maxScaleValue: 100,
        step: 5,
        toggleNumber: 2
    }, elem);
}

function createSlider(info: { idNum: number,
                              minScaleValue: number,
                              maxScaleValue: number,
                              step: number,
                              toggleNumber: number}, 
                      parentElement: Element)  {
    const newModel = new Model(info);
    const newView = new View(newModel, parentElement);
    const app = new Controller(newModel, newView);
}

export { Observable };
export { Observer };
export { Model };
export { Controller };
export { View };
export { SliderInterface };



