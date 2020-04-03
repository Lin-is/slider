import './index.css';
"use strict";

class Observable {
  constructor() {
    let that = this;
    this.observers = [];
    this.sendMessage = function (msg) {
      for (var i = 0, len = that.observers.length; i < len; i++) {
        that.observers[i].notify(msg);
      }
    };
    this.addObserver = function (observer) {
      that.observers.push(observer);
    };
  }  
}



class SliderModel {
  
  constructor() {
    this.sliders = [ {idNum: 1, minScaleValue: 0, maxScaleValue: 100, step: 2, handleNumber: 1},
                     {idNum: 2, minScaleValue: -50, maxScaleValue: 352, step: 1, handleNumber: 2},
                     {idNum: 3, minScaleValue: 15, maxScaleValue: 120, step: 5, handleNumber: 1},]; 
  }
  
  addSlider(min = 0, max = 100, step = 1) {
    let slider = {
      idNum: this.sliders.length > 0 ? this.sliders[this.sliders.length - 1].idNum + 1 : 1,
      minScaleValue: min,
      maxScaleValue: max,
      step: step,
    }

    this.sliders.push(slider);
  };

  findSliderById(idNum) {
    let slider = this.sliders.find(item => item.idNum == idNum);
    return slider;
  };

  getMinScaleValue(idNum) {
    return findSliderById(idNum).minScaleValue;
  };
  getMaxScaleValue(idNum) {
    return findSliderById(idNum).maxScaleValue;
  };
  getStep(idNum) {
    return findSliderById(idNum).step;
  };
  getHandleNumberValue(idNum) {
    return findSliderById(idNum).handleNumber;
  };

  setMinScaleValue(idNum, newMin) {
    this.findSliderById(idNum).minScaleValue = newMin;
  }
  setMaxScaleValue(idNum, newMax) {
    this.findSliderById(idNum).maxScaleValue = newMax;
  }
  setStep(idNum, newStep) {
    this.findSliderById(idNum).step = newStep;
  }
  setHandleNumberValue(idNum, newNumber) {
    this.findSliderById(idNum).handleNumber = newNumber;
  }
  deleteSlider() {}
}


class SliderController {
  constructor(model, view) {
    this.model = model;
    this.view = view;



    this.view.displaySliders(this.model.sliders);
    let that = this;

    this.observer = new this.createObserver(function (info) {
      console.log(info);
        if (info.elemId.includes('minInput')) {
          that.changeMinValue(info.idNum, info.newValue);
        } else if (info.elemId.includes('maxInput')) {
          that.changeMaxValue(info.idNum, info.newValue);
        } else if (info.elemId.includes('stepInput')) {
          that.changeStepValue(info.idNum, info.newValue);
        }
        if (that.handleNumber != info.handleNum) {
          that.changeHandleNumberValue(info.idNum, info.handleNum);
        }

        that.view.clear();
        that.view.displaySliders(that.model.sliders);
    });  

    this.view.addObserver(this.observer);
  }

  createObserver = function (behavior) {
    this.notify = function (info) {
      behavior(info);
    };
  }

  changeMinValue = (idNum, newValue) => {
    this.model.setMinScaleValue(idNum, newValue);
  }

  changeMaxValue = (idNum, newValue) => {
    this.model.setMaxScaleValue(idNum, newValue);
  }

  changeStepValue = (idNum, newValue) => {
    this.model.setStep(idNum, newValue);
  }

  changeHandleNumberValue = (idNum, newValue) => {
    this.model.setHandleNumberValue(idNum, newValue);
  }
}

class SliderView extends Observable {
  constructor(model) {
    super();
    this.model = model;
  }

  displaySliders (sliders) {   
    sliders.forEach(item => this.createSliderInterface(item.idNum));
  }

  clear () {
    for (let elem of document.querySelectorAll('.slider__mainContainer')) {
      elem.remove();
    }
  }

