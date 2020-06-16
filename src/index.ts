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
    }

    getElemById(){

    }
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

class Model {
    sliderData: {
        idNum: number,
        minScaleValue: number,
        maxScaleValue: number,
        step: number,
        toggleNumber: number
    };

    constructor(sliderData: {idNum: number, minScaleValue: number, maxScaleValue: number, step: number, toggleNumber: number}) {
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
    }
    setMaxScaleValue(newMax: number) {
        this.sliderData.maxScaleValue = newMax;
    }
    setStep(newStep: number) {
        this.sliderData.step = newStep;
    }
    setHandleNumberValue(newNumber: number) {
        this.sliderData.toggleNumber = newNumber;
    }
}

class Controller {
    model: Model;
    view: View;
    notify: any;
    observer: Observer;

    constructor(model: Model, view: View) {
        this.model = model;
        this.view = view;
        this.view.displaySlider();
        this.observer = new Observer(this.observerFunc.bind(this));
        this.view.addObserver(this.observer);
    }

    changeMinValue = (newValue: number) => {
        this.model.setMinScaleValue(newValue);
    }
    changeMaxValue = (newValue: number) => {
        this.model.setMaxScaleValue(newValue);
    }
    changeStepValue = (newValue: number) => {
        this.model.setStep(newValue);
    }
    changeHandleNumberValue = (newValue: number) => {
        this.model.setHandleNumberValue(newValue);
    }

    observerFunc(info: any) {
        if (info.elemId.includes('minInput')) {
            this.changeMinValue(info.newValue);
        } else if (info.elemId.includes('maxInput')) {
            this.changeMaxValue(info.newValue);
        } else if (info.elemId.includes('stepInput')) {
            this.changeStepValue(info.newValue);
        }
        this.view.clear();
        this.view.displaySlider();
    }
}

class View extends Observable {
    model: Model;
    sliderInterface: SliderInterface;

    constructor(model: Model, parentElement: Element) {
        super();
        this.model = model;
        this.sliderInterface = new SliderInterface(this.model.sliderData);
        parentElement.append(this.sliderInterface.container);
        this.createListeners();
    }

    displaySlider() {
        this.sliderInterface.render();   
    }

    clear() {
        this.sliderInterface.container.remove();
    }

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
    }

    
}

class SliderInterface extends InterfaceElement  {
    scale: Scale;
    controlPanel: controlPanel;
    toggles: Array<string>

    sliderInfo: {
        idNum: number,
        min: number,
        max: number,
        step: number,
        toggleNumber: number
    };

    constructor(sliderInfo: any) {
        super();
        this.sliderInfo = {
            idNum: sliderInfo.idNum,
            min: sliderInfo.minScaleValue,
            max: sliderInfo.maxScaleValue,
            step: sliderInfo.step,
            toggleNumber: sliderInfo.toggleNumber
        };
        this.toggles = [];
        this.render();
    }

    render() {
        this.container = this.createElement("div", "slider__mainContainer", this.sliderInfo.idNum);
        this.controlPanel = new controlPanel(this.sliderInfo.idNum);
        this.container.append(this.controlPanel.container);
        this.scale = new Scale(this.sliderInfo.idNum);

        for (let i = 0; i < this.sliderInfo.toggleNumber; i++) {
            this.addToggle(this.scale.scale, i + 1);
        }  
        this.container.append(this.scale.container); 
    }

    addToggle (parentElement: Element, index: number) {
        let toggle = new Toggle(this.sliderInfo.idNum + '-' + index);
        parentElement.append(toggle.container);
        this.toggles.push(toggle.container.getAttribute("id"));
    }

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
    }
};

class Scale extends InterfaceElement {
    scale: Element;
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

        let checkboxLabel = this.createElement("label", "slider__valueCheckboxLabel", this.idNum);
        checkboxLabel.innerHTML = "Показать значение над ползунком";
        let showToggleLabelsCheckbox = this.createElement("input", "slider__valueCheckbox", this.idNum);
        showToggleLabelsCheckbox.setAttribute("type", "checkbox");
        this.showToggleLabelsCheckboxID = showToggleLabelsCheckbox.getAttribute("id");
        
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

        let isHorizontalRadio = this.createElement("input", "slider__viewRadio", this.idNum);
        isHorizontalRadio.setAttribute("type", "radio");
        isHorizontalRadio.setAttribute("name", "slider__viewRadio-" + this.idNum);
        isHorizontalRadio.setAttribute("value", "horizontal");
        isHorizontalRadio.setAttribute("checked", "true");
        this.isHorizontalRadioID = isHorizontalRadio.getAttribute("id");

        let viewRadioHorizontalLabel = this.createElement("label", "slider__viewRadioLabel", this.idNum);
        viewRadioHorizontalLabel.innerHTML = "Горизонтальный";

        let isVerticalRadio = this.createElement("input", "slider__viewRadio", this.idNum);
        isVerticalRadio.setAttribute("type", "radio");
        isVerticalRadio.setAttribute("name", "slider__viewRadio-" + this.idNum);
        isVerticalRadio.setAttribute("value", "vertical");
        this.isVerticalRadioID = isVerticalRadio.getAttribute("id");


        let viewRadioVerticalLabel = this.createElement("label", "slider__viewRadioLabel", this.idNum);
        viewRadioVerticalLabel.innerHTML = "Вертикальный";

        //-----------------------------------------------------------------------------

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

        this.container.append(checkboxLabel);
        checkboxLabel.append(showToggleLabelsCheckbox);

        this.container.append(inputsContainer);
        inputsContainer.append(minInputLabel);
        minInputLabel.append(minInput);
        inputsContainer.append(maxInputLabel);
        maxInputLabel.append(maxInput);

        this.container.append(stepInputLabel);
        stepInputLabel.append(stepInput);

        this.container.append(viewRadioContainer);
        viewRadioContainer.append(viewRadioCommonLabel);
        viewRadioContainer.append(viewRadioHorizontalLabel);
        viewRadioHorizontalLabel.append(isHorizontalRadio);
        viewRadioContainer.append(viewRadioVerticalLabel);
        viewRadioVerticalLabel.append(isVerticalRadio);

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



