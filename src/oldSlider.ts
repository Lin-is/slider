import './index.css'
import { valHooks } from 'jquery';
"use strict";



//буква ё


        //Ё = 1025, Е = 1045; ё = 1105, е = 1077
        // А-Я = 1040 - 1071, а-я = 1072 - 1103

//из координаты в подпись




        // numMaxVal += this.cyrillcalcMaxDiff(numMaxVal, numMinVal);
        // if (numVal > 1045 && numVal < 1079) {
        //     if (numVal === 1046) {
        //         numVal = 1025;
        //     } else {
        //         numVal -= 1;
        //     }
        // }
        // if (numVal > 1078) {
        //     if (numVal === 1079) {
        //         numVal = 1105
        //     } else {
        //         numVal -= 2;
        //     }
        // }


        // if (numMinVal < 1046 && numMaxVal > 1078) {
        //     if (numVal > 1045 && numVal < 1078) {
        //         if (numVal === 1046) {
        //             numVal = 1025;
        //         } else {
        //             numVal -= 1;
        //         }
        //     }
        //     if (numVal > 1077) {
        //         if (numVal === 1079) {
        //             numVal = 1105
        //         } else if (numVal === 1078) {
        //             numVal -= 1;
        //         } else {
        //             numVal -= 2;
        //         }
        //     }
        // } else if (numMinVal < 1046 && numMaxVal <= 1072) {
        //     if (numVal > 1045) {
        //         if (numVal === 1046) {
        //             numVal = 1025;
        //         } else {
        //             numVal -= 1;
        //         }
        //     }
        // } else if (numMinVal >= 1046 && numMinVal < 1079) {
        //     if (numVal > 1077) {
        //         if (numVal === 1078) {
        //             numVal = 1105;
        //         } else {
        //             numVal -= 1;
        //         }
        //     }
        // }

// из подписи в координату 
    // numMaxVal += this.cyrillcalcMaxDiff(numMaxVal, numMinVal, numVal);


        // if (numVal === 1025) {
        //     numVal = 1046; 
        // };

        // if (numVal === 1105) {
        //     numVal = 1079
        // };

        // if (numVal > 1046 && numVal < 1079) {
        //     numVal += 1;
        // }
        // if (numVal > 1079) {
        //     numVal += 2;
        // }



        // if (numMinVal < 1046 && numMaxVal > 1078) {
        //     if (numVal > 1046 && numVal < 1078) {
        //         numVal += 1;
        //     }
        //     if (numVal > 1077) {
        //         if (numVal === 1105) {
        //             numVal = 1079;
        //         } else if (numVal === 1078) {
        //             numVal += 1;
        //         } else {
        //             numVal += 2;
        //         }
        //     }
        // } else if (numMinVal < 1046 && numMaxVal <= 1072) {
        //     if (numVal > 1046) {
        //         numVal += 1;
        //     }
        // } else if (numMinVal >= 1046 && numMinVal < 1079) {
        //     if (numVal > 1077) {
        //         if (numVal === 1105) {
        //             numVal = 1078;
        //         } else {
        //             numVal += 1;
        //         }
        //     }
        // }

        //в расчете размера шага
        // if (this.info.valType === "cyrillic") {
        //     maxVal += this.cyrillcalcMaxDiff(maxVal, minVal);
        // }

// cyrillcalcMaxDiff(maxCode: number, minCode: number, valCode ?: number): number {
//     let diff = 0;

//     // if (minCode < 1046 && maxCode >= 1078) {
//     //     diff = 2;
//     // } else if (minCode < 1046 && maxCode <= 1077 || minCode > 1046 && minCode < 1079) {
//     //     diff = 1;
//     // }

//     if (maxCode < 1078) {
//         diff = 1;
//     } else {
//         diff = 2;
//     }

//     return diff;
// }



interface sliderInfo {
    idNum?: number,
    minScaleValue: number,
    maxScaleValue: number,
    step: number,
    isRange: boolean,
    startVals?: Array<number>,
    measure?: string,
    isVertical: boolean,
}