  renewScale (idNum, min, max, step) {
    let that = this;
    this.addHandleListener(idNum, min, max, step);
    let scale = this.getElement('', 'slider__scale', idNum);
    let handles = scale.children;
    for (let handle of handles) {
      this.addHandleListener.bind(handle, idNum, min, max, step);
    }
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
  }

  createElement (tag, className, idNum) {
    if (!tag || !className) {
      return;
    }
    let newElem = document.createElement(tag);
    newElem.className = className; 
    
    if (idNum) {
      newElem.id = className + '-' + idNum;
    }
    return newElem;
  }

  getElement(selector, className, idNum, postfixNum) {
    if (selector != '') {
      const element = document.querySelector(selector);
      return element;
    } else if (className && idNum) {
      let searchId = '#' + className + '-' + idNum;
      if (postfixNum) {
        searchId = searchId + '-' + postfixNum;
      }
      let element = document.querySelector(searchId);
      return element;
    } else return;
  }

  createSliderInterface (idNum) {

    this.max = this.model.sliders[idNum - 1].maxScaleValue;
    this.min = this.model.sliders[idNum - 1].minScaleValue;
    this.step = this.model.sliders[idNum - 1].step;
    this.startHandleNum = this.model.sliders[idNum - 1].handleNumber;
    this.handleNum = 0;

    this.controlContainer = this.createElement("div", "slider__mainContainer", idNum);
    document.body.append(this.controlContainer);

    this.controlElements = this.createElement("div", "slider__controlElements", idNum);

    this.valueCheckbox = this.createElement("input", "slider__valueCheckbox", idNum);
    this.valueCheckbox.type = "checkbox";
    this.valueCheckbox.checked = true;
    this.checkboxLabel = this.createElement("label", "slider__valueCheckboxLabel", idNum);
    this.checkboxLabel.setAttribute('for', '' + this.valueCheckbox.id);
    this.checkboxLabel.innerHTML = "Показать значение над ползунком";

    //----------------------------------------------------------------------------
    //------------------------ inputs for min and max ----------------------------
    //----------------------------------------------------------------------------

    this.minMaxInputsContainer = this.createElement("div", "slider__minMaxInputsContainer", idNum);

    this.minInputLabel = this.createElement("div", "slider__minInputLabel", idNum);
    this.minInputLabel.innerHTML = "Min:";
    this.minInput = this.createElement("input", "slider__minInput", idNum);
    this.minInput.type = "text";
    this.minInput.setAttribute("placeholder", "" + this.min);
    this.minInputLabel.setAttribute("for", "" + this.minInput.idNum);


    this.maxInputLabel = this.createElement("div", "slider__maxInputLabel", idNum);
    this.maxInputLabel.innerHTML = "Max:";
    this.maxInput = this.createElement("input", "slider__maxInput", idNum);
    this.maxInput.type = "text";
    this.maxInput.setAttribute("placeholder", "" + this.max);
    this.maxInputLabel.setAttribute("for", "" + this.maxInput.id);


    this.stepInputLabel = this.createElement("div", "slider__stepInputLabel", idNum);
    this.stepInputLabel.innerHTML = "Шаг:";
    this.stepInput = this.createElement("input", "slider__stepInput", idNum);
    this.stepInput.type = "text";
    this.stepInput.setAttribute("placeholder", "" + this.step);
    this.stepInputLabel.setAttribute("for", "" + this.stepInput.id);

    //---------------------------------------------------------------------------
    //-----------------------  view radiobuttons  -------------------------------
    //---------------------------------------------------------------------------
      
    this.viewRadioContainer = this.createElement("div", "slider__viewRadioContainer", idNum);
    this.viewRadioCommonLabel = this.createElement("label", "slider__viewRadioCommonLabel", idNum);
    this.viewRadioCommonLabel.innerHTML = "Вид слайдера:";

    this.viewRadioHorizontal = this.createElement("input", "slider__viewRadio", "horizontal-" + idNum);
    this.viewRadioHorizontal.type = "radio";
    this.viewRadioHorizontal.name = "slider__viewRadio" + idNum;
    this.viewRadioHorizontal.value = "horizontal";
    this.viewRadioHorizontal.checked = true;

    this.viewRadioHorizontalLabel = this.createElement("label", "slider__viewRadioLabel", idNum);
    this.viewRadioHorizontalLabel.setAttribute("for", "" + this.viewRadioHorizontal.id);
    this.viewRadioHorizontalLabel.innerHTML = "Горизонтальный";

    this.viewRadioVertical = this.createElement("input", "slider__viewRadio", "vertical-" + idNum);
    this.viewRadioVertical.type = "radio";
    this.viewRadioVertical.name = "slider__viewRadio" + idNum;
    this.viewRadioHorizontal.value = "vertical";

    this.viewRadioVerticalLabel = this.createElement("label", "slider__viewRadioLabel", idNum);
    this.viewRadioVerticalLabel.setAttribute("for", "" + this.viewRadioVertical.id);
    this.viewRadioVerticalLabel.innerHTML = "Вертикальный";

  //-----------------------------------------------------------------------------

    this.addHandleButton = this.createElement("button", "slider__addHandleButton", idNum);
    this.addHandleButton.type = "button";
    this.addHandleButton.innerHTML = "+";

    this.deleteAllHandlesButton = this.createElement("button", "slider__deleteAllHandlesButton", idNum);
    this.deleteAllHandlesButton.type = "button";
    this.deleteAllHandlesButton.innerHTML = "- all";
    this.deleteAllHandlesButton.classList.add('hidden');

    this.handleControlContainer = this.createElement("div", "slider__handleControlContainer", idNum);


    this.controlContainer.append(this.controlElements);
    this.controlElements.append(this.valueCheckbox);
    this.controlElements.append(this.checkboxLabel);

    this.controlElements.append(this.minMaxInputsContainer);
    this.minMaxInputsContainer.append(this.minInputLabel);
    this.minMaxInputsContainer.append(this.minInput);
    this.minMaxInputsContainer.append(this.maxInputLabel);
    this.minMaxInputsContainer.append(this.maxInput);

    this.controlElements.append(this.stepInputLabel);
    this.controlElements.append(this.stepInput);

    this.controlElements.append(this.viewRadioContainer);
    this.viewRadioContainer.append(this.viewRadioCommonLabel);
    this.viewRadioContainer.append(this.viewRadioHorizontal);
    this.viewRadioContainer.append(this.viewRadioHorizontalLabel);
    this.viewRadioContainer.append(this.viewRadioVertical);
    this.viewRadioContainer.append(this.viewRadioVerticalLabel);

    this.controlElements.append(this.addHandleButton);
    this.controlElements.append(this.deleteAllHandlesButton);
    this.controlElements.append(this.handleControlContainer);

    this.mainDiv = this.createElement("div", "slider__container", idNum);
    this.sliderScale = this.createElement("div", "slider__scale", idNum);

    this.controlContainer.append(this.mainDiv);
    this.mainDiv.append(this.sliderScale);

    let that = this;

    while (this.handleNum != this.startHandleNum) {
      this.addSliderHandle(that, idNum);
    }
    

    let deleteAllHandlesButton = this.deleteAllHandlesButton;
    let radioVertical = this.viewRadioVertical;
    let radioHorizontal = this.viewRadioHorizontal;
    let mainDivId = this.mainDiv.id;
    let valueCheckbox = this.valueCheckbox;

    this.addHandleButton.onclick = function () {
      let [, thisIdNum] =  this.id.split('-');
      console.log('this.id', this.id);
      that.addSliderHandle(that, thisIdNum);
      deleteAllHandlesButton.classList.remove('hidden');
    };

    this.deleteAllHandlesButton.onclick = function () {
      that.removeAllHandles(idNum);
      this.classList.add('hidden');
    }

    this.viewRadioHorizontal.onchange = function () {
      if (radioHorizontal.checked) {
        that.rotateSliderHorisontal(mainDivId);
      }
    }

    this.viewRadioVertical.onchange = function () {
       if (radioVertical.checked) {
         that.rotateSliderVertical(mainDivId);
       }
    }

    this.valueCheckbox.onchange = function () {
      if (valueCheckbox.checked) {
        that.showHandleLable(idNum, true);
      } else {
        that.showHandleLable(idNum, false);
      }
    }

    this.maxInput.onchange = function () {
      console.log('this,', this);
      let [, thisIdNum] = this.id.split('-');
      let info = {
        elemId: this.id,
        idNum: thisIdNum,
        newValue: +this.value,
        handleNum: that.handleNum,
      }
      if (+this.value) {
        that.sendMessage(info);
      }
    };

    this.minInput.onchange = function () {
        console.log('this,', this);
        let [, thisIdNum] = this.id.split('-');
        let info = {
          elemId: this.id,
          idNum: thisIdNum,
          newValue: +this.value,
          handleNum: that.handleNum,
        }
        if (+this.value) {
          that.sendMessage(info);
        }
    };

    this.stepInput.onchange = function () {
        console.log('this,', this);
        let [, thisIdNum] = this.id.split('-');
        let info = {
          elemId: this.id,
          idNum: thisIdNum,
          newValue: +this.value,
          handleNum: that.handleNum,
        }
        if (+this.value) {
          that.sendMessage(info);
        }
      };
      
  }

