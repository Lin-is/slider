import './index.css'
"use strict";

export { Observable };
export { Observer };
export { Model };
export { Controller };
export { View };
export { SliderInterface };


class Observable {
    observers: any[];

    constructor() {
        this.observers = [];
    }
    sendMessage = function (msg: any) {
        for (var i = 0, len = this.observers.length; i < len; i++) {
            this.observers[i].notify(msg);
        }
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

    sliders: any[];

    constructor() {
        this.sliders = [{ idNum: 1, minScaleValue: 0, maxScaleValue: 100, step: 10, handleNumber: 1 },
        { idNum: 2, minScaleValue: -30, maxScaleValue: 200, step: 5, handleNumber: 2 }];
    }

    addSlider(min: number = 0, max: number = 100, step: number = 1) {
        let slider = {
            idNum: this.sliders.length > 0 ? this.sliders[this.sliders.length - 1].idNum + 1 : 1,
            minScaleValue: min,
            maxScaleValue: max,
            step: step,
            handleNumber: 1,
        }
        this.sliders.push(slider);
    };
    findSliderById(idNum: number) {
        let slider = this.sliders.find(item => item.idNum == idNum);
        try {
            if (slider !== undefined) {
                return slider;
            } else {
                throw new Error("Slider not found");
            }
        } catch (e) {
            console.log("Error: " + e.message);
        }
    };

    getMinScaleValue(idNum: number) {
        return this.findSliderById(idNum).minScaleValue;
    };
    getMaxScaleValue(idNum: number): number {
        return +this.findSliderById(idNum).maxScaleValue;
    };
    getStep(idNum: number): number {
        return +this.findSliderById(idNum).step;
    };
    getHandleNumberValue(idNum: number): number {
        return +this.findSliderById(idNum).handleNumber;
    };

    setMinScaleValue(idNum: number, newMin: number) {
        this.findSliderById(idNum).minScaleValue = newMin;
    }
    setMaxScaleValue(idNum: number, newMax: number) {
        this.findSliderById(idNum).maxScaleValue = newMax;
    }
    setStep(idNum: number, newStep: number) {
        this.findSliderById(idNum).step = newStep;
    }
    setHandleNumberValue(idNum: number, newNumber: number) {
        this.findSliderById(idNum).handleNumber = newNumber;
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
        this.view.displaySliders(this.model.sliders);
        this.observer = new Observer(this.observerFunc.bind(this));
        this.view.addObserver(this.observer);
    }

    changeMinValue = (idNum: number, newValue: number) => {
        this.model.setMinScaleValue(idNum, newValue);
    }
    changeMaxValue = (idNum: number, newValue: number) => {
        this.model.setMaxScaleValue(idNum, newValue);
    }
    changeStepValue = (idNum: number, newValue: number) => {
        this.model.setStep(idNum, newValue);
    }
    changeHandleNumberValue = (idNum: number, newValue: number) => {
        this.model.setHandleNumberValue(idNum, newValue);
    }

    observerFunc(info: any) {
        if (info.elemId.includes('minInput')) {
            this.changeMinValue(info.idNum, info.newValue);
        } else if (info.elemId.includes('maxInput')) {
            this.changeMaxValue(info.idNum, info.newValue);
        } else if (info.elemId.includes('stepInput')) {
            this.changeStepValue(info.idNum, info.newValue);
        }
        this.view.clear();
        this.view.displaySliders(this.model.sliders);
    }
}

class View extends Observable {
    model: Model;
    renderedSliders: Array<{
        idNum: number,
        mainContainerFullId: string
    }>;

    constructor(model: Model) {
        super();
        this.model = model;
        this.renderedSliders = [];
    }

    displaySliders(sliders: any) {
        for (let slider of sliders) {
            let newSlider = new SliderInterface(slider);
            newSlider.render(slider.idNum);

            let newSliderInfo = {
                idNum: +slider.idNum,
                mainContainerFullId: "#" + newSlider.mainContainer.id
            }
            this.renderedSliders.push(newSliderInfo);
        }
        this.createListeners();
    }