class InterfaceElement {
    container: HTMLElement;
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
    sendMessage(msg: any) {
        for (var i = 0, len = this.observers.length; i < len; i++) {
            this.observers[i].notify(msg);
        }
        console.log("message sended", msg);
    };
    addObserver(observer: any) {
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
        return +this.sliderData.minScaleValue;
    };
    getMaxValue(): number {
        return +this.sliderData.maxScaleValue;
    };
    getStep(): number {
        return +this.sliderData.step;
    };
    getIsRangeInfo(): boolean {
        return this.sliderData.isRange;
    };

    setMinValue(newMin: number) {
        this.sliderData.minScaleValue = newMin;
        this.sendMessage({ "min": this.getMinValue() });
    }
    setMaxValue(newMax: number) {
        this.sliderData.maxScaleValue = newMax;
        this.sendMessage({ "max": this.getMaxValue() });
    }
    setStep(newStep: number) {
        this.sliderData.step = newStep;
        this.sendMessage({ "step": this.getStep() });
    }
    setIsRangeInfo(newData: boolean) {
        this.sliderData.isRange = newData;
        this.sendMessage({ "isRange": this.getIsRangeInfo() });
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
        this.model.setMinValue(newValue);
    };
    changeMaxValue = (newValue: number) => {
        this.model.setMaxValue(newValue);
    };
    changeStepValue = (newValue: number) => {
        this.model.setStep(newValue);
    };
    changeTogglesNumberValue = (newData: boolean) => {
        this.model.setIsRangeInfo(newData);
        this.view.updateTogglesWithControl();
    };
    observerViewFunc(info: any) {
        if (info.elemId.includes('min')) {
            this.changeMinValue(info.newValue);
        } else if (info.elemId.includes('max')) {
            this.changeMaxValue(info.newValue);
        } else if (info.elemId.includes('step')) {
            this.changeStepValue(info.newValue);
        } else if (info.elemId.includes('RadioVal')) {
            this.changeTogglesNumberValue(info.isRange);
        }
    };
    observerModelFunc(newValue: any) {
        if ("min" in newValue) {
            this.view.scaleInfo.min = newValue.min;
        } else if ("max" in newValue) {
            this.view.scaleInfo.max = newValue.max;
        } else if ("step" in newValue) {
            this.view.scaleInfo.step = newValue.step;
        } else if ("isRange" in newValue) {
            this.view.sliderInterface.sliderInfo.isRange = newValue.isRange;
        }
        this.view.connectInputsWithData();
    };
}

class View extends Observable {
    model: Model;
    sliderInterface: SliderInterface;
    observers: Array<Observer>;
    scaleInfo: {
        min: number,
        max: number,
        step: number,
        scaleMax: number,
        measure: string,
        isVertical: boolean,
    };

    togglesInfo: {
        firstTogCoord: number;
        secTogCoord: number;
    }
    sendTogMessage = function (msg: any) {
        for (var i = 0, len = this.togObservers.length; i < len; i++) {
            this.togObservers[i].notify(msg);
        }
        console.log("tog message sended", msg);
    };

    constructor(model: Model, parentElement: Element) {
        super();
        this.model = model;
        this.sliderInterface = new SliderInterface(this.model.sliderData);
        parentElement.append(this.sliderInterface.container);
        this.createListeners();
        this.observers = [];

        this.scaleInfo = {
            min: null,
            max: null,
            step: null,
            scaleMax: null,
            measure: "",
            isVertical: false,
        };
        this.togglesInfo = {
            firstTogCoord: null,
            secTogCoord: null,
        }
        this.observers.push(new Observer(this.togglesObserver.bind(this)));
        this.addObserver(this.observers[0]);
    };
    displaySlider() {
        this.connectInputsWithData();
        this.createTogglesControl();
        this.addDragAndDrop();
    };

    clear() {
        this.sliderInterface.container.remove();
        this.sliderInterface.toggles = [];
    };