  addSliderHandle (that, idNum) {

    let sliderScale = this.getElement('', 'slider__scale', idNum);

    let handleLabelNumber = sliderScale.children.length;
    let handleIdPostfix = idNum + "-" + ++handleLabelNumber;
    that.sliderHandle = this.createElement("div", "slider__handle", handleIdPostfix);
    that.sliderHandleLabel = this.createElement("div", "slider__handleLabel", handleIdPostfix);

    sliderScale.append(that.sliderHandle);
    that.sliderHandle.append(that.sliderHandleLabel);

   

    if (!sliderScale.parentElement.previousElementSibling.firstElementChild.checked) {
      that.sliderHandleLabel.classList.add('hidden');
    }

    if (sliderScale.classList.contains("vertical")){
      that.sliderHandle.classList.add("vertical");
      that.sliderHandleLabel.classList.add("vertical");
      if (that.sliderHandle.previousElementSibling){
        that.sliderHandle.style.top = that.sliderHandle.previousElementSibling.style.top + 15 + 'px';
      }
    } else if (that.sliderHandle.previousElementSibling) {
      that.sliderHandle.style.left = that.sliderHandle.previousElementSibling.style.left + 15 + 'px';
    }

    let handleControlContainer = sliderScale.parentElement.previousElementSibling.lastElementChild;

    let max = that.model.sliders[idNum - 1].maxScaleValue;
    let min = that.model.sliders[idNum - 1].minScaleValue;
    let step = that.model.sliders[idNum - 1].step;
    that.handleNum += 1;
    this.addHandleControl(handleControlContainer, that);
    this.addHandleListener(idNum, min, max, step);
  }

