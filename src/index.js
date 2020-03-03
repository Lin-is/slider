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
  checkboxLabel.setAttribute('for', '' + valueCheckbox.id);
  checkboxLabel.innerHTML = "Показать значение над ползунком";

  //-----------------------  view radiobuttons  -------------------------------
  
  let viewRadioContainer = createElement("div", "slider__viewRadioContainer", id);
  let viewRadioCommonLabel = createElement("label", "slider__viewRadioCommonLabel", id);
  viewRadioCommonLabel.innerHTML = "Вид слайдера:";

  let viewRadioHorizontal = createElement("input", "slider__viewRadio", "horizontal-" + id);
  viewRadioHorizontal.type = "radio";
  viewRadioHorizontal.name = "slider__viewRadio" + id;
  viewRadioHorizontal.value = "horizontal";
  viewRadioHorizontal.checked = true;

  let viewRadioHorizontalLabel = createElement("label", "slider__viewRadioLabel", id);
  viewRadioHorizontalLabel.setAttribute("for", "" + viewRadioHorizontal.id);
  viewRadioHorizontalLabel.innerHTML = "Горизонтальный";

  let viewRadioVertical = createElement("input", "slider__viewRadio", "vertical-" + id);
  viewRadioVertical.type = "radio";
  viewRadioVertical.name = "slider__viewRadio" + id;
  viewRadioHorizontal.value = "vertical";

  let viewRadioVerticalLabel = createElement("label", "slider__viewRadioLabel", id);
  viewRadioVerticalLabel.setAttribute("for", "" + viewRadioVertical.id);
  viewRadioVerticalLabel.innerHTML = "Вертикальный";

//-----------------------------------------------------------------------------

  let addHandleButton = createElement("button", "slider__addHandleButton", id);
  addHandleButton.type = "button";
  addHandleButton.innerHTML = "+";

  let deleteAllHandlesButton = createElement("button", "slider__deleteAllHandlesButton", id);
  deleteAllHandlesButton.type = "button";
  deleteAllHandlesButton.innerHTML = "- all";
  deleteAllHandlesButton.classList.add('hidden');

  let handleControlContainer = createElement("div", "slider__handleControlContainer", id);


  $('#' + controlContainer.id).append(controlElements);
  $('#' + controlElements.id).append(valueCheckbox);
  $('#' + controlElements.id).append(checkboxLabel);

  $('#' + controlElements.id).append(viewRadioContainer);
  $('#' + viewRadioContainer.id).append(viewRadioCommonLabel);
  $('#' + viewRadioContainer.id).append(viewRadioHorizontal);
  $('#' + viewRadioContainer.id).append(viewRadioHorizontalLabel);
  $('#' + viewRadioContainer.id).append(viewRadioVertical);
  $('#' + viewRadioContainer.id).append(viewRadioVerticalLabel);

  $('#' + controlElements.id).append(addHandleButton);
  $('#' + controlElements.id).append(deleteAllHandlesButton);
  $('#' + controlElements.id).append(handleControlContainer);


  let buttonId = "#" + addHandleButton.id;
  let but = document.querySelector(buttonId);

  addNewSlider(id, min, max, controlContainer);

  but.onclick = function () {
    addSliderHandle(id, max);
    $('#' + deleteAllHandlesButton.id).removeClass('hidden');
  };

  let removeButtonId = "#" + deleteAllHandlesButton.id;
  let removeBut = document.querySelector(removeButtonId);

  removeBut.onclick = function () {
    removeAllHandles(id);
    $('#' + deleteAllHandlesButton.id).addClass('hidden');
  }

  let radioIdHorizontal = "#" + viewRadioHorizontal.id;
  let radioHorizontal = document.querySelector(radioIdHorizontal);

  let radioIdVertical = "#" + viewRadioVertical.id;
  let radioVertical = document.querySelector(radioIdVertical);

  let sliderId = "slider__container-" + id;

  radioHorizontal.onchange = function () {
    if (radioHorizontal.checked) {
      rotateSliderHorisontal(sliderId);
    }
  }
  radioVertical.onchange = function () {
    if (radioVertical.checked) {
      rotateSliderVertical(sliderId);
    }
  }

};