    clear() {
        for (let elem of document.querySelectorAll('.slider__mainContainer')) {
            elem.remove();
        }
    }

    createListeners() {
        for (let slider of this.renderedSliders) {

            let container = document.querySelector(slider.mainContainerFullId);
            let minInput = document.querySelector("#slider__minInput-" + slider.idNum);
            let maxInput = document.querySelector("#slider__maxInput-" + slider.idNum);
            let stepInput = document.querySelector("#slider__stepInput-" + slider.idNum);

            let that = this;

            let inputListener = function () {
                let thisHTML: HTMLInputElement = this as HTMLInputElement;
                let handleNum = container.lastElementChild.firstElementChild.childElementCount;
                let [, thisIdNum] = thisHTML.id.split('-');
                let info = {
                    elemId: thisHTML.id,
                    idNum: thisIdNum,
                    newValue: +thisHTML.value,
                    handleNum: handleNum,
                }
                if (+thisHTML.value) {
                    that.sendMessage(info);
                }
            }

            minInput.addEventListener("change", inputListener);
            maxInput.addEventListener("change", inputListener);
            stepInput.addEventListener("change", inputListener);
        }
    }

    
}

class SliderInterface {
    mainContainer: Element;
    sliderInfo: {
        idNum: number,
        min: number,
        max: number,
        step: number,
        handleNumber: number
    };

    constructor(sliderInfo: any) {
        this.sliderInfo = {
            idNum: sliderInfo.idNum,
            min: sliderInfo.minScaleValue,
            max: sliderInfo.maxScaleValue,
            step: sliderInfo.step,
            handleNumber: sliderInfo.handleNumber
        };
    }