  addHandleControl (handleControlContainer, that) {

    let [ , idNumber, postfix] = that.sliderHandle.id.split("-");
    let idPostfix = idNumber + '-' + postfix;

    that.handleControl = this.createElement("div", "slider__handleControl", idPostfix);
    handleControlContainer.append(that.handleControl);

    that.handleValueFieldLabel = this.createElement("lable", "slider__handleValueFieldLabel", idPostfix);
    that.handleValueFieldLabel.innerHTML = postfix + ": ";

    that.handleValueField = this.createElement("input", "slider__handleValueField", idPostfix);
    that.handleValueField.type = "text";
    
    that.handleValueFieldLabel.setAttribute('for', '' + that.handleValueField.id);

    that.handleControl.append(that.handleValueFieldLabel);
    that.handleControl.append(that.handleValueField);

    if (postfix > 1)  {

      that.deleteHandleButton = this.createElement("button", "slider__deleteHandleButton", idPostfix);
      that.deleteHandleButton.type = "button";
      that.deleteHandleButton.innerHTML = "-";

      that.handleControl.append(that.deleteHandleButton);

      let newThat = this;

      that.deleteHandleButton.onclick = function () {
        let butId = $(this).attr("id");
        let [ , idNumberBut, postfixBut] = butId.split("-");
        newThat.deleteSliderHandle(idNumberBut, postfixBut);
      };
    }
  };


