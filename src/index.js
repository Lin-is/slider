import './index.css';
"use strict";

class SliderModel {
  constructor() {
    this.sliders = [ {idNum: 1, minScaleValue: 0, maxScaleValue: 100, step: 2},
                     {idNum: 2, minScaleValue: -50, maxScaleValue: 352, step: 1},
                     {idNum: 3, minScaleValue: 15, maxScaleValue: 120, step: 5},]; 
  }

  addSlider(idNum = this.sliders.length > 0 ? this.sliders[this.sliders.length - 1].idNum + 1 : 1, min = 0, max = 100, step = 1) {
    let slider = {
      idNum: idNum,
      minScaleValue: min,
      maxScaleValue: max,
      step: step,
    }

    this.sliders.push(slider);
  }

  findSliderById(idNum) {
    let slider = this.sliders.find(item => item.idNum == idNum);
    return slider;
  }

  getMinScaleValue(idNum) {
    return findSliderById(idNum).minScaleValue;
  }
  getMaxScaleValue(idNum) {
    return findSliderById(idNum).maxScaleValue;
  }
  getStep(idNum) {
    return findSliderById(idNum).step;
  }

  setMinScaleValue(idNum, newMin) {
    this.findSliderById(idNum).minScaleValue = newMin;
  }
  setMaxScaleValue(idNum, newMax) {
    this.findSliderById(idNum).maxScaleValue = newMax;
  }
  setStep(idNum, newStep) {
    this.findSliderById(idNum).step = newStep;
  }

  deleteSlider() {}
}

class SliderView {
  constructor(model) {
    this.model = model;
    this.model.sliders.forEach(item => this.createSliderInterface (item.idNum));
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

    

    this.controlContainer = this.createElement("div", "slider__controlContainer", idNum);
    document.body.append(this.controlContainer);

    this.controlElements = this.createElement("div", "slider__controlElements", idNum);

    this.valueCheckbox = this.createElement("input", "slider__valueCheckbox", idNum);
    this.valueCheckbox.type = "checkbox";
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


    this.addSliderHandle(this.sliderScale, that, idNum);

    let sliderScale = this.sliderScale;
    let deleteAllHandlesButton = this.deleteAllHandlesButton;


    this.addHandleButton.onclick = function () {
        that.addSliderHandle(sliderScale, that, idNum);
        deleteAllHandlesButton.classList.remove('hidden');
    };

    this.deleteAllHandlesButton.onclick = function () {
      that.removeAllHandles(idNum);
      this.classList.add('hidden');
    }
  }

  addSliderHandle (sliderScale, that, idNum) {
    
    console.log('sliderScale', sliderScale);

    let handleLabelNumber = sliderScale.children.length;
    let handleIdPostfix = idNum + "-" + ++handleLabelNumber;
    that.sliderHandle = this.createElement("div", "slider__handle", handleIdPostfix);
    that.sliderHandleLabel = this.createElement("div", "slider__handleLabel", handleIdPostfix);

    sliderScale.append(that.sliderHandle);
    that.sliderHandle.append(that.sliderHandleLabel);

    if (sliderScale.classList.contains("vertical")){
      that.sliderHandle.classList.add("vertical");
      that.sliderHandleLabel.classList.add("vertical");
    }

    let handleControlContainer = sliderScale.parentElement.previousElementSibling.lastElementChild;

    // that.sliderHandleLabel.innerHTML = max/2;
    this.addHandleControl(handleControlContainer, that);
    this.addHandleListener(this);
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
    }
  };

    
  addHandleListener (that) {

      let slider = that.sliderScale;
      let handle = that.sliderHandle;
      let handleLabel = that.sliderHandleLabel;
      let handleField = that.handleValueField;

      let min = 0,
          max = that.max - that.min,
          valueMin = that.min,
          step = that.step,
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
      changePostfixes( sliderScaleId, 'slider__handle', postfix);
      changePostfixes( handleControlContainerId, 'slider__handleControl', postfix);
    }
  };


}




class SliderController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}


const newModel = new SliderModel();
const app = new SliderController(newModel, new SliderView(newModel));



