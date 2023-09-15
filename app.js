/* =========== CONSTANTS =========== */
const CALENDAR_EVENT_SELECTOR = '.NlL62b[data-eventid]' // css選擇器
const INTERVAL_DELAY = 50
const EVENT_PANEL_SELECTOR = '.pPTZAe'
/* ================================= */

function getHelloWorldButton (eventId) {
  return `
  <button class="open-hello-world" data-id="${eventId}" 
    style="background: none;
      border: none;cursor: pointer">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" viewBox="0 0 512 512">
          <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
        </svg>
  </button>
  `
}

/* =========== VARIABLES  ============ */
let intervalInjectIcon
/* ================================= */
function app () {
  addEvent(document, 'click', CALENDAR_EVENT_SELECTOR, (e) => {
    injectHelloWorldButton(e)
  })
  addEvent(document, 'click', '.open-hello-world', () => {
    alert('Hello World')
  })
}
function injectHelloWorldButton (event) {
  const eventId = event.target.getAttribute('data-eventid')
  // 清除現有的間隔，避免setInterval重複添加
  clearInterval(intervalInjectIcon)
  // setInterval設定間隔執行器，每50單位檢測按鈕是否被添加
  intervalInjectIcon = setInterval(function () {
    // 如果沒找到事件面板工具列選擇器則直接return
    const eventPanelNode = document.querySelector(EVENT_PANEL_SELECTOR)

    if (eventPanelNode == null) return
    // 清除間隔執行器
    clearInterval(intervalInjectIcon)
    console.log('aaa')
    // 確認有沒有按鈕的CSS選擇器
    const helloWorldButton = eventPanelNode.querySelector('.open-hello-world')
    // 如果沒有按鈕
    if (helloWorldButton == null) {
      // 傳入事件面板與日曆事件的id作為參數呼叫prependHelloWorldButton函式添加按鈕
      prependHelloWorldButton(eventPanelNode, eventId)
    }
  }, INTERVAL_DELAY)
}

function prependHelloWorldButton (eventPanelNode, eventId) {
  const helloWorldButton = getHelloWorldButton(eventId)
  eventPanelNode.prepend(htmlToElement(helloWorldButton))
}

function addEvent (parent, evt, selector, handler) {
  parent.addEventListener(
    evt,
    function (event) {
      if (event.target.matches(selector + ', ' + selector + ' *')) {
        handler.apply(event.target.closest(selector), arguments)
      }
    },
    false
  )
}
function htmlToElement (html) {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node with whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

/** ========== READY EVENT ========== */
if (
  document.readyState === 'complete' ||
  (document.readyState !== 'loading' && !document.documentElement.doScroll)
) {
  app()
} else {
  document.addEventListener('DOMContentLoaded', app)
}
/** ======================================== */