  // getSliderInfo (that, idNum){
  //   let sliderInfo = {
  //     min: 0,
  //     sliderMax = 
  //   }
  // }
    
  addHandleListener = (idNum, sliderMin, sliderMax, sliderStep) => {
    let slider = this.getElement( '', 'slider__scale', idNum),
        handle = this.sliderHandle,
        handleLabel = this.sliderHandleLabel,
        handleField = this.handleValueField;

    let min = 0,
        max = sliderMax - sliderMin,
        valueMin = sliderMin,
        step = sliderStep,
        stepSize = 1,
        shiftX;

    handle.onmousedown = function(event) {

      let isVertical = handle.classList.contains("vertical");

      event.preventDefault(); // предотвратить запуск выделения (действие браузера)
      
      if (isVertical) {
        shiftX = event.clientY - handle.getBoundingClientRect().top;
      } else {
        shiftX = event.clientX - handle.getBoundingClientRect().left;
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

        let stepNumber = max / step; 

        stepSize = (slider.getBoundingClientRect().width - handle.getBoundingClientRect().width) / stepNumber;
        if (isVertical) {
          stepSize = (slider.getBoundingClientRect().height - handle.getBoundingClientRect().height) / stepNumber;
        }

        function onMouseMove(event) {
          let newCoord, finishEdge;

          if (isVertical) {
            finishEdge = slider.offsetHeight - handle.offsetHeight;
            newCoord = event.clientY - shiftX - slider.getBoundingClientRect().top;
          } else {
            newCoord = event.clientX - shiftX - slider.getBoundingClientRect().left;
            finishEdge = slider.offsetWidth - handle.offsetWidth / 2;
          }

          
          let nextSibling = handle.nextSibling;
          let prevSibling = handle.previousElementSibling;

          if (prevSibling && isVertical) {
            min = prevSibling.getBoundingClientRect().bottom - slider.getBoundingClientRect().top;
          } else if (prevSibling) {
            min = prevSibling.getBoundingClientRect().right - slider.getBoundingClientRect().left;
          }


          if (nextSibling && isVertical) {
            finishEdge = nextSibling.getBoundingClientRect().top - slider.getBoundingClientRect().top - nextSibling.getBoundingClientRect().height;
        } else if (nextSibling) {
            finishEdge = nextSibling.getBoundingClientRect().left - slider.getBoundingClientRect().left - nextSibling.getBoundingClientRect().width;
        }

          // курсор вышел из слайдера => оставить бегунок в его границах.
          

          let finCoord = Math.round(newCoord / stepSize) * stepSize;

          if (finCoord < min) {
            finCoord = min;
          }

          if (finCoord > finishEdge) {
            finCoord = finishEdge;
          }

          if (isVertical) {
            handle.style.top = finCoord + 'px';
          } else {
            handle.style.left = finCoord + 'px';
          }
      
          //--------  расчет числа над ползунком  ---------------
          //! шкала работает неправильно

          let percent;

          if (isVertical) {
            percent = (finCoord / slider.offsetHeight) * 100;  
          } else { 
            percent = (finCoord /(slider.offsetWidth - handle.offsetWidth/2)) * 100;
          }
          
          let val = Math.round((max * percent) /100 + valueMin);
          handleLabel.innerHTML = val;
          handleField.value = val;
        };
      
        function onMouseUp() {
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
        };
      
      };
      
      handle.ondragstart = function() {
        return false;
      };
  };

  removeAllHandles (idNumber) {
    let sliderScaleId = "#slider__scale-" + idNumber;
    let sliderParent = document.querySelector(sliderScaleId);

    for (let i = sliderParent.children.length; i > 1; i--) {
      this.deleteSliderHandle(idNumber, i, true);
    }
  };

  deleteSliderHandle(idNumber, postfix, isAll = false) {

    let handleControlContainerId = "#slider__handleControlContainer-" + idNumber;
    let sliderScaleId = "#slider__scale-" + idNumber;

    document.querySelector(sliderScaleId).children[postfix-1].remove();
    document.querySelector(handleControlContainerId).children[postfix-1].remove();

    if (postfix < document.querySelector(sliderScaleId).children.length + 1 && !isAll){
      this.changePostfixes( sliderScaleId, 'slider__handle', postfix);
      this.changePostfixes( handleControlContainerId, 'slider__handleControl', postfix);
    }
  };

 

  rotateSliderVertical (containerId) {
    let searchContainerId;

    if (containerId.includes("#")) {
      searchContainerId = containerId;
    } else {
      searchContainerId = '#' + containerId;
    }

    if (!($(searchContainerId).hasClass("vertical"))) {
      $(searchContainerId).addClass("vertical");
      $(searchContainerId).children(".slider__scale").addClass("vertical");
      let handles = $(searchContainerId).children(".slider__scale").children(".slider__handle");
    
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

  rotateSliderHorisontal (containerId) {
    let searchContainerId;

    if (containerId.includes("#")) {
      searchContainerId = containerId;
    } else {
      searchContainerId = '#' + containerId;
    }

    if ($(searchContainerId).hasClass("vertical")) {
      $(searchContainerId).removeClass("vertical");
      $(searchContainerId).children(".slider__scale").removeClass("vertical");
      let handles = $(searchContainerId).children(".slider__scale").children(".slider__handle");

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

  changePostfixes(parentId, className, deletedPostfix) {

    let newPostfix = deletedPostfix - 1;
    let parent = document.querySelector(parentId);

    for (let i = newPostfix; i < parent.children.length; i++) {
      let thisChild = parent.children[i];
      let [, idNum, postf] = thisChild.id.split("-");
      let newPostf = postf - 1;
      let newId = "#" + className + '-' + idNum + '-' + newPostf;
      thisChild.id = newId;

      if (thisChild.children.length > 0) {
        for (let j = 0; j < thisChild.children.length; j++) {
          let [childClassName, , ] = thisChild.children[j].id.split("-");
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

  showHandleLable(idNum, isToShow) {
    let parentSlider = this.getElement('', 'slider__scale', idNum);
    let handles = Array.prototype.slice.call(parentSlider.children);

    handles.forEach(item => {
      if (isToShow) {
        if (item.firstElementChild.classList.contains("hidden")){
          item.firstElementChild.classList.remove("hidden");
        }
      } else if (!item.firstElementChild.classList.contains("hidden")) {
        item.firstElementChild.classList.add("hidden");
      }
    })
  };

}






const newModel = new SliderModel();
console.log(newModel);
const newView = new SliderView(newModel);
console.log(newView);
const app = new SliderController(newModel, newView);



// function addSliderWithControl (id, min, max, step = 1) {

//   minInput.onchange = function () {
//     let newMin = +this.value;
//     setMinValue(sliderIndex, newMin);
//   };

//   maxInput.onchange = function () {
//     let newMax = +this.value;
//     setMaxValue(sliderIndex, newMax);
//   };

//   stepInput.onchange = function () {
//     let newStep = +this.value;
//     setStepValue(sliderIndex, newStep);
//   };

// };

// //!_----------------------------------------------------------------------------
// //!-----------------------------------------------------------------------------
// //!-----------------------------------------------------------------------------

// function setMinValue (index, newMin) {
//   sliders[index].minScaleValue = newMin;
// };

// function setMaxValue (index, newMax) {
//   sliders[index].maxScaleValue = newMax;
// };

// function setStepValue (index, newStep) {
//   sliders[index].step = newStep;
// };


// //!_----------------------------------------------------------------------------
// //!-----------------------------------------------------------------------------
// //!-----------------------------------------------------------------------------