// function addSliderWithControl (id, min, max, step = 1) {
//   //!---------------------------------------------------------------
//   //!---------------------------------------------------------------
//   //!---------------------------------------------------------------
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
//   //!---------------------------------------------------------------
//   //!---------------------------------------------------------------
//   //!---------------------------------------------------------------

//   but.onclick = function () {
//     addSliderHandle(id, max);
//     $('#' + deleteAllHandlesButton.id).removeClass('hidden');
//   };

//   let removeButtonId = "#" + deleteAllHandlesButton.id;
//   let removeBut = document.querySelector(removeButtonId);

//   removeBut.onclick = function () {
//     removeAllHandles(id);
//     $('#' + deleteAllHandlesButton.id).addClass('hidden');
//   }

//   let radioIdHorizontal = "#" + viewRadioHorizontal.id;
//   let radioHorizontal = document.querySelector(radioIdHorizontal);

//   let radioIdVertical = "#" + viewRadioVertical.id;
//   let radioVertical = document.querySelector(radioIdVertical);

//   let sliderId = "slider__container-" + id;

//   radioHorizontal.onchange = function () {
//     if (radioHorizontal.checked) {
//       rotateSliderHorisontal(sliderId);
//     }
//   }
//   radioVertical.onchange = function () {
//     if (radioVertical.checked) {
//       rotateSliderVertical(sliderId);
//     }
//   }

// };



// function rotateSliderVertical (containerId) {

//   let searchContainerId;

//   if (containerId.includes("#")) {
//     searchContainerId = containerId;
//   } else {
//     searchContainerId = '#' + containerId;
//   }

//   if (!($(searchContainerId).hasClass("vertical"))) {
//     $(searchContainerId).addClass("vertical");
//     $(searchContainerId).children(".slider__scale").addClass("vertical");
//     let handles = $(searchContainerId).children(".slider__scale").children(".slider__handle");
  
//     for (let handle of handles) {
//       handle.classList.add("vertical");
//       let oldLeft = handle.style.left;
//       handle.style.left = -4 + "px";
//       handle.style.top = oldLeft;
//       let lable = handle.firstElementChild;
//       lable.classList.add("vertical");
//     }
//   }

// };


// function rotateSliderHorisontal (containerId) {

//   let searchContainerId;

//   if (containerId.includes("#")) {
//     searchContainerId = containerId;
//   } else {
//     searchContainerId = '#' + containerId;
//   }

//   if ($(searchContainerId).hasClass("vertical")) {

//     $(searchContainerId).removeClass("vertical");
//     $(searchContainerId).children(".slider__scale").removeClass("vertical");
//     let handles = $(searchContainerId).children(".slider__scale").children(".slider__handle");

//     for (let handle of handles) {
//       handle.classList.remove("vertical");
//       let oldTop = handle.style.top;
//       handle.style.top = -5 + "px";
//       handle.style.left = oldTop;
//       let lable = handle.firstElementChild;
//       lable.classList.remove("vertical");
//     }
//   }
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

// function addHandleControl (handleId) {

//   handleValueField.onchange = function() {
//     let max, min;

//     max = sliders[sliderIndex].maxScaleValue;
//     min = sliders[sliderIndex].minScaleValue;

//     let newValue;
//     let inputValue = +handleValueField.value;
//     let valueWdth = max - min; 
//     let fieldId = $(this).attr("id");
//     let [ , idNum, idPost] = fieldId.split('-');

//     let idTail = idNum + '-' + idPost;

//     if (!isNaN(inputValue)) {

//       if (inputValue < min) {
//         inputValue = min;
//       }

//       if (inputValue > max) {
//         inputValue = max;
//       }

//       let sliderScaleId = "#slider__scale-" + idNum;
//       let handleLabelId = "#slider__handleLabel-" + idTail;


//       let sliderScale = document.querySelector(sliderScaleId); 
//       let handleLabel = document.querySelector(handleLabelId);
//       let handle = handleLabel.parentNode;

//       if (handle.classList.contains("vertical")) {
//         newValue = ((sliderScale.getBoundingClientRect().height * (inputValue - min))/(valueWdth)).toFixed(0);
//         handle.style.top = newValue + "px";
//       } else {
//         newValue = ((sliderScale.getBoundingClientRect().width * (inputValue - min))/(valueWdth)).toFixed(0);
//         handle.style.left = newValue + "px";
//       }

