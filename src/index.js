import './index.css';
"use strict";

function createElement (tag, className, id) {
    if (!tag || !className) {
      return;
    }

    let newElem = document.createElement(tag);
    newElem.className = className; 

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

  let controlContainer = createElement("div", "slider__controlContainer", id);
  document.body.append(controlContainer);

  let controlElements = createElement("div", "slider__controlElements", id);

  let valueCheckbox = createElement("input", "slider__valueCheckbox", id);
  valueCheckbox.type = "checkbox";
  let checkboxLabel = createElement("label", "slider__valueCheckboxLabel", id);
  checkboxLabel.for = valueCheckbox.id;
  checkboxLabel.setAttribute('for', '' + valueCheckbox.id);
  checkboxLabel.innerHTML = "Показать значение над ползунком";

  let addHandleButton = createElement("button", "slider__addHandleButton", id);
  addHandleButton.type = "button";
  addHandleButton.innerHTML = "+";

  let handleControlContainer = createElement("div", "slider__handleCotrolContainer", id);


  $('#' + controlContainer.id).append(controlElements);
  $('#' + controlElements.id).append(valueCheckbox);
  $('#' + controlElements.id).append(checkboxLabel);
  $('#' + controlElements.id).append(addHandleButton);
  $('#' + controlElements.id).append(handleControlContainer);


  let buttonId = "#" + addHandleButton.id;
  let but = document.querySelector(buttonId);

  addNewSlider(id, min, max, controlContainer);

  but.onclick = function () {
    addSliderHandle(id, max);
  };

};

function addSliderHandle (id, max) {

  let sliderScaleId = "#slider__scale-" + id;
  let handleLabelNumber = document.querySelector(sliderScaleId).children.length;
  let handleIdPostfix = id + "-" + ++handleLabelNumber;
  let sliderHandle = createElement("div", "slider__handle", handleIdPostfix);
  let sliderHandleLabel = createElement("div", "slider__handleLabel", handleIdPostfix);

  $(sliderScaleId).append(sliderHandle);
  $('#' + sliderHandle.id).append(sliderHandleLabel);
  startValueHint(sliderHandleLabel.id);

  document.querySelector("#" + sliderHandleLabel.id).innerHTML = max/2;
  letHandleRun();
  addHandleControl(sliderHandleLabel.id);
};

function addHandleControl (handleId) {
  let [ , idNumber, postfix] = handleId.split("-");
  let idPostfix = idNumber + '-' + postfix;

  let containerId = "#slider__handleCotrolContainer-" + idNumber;
  let container = document.querySelector(containerId);

  let handleControl = createElement("div", "slider__handleControl", idPostfix);
  let handleControlId = "#" + handleControl.id;

  $("#" + container.id).append(handleControl);

  let handleValueFieldLabel = createElement("lable", "slider__handleValueFieldLabel", idPostfix);
  handleValueFieldLabel.innerHTML = postfix + ": ";

  let handleValueField = createElement("input", "slider__handleValueField", idPostfix);
  handleValueField.type = "text";
  
  handleValueFieldLabel.setAttribute('for', '' + handleValueField.id);

  $("#" + handleControl.id).append(handleValueFieldLabel);
  $("#" + handleControl.id).append(handleValueField);

  if (postfix > 1)  {

    let deleteHandleButton = createElement("button", "slider__deleteHandleButton", idPostfix);
    deleteHandleButton.type = "button";
    deleteHandleButton.innerHTML = "-";

    $("#" + handleControl.id).append(deleteHandleButton);

    let buttonId = "#" + deleteHandleButton.id;
    let but = document.querySelector(buttonId);
  
    but.onclick = function () {
      let [ , idNumberBut, postfixBut] = but.id.split("-");
      deleteSliderHandle(idNumberBut, postfixBut);
    };
  }
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
        if (check.checked) {
          $(handleLabelId).removeClass("hidden"); 
        } else {
          $(handleLabelId).addClass("hidden"); 
        }
      }
    };

  });
};

function deleteSliderHandle(idNumber, postfix) {
  let idPostfix = idNumber + "-" + postfix;
  let sliderControlId = "#slider__handleControl-" + idPostfix;
  let handleId = "#slider__handle-" + idPostfix;

  let sliderScaleId = "#slider__scale-" + idNumber;

  document.querySelector(sliderControlId).remove();
  document.querySelector(handleId).remove();

  if (postfix < document.querySelector(sliderScaleId).children.length + 1){
    changePostfixes( 'slider__handle', postfix);
    changePostfixes( 'slider__handleControl', postfix);
  }
};

function changePostfixes(className, deletedPostfix) {

  //! не удаляются бегунки, у которых были изменены постфиксы. Возможно, браузер не может их найти из-за
  //! того, что ищет по старым ид и постфиксам

  let newPostfix = deletedPostfix - 1;
  let parent = document.querySelector("." + className).parentNode;
 
  for (let i = newPostfix; i < parent.children.length; i++) {
    let thisChild = parent.children[i];
    let [ , idNum, postf] = thisChild.id.split("-");
    let newPostf = postf - 1;
    let newId = "#" + className + '-' + idNum + '-' + newPostf;
    thisChild.id = newId;
    
    if (thisChild.children.length > 0) {
      for (let j = 0; j < thisChild.children.length; j++) {
        let [childClassName, , ] = thisChild.children[j].id.split("-");
        newId = childClassName + '-' + idNum + '-' + newPostf;
        thisChild.children[j].id = newId;
        console.log(thisChild.children[j].tagName);

        if (thisChild.children[j].tagName === "LABLE") {
          let lableElement = thisChild.children[j];
          console.log(lableElement);

          let attrFor = lableElement.getAttribute('for');

          console.log("AAAAAAAAAAAAA");
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

function startValueHint (sliderHandleId) {
  let [ , handleIdNum, ] = sliderHandleId.split("-");
  let checkboxId = "#slider__valueCheckbox-" + handleIdNum;
  let check = document.querySelector(checkboxId);
  if (check.checked) {
    return;
  } else {
    $("#" + sliderHandleId).addClass("hidden");
  }
 };


toggleValueHint(sliders, "slider__valueCheckbox", "slider__handleLabel");


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
      let val = Math.round((max * percent) /100);
      handleLabel.innerHTML = val;

      let [ , idNum, postfix] = handleLabel.id.split("-");
      let handleField = document.querySelector("#slider__handleValueField-" + idNum + "-" + postfix);
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






