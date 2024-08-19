/* global GAS_DATE_PUT_API   */
/* global getDateFromUrl showDateDataByEventId getCalendarId textToDate axios overlay showPeopleValue showHoursValue  */
/* =========== CONSTANTS =========== */
const CANCEL_BUTTON_SELECTOR = '.TbpVhb'
const GOOGLE_SAVE_BUTTON_SELECTOR = '#xSaveBu'

/* ================================= */
let eventId = ''
let startDate = ''
let endDate = ''
let eventHandler = false
// 監聽日曆活動的移動事件

window.addEventListener('mousedown', (downEvent) => {
  // 後續事件，確定點擊到日曆活動的button，才執行後續事件
  if (downEvent.target.classList.contains('g3dbUc') &&
    downEvent.target.classList.contains('jKgTF') &&
    downEvent.target.classList.contains('QGRmIf')) {
    setTimeout(() => {
      const overlay = document.querySelector('#overlay')
      const currentURL = window.location.href
      if (currentURL.includes('eventedit')) overlay.style.display = 'none'
      if (currentURL.includes('eventedit')) return
      // 取得event id
      eventId = downEvent.target.parentElement.dataset.eventid
      startDate = textToDate(downEvent.target.lastElementChild.textContent)
      eventHandler = true
    }, 200)
  }
})

window.addEventListener('pointerup', pointerUpEvent)

function pointerUpEvent () {
  const overlay = document.querySelector('#overlay')
  const currentURL = window.location.href
  if (currentURL.includes('eventedit')) overlay.style.display = 'none'
  if (currentURL.includes('eventedit')) return
  if (eventHandler) {
    eventHandler = false
    // 顯示遮罩
    overlay.style.display = 'block'

    setTimeout(() => { // 等待0.5秒，確認dom操作完畢後才執行
      const endEvent = document.querySelector(`[data-eventid="${eventId}"]`)
      if (!endEvent) return
      endDate = textToDate(endEvent.firstElementChild.lastElementChild.textContent)
      // 當開始與結束日期不相同時，才需要發送請求變更google sheet日期資料
      if (startDate !== endDate) {
        if (endDate === '錯誤的日期格式') return
        const reqPutDate = JSON.stringify({
          result: {
            calendar_event_id: eventId,
            startDate,
            endDate
          }
        })
        axios.post(GAS_DATE_PUT_API, reqPutDate)
          .then(res => {
            // 日期修改完成
            // 隱藏遮罩
            overlay.style.display = 'none'
          })
      } else {
        // 隱藏遮罩
        overlay.style.display = 'none'
      }
    }, 500)
  }
}
const calendarHTML = document.querySelector('.tEhMVd')
calendarHTML.appendChild(htmlToElement('<div id="overlay" ></div>'))
document.querySelector('#overlay').addEventListener('click', function () {
  overlay.style.display = 'none'
})