function rotateSliderVertical (containerId) {

  let searchContainerId;

  if (containerId.includes("#")) {
    searchContainerId = containerId;
    console.log('has #', searchContainerId);
  } else {
    searchContainerId = '#' + containerId;
    console.log('doesn`t have #', searchContainerId)
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
      let handleId = handle.id;
      if (handleId.includes('#') == false) {
        handleId = "#" + handle.id;
      }
      $(handleId).children(".slider__handleLabel").addClass("vertical");
    }
  }

};


function rotateSliderHorisontal (containerId) {

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
      let handleId = handle.id;
      if (handleId.includes('#') == false) {
        handleId = "#" + handle.id;
      }
      console.log("BBBB handleId", handleId);
      $(handleId).children(".slider__handleLabel").removeClass("vertical");
    }
  }

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

  if (document.querySelector(sliderScaleId).classList.contains("vertical")){
    sliderHandle.classList.add("vertical");
    sliderHandleLabel.classList.add("vertical");
  }

  document.querySelector("#" + sliderHandleLabel.id).innerHTML = max/2;
  letHandleRun();
  addHandleControl(sliderHandleLabel.id);
};




function addHandleControl (handleId) {

  let [ , idNumber, postfix] = handleId.split("-");
  let idPostfix = idNumber + '-' + postfix;

  let containerId = "#slider__handleControlContainer-" + idNumber;
  let container = document.querySelector(containerId);

  let handleControl = createElement("div", "slider__handleControl", idPostfix);

  $("#" + container.id).append(handleControl);

  let handleValueFieldLabel = createElement("lable", "slider__handleValueFieldLabel", idPostfix);
  handleValueFieldLabel.innerHTML = postfix + ": ";

  let handleValueField = createElement("input", "slider__handleValueField", idPostfix);
  handleValueField.type = "text";
  
  handleValueFieldLabel.setAttribute('for', '' + handleValueField.id);

  $("#" + handleControl.id).append(handleValueFieldLabel);
  $("#" + handleControl.id).append(handleValueField);

  let max, min;

  for (let j = 0; j < sliders.length; j++) {
    if (sliders[j].id == "slider__container-" + idNumber ) {
      max = sliders[j].maxScaleValue;
      min = sliders[j].minScaleValue;
    }
  }

  handleValueField.onchange = function() {
    let newValue;
    let inputValue = +handleValueField.value;

    if (!isNaN(inputValue)) {

      if (inputValue < min) {
        inputValue = min;
      }

      if (inputValue > max) {
        inputValue = max;
      }


      let handleId = "#slider__handle-" + idPostfix;
      let sliderScaleId = "#slider__scale-" + idNumber;
      let handleLabelId = "#slider__handleLabel-" + idPostfix;

      let handle = document.querySelector(handleId);
      let sliderScale = document.querySelector(sliderScaleId); 
      let handleLabel = document.querySelector(handleLabelId);

      if (handle.classList.contains("vertical")) {
        newValue = ((sliderScale.getBoundingClientRect().height * (inputValue))/max).toFixed(0);
        handle.style.top = newValue + "px";
      } else {
        newValue = ((sliderScale.getBoundingClientRect().width * inputValue)/max).toFixed(0);
        handle.style.left = newValue + "px";
      }

      handleLabel.innerHTML = inputValue;
    }
  }

  if (postfix > 1)  {

    let deleteHandleButton = createElement("button", "slider__deleteHandleButton", idPostfix);
    deleteHandleButton.type = "button";
    deleteHandleButton.innerHTML = "-";

    $("#" + handleControl.id).append(deleteHandleButton);

    let buttonId = "#" + deleteHandleButton.id;
    let but = document.querySelector(buttonId);
  
    but.onclick = function () {
      let butId = $(this).attr("id");
      let [ , idNumberBut, postfixBut] = butId.split("-");
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
      let [ ,  , idPostfix] = elem.id.split('-');

      let handleLabelId = '#slider__handleLabel-' + id + '-' + idPostfix;
      let handleLabel = document.querySelector(handleLabelId);

      addHandleListener(i, slider, elem, handleLabel);
    }
  };
};










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





function removeAllHandles (idNumber) {
  let sliderScaleId = "#slider__scale-" + idNumber;
  let sliderParent = document.querySelector(sliderScaleId);

  for (let i = sliderParent.children.length; i > 1; i--) {
    deleteSliderHandle(idNumber, i, true);
  }
};





