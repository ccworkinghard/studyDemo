const allUnitsArr = [...document.querySelectorAll(".one-unit")];
// 单元拖拽时 阻止 非添加单元样式切换的事件处理
let clickable = true;
let clickTimeId = 0;

function handleClick(e) {
  if (!clickable) {
    clickable = true;
    return;
  }
  const target = e.currentTarget;
  //两部分功能：添加单元的事件处理 和 非添加单元样式切换的事件处理
  if (!target.classList.contains("add-unit")) {
    //这里 单元节点 必须重新获取
    const allUnitsArr = [...document.querySelectorAll(".one-unit")];
    allUnitsArr.forEach((item) => {
      item.classList.remove("selected-unit");
    });
    target.classList.add("selected-unit");
  } else {
    const rootDiv = document.createElement("div");
    rootDiv.classList.add("one-unit");

    const span = document.createElement("span");
    span.classList.add("currency");
    span.innerHTML = "CNY";

    const div = document.createElement("div");
    const spanInner1 = document.createElement("span");
    spanInner1.classList.add("num");
    spanInner1.innerHTML = "75";
    const spanInner2 = document.createElement("span");
    spanInner2.classList.add("symbol");
    spanInner2.innerHTML = "%";
    const text = document.createTextNode("\n");

    div.appendChild(spanInner1);
    div.appendChild(text);
    div.appendChild(spanInner2);

    rootDiv.appendChild(span);
    rootDiv.appendChild(div);

    e.currentTarget.parentNode.insertBefore(
      rootDiv,
      e.currentTarget.parentNode.lastElementChild
    );

    //为新单元绑定事件
    rootDiv.addEventListener("mousedown", handleMouseDown);
    rootDiv.addEventListener("mouseup", handleMouseUp);
    // rootDiv.addEventListener('transitionend', handleTransitionEnd)
    rootDiv.addEventListener("click", handleClick);
  }
}

allUnitsArr.forEach((item) => {
  item.addEventListener("click", handleClick);
});
/****************************************************
 * 容器移动
 *
 * **************************************************
 */
const wallet = document.querySelector(".container");
const moveBar = document.querySelector(".moveBar");
//拖拽判断：mousedown -> true ; mouseup -> false
let isStarted = false;
//下面4个变量：startedPos, disX, disY 用于拖拽位移，baseDis 保存容器位置坐标
const startedPos = {
  x: 0,
  y: 0
};
const baseDis = {
  x: 0,
  y: 0
};
let disX = 0;
let disY = 0;
moveBar.addEventListener("mousedown", (e) => {
  isStarted = true;
  startedPos.x = e.clientX;
  startedPos.y = e.clientY;
});
moveBar.addEventListener("mouseup", (e) => {
  isStarted = false;
  baseDis.x = disX;
  baseDis.y = disY;
});
document.body.addEventListener("mousemove", (e) => {
  if (isStarted) {
    disX = baseDis.x + e.clientX - startedPos.x;
    disY = baseDis.y + e.clientY - startedPos.y;

    wallet.style.transform = `translate(${disX}px,${disY}px)`;
  }
});

/****************************************************
 * 单元移动
 *
 * **************************************************
 */
//拖拽判断：mousedown -> true ; mouseup -> false
let blockMoving = false;
//startedBlockPos, blockDisX, blockDisY 用于拖拽位移
const startedBlockPos = {
  x: 0,
  y: 0
};
let blockDisX = 0;
let blockDisY = 0;
//目标单元的信息保存（节点、索引、宽度、单元之间的间隙）
let target = null;
let targetIndex = 0;
let blockWidth = 0;
//默认 1rem = 16px
const gapWidth = 16;
//位移时，当前索引 和 移动步数( 目标位移/(单位宽度+间隙) 取整)
let currentPosIndex = 0;
let moveStep = 0;
//判断单元处于拖拽状态
let isDrag = false;