    render(idNum: number, parent: Element | HTMLElement = document.body): void {
        this.mainContainer = this.createElement("div", "slider__mainContainer", idNum);
        parent.append(this.mainContainer);
        let handleNum = 0;

        let controlElements = this.createElement("div", "slider__controlElements", idNum);

        let valueCheckbox = this.createElement("input", "slider__valueCheckbox", idNum);
        valueCheckbox.setAttribute("type", "checkbox");
        valueCheckbox.setAttribute("checked", "true");
        let checkboxLabel = this.createElement("label", "slider__valueCheckboxLabel", idNum);
        checkboxLabel.setAttribute('for', '' + valueCheckbox.id);
        checkboxLabel.innerHTML = "Показать значение над ползунком";

        let minMaxInputsContainer = this.createElement("div", "slider__minMaxInputsContainer", idNum);

        let minInputLabel = this.createElement("div", "slider__minInputLabel", idNum);
        minInputLabel.innerHTML = "Min:";
        let minInput = this.createElement("input", "slider__minInput", idNum);
        minInput.setAttribute("type", "text");
        minInput.setAttribute("placeholder", "" + this.sliderInfo.min);
        minInputLabel.setAttribute("for", "" + minInput.id);


        let maxInputLabel = this.createElement("div", "slider__maxInputLabel", idNum);
        maxInputLabel.innerHTML = "Max:";
        let maxInput = this.createElement("input", "slider__maxInput", idNum);
        maxInput.setAttribute("type", "text");
        maxInput.setAttribute("placeholder", "" + this.sliderInfo.max);
        maxInputLabel.setAttribute("for", "" + maxInput.id);


        let stepInputLabel = this.createElement("div", "slider__stepInputLabel", idNum);
        stepInputLabel.innerHTML = "Шаг:";
        let stepInput = this.createElement("input", "slider__stepInput", idNum);
        stepInput.setAttribute("type", "text");
        stepInput.setAttribute("placeholder", "" + this.sliderInfo.step);
        stepInputLabel.setAttribute("for", "" + stepInput.id);

        //---------------------------------------------------------------------------
        //-----------------------  view radiobuttons  -------------------------------
        //---------------------------------------------------------------------------

        let viewRadioContainer = this.createElement("div", "slider__viewRadioContainer", idNum);
        let viewRadioCommonLabel = this.createElement("label", "slider__viewRadioCommonLabel", idNum);
        viewRadioCommonLabel.innerHTML = "Вид слайдера:";

        let viewRadioHorizontal = this.createElement("input", "slider__viewRadio", "horizontal-" + idNum);
        viewRadioHorizontal.setAttribute("type", "radio");
        viewRadioHorizontal.setAttribute("name", "slider__viewRadio" + idNum);
        viewRadioHorizontal.setAttribute("value", "horizontal");
        viewRadioHorizontal.setAttribute("checked", "true");

        let viewRadioHorizontalLabel = this.createElement("label", "slider__viewRadioLabel", idNum);
        viewRadioHorizontalLabel.setAttribute("for", "" + viewRadioHorizontal.id);
        viewRadioHorizontalLabel.innerHTML = "Горизонтальный";

        let viewRadioVertical = this.createElement("input", "slider__viewRadio", "vertical-" + idNum);
        viewRadioVertical.setAttribute("type", "radio");
        viewRadioVertical.setAttribute("name", "slider__viewRadio" + idNum);
        viewRadioVertical.setAttribute("value", "vertical");


        let viewRadioVerticalLabel = this.createElement("label", "slider__viewRadioLabel", idNum);
        viewRadioVerticalLabel.setAttribute("for", "" + viewRadioVertical.id);
        viewRadioVerticalLabel.innerHTML = "Вертикальный";

        //-----------------------------------------------------------------------------

        let addHandleButton = this.createElement("button", "slider__addHandleButton", idNum);
        addHandleButton.setAttribute("type", "button");
        addHandleButton.innerHTML = "+";

        let deleteAllHandlesButton = this.createElement("button", "slider__deleteAllHandlesButton", idNum);
        deleteAllHandlesButton.setAttribute("type", "button");
        deleteAllHandlesButton.innerHTML = "- all";
        deleteAllHandlesButton.classList.add('hidden');

        let handleControlContainer = this.createElement("div", "slider__handleControlContainer", idNum);

        this.mainContainer.append(controlElements);
        controlElements.append(valueCheckbox);
        controlElements.append(checkboxLabel);

        controlElements.append(minMaxInputsContainer);
        minMaxInputsContainer.append(minInputLabel);
        minMaxInputsContainer.append(minInput);
        minMaxInputsContainer.append(maxInputLabel);
        minMaxInputsContainer.append(maxInput);

        controlElements.append(stepInputLabel);
        controlElements.append(stepInput);

        controlElements.append(viewRadioContainer);
        viewRadioContainer.append(viewRadioCommonLabel);
        viewRadioContainer.append(viewRadioHorizontal);
        viewRadioContainer.append(viewRadioHorizontalLabel);
        viewRadioContainer.append(viewRadioVertical);
        viewRadioContainer.append(viewRadioVerticalLabel);

        controlElements.append(addHandleButton);
        controlElements.append(deleteAllHandlesButton);
        controlElements.append(handleControlContainer);

        let mainDiv = this.createElement("div", "slider__container", idNum);
        let sliderScale = this.createElement("div", "slider__scale", idNum);

        this.mainContainer.append(mainDiv);
        mainDiv.append(sliderScale);

        let that = this;

        while (handleNum < this.sliderInfo.handleNumber) {
            this.addToggle(sliderScale, handleControlContainer);
            handleNum++;
        }

        valueCheckbox.addEventListener("change", function () {
            if ((valueCheckbox as HTMLInputElement).checked) {
                that.showToggleLables(idNum, true);
            } else {
                that.showToggleLables(idNum, false);
            }
        });

        addHandleButton.addEventListener("click", function (e: MouseEvent) {
            e.preventDefault();
            that.addToggle(sliderScale, handleControlContainer);
            deleteAllHandlesButton.classList.remove("hidden");
        });

        deleteAllHandlesButton.addEventListener("click", function () {
            that.deleteAllToggles(idNum);
            this.classList.add('hidden');
        });

        viewRadioVertical.addEventListener("change", function () {
            if ((this as HTMLInputElement).checked) {
                that.rotateScaleVertical(mainDiv.id);
            }
        });

        viewRadioHorizontal.addEventListener("change", function () {
            if ((viewRadioHorizontal as HTMLInputElement).checked) {
                that.rotateScaleHorisontal(mainDiv.id);
            }
        });


    };