function deleteSliderHandle(idNumber, postfix, isAll = false) {

  let handleControlContainerId = "#slider__handleControlContainer-" + idNumber;
  let sliderScaleId = "#slider__scale-" + idNumber;

  document.querySelector(sliderScaleId).children[postfix-1].remove();
  document.querySelector(handleControlContainerId).children[postfix-1].remove();

  if (postfix < document.querySelector(sliderScaleId).children.length + 1 && !isAll){
    changePostfixes( sliderScaleId, 'slider__handle', postfix);
    changePostfixes( handleControlContainerId, 'slider__handleControl', postfix);
  }
};





function changePostfixes(parentId, className, deletedPostfix) {

  let newPostfix = deletedPostfix - 1;
  let parent = document.querySelector(parentId);
  
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













//--------------------------------------------------------------------------
//------------- DRAG AND DROP FOR EVERY SLIDER -----------------------------
//--------------------------------------------------------------------------

function addHandleListener (i, slider, handle, handleLabel) {

  handle.onmousedown = function(event) {
    let min = sliders[i].minScaleValue,
        max = sliders[i].maxScaleValue,
        shiftX,
        prevHandle,
        nextHandle;

    let isVertical = handle.classList.contains("vertical");

    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------


  

    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------

    event.preventDefault(); // предотвратить запуск выделения (действие браузера)
  
    if (isVertical) {
      shiftX = event.clientY - handle.getBoundingClientRect().top;
    } else {
      shiftX = event.clientX - handle.getBoundingClientRect().left;
    }
   
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  
    function onMouseMove(event) {
      let newCoord, finishEdge;

      if (isVertical) {
        finishEdge = slider.offsetHeight - handle.offsetHeight;
        newCoord = event.clientY - shiftX - slider.getBoundingClientRect().top;
      } else {
        newCoord = event.clientX - shiftX - slider.getBoundingClientRect().left;
        finishEdge = slider.offsetWidth - handle.offsetWidth;
      }

      
      let [ handleClass, handleIdNum, handleNumPostfix] = handle.id.split("-");
      console.log('handleIdNum', handleIdNum, 'handleNumPostfix', handleNumPostfix);
      let nextSibling = handle.nextSibling;


      if (handleNumPostfix > 1) {

      }

      if (nextSibling && isVertical) {
          finishEdge = nextSibling.getBoundingClientRect().top - slider.getBoundingClientRect().top - nextSibling.getBoundingClientRect().height;
      } else if (nextSibling) {
          finishEdge = nextSibling.getBoundingClientRect().left - slider.getBoundingClientRect().left - nextSibling.getBoundingClientRect().width;
      }
      


      // курсор вышел из слайдера => оставить бегунок в его границах.
      if (newCoord < min) {
        newCoord = -2;
      }

      if (newCoord > finishEdge) {
        newCoord = finishEdge;
      }

      if (isVertical) {
        handle.style.top = newCoord + 'px';
      } else {
        handle.style.left = newCoord + 'px';
      }
  
      //--------  расчет числа над ползунком  ---------------
      //! избавиться от ширины ползунка

      let handleCoordFirst, handleCoordSec, sliderCoord, sliderParam;

      if (isVertical) {
        handleCoordFirst = handle.getBoundingClientRect().top;
        handleCoordSec = handle.getBoundingClientRect().bottom;
        sliderCoord = slider.getBoundingClientRect().top;
        sliderParam = slider.getBoundingClientRect().height;
      } else {
        handleCoordFirst = handle.getBoundingClientRect().left;
        handleCoordSec = handle.getBoundingClientRect().right;
        sliderCoord = slider.getBoundingClientRect().left;
        sliderParam = slider.getBoundingClientRect().width;
      }
 
      let percent = (((handleCoordFirst - sliderCoord)/sliderParam) * 100).toFixed(0);
      if (percent > 50) {
          percent = (((handleCoordSec - sliderCoord)/sliderParam) * 100).toFixed(0);
      }
      
      let val = Math.round((max * percent) /100);
      handleLabel.innerHTML = val;

      let [ , idNum, postfix] = handleLabel.id.split("-");
      let handleField = document.querySelector("#slider__handleValueField-" + idNum + "-" + postfix);
      handleField.value = val;
    };

//not vertical = 

    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
  
    function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  
  };
  
  handle.ondragstart = function() {
    return false;
  };
};


addSliderWithControl(5, 0, 100);
addSliderWithControl(6, 0, 124);
toggleValueHint(sliders, "slider__valueCheckbox", "slider__handleLabel");