    togglesObserver(info: { isFirstToggle: boolean, newCoord: number }) {
        if (info.isFirstToggle) {
            this.togglesInfo.firstTogCoord = info.newCoord;
        } else {
            this.togglesInfo.secTogCoord = info.newCoord;
        }
    }
    updateTogglesWithControl() {
        this.sliderInterface.updateToggles();

        let container = document.getElementById(this.sliderInterface.controlPanel.toggleInputsContainerID);
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        this.createTogglesControl();
        this.addDragAndDrop();
    }
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
        for (let i = 0; i < this.sliderInterface.toggles.length; i++) {
            let toggleID = this.sliderInterface.toggles[i];
            let toggle = document.getElementById(toggleID);
            let input = document.getElementById(this.sliderInterface.controlPanel.toggleInputsContainerID).children[i].lastElementChild as HTMLInputElement;
            this.addToggleDragAndDrop((this.sliderInterface.scale.scale) as HTMLElement, toggle, input);
        }
    };

    createTogglesControl() {
        let that = this;
        for (let i = 0; i < this.sliderInterface.toggles.length; i++) {

            let container = document.getElementById(this.sliderInterface.controlPanel.toggleInputsContainerID);
            let idPostfix = this.sliderInterface.sliderInfo.idNum + "-" + (i + 1);

            let toggleControl = document.createElement("div");
            toggleControl.setAttribute("class", "slider__toggleControl");
            toggleControl.setAttribute("id", "slider__toggleControl-" + idPostfix);


            let toggleValueFieldLabel = document.createElement("lable");
            toggleValueFieldLabel.setAttribute("class", "slider__toggleValueFieldLabel");
            toggleValueFieldLabel.setAttribute("id", "slider__toggleValueFieldLabel-" + idPostfix);
            toggleValueFieldLabel.innerHTML = i + 1 + ": ";

            let toggleValueField = document.createElement("input");
            toggleValueField.setAttribute("class", "slider__toggleValueField");
            toggleValueField.setAttribute("id", "slider__toggleValueField-" + idPostfix);
            toggleValueField.setAttribute("type", "text");
            toggleValueField.setAttribute("data-toggleID", this.sliderInterface.toggles[i]);

            toggleValueFieldLabel.setAttribute('for', '' + toggleValueField.id);

            container.append(toggleControl);
            toggleControl.append(toggleValueFieldLabel);
            toggleControl.append(toggleValueField);

            let toggleInputListener = function () {
                let thisHTML = this as HTMLInputElement;
                let toggle = document.getElementById(thisHTML.getAttribute("data-toggleID")) as HTMLElement;
                let isFirstTog = (i == 0) ? true : false;
                let newVal = +thisHTML.value;
                if (newVal > that.scaleInfo.max) {
                    newVal = that.scaleInfo.max;
                }
                if (newVal < that.scaleInfo.min) {
                    newVal = that.scaleInfo.min;
                }
                let info = {
                    isFirstToggle: isFirstTog,
                    newCoord: that.calculateToggleValToCoord(newVal),
                }
                that.sendTogMessage(info);
                that.changeTogglePosition(toggle);
            }
            toggleValueField.addEventListener("change", toggleInputListener);
        }
    }
    calculateToggleValToCoord(val: number): number {
        let isVertical = this.sliderInterface.scale.scale.classList.contains("vertical");
        let scaleSize = isVertical ? this.sliderInterface.scale.scale.getBoundingClientRect().height : this.sliderInterface.scale.scale.getBoundingClientRect().width;
        let toggleSize = isVertical ? this.sliderInterface.scale.scale.lastElementChild.getBoundingClientRect().height : this.sliderInterface.scale.scale.lastElementChild.getBoundingClientRect().width;
        let coord = ((val - this.scaleInfo.min) * (scaleSize - toggleSize)) / (this.scaleInfo.max - this.scaleInfo.min);
        return coord;
    }
    calculateToggleCoordToVal(coord: number): number {
        let isVertical = this.sliderInterface.scale.scale.classList.contains("vertical");
        let scaleSize = isVertical ? this.sliderInterface.scale.scale.getBoundingClientRect().height : this.sliderInterface.scale.scale.getBoundingClientRect().width;
        let toggleSize = isVertical ? this.sliderInterface.scale.scale.lastElementChild.getBoundingClientRect().height : this.sliderInterface.scale.scale.lastElementChild.getBoundingClientRect().width;
        let val = Math.round(((coord * this.scaleInfo.scaleMax) / (scaleSize - toggleSize)) + this.scaleInfo.min);
        return val;
    }
    createListeners() {
        let that = this;

        let inputListener = function () {
            let thisHTML: HTMLInputElement = this as HTMLInputElement;
            let info = {
                elemId: thisHTML.getAttribute("id"),
                newValue: +thisHTML.value,
            }
            if (+thisHTML.value) {
                that.sendMessage(info);
            }
        }

        let checkboxListener = function () {
            let thisHTML: HTMLInputElement = this as HTMLInputElement;
            if (thisHTML.checked) {
                that.sliderInterface.hideToggleLabels(false);
            } else {
                that.sliderInterface.hideToggleLabels(true);
            }
        }

        let isRangeListener = function () {
            let thisHTML: HTMLInputElement = this as HTMLInputElement;
            let info = {
                elemId: thisHTML.getAttribute("id"),
                isRange: true,
            }
            if (thisHTML.value == "range" && !thisHTML.checked || thisHTML.value == "single" && thisHTML.checked) {
                info.isRange = false;
            }
            that.sendMessage(info);

        }

        let minInput = document.getElementById(that.sliderInterface.controlPanel.minInputID);
        minInput.addEventListener("change", inputListener);
        let maxInput = document.getElementById(that.sliderInterface.controlPanel.maxInputID);
        maxInput.addEventListener("change", inputListener);
        let stepInput = document.getElementById(that.sliderInterface.controlPanel.stepInputID);
        stepInput.addEventListener("change", inputListener);

        let isRangeRadio = document.getElementById(that.sliderInterface.controlPanel.isRangeValRadioID);
        isRangeRadio.addEventListener("change", isRangeListener);
        let isSingleRadio = document.getElementById(that.sliderInterface.controlPanel.isSingleValRadioID);
        isSingleRadio.addEventListener("change", isRangeListener);

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
    addToggleDragAndDrop(scale: HTMLElement, toggle: HTMLElement, input: HTMLInputElement) {
        let isRange = false;
        let isFirstToggle = true;

        if (scale.children.length > 2) {
            isRange = true;
        }
        if (isRange && toggle.previousSibling) {
            isFirstToggle = false;
        }

        let toggleLabel = toggle.firstElementChild as HTMLElement;
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

                if (toggle.previousElementSibling && isRange) {
                    min = coords.prevToggleBorder - coords.scaleDistBord;
                }
                if (toggle.nextElementSibling && isRange) {
                    finishEdge = coords.nextToggleBorder - coords.scaleDistBord - coords.nextToggleSize;
                }

                if (newCoord < min) {
                    newCoord = min;
                }
                if (newCoord > finishEdge) {
                    newCoord = finishEdge;
                }
                if (isVertical) {
                    toggle.style.top = newCoord + 'px'
                } else {
                    toggle.style.left = newCoord + 'px'
                }
                let info = {
                    isFirstToggle: isFirstToggle,
                    newCoord: newCoord,
                }
                that.sendTogMessage(info);
                that.updateToggleLabel(toggleLabel, isFirstToggle, input);
                that.updateProgressBar();
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

        let isRange = false;

        if (scale.childElementCount > 2) {
            isRange = true;
        }

        let borderVals = {
            togDistBord: 0,
            togFirstBord: 0,
            togSize: 0,

            scaleDistBord: 0,
            scaleFirstBord: 0,
            scaleSize: 0,

            nextToggleBorder: 0,
            nextToggleSize: 0,

            prevToggleBorder: 0,
        }

        let nextToggle, prevToggle: Element;

        if (isRange) {
            nextToggle = scale.lastElementChild;
            prevToggle = scale.firstElementChild;
        }


        if (isVertical) {
            borderVals.togDistBord = toggle.getBoundingClientRect().top;
            borderVals.scaleDistBord = scale.getBoundingClientRect().top;

            borderVals.togFirstBord = toggle.getBoundingClientRect().bottom;
            borderVals.scaleFirstBord = scale.getBoundingClientRect().bottom;

            borderVals.togSize = toggle.getBoundingClientRect().height;
            borderVals.scaleSize = scale.getBoundingClientRect().height;

            if (nextToggle) {
                borderVals.nextToggleBorder = nextToggle.getBoundingClientRect().top;
                borderVals.nextToggleSize = nextToggle.getBoundingClientRect().height;
            }
            if (prevToggle) {
                borderVals.prevToggleBorder = prevToggle.getBoundingClientRect().bottom;
            }
        } else {
            borderVals.togDistBord = toggle.getBoundingClientRect().left;
            borderVals.scaleDistBord = scale.getBoundingClientRect().left;

            borderVals.togFirstBord = toggle.getBoundingClientRect().right;
            borderVals.scaleFirstBord = scale.getBoundingClientRect().right;

            borderVals.togSize = toggle.getBoundingClientRect().width;
            borderVals.scaleSize = scale.getBoundingClientRect().width;

            if (nextToggle) {
                borderVals.nextToggleBorder = nextToggle.getBoundingClientRect().left;
                borderVals.nextToggleSize = nextToggle.getBoundingClientRect().width;
            }
            if (prevToggle) {
                borderVals.prevToggleBorder = prevToggle.getBoundingClientRect().right;
            }
        }
        return borderVals;
    };
    changeTogglePosition(toggle: HTMLElement) {
        let scale = this.sliderInterface.scale.scale as HTMLElement;
        let isRange = (scale.childElementCount > 2) ? true : false;
        let isLastTog = toggle.previousSibling ? true : false;
        let firstTog: HTMLElement;
        let secTog: HTMLElement;
        if (isRange) {
            if (toggle.previousSibling) {
                firstTog = scale.firstElementChild as HTMLElement;
                secTog = toggle;
            } else {
                firstTog = toggle;
                secTog = scale.lastElementChild as HTMLElement;
            }

        } else {
            firstTog = toggle;
            secTog = null;
        }
        let newCoord = (!isRange) ? this.togglesInfo.firstTogCoord : (isLastTog ? this.togglesInfo.secTogCoord : this.togglesInfo.firstTogCoord);

        let isVertical = scale.classList.contains("vertical") ? true : false;

        let scaleSize = scale.offsetWidth;
        let toggleSize = toggle.offsetWidth;

        if (isVertical) {
            scaleSize = scale.offsetHeight;
            toggleSize = toggle.offsetHeight;
        }
        let borderMinVal = 0;
        let borderMaxVal = scaleSize - toggleSize / 2;
        let newText = newCoord;

        if (newCoord > borderMaxVal) {
            newCoord = borderMaxVal;
            newText = this.scaleInfo.max;
        }
        if (newCoord < borderMinVal) {
            newCoord = borderMinVal;
            newText = this.scaleInfo.min;
        }

        if (isVertical) {
            toggle.style.top = newCoord + "px";
        } else {
            toggle.style.left = newCoord + "px";
        }
        this.updateProgressBar();
        toggle.firstElementChild.textContent = "" + this.calculateToggleCoordToVal(newCoord);
    }

    updateToggleLabel(label: HTMLElement, isFirstToggle: boolean, input: HTMLInputElement) {
        let newCoord = isFirstToggle ? this.togglesInfo.firstTogCoord : this.togglesInfo.secTogCoord;
        let val = this.calculateToggleCoordToVal(newCoord);
        label.innerHTML = val + "";
        input.value = val + "";
    }

    updateProgressBar() {
        let scale = this.sliderInterface.scale.scale as HTMLElement;
        let isVertical = scale.classList.contains("vertical") ? true : false;
        let isRange = scale.childElementCount > 2 ? true : false;
        let progressBar = scale.childElementCount > 2 ? scale.children[1] as HTMLElement : scale.firstElementChild as HTMLElement;

        if (isRange) {
            if (isVertical) {
                progressBar.style.top = this.togglesInfo.firstTogCoord + "px";
                progressBar.style.height = this.togglesInfo.secTogCoord - this.togglesInfo.firstTogCoord + "px";
            } else {
                progressBar.style.left = this.togglesInfo.firstTogCoord + "px";
                progressBar.style.width = this.togglesInfo.secTogCoord - this.togglesInfo.firstTogCoord + "px";
            }
        } else {
            if (isVertical) {
                progressBar.style.top = "0px";
                progressBar.style.height = this.togglesInfo.firstTogCoord + "px";
            } else {
                progressBar.style.left = "0px";
                progressBar.style.width = this.togglesInfo.firstTogCoord + "px";
            }
        }
    }
}