function handleMouseDown(e) {
  if (e.currentTarget.classList.contains("add-unit")) {
    return;
  }

  clickTimeId = setTimeout(() => {
    clickable = false;
  }, 200);

  const allUnits = [...document.querySelectorAll(".one-unit")];
  allUnits.forEach((item, index) => {
    if (item === e.currentTarget) {
      targetIndex = index;
      currentTarget = index;
    }
  });

  blockMoving = true;

  startedBlockPos.x = e.clientX;
  startedBlockPos.y = e.clientY;

  target = e.currentTarget;
  target.style.transition = "none";
  target.style.zIndex = 10;

  blockWidth = target.getBoundingClientRect().width;
}

function handleMouseUp(e) {
  if (e.currentTarget.classList.contains("add-unit")) {
    return;
  }

  clearTimeout(clickTimeId);

  blockMoving = false;

  const allUnits = [...document.querySelectorAll(".one-unit")];

  if (moveStep < 0 - targetIndex) {
    moveStep = -targetIndex;
  } else if (moveStep > allUnits.length - targetIndex - 2) {
    moveStep = allUnits.length - targetIndex - 2;
  }

  target.style.transition = "all 0.2s ease-in-out";
  target.style.zIndex = 0;
  target.style.transform = `translateX(${
    moveStep * (blockWidth + gapWidth)
  }px)`;
  isDrag ? (handleTransitionEnd(e), (clickable = true), (isDrag = false)) : "";
  moveStep = 0;
}

function handleTransitionEnd(e) {
  if (currentPosIndex !== targetIndex) {
    const all = document.querySelectorAll(".one-unit");
    if (currentPosIndex < 0) {
      currentPosIndex = 0;
    } else if (currentPosIndex > all.length - 2) {
      currentPosIndex = all.length - 2;
    }

    if (currentPosIndex < targetIndex) {
      target.parentNode.insertBefore(target, all[currentPosIndex]);
    } else {
      target.parentNode.insertBefore(target, all[currentPosIndex + 1]);
    }

    const allArr = [...all];
    allArr.forEach((item) => {
      item.style.transition = "none";
      item.style.transform = "translateX(0px)";
    });

    setTimeout(() => {
      allArr.forEach((item) => {
        item.style.transition = "all 0.2s ease-in-out";
      });
    }, 200);
  }
}

/**
 * 目标单元移动
 * @param {HTMLElement[]} allUnits 所有单元节点
 * @param {number} targetIndex 目标索引
 * @param {number} disX 目标x轴位移
 * @param {number} moveWidth 目标单元宽度（自身宽度 + 间隙）
 */
function changPos(allUnits, targetIndex, disX, moveWidth) {
  moveStep = parseInt(disX / moveWidth);
  currentPosIndex = moveStep + targetIndex;

  for (let i = 0; i < allUnits.length; i++) {
    if (i !== targetIndex) {
      allUnits[i].style.transform = "translateX(0px)";
    }
  }
  // 这里无法知晓原先单元的位移，清除位移信息，用到 handleTransitionEnd
  if (currentPosIndex > targetIndex) {
    const needMoveCount = currentPosIndex - targetIndex;
    for (let i = 1; i <= needMoveCount; i++) {
      if (targetIndex + i !== allUnits.length - 1) {
        allUnits[targetIndex + i]
          ? (allUnits[
              targetIndex + i
            ].style.transform = `translateX(-${moveWidth}px)`)
          : "";
      }
    }
  } else if (currentPosIndex < targetIndex) {
    const needMoveCount = targetIndex - currentPosIndex;
    for (let i = 1; i <= needMoveCount; i++) {
      allUnits[targetIndex - i]
        ? (allUnits[
            targetIndex - i
          ].style.transform = `translateX(${moveWidth}px)`)
        : "";
    }
  }
}

allUnitsArr.forEach((item) => {
  item.addEventListener("mousedown", handleMouseDown);
  item.addEventListener("mouseup", handleMouseUp);
});

document.body.addEventListener("mousemove", (e) => {
  if (blockMoving) {
    blockDisX = e.clientX - startedBlockPos.x;
    blockDisY = e.clientY - startedBlockPos.y;

    isDrag = true;

    target.style.transform = `translate(${blockDisX}px,${blockDisY}px)`;

    changPos(
      document.querySelectorAll(".one-unit"),
      targetIndex,
      blockDisX,
      blockWidth + gapWidth
    );
  }
});