//       handleLabel.innerHTML = inputValue;
//     }
//   }

//   if (postfix > 1)  {

//     let deleteHandleButton = createElement("button", "slider__deleteHandleButton", idPostfix);
//     deleteHandleButton.type = "button";
//     deleteHandleButton.innerHTML = "-";

//     $("#" + handleControl.id).append(deleteHandleButton);

//     let buttonId = "#" + deleteHandleButton.id;
//     let but = document.querySelector(buttonId);
  
//     but.onclick = function () {
//       let butId = $(this).attr("id");
//       let [ , idNumberBut, postfixBut] = butId.split("-");
//       deleteSliderHandle(idNumberBut, postfixBut);
//     };
//   }
// };

// function toggleValueHint(idArr, classCheckbox, classHint) {

//   idArr.forEach((item) => {
//     let [ , id] = item.id.split('-');
//     let check = document.querySelector("#" + classCheckbox + "-" + id);

//     check.onchange = function () {
//       let sliderId = "#slider__scale-" + id;
//       let allHandles = $(sliderId).children('.slider__handle');

//       for (let handle of allHandles) {
//         let [ , handleIdNum, idPostfix] = handle.id.split('-');
//         let handleLabelId = '#slider__handleLabel-' + handleIdNum + '-' + idPostfix;
//         if (check.checked) {
//           $(handleLabelId).removeClass("hidden"); 
//         } else {
//           $(handleLabelId).addClass("hidden"); 
//         }
//       }
//     };

//   });
// };





// function removeAllHandles (idNumber) {
//   let sliderScaleId = "#slider__scale-" + idNumber;
//   let sliderParent = document.querySelector(sliderScaleId);

//   for (let i = sliderParent.children.length; i > 1; i--) {
//     deleteSliderHandle(idNumber, i, true);
//   }
// };





// function deleteSliderHandle(idNumber, postfix, isAll = false) {

//   let handleControlContainerId = "#slider__handleControlContainer-" + idNumber;
//   let sliderScaleId = "#slider__scale-" + idNumber;

//   document.querySelector(sliderScaleId).children[postfix-1].remove();
//   document.querySelector(handleControlContainerId).children[postfix-1].remove();

//   if (postfix < document.querySelector(sliderScaleId).children.length + 1 && !isAll){
//     changePostfixes( sliderScaleId, 'slider__handle', postfix);
//     changePostfixes( handleControlContainerId, 'slider__handleControl', postfix);
//   }
// };





// function changePostfixes(parentId, className, deletedPostfix) {

//   let newPostfix = deletedPostfix - 1;
//   let parent = document.querySelector(parentId);
  
//   for (let i = newPostfix; i < parent.children.length; i++) {
//     let thisChild = parent.children[i];
//     let [ , idNum, postf] = thisChild.id.split("-");
//     let newPostf = postf - 1;
//     let newId = "#" + className + '-' + idNum + '-' + newPostf;
//     thisChild.id = newId;
    
//     if (thisChild.children.length > 0) {
//       for (let j = 0; j < thisChild.children.length; j++) {
//         let [childClassName, , ] = thisChild.children[j].id.split("-");
//         newId = childClassName + '-' + idNum + '-' + newPostf;
//         thisChild.children[j].id = newId;

//         if (thisChild.children[j].tagName === "LABLE") {
//           let lableElement = thisChild.children[j];
//           let attrFor = lableElement.getAttribute('for');
//           let [forClass, ,] = attrFor.split("-");
//           attrFor = forClass + '-' + idNum + '-' + newPostf;
//           lableElement.setAttribute('for', attrFor);
//           lableElement.innerHTML = newPostf + ": ";
//         }
//       }     
//     }
//   }
//   return;
// };





// function startValueHint (sliderHandleId) {
//   let [ , handleIdNum, ] = sliderHandleId.split("-");
//   let checkboxId = "#slider__valueCheckbox-" + handleIdNum;
//   let check = document.querySelector(checkboxId);
//   if (check.checked) {
//     return;
//   } else {
//     $("#" + sliderHandleId).addClass("hidden");
//   }
//  };













// //--------------------------------------------------------------------------
// //------------- DRAG AND DROP FOR EVERY SLIDER -----------------------------
// //--------------------------------------------------------------------------

