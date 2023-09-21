console.log('app.js')
/* =========== CONSTANTS =========== */
const CALENDAR_EVENT_SELECTOR = '.NlL62b[data-eventid]' // css選擇器
const INTERVAL_DELAY = 50
const EVENT_PANEL_SELECTOR = '.pPTZAe'

/* ================================= */

const head = document.querySelector('head')
const calendarHTML = document.querySelector('.tEhMVd')

console.log(calendarHTML)
console.log(head)
head.appendChild(htmlToElement(`
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
  integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
`))
// head.appendChild(htmlToElement(`
// <link rel="stylesheet" href="./stylesheet/form.css">
// `))
head.appendChild(htmlToElement(`
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
  integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>

`))
head.appendChild(htmlToElement(`

<script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script> 

`))
head.appendChild(htmlToElement(`

<script src="https://cdn.jsdelivr.net/npm/dayjs@1/plugin/utc.js"></script>

`))
head.appendChild(htmlToElement(`

<script src="https://cdn.jsdelivr.net/npm/dayjs@1/plugin/timezone.js"></script>

`))
head.appendChild(htmlToElement(`

<script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"></script>

`))
// head.appendChild(htmlToElement(`

// <script src="./JavaScript/form.js"></script>
// `))
console.log(head)
calendarHTML.appendChild(htmlToElement(`

<div class="container card bg-body-secondary mt-3">


  <div class="row">
    <!-- 左側內容：表單 -->
    <div class="col-md-5">
      <div class=" bg-body-secondary mt-3">
        <!-- 表單內容 -->
        <!-- 啟用工時計算 -->
        <div class="enable_work_times">
          <input type="checkbox" id="check_work_times">
          <label for="check_work_times">啟用工時計算</label>
        </div>
        <!-- 表單 -->
        <form action="#">
          <div class="date_block ">
            <label for="date_input" class="form-label">日期</label>
            <input type="date" class="form-control " id="date_input" disabled value="2023-09-27" name="date">
          </div>
          <!-- 生產線輸入欄位 -->
          <div class="production_line_block ">
            <label for="production_line" class="form-label">生產線</label>
        
            <select name="production_line" id="production_line" class="form-select  border-black mb-3">
              <option value="first_line">一線</option>
              <option value="second_line">二線</option>
              <option value="third_line">三線</option>
            </select>
          </div>
          <!-- 名稱輸入欄位 -->
          <div class="product_number_block">
            <label for="product_number_input" class="form-label">品號</label>
            <input type="text" class="form-control  border-black" id="product_number_input" name="product_number">
          </div>
          <!-- 顏色輸入欄位 -->
          <div class="product_color_block">
            <label for="product_color_input" class="form-label">顏色</label>
            <select name="product_color_input" id="product_color_input" class="form-select border-black mb-3">
              <option value="none_color">無</option>
              <option value="五彩">五彩</option>
              <option value="鋅">鍍鋅</option>
              <option value="鉻">鍍鉻</option>
              <option value="電著">電著</option>
            </select>
          </div>
          <!-- 作業人數輸入欄位 -->
          <div class="people_counts_block">
            <label for="people_counts_input" class="form-label">作業人數</label>
            <input type="range" class="input_range " id="people_counts_input" min="1" max="10" value="4" name="people_counts">
            <span class="people_counts_input" id="rangeValue1">4 人</span>
          </div>
          <!-- 當日工時輸入欄位 -->
          <div class="working_hours_block">
            <label for="working_hours_input" class="form-label">本日工作時數</label>
            <input type="range" class="input_range " id="working_hours_input" min="1" max="12" value="8" name="working_hours">
            <span class="people_counts_input" id="rangeValue2">8 小時</span>
          </div>
          <!-- 訂單數量輸入欄位 -->
          <div class="product_counts_block">
            <label for="product_counts_input" class="form-label">生產數量</label>
            <input type="number" class="form-control border-black" id="product_counts_input" min="1" max="999999" step="100"
              name="product_counts">
          </div>
          <!-- 品名顯示欄位(可選) -->
          <!-- 載入資料按紐 -->
          <button type="button" class="btn btn-primary mt-2" id="data_submit_button">
            載入製程資料
          </button>
        </form>

      </div>
    </div>
    <!-- 右側內容 -->
    <div class="col-md-7 ">
      <div class="process_list mt-5">
      
        <table class="custom-table">
          <tr class="table-title">
            <td><span>新增</span></td>
            <td><span>刪除</span></td>
            <td><span>製程名稱</span></td>
            <td><span>平均工時</span></td>
            <td><span>耗時</span></td>
          </tr>
          <!-- JS自動產生 -->
          <!-- <tr>
              <td><button class="add_process">十</button></td>
              <td><button class="delete_process">一</button></td>
              <td><span class="process_name">成品</span></td>
              <td><input type="number" class="process_times_input" value="130"></td>
              <td><span class="cost_times">2天15分鐘</span></td>
            </tr> -->
          <!-- JS自動產生 -->
          <!-- JS自動產生 -->
          <!-- <tr>
              <td><button class="add_process">十</button></td>
              <td><button class="delete_process">一</button></td>
              <td><span class="process_name">成品</span></td>
              <td><input type="number" class="process_times_input" value="130"></td>
              <td><span class="cost_times">2天15分鐘</span></td>
            </tr> -->
          <!-- JS自動產生 -->
        </table>
        <h3 class="total_cost_times" id="total_cost_times">總共花費: --天--分鐘</h3>
        <button class="save_button btn btn-primary" disabled>
          保存
        </button>
        <button class="update_button btn btn-primary" disabled style="display: none;">
          修改
        </button>
      </div>
      <div class="progress_block">
        <h4 for="bar">工時使用量 :</h4>
        <div class="progress_bar">
          <div class="current_working_times bar" id="bar"></div>
        </div>
      </div>
      
    </div>
  </div>

  

  
</div>



`))

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