calendarHTML.appendChild(htmlToElement(`

<div class=" container card border border-dark  bg-body-secondary p-2 d-none" id="custom-container">
  <div id="loader">載入中...</div>
  <div class="row">
    <!-- 左側內容：表單 -->
    <div class="col-md-5">
      <div class=" bg-body-secondary mt-3">
        <!-- 表單內容 -->
        <!-- 表單 -->
        <form action="#" class="work_form">
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
              <option value="riveting_line">中空</option>
              <option value="rope_grab_riveing_line">鉚合(抓繩器)</option>
              <option value="hook_riveing">鉚合(鉤類)</option>
              <option value="c_buckle_riveing">鉚合(C扣)</option>
              <option value="customization_riveing">鉚合(客製)</option>
              <option value="other_riveing">鉚合(其他)</option>
              <option value="foreign_workers_line">外勞工作</option>
            </select>
          </div>
          <!-- 名稱輸入欄位 -->
          <div class="product_number_block">
            <label for="product_number_input" class="form-label">品號</label>
            <input type="text" class="form-control  border-black" id="product_number_input" name="product_number" autocomplete="off">
          </div>
          <!-- 顏色輸入欄位 -->
          <div class="product_color_block">
            <label for="product_color_input" class="form-label">顏色</label>
            <input class="form-control border-black mb-3" list="datalistOptions" id="product_color_input">
              <datalist id="datalistOptions">
              <option value="鋁製">鋁製</option>
              <option value="五彩">五彩</option>
              <option value="鍍鋅">鍍鋅</option>
              <option value="鍍鉻">鍍鉻</option>
              <option value="電著黑">電著黑</option>
              <option value="鍍鎳">鍍鎳</option>
              <option value="烤漆">烤漆</option>
              <option value="振金">振金</option>
              <option value="粗胚">粗胚</option>
              <option value="三價五彩">三價五彩</option>
              <option value="無">無</option>
            </datalist>
          </div>
          <!-- 作業人數輸入欄位 -->
          <div class="people_counts_block">
            <label for="people_counts_input" class="form-label">作業人數</label>
            <input type="range" class="input_range " id="people_counts_input" min="1" max="10" value="4"
              name="people_counts">
            <span class="people_counts_input" id="rangeValue1">4 人</span>
          </div>
          <!-- 當日工時輸入欄位 -->
          <div class="working_hours_block">
            <label for="working_hours_input" class="form-label">本日工作時數</label>
            <input type="range" class="input_range " id="working_hours_input" min="1" max="12" value="8"
              name="working_hours">
            <span class="people_counts_input" id="rangeValue2">8 小時</span>
          </div>
          <!-- 訂單數量輸入欄位 -->
          <div class="product_counts_block">
            <label for="product_counts_input" class="form-label">生產數量</label>
            <input type="number" class="form-control border-black" id="product_counts_input" min="1" max="999999"
              step="100" name="product_counts">
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
        <div class="modal-client">
          <label for="client" class="form-label h3">客戶</label>
          <input type="text" id="client" class=" client border-black" autocomplete="off">
        </div>
        <button class=" btn btn-primary data-handler" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          複製活動
        </button>
      </div>
      <div class="progress_block">
        <h4 for="bar" class="bar_content">工時使用量 :</h4>
        <div class="progress_bar">
          <div class="current_working_times bar" id="bar"></div>
        </div>
      </div>

    </div>
  </div>
  <!-- 根據日期選擇要輸入的描述 -->
  <!-- Button trigger modal -->
  <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
    Launch static backdrop modal
  </button> -->

  <!-- Modal -->
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content" style="right: 160px">
        <div class="modal-header sticky-top bg-white">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">批量複製設定</h1>
          <span id="modal_cost_message_current" class="fs-5" style="margin-left:650px;">已分配 10 小時 </span>
          <span  class="fs-5" style="margin-left:10px;"> / </span>
          <span id="modal_cost_message_total" class="fs-5" style="margin-left:10px;"> 需要 25 小時</span>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

       <div class="modal-body">
          <div class="modal-event">
            <div class="row">
              <!-- 左側 -->
              <div class="col-md-6">
                
              </div>
              <!-- 右側 -->
              <div class="col-md-6">
                
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" id="add_event" class="btn btn-primary" style="margin-right: 650px;">新增活動</button>
          <span id="modal_message">按下確認後，處理需要一段時間</span>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          <button type="button" class="btn btn-primary save_button">確認複製</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 還沒有跟進日期校正更新之前，先拔掉按鈕 -->
  <!-- 工時使用量總覽 -->
  <!--
  <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#exampleModal" style="margin-top: 1%;">
    工時資料總覽
  </button>
  -->
  <!-- Modal -->
  <div class="modal fade modal-xl" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content" style="width: 1280px">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">工時使用量總覽</h5>
          <label for="dayCounts" class="modal-title" style="font-size:20px; margin: 0 0.5% 0  5% ;">天數</label>
          <input type="number" class="form-control border border-dark" style="width:10%;" id="dayCounts" min="1"
            max="100" step="5" name="dayCounts">
          <label for="date_Overview_input" class="modal-title" style="font-size:20px; margin: 0 0.5% 0  5% ;">選擇日期</label>
          <input type="date" class="form-control border border-dark" id="date_Overview_input"
            style="width:20%;margin-right: 1.5%;">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="modalContainer" class="container modal-body">
          <!-- js -->
        </div>
        <div class="modal-footer">
          <span id="overview_message" style="margin-right: 2%;"></span>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          <button type="button" class="btn btn-primary" id="working_timeOver-view">載入資料</button>
        </div>
      </div>
    </div>
  </div>
</div>


`))

window.addEventListener('popstate', function (event) {
  // 重置頁面設定
  document.querySelector('.work_form').reset()
  document.querySelector('.bar').style.width = '0%'
  document.querySelector('.bar_content').innerText = '工時使用量 : ---小時 / ---小時 '
  document.querySelector('#client').value = ''
  document.querySelector('.custom-table').innerHTML = `
  <tr class="table-title">
    <td><span>新增</span></td>
    <td><span>刪除</span></td>
    <td><span>製程名稱</span></td>
    <td><span>平均工時</span></td>
    <td><span>耗時</span></td>
  </tr>
  `
  // google日曆採用SPA操作，動態重寫當前頁面來與使用者互動，而非傳統的從伺服器重新載入整個新頁面，避免了頁面之間切換打斷使用者體驗。
  // dom操作需要時間，如果沒有包一層setTimeout會無法正確捕捉到currentURL.includes('eventedit')的結果
  setTimeout(() => {
    const currentURL = window.location.href
    if (currentURL.includes('eventedit')) {
      const container = document.querySelector('#custom-container')
      container.classList.remove('d-none')
      if (currentURL.includes('eventedit?')) {
        const date = getDateFromUrl(currentURL)
        document.querySelector('#total_cost_times').innerText = '總共花費: --天--分鐘'
        document.querySelector('#date_input').value = date
        document.querySelector('.data-handler').innerText = '複製活動'
        document.querySelector('.data-handler').disabled = true
        document.querySelector('.data-handler').classList.add('btn-primary')
        document.querySelector('.data-handler').classList.remove('btn-secondary')
        showPeopleValue()
        showHoursValue()
      } else {
        showDateDataByEventId(getCalendarId(currentURL))
      }
      // 如果點擊了取消活動變更或保存的按鈕，隱藏日曆工時UI
      setTimeout(() => {
        document.querySelector(CANCEL_BUTTON_SELECTOR).addEventListener('click', () => {
          const container = document.querySelector('#custom-container')
          container.classList.add('d-none')
        })
        document.querySelector(GOOGLE_SAVE_BUTTON_SELECTOR).addEventListener('click', () => {
          const container = document.querySelector('#custom-container')
          container.classList.add('d-none')
        })
        window.addEventListener('keyup', (event) => {
          const container = document.querySelector('#custom-container')
          if (event.key === 'Enter') {
            const activeElement = document.activeElement
            if (!container.contains(activeElement)) {
              container.classList.add('d-none')
            }
          }
          if (event.key === 'Escape') {
            container.classList.add('d-none')
          }
        })
      }, 300)
    } else {
      const container = document.querySelector('#custom-container')
      container.classList.add('d-none')
    }
  }, 300)
})

function htmlToElement (html) {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node with whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // 在這裡添加事件監聽器
  }, 100)
})