    createElement(tag: string, className: string, idNum: number | string): Element {
        if (!tag || !className) {
            return;
        }
        let newElem = document.createElement(tag);
        newElem.className = className;

        if (idNum) {
            newElem.id = className + '-' + idNum;
        }
        return newElem;
    };

    addToggle(scale: Element, toggleControlContainer: Element): void {
        let orderNumber = scale.childElementCount + 1;
        let idPostfixFull = this.sliderInfo.idNum + '-' + (orderNumber);
        let toggle = this.createElement("div", "slider__toggle", idPostfixFull);
        let sliderToggleLabel = this.createElement("div", "slider__toggleLabel", idPostfixFull);
        let that = this;

        scale.append(toggle);
        toggle.append(sliderToggleLabel);

        let toggleControl = this.createElement("div", "slider__toggleControl", idPostfixFull);
        toggleControlContainer.append(toggleControl);

        let toggleValueFieldLabel = this.createElement("lable", "slider__toggleValueFieldLabel", idPostfixFull);
        toggleValueFieldLabel.innerHTML = orderNumber + ": ";

        let toggleValueField = this.createElement("input", "slider__toggleValueField", idPostfixFull);
        toggleValueField.setAttribute("type", "text");
        toggleValueFieldLabel.setAttribute('for', '' + toggleValueField.id);

        toggleControl.append(toggleValueFieldLabel);
        toggleControl.append(toggleValueField);

        if (scale.classList.contains("vertical")) {
            toggle.classList.add("vertical");
            sliderToggleLabel.classList.add("vertical");
        }

        if (+orderNumber > 1) {
            if (scale.firstElementChild.firstElementChild.classList.contains("hidden")) {
                toggle.firstElementChild.classList.add("hidden");
            }
            let deleteToggleButton = this.createElement("button", "slider__deleteToggleButton", idPostfixFull);
            deleteToggleButton.setAttribute("type", "button");
            deleteToggleButton.innerHTML = "-";
            toggleControl.append(deleteToggleButton);

            deleteToggleButton.addEventListener("click", function () {
                let butId = $(this).attr("id");
                let [, idNumberBut, postfixBut] = butId.split("-");
                that.deleteToggle(idNumberBut, +postfixBut);
            });
        }

        toggleValueField.addEventListener("change", function () {
            that.chandeTogglePosition(this.value, (scale as HTMLElement), (toggle as HTMLElement));
        });

        this.addToggleDragAndDrop((scale as HTMLElement), (toggle as HTMLElement));
    };
    addToggleDragAndDrop(scale: HTMLElement, toggle: HTMLElement) {
        let toggleField = toggle.parentElement.parentElement.previousElementSibling.lastElementChild.lastElementChild.firstChild.nextSibling as HTMLInputElement;
        let toggleLabel = toggle.firstElementChild;
        let min = 0,
            max = this.sliderInfo.max - this.sliderInfo.min,
            valueMin = this.sliderInfo.min,
            step = this.sliderInfo.step,
            stepSize = 1,
            shiftX: number;

        toggle.addEventListener('mousedown', function (event: MouseEvent) {
            event.preventDefault();

            let isVertical = toggle.classList.contains("vertical");
            let stepNumber = max / step;

            if (isVertical) {
                shiftX = event.clientY - toggle.getBoundingClientRect().top;
            } else {
                shiftX = event.clientX - toggle.getBoundingClientRect().left;
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            stepSize = Math.round((scale.offsetWidth - toggle.offsetWidth) / stepNumber);
            if (isVertical) {
                stepSize = (scale.getBoundingClientRect().height - toggle.getBoundingClientRect().height) / stepNumber;
            }

            function onMouseMove(event: MouseEvent) {
                let newCoord: number, finishEdge: number;

                if (isVertical) {
                    finishEdge = scale.offsetHeight - toggle.offsetHeight;
                    newCoord = event.clientY - shiftX - scale.getBoundingClientRect().top;
                } else {
                    newCoord = event.clientX - shiftX - scale.getBoundingClientRect().left;
                    finishEdge = scale.getBoundingClientRect().width - toggle.getBoundingClientRect().width;
                }

                let nextSibling = toggle.nextElementSibling;
                let prevSibling = toggle.previousElementSibling;

                if (prevSibling) {
                    min = prevSibling.getBoundingClientRect().right - scale.getBoundingClientRect().left;
                    if (isVertical) {
                        min = prevSibling.getBoundingClientRect().bottom - scale.getBoundingClientRect().top;
                    }
                }
                if (nextSibling) {
                    finishEdge = nextSibling.getBoundingClientRect().left - scale.getBoundingClientRect().left - nextSibling.getBoundingClientRect().width;
                    if (isVertical) {
                        finishEdge = nextSibling.getBoundingClientRect().top - scale.getBoundingClientRect().top - nextSibling.getBoundingClientRect().height;
                    }
                }

                let finCoord = Math.round(newCoord / stepSize) * stepSize;

                if (finCoord < min) {
                    finCoord = min;
                }

                if (finCoord > finishEdge) {
                    finCoord = finishEdge;
                }

                if (isVertical) {
                    toggle.style.top = finCoord + 'px';
                } else {
                    toggle.style.left = finCoord + 'px';
                }

                //--------  расчет числа над ползунком  ---------------
                //! шкала работает неправильно

                let val: number;

                if (isVertical) {
                    val = Math.round(((finCoord * max) / (scale.offsetHeight - toggle.offsetHeight)) + valueMin);
                } else {
                    val = Math.round(((finCoord * max) / (scale.offsetWidth - toggle.offsetWidth)) + valueMin);
                }

                toggleLabel.innerHTML = val + "";
                toggleField.value = val + "";
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
    deleteAllToggles(idNumber: number) {
        let sliderScaleId = "#slider__scale-" + idNumber;
        let sliderParent = document.querySelector(sliderScaleId);

        for (let i = sliderParent.children.length; i > 1; i--) {
            this.deleteToggle(idNumber, i, true);
        }
    };
    deleteToggle(idNumber: number | string, postfix: number, isAll: boolean = false) {

        let handleControlContainerId = "#slider__handleControlContainer-" + idNumber;
        let sliderScaleId = "#slider__scale-" + idNumber;

        document.querySelector(sliderScaleId).children[postfix - 1].remove();
        document.querySelector(handleControlContainerId).children[postfix - 1].remove();

        if (postfix < document.querySelector(sliderScaleId).children.length + 1 && !isAll) {
            this.changePostfixes(sliderScaleId, 'slider__toggle', postfix);
            this.changePostfixes(handleControlContainerId, 'slider__toggleControl', postfix);
        }
    };
    chandeTogglePosition(newCoord: number | string, scale: HTMLElement, toggle: HTMLElement) {

        let scaleSize = scale.offsetWidth;
        let toggleSize = toggle.offsetWidth;

        if (toggle.classList.contains("vertical")) {
            scaleSize = scale.offsetHeight;
            toggleSize = toggle.offsetHeight;
        }

        let toggleNewPosition = ((+newCoord - this.sliderInfo.min) * (scaleSize - toggleSize)) / (this.sliderInfo.max - this.sliderInfo.min);

        if (toggleNewPosition > scaleSize - toggleSize / 2) {
            toggleNewPosition = scaleSize - toggleSize / 2;
            newCoord = this.sliderInfo.max;
        }
        if (toggleNewPosition < 0) {
            toggleNewPosition = 0;
            newCoord = this.sliderInfo.min;
        }

        if (toggle.classList.contains("vertical")) {
            toggle.style.top = toggleNewPosition + "px"
        } else {
            toggle.style.left = toggleNewPosition + "px";
        }
        toggle.firstElementChild.textContent = "" + newCoord;
    }

    changePostfixes(parentId: string, className: string, deletedPostfix: number) {

        let newPostfix = deletedPostfix - 1;
        let parent = document.querySelector(parentId);

        for (let i = newPostfix; i < parent.children.length; i++) {
            let thisChild = parent.children[i];
            let [, idNum, postf] = thisChild.id.split("-");
            let newPostf = +postf - 1;
            let newId = "#" + className + '-' + idNum + '-' + newPostf;
            thisChild.id = newId;

            if (thisChild.children.length > 0) {
                for (let j = 0; j < thisChild.children.length; j++) {
                    let [childClassName, ,] = thisChild.children[j].id.split("-");
                    newId = childClassName + '-' + idNum + '-' + newPostf;
                    thisChild.children[j].id = newId;

                    if (thisChild.children[j].tagName === "LABLE") {
                        let lableElement = thisChild.children[j];
                        let attrFor = lableElement.getAttribute('for');
                        let [forClass, ,] = attrFor.split("-");
                        attrFor = forClass + '-' + idNum + '-' + newPostf;
                        lableElement.setAttribute('for', attrFor);
                        lableElement.innerHTML = newPostf + ": ";
                    }
                }
            }
        }
        return;
    };

    rotateScaleVertical(containerId: string) {
        let searchContainerId: string = containerId;

        if (!containerId.includes("#")) {
            searchContainerId = '#' + containerId;
        }
        if (!($(searchContainerId).hasClass("vertical"))) {
            $(searchContainerId).addClass("vertical");
            $(searchContainerId).children(".slider__scale").addClass("vertical");
            let handles = $(searchContainerId).children(".slider__scale").children(".slider__toggle");

            for (let handle of handles) {
                handle.classList.add("vertical");
                let oldLeft = handle.style.left;
                handle.style.left = -4 + "px";
                handle.style.top = oldLeft;
                let lable = handle.firstElementChild;
                lable.classList.add("vertical");
            }
        }
    };
    rotateScaleHorisontal(containerId: string) {
        let searchContainerId: string = containerId;

        if (!containerId.includes("#")) {
            searchContainerId = '#' + containerId;
        }

        if ($(searchContainerId).hasClass("vertical")) {
            $(searchContainerId).removeClass("vertical");
            $(searchContainerId).children(".slider__scale").removeClass("vertical");
            let handles = $(searchContainerId).children(".slider__scale").children(".slider__toggle");

            for (let handle of handles) {
                handle.classList.remove("vertical");
                let oldTop = handle.style.top;
                handle.style.top = -5 + "px";
                handle.style.left = oldTop;
                let lable = handle.firstElementChild;
                lable.classList.remove("vertical");
            }
        }

    };

    showToggleLables(idNum: number, isToShow: boolean) {

        let parentSlider = document.querySelector("#slider__scale-" + idNum);
        let handles = Array.prototype.slice.call(parentSlider.children);

        for (let item of handles) {
            if (isToShow) {
                if (item.firstElementChild.classList.contains("hidden")) {
                    item.firstElementChild.classList.remove("hidden");
                }
            } else if (!item.firstElementChild.classList.contains("hidden")) {
                item.firstElementChild.classList.add("hidden");
            }
        }
    };

};

class Scale {
    info: {
        sliderID: number;
    }
     

};

class Toggle {
    info: {
        sliderID: number;
        toggleNum: number;
    }

};


const newModel = new Model();
console.log(newModel);
const newView = new View(newModel);
console.log(newView);
const app = new Controller(newModel, newView); 





//   renewScale(idNum: number, min: number, max: number, step: number) {
//     let that = this;
//     this.addHandleListener(idNum, min, max, step);
//     let scale = this.getElement('', 'slider__scale', idNum);
//     let handles = scale.children;
//     for (let handle of handles) {
//       this.addHandleListener.bind(handle, idNum, min, max, step);
//     }
    // let oldSlider = this.getElement('', 'slider__mainContainer', idNum);
    // let newSlider = this.createSliderInterface(idNum);
    // let prevSibling = oldSlider.previousElementSibling;
    // if (prevSibling) {
    //   oldSlider.remove();
    //   prevSibling.insertAdjacentElement("afterend", newSlider);
    // } else {
    //   let parentElement = oldSlider.parentElement; 
    //   oldSlider.remove();
    //   parentElement.prepend(newSlider);
    // }
//   }



