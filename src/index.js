import './index.css';


"use strict";

function createElement (tag, className, id) {
    if (!tag) {
      return;
    }
    let newElem = document.createElement(tag);
    if (className){
      newElem.className = className;
    }    
    if (id) {
      newElem.id = className + '-' + id;
    }
    return newElem;
};

let sliders = [];

function addNewSlider (id, min, max, sliderParent = document.body) {

  let mainDiv = createElement("div", "slider__container", id);
  let sliderScale = createElement("div", "slider__scale", id);

  if(min) {
    mainDiv.min = min;
  }
  if (max) {
    mainDiv.max = max;
  }
  
  sliders.push({
    id: mainDiv.id,
    minScaleValue: min,
    maxScaleValue: max, 
  });

  sliderParent.append(mainDiv);
  $('#' + mainDiv.id).append(sliderScale);
  addSliderHandle(id, max);
};


function addSliderWithControl (id, min, max) {

  let controlContainer = createElement("div", "slider__control-container", id);
  document.body.append(controlContainer);

  let controlElements = createElement("div", "slider__control-elements", id);


  let valueCheckbox = createElement("input", "slider__value-checkbox", id);
  valueCheckbox.type = "checkbox";
  let checkboxLabel = createElement("label", "slider__value-checkbox-label", id);
  checkboxLabel.for = valueCheckbox.id;
  checkboxLabel.setAttribute('for', '' + valueCheckbox.id);
  checkboxLabel.innerHTML = "Показать значение над ползунком";


  let buttonAddHandle = createElement("button", "slider__button-add-handle", id);
  buttonAddHandle.type = "button";
  buttonAddHandle.innerHTML = "+";

  $('#' + controlContainer.id).append(controlElements);
  $('#' + controlElements.id).append(valueCheckbox);
  $('#' + controlElements.id).append(checkboxLabel);
  $('#' + controlElements.id).append(buttonAddHandle);

  let buttonId = "#" + buttonAddHandle.id;
  console.log(buttonId);
  let but = document.querySelector(buttonId);
  console.log(but);

  addNewSlider(id, min, max, controlContainer);

  but.onclick = function () {
    console.log("FFFFFFFFFF");
    addSliderHandle(id, max);
  };

};

function addSliderHandle (id, max) {

  //! не меняется номер рукоятки в id (postfix)

  let sliderScaleId = "#slider__scale-" + id;
  let handleLabelNumber = $(sliderScaleId).children('.slider__handleLabel').length;
  let handleIdPostfix = id + "-" + ++handleLabelNumber;
  console.log(handleIdPostfix);
  let sliderHandle = createElement("div", "slider__handle", handleIdPostfix);
  let sliderHandleLabel = createElement("div", "slider__handleLabel", handleIdPostfix);

  $(sliderScaleId).append(sliderHandle);
  $('#' + sliderHandle.id).append(sliderHandleLabel);
  $('#' + sliderHandleLabel.id).addClass("hidden");

  document.querySelector("#" + sliderHandleLabel.id).innerHTML = max/2;
  letHandleRun();

};

function letHandleRun () {

  for (let i = 0; i < sliders.length; i++) {

    let [ , id] = sliders[i].id.split('-');
    let sliderId = '#slider__scale-' + id;

    let slider = document.querySelector(sliderId);

    let allHandles = $(sliderId).children('.slider__handle');

    for (let elem of allHandles) {
      let [ , handleIdNum, idPostfix] = elem.id.split('-');

      let handleId = '#slider__handle-' + handleIdNum + '-' + idPostfix;
      let handleLabelId = '#slider__handleLabel-' + id + '-' + idPostfix;
      let handleLabel = document.querySelector(handleLabelId);

      addHandleListener(i, slider, elem, handleLabel);
    }
  };
};


addSliderWithControl(5, 0, 100);
addSliderWithControl(6, 0, 124);

function toggleValueHint(idArr, classCheckbox, classHint) {

  idArr.forEach((item) => {
    let [ , id] = item.id.split('-');
    let check = document.querySelector("#" + classCheckbox + "-" + id);

    check.onchange = function () {
      let sliderId = "#slider__scale-" + id;
      let allHandles = $(sliderId).children('.slider__handle');

      for (let handle of allHandles) {
        let [ , handleIdNum, idPostfix] = handle.id.split('-');
        let handleLabelId = '#slider__handleLabel-' + handleIdNum + '-' + idPostfix;
        $(handleLabelId).toggleClass("hidden"); 
      }

    };

  });

};

toggleValueHint(sliders, "slider__value-checkbox", "slider__handleLabel");


//--------------------------------------------------------------------------
//------------- DRAG AND DROP FOR EVERY SLIDER -----------------------------
//--------------------------------------------------------------------------

function addHandleListener (i, slider, handle, handleLabel) {

  handle.onmousedown = function(event) {
    let min = sliders[i].minScaleValue,
        max = sliders[i].maxScaleValue;
  
    event.preventDefault(); // предотвратить запуск выделения (действие браузера)
  
    let shiftX = event.clientX - handle.getBoundingClientRect().left;
    // shiftY здесь не нужен, слайдер двигается только по горизонтали
   
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  
    function onMouseMove(event) {
      let newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;
  
      // курсор вышел из слайдера => оставить бегунок в его границах.
      if (newLeft < 0) {
        newLeft = -2;
      }
      let rightEdge = slider.offsetWidth - handle.offsetWidth;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }
  
      handle.style.left = newLeft + 'px';
  
      //--------  расчет числа над ползунком  ---------------
      //! избавиться от ширины ползунка
      let percent = (((handle.getBoundingClientRect().left - slider.getBoundingClientRect().left)/slider.getBoundingClientRect().width) * 100).toFixed(0);
      if (percent > 50) {
          percent = (((handle.getBoundingClientRect().right - slider.getBoundingClientRect().left)/slider.getBoundingClientRect().width) * 100).toFixed(0);
      }
      let temp = parseFloat(handle.getBoundingClientRect().width);

      console.log('temp: ' + temp);
      handleLabel.innerHTML = Math.round((max * percent) /100) + ', ' + percent;
     
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