class SliderInterface extends InterfaceElement {
    scale: Scale;
    controlPanel: controlPanel;
    toggles: Array<string>;
    progressBarId: string;

    sliderInfo: {
        idNum: number,
        isRange: boolean
    };

    constructor(sliderInfo: any) {
        super();
        this.sliderInfo = {
            idNum: sliderInfo.idNum,
            isRange: sliderInfo.isRange
        };
        this.toggles = [];
        this.render();
    };

    render() {
        this.container = this.createElement("div", "slider__mainContainer", this.sliderInfo.idNum) as HTMLElement;
        this.scale = new Scale(this.sliderInfo.idNum);
        this.controlPanel = new controlPanel(this.sliderInfo.idNum, this.sliderInfo.isRange);
        this.container.append(this.scale.container);
        this.createToggles();
        this.container.append(this.controlPanel.container);
    };
    updateToggles() {
        this.removeToggles();
        this.createToggles();
        let toHideLabels = (document.getElementById(this.controlPanel.showToggleLabelsCheckboxID)) as HTMLInputElement;
        if (toHideLabels.checked) {
            this.hideToggleLabels(false);
        }
    }
    removeToggles() {
        while (this.scale.scale.firstChild) {
            this.scale.scale.removeChild(this.scale.scale.firstChild);
        }
        this.toggles = [];
    }
    createToggles() {
        let progressBar = this.createElement("div", "slider__progressBar", this.sliderInfo.idNum);
        let HTMLbar = progressBar as HTMLElement;
        if (this.scale.scale.classList.contains("vertical")) {
            HTMLbar.classList.add("vertical");
            HTMLbar.style.top = "0px";
        } else {
            HTMLbar.style.left = "0px";
        }
        this.progressBarId = progressBar.getAttribute("id");
        if (this.sliderInfo.isRange) {
            for (let i = 0; i < 2; i++) {
                this.addToggle(this.scale.scale, i + 1);
                if (i == 0) {
                    this.scale.scale.append(HTMLbar);
                }
            }
        } else {
            this.scale.scale.append(HTMLbar);
            this.addToggle(this.scale.scale, 1);
        }
    }
    addToggle(parentElement: Element, index: number) {
        let toggle = new Toggle(this.sliderInfo.idNum + '-' + index);
        let isVertical = parentElement.classList.contains("vertical") ? true : false;
        let togContainer = toggle.container as HTMLElement;
        let startVal: number;

        if (!isVertical) {
            startVal = Math.floor(parentElement.getBoundingClientRect().width * 0.25);
            if (index > 1) {
                startVal = Math.floor(parentElement.getBoundingClientRect().width * 0.75);
            }
            togContainer.style.left = startVal + "px"
            togContainer.firstElementChild.innerHTML = startVal + "";
        }
        if (isVertical) {
            toggle.container.classList.add("vertical");
            toggle.container.firstElementChild.classList.add("vertical");
            startVal = Math.floor(parentElement.getBoundingClientRect().height * 0.25);
            if (index > 1) {
                startVal = Math.floor(parentElement.getBoundingClientRect().height * 0.75);
            }
            togContainer.style.top = startVal + "px"
            togContainer.firstElementChild.innerHTML = startVal + "";
        }
        parentElement.append(toggle.container);
        this.toggles.push(toggle.container.getAttribute("id"));
    };
    hideToggleLabels(toHide: boolean) {
        for (let toggle of this.toggles) {
            let toggleElem = document.getElementById(toggle);
            let label = toggleElem.firstChild as HTMLElement
            if (toHide) {
                label.classList.add("hidden");
            } else {
                label.classList.remove("hidden");
            }
        }
    };
    rotateSlider(toVertical: boolean) {
        let scaleContainer = document.getElementById(this.scale.container.getAttribute("id"));
        let scale = document.getElementById(this.scale.scaleID);
        let progressBar: HTMLElement;
        let progBarRightCoord: string;

        if (this.sliderInfo.isRange) {
            progressBar = (this.scale.scale.children[1]) as HTMLElement;
        } else {
            progressBar = (this.scale.scale.firstElementChild) as HTMLElement;
        }

        if (toVertical && !scaleContainer.classList.contains("vertical")) {
            scaleContainer.classList.add("vertical");
            scale.classList.add("vertical");
            progressBar.classList.add("vertical");
            for (let toggle of this.toggles) {
                let toggleElem = document.getElementById(toggle);
                let label = toggleElem.firstChild as HTMLElement
                label.classList.add("vertical");
                toggleElem.classList.add("vertical");
                let oldLeft = toggleElem.style.left;
                toggleElem.style.left = -4 + "px";
                toggleElem.style.top = oldLeft;
                progBarRightCoord = oldLeft;
            }
            progressBar.style.height = progBarRightCoord;
            progressBar.style.width = "100%";
            progressBar.style.left = "0px"

            if (this.sliderInfo.isRange) {
                let firstToggle = document.getElementById(this.toggles[0]);
                let secToggle = document.getElementById(this.toggles[1]);
                progressBar.style.top = (firstToggle.getBoundingClientRect().top - this.scale.scale.getBoundingClientRect().top) + "px"
                progressBar.style.height = (secToggle.getBoundingClientRect().top - firstToggle.getBoundingClientRect().top) + "px";
            }
        } else if (!toVertical && scale.classList.contains("vertical")) {
            scaleContainer.classList.remove("vertical");
            scale.classList.remove("vertical");
            progressBar.classList.remove("vertical");
            for (let toggle of this.toggles) {
                let toggleElem = document.getElementById(toggle);
                let label = toggleElem.firstChild as HTMLElement
                label.classList.remove("vertical");
                toggleElem.classList.remove("vertical");
                let oldTop = toggleElem.style.top;
                toggleElem.style.top = -5 + "px";
                toggleElem.style.left = oldTop;
                progBarRightCoord = oldTop;
            }
            progressBar.style.height = "100%";
            progressBar.style.width = progBarRightCoord;
            progressBar.style.top = "0px";

            if (this.sliderInfo.isRange) {
                let firstToggle = document.getElementById(this.toggles[0]);
                let secToggle = document.getElementById(this.toggles[1]);
                progressBar.style.left = (firstToggle.getBoundingClientRect().left - this.scale.scale.getBoundingClientRect().left) + "px";
                progressBar.style.width = (secToggle.getBoundingClientRect().left - firstToggle.getBoundingClientRect().left) + "px";
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
        this.container = this.createElement("div", "slider__scaleContainer", this.idNum) as HTMLElement;
        this.scale = this.createElement("div", "slider__scale", this.idNum);
        this.container.append(this.scale);
        this.scaleID = this.scale.getAttribute("id");
    }
};

class Toggle extends InterfaceElement {
    label: HTMLElement;
    idNum: number | string;
    constructor(idNum: number | string) {
        super();
        this.idNum = idNum;
        this.render();
    }
    render() {
        let container = this.createElement("div", "slider__toggle", this.idNum);
        this.container = document.getElementById(container.getAttribute("id")) as HTMLElement;
        this.label = (this.createElement("div", "slider__toggleLabel", this.idNum)) as HTMLElement;
        this.label.classList.add("hidden")
        this.container.append(this.label);
    }
    remove() {
        this.container.remove;
    }
    setCoord(coord: number, value: number | string, isVertical: boolean): void {
        if (isVertical) {
            this.container.style.top = coord + "px";
        } else {
            this.container.style.left = coord + "px";
        }
        this.label.innerText = value + "";
    };

    getCoord(isVertical: boolean): number {
        let coord = this.container.getBoundingClientRect().left;
        if (isVertical) {
            coord = this.container.getBoundingClientRect().top;
        }
        return coord;
    };
};

class controlPanel extends InterfaceElement {

    idNum: number;
    isRange: boolean;

    showToggleLabelsCheckboxID: string;
    minInputID: string;
    maxInputID: string;
    stepInputID: string;
    isHorizontalRadioID: string;
    isVerticalRadioID: string;
    isSingleValRadioID: string;
    isRangeValRadioID: string;
    toggleInputsContainerID: string;

    constructor(idNum: number, isRange: boolean) {
        super();
        this.idNum = idNum;
        this.isRange = isRange;
        this.render();
    }

    render() {
        this.container = this.createElement("div", "slider__controlElements", this.idNum) as HTMLElement;

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


        let viewRadioValTypeLabel = this.createElement("label", "slider__viewRadioCommonLabel", this.idNum);
        viewRadioValTypeLabel.innerHTML = "Тип значения:";

        let isSingleValRadio = this.createElement("input", "slider__viewRadioValType-single", this.idNum);
        isSingleValRadio.setAttribute("type", "radio");
        isSingleValRadio.setAttribute("name", "slider__viewRadioValType-" + this.idNum);
        isSingleValRadio.setAttribute("value", "single");
        this.isSingleValRadioID = isSingleValRadio.getAttribute("id");

        let viewRadioSingleValLabel = this.createElement("label", "slider__viewRadioLabel", this.idNum);
        viewRadioSingleValLabel.innerHTML = "Значение";
        viewRadioSingleValLabel.setAttribute("for", this.isSingleValRadioID);

        let isRangeValRadio = this.createElement("input", "slider__viewRadioValType-range", this.idNum);
        isRangeValRadio.setAttribute("type", "radio");
        isRangeValRadio.setAttribute("name", "slider__viewRadioValType-" + this.idNum);
        isRangeValRadio.setAttribute("value", "range");
        this.isRangeValRadioID = isRangeValRadio.getAttribute("id");

        let viewRadioRangeValLabel = this.createElement("label", "slider__viewRadioLabel", this.idNum);
        viewRadioRangeValLabel.innerHTML = "Интервал";
        viewRadioRangeValLabel.setAttribute("for", this.isRangeValRadioID);

        if (this.isRange) {
            isRangeValRadio.setAttribute("checked", "true");
        }
        if (!this.isRange) {
            isSingleValRadio.setAttribute("checked", "true");
        }

        let toggleInputsContainer = this.createElement("div", "slider__toggleControlContainer", this.idNum);
        this.toggleInputsContainerID = toggleInputsContainer.getAttribute("id");

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

        viewRadioContainer.append(viewRadioValTypeLabel);
        viewRadioContainer.append(isSingleValRadio);
        viewRadioContainer.append(viewRadioSingleValLabel);
        viewRadioContainer.append(isRangeValRadio);
        viewRadioContainer.append(viewRadioRangeValLabel);

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
        isRange: false,
        isVertical: false,
    }, elem);
}

function createSlider(info: sliderInfo,
    parentElement: Element) {
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


















// Round a value to the closest 'to'.
// function closest(value, to) {
//     return Math.round(value / to) * to;
// }