// function addHandleListener (i, slider, handle, handleLabel) {

//   handle.onmousedown = function(event) {
//     let min = 0,
//         max = sliders[i].maxScaleValue - sliders[i].minScaleValue,
//         valueMin = sliders[i].minScaleValue,
//         valueMax = sliders[i].maxScaleValue,
//         step = sliders[i].step,
//         stepSize = 1,
//         shiftX;

//     let isVertical = handle.classList.contains("vertical");

//     //---------------------------------------------------------------------------------
//     //---------------------------------------------------------------------------------
//     //---------------------------------------------------------------------------------

//     event.preventDefault(); // предотвратить запуск выделения (действие браузера)
  
//     if (isVertical) {
//       shiftX = event.clientY - handle.getBoundingClientRect().top;
//     } else {
//       shiftX = event.clientX - handle.getBoundingClientRect().left;
//     }
   
//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);


//     let stepNumber = max / step; 


//     if (isVertical && step > 1) {
//       stepSize = (slider.getBoundingClientRect().height - handle.getBoundingClientRect().height) / stepNumber;
//     } else if (step > 1) {
//       stepSize = (slider.getBoundingClientRect().width - handle.getBoundingClientRect().width) / stepNumber;
//     } 

//     function onMouseMove(event) {
//       let newCoord, finishEdge;

//       if (isVertical) {
//         finishEdge = slider.offsetHeight - handle.offsetHeight;
//         newCoord = event.clientY - shiftX - slider.getBoundingClientRect().top;
//       } else {
//         newCoord = event.clientX - shiftX - slider.getBoundingClientRect().left;
//         finishEdge = slider.offsetWidth - handle.offsetWidth / 2;
//       }

      
//       let nextSibling = handle.nextSibling;
//       let prevSibling = handle.previousElementSibling;

//       if (prevSibling && isVertical) {
//         min = prevSibling.getBoundingClientRect().bottom - slider.getBoundingClientRect().top;
//       } else if (prevSibling) {
//         min = prevSibling.getBoundingClientRect().right - slider.getBoundingClientRect().left;
//       }


//       if (nextSibling && isVertical) {
//         finishEdge = nextSibling.getBoundingClientRect().top - slider.getBoundingClientRect().top - nextSibling.getBoundingClientRect().height;
//     } else if (nextSibling) {
//         finishEdge = nextSibling.getBoundingClientRect().left - slider.getBoundingClientRect().left - nextSibling.getBoundingClientRect().width;
//     }

//       // курсор вышел из слайдера => оставить бегунок в его границах.
      

//       let finCoord = Math.round(newCoord / stepSize) * stepSize;

//       if (finCoord < min) {
//         finCoord = min;
//       }

//       if (finCoord > finishEdge) {
//         finCoord = finishEdge;
//       }

//       if (isVertical) {
//         handle.style.top = finCoord + 'px';
//       } else {
//         handle.style.left = finCoord + 'px';
//       }
  
//       //--------  расчет числа над ползунком  ---------------
//       //! шкала работает неправильно

//       let percent;

//       if (isVertical) {
//         percent = (finCoord / slider.offsetHeight) * 100;  
//       } else {
//         percent = (finCoord /(slider.offsetWidth - handle.offsetWidth/2)) * 100;
//       }
      
//       let val = Math.round((max * percent) /100 + valueMin);
//       handleLabel.innerHTML = val;

//       let [ , idNum, postfix] = handleLabel.id.split("-");
//       let handleField = document.querySelector("#slider__handleValueField-" + idNum + "-" + postfix);
//       handleField.value = val;
//     };

//     //---------------------------------------------------------------------------------
//     //---------------------------------------------------------------------------------
//     //---------------------------------------------------------------------------------
  
//     function onMouseUp() {
//       document.removeEventListener('mouseup', onMouseUp);
//       document.removeEventListener('mousemove', onMouseMove);
//     };
  
//   };
  
//   handle.ondragstart = function() {
//     return false;
//   };
// };


// addSliderWithControl(5, -10, 30, 2);
// addSliderWithControl(6, 70, 124);
// toggleValueHint(sliders, "slider__valueCheckbox", "slider__handleLabel");



