const GAS_PROCESS_GET_API = 'https://script.google.com/macros/s/AKfycbzoZpcFqCb9wVzRhQFgM_L3O2Sava4jqfbe7tdjPrr_tkRDxeCowYpHy9HzxKVggaBe/exec'
const GAS_DATE_GET_API = 'https://script.google.com/macros/s/AKfycbwmc0l4wZ1cBg-K3P8QWFNyzlUKQXXjXQGjC5mSP0zES7sx0deWmRlNrF9jpVHuvqpr3Q/exec'
const GAS_DATE_POST_API = 'https://script.google.com/macros/s/AKfycby4qDjmoOifA2wMC-4Lq3GsPyrfVWhTgJIgYRxdb__mQxQRqsnK0hria1Ro3CtRDuUW/exec'
const GAS_PROCESS_POST_API = 'https://script.google.com/macros/s/AKfycbwhqIBXMAuoDKujXC8DNmLvXvvdqLNRqSSxJsgo-5xIs43-Y1xp13PsvO-Qh-rPfXLS/exec'
const GAS_DATE_GET_BY_ID_API = 'https://script.google.com/macros/s/AKfycbydh-BmMMG_8K-HBuMnQgy93Z1Go2aWm-Hd6wSK2EQeWwC5sRcPLP6anYGxPDt-_p8QiQ/exec'
const GAS_CALENDAR_POST_API = 'https://script.google.com/macros/s/AKfycbwZduyF-_oxlfDRIjp00BLZbhX93hl1uXwdc8xjqfCeMJ-ZI4zaf3vpe70GBeB8GfFTkQ/exec'
const GAS_DATE_DELETE_API = 'https://script.google.com/macros/s/AKfycbyCWKMC8QcVuvc9NFSw1viKifjDp-xfYIuwFjtPFSw9ohhbb3K70mEbTsDLKzaP_g4b/exec'
const GAS_WORKING_TIMES_GET_API = 'https://script.google.com/macros/s/AKfycbzsgl3N5AkcBiCin3Kh30OfdbIGcaZxFsIq8gkAmwsecaR-AT04Y2vwO_NO1J2TCyXXIw/exec'
const submitButton = document.querySelector('#data_submit_button')
const table = document.querySelector('.custom-table')
const container = document.querySelector('.container')
const date = document.querySelector('#date_input')
const productNumber = document.querySelector('#product_number_input')
const productColor = document.querySelector('#product_color_input')
const workingHours = document.querySelector('#working_hours_input')
const peopleCounts = document.querySelector('#people_counts_input')
const productCounts = document.querySelector('#product_counts_input')
const totalCostTimes = document.querySelector('#total_cost_times')
const dataHandlerButton = document.querySelector('.data-handler')
const saveButton = document.querySelector('.save_button')
const line = document.querySelector('#production_line')
const workingTimeOverViewButton = document.querySelector('#working_timeOver-view')
// 遮罩
const loader = document.querySelector('#loader')
dayjs.extend(window.dayjs_plugin_utc)
dayjs.extend(window.dayjs_plugin_timezone)
dayjs.tz.setDefault('Asia/Taipei') // 設定為台灣時區
/* 監聽器 */
peopleCounts.addEventListener('input', showPeopleValue)
workingHours.addEventListener('input', showHoursValue)
table.addEventListener('click', addAndDeleteProcess)
container.addEventListener('input', inputChangeEvent)
dataHandlerButton.addEventListener('click', dataHandler)
saveButton.addEventListener('click', saveData)
window.addEventListener('click', deleteEvent)
workingTimeOverViewButton.addEventListener('click', workingTimeOverViewEvent)
/* ========== */

submitButton.addEventListener('click', () => {
  loader.style.display = 'flex'
  /* ======取得資料====== */
  const dateValue = date.value
  const productNumberValue = productNumber.value.toUpperCase()
  const productColorValue = productColor.value
  const workingHoursValue = workingHours.value
  const peopleCountsValue = peopleCounts.value
  const productCountsValue = productCounts.value
  /* =================== */
  if (workingHoursValue > 12 || workingHoursValue < 1) return alert('當日工時輸入錯誤，請確認')
  if (peopleCountsValue > 10 || peopleCountsValue < 1) return alert('作業人數輸入錯誤，請確認')
  if (productCountsValue > 999999 || productCountsValue < 0) return alert('生產數量輸入錯誤，請確認')
  const data = JSON.stringify({
    date: dateValue,
    product_number: productNumberValue,
    product_color: productColorValue,
    working_hours: workingHoursValue,
    people_counts: peopleCountsValue,
    product_counts: productCountsValue
  })
  /* global axios dayjs */
  axios.post(GAS_PROCESS_GET_API, data)
    .then(res => {
      console.log(res.data)
      if (res.data.length === 0) return alert('沒有任何工時資料')
      res.data.forEach(process => {
        const processTimes = costTimes(process.assembly, peopleCountsValue, workingHoursValue, productCountsValue)
        const tableHTML = `
        <tr>
          <td><button class="add_process">十</button></td>
          <td><button class="delete_process">一</button></td>
          <td><span class="process_name">${process.process_name}</span></td>
          <td><input type="number" class="process_times_input" value="${process.assembly}" step="10" max="10000"></td>
          <td><span class="cost_times">${processTimes}</span></td>
        </tr>
       `

        table.innerHTML += tableHTML
        totalCostTimes.innerText = sumCostTimes(workingHoursValue)
        // dataHandlerButton.classList.remove('d-none')
        if (window.location.href.includes('eventedit?')) {
          dataHandlerButton.disabled = false
          dataHandlerButton.classList.add('btn-primary')
          dataHandlerButton.classList.remove('btn-secondary')
        }
        loader.style.display = 'none'
      })
    })
    .catch(error => console.log(error))
})
// 給定平均工時、作業人數、每人每日做的時間、生產數量，回傳完成的時間(以X天X小時顯示)
function costTimes (processTimes, peopleCounts, workingHours, productCounts) {
  let totalHours = productCounts / (peopleCounts * workingHours * processTimes) // 總小時
  let day = Math.floor(totalHours)
  totalHours -= day
  let hour = Math.ceil(totalHours * workingHours)
  if (hour >= workingHours) {
    hour = hour - workingHours
    day = day + 1
  }
  if (processTimes === 0 || processTimes === '') {
    day = 0
    hour = 0
  }
  return day + '天' + hour + '小時'
}
/* 顯示input的值 */
function showPeopleValue () {
  const rangeValue = document.querySelector('#people_counts_input').value
  document.querySelector('#rangeValue1').innerText = rangeValue + ' 人'
}
function showHoursValue () {
  const rangeValue = document.querySelector('#working_hours_input').value
  document.querySelector('#rangeValue2').innerText = rangeValue + ' 小時'
}
/* ============ */

/* 新增與刪除按鈕 */

function addAndDeleteProcess (event) {
  const target = event.target
  // 如果點擊到新增按鈕，新增一行(table row)，供使用者輸入
  if (target.classList.contains('add_process')) {
    const tableHTML = `
        <tr>
          <td><button class="add_process">十</button></td>
          <td><button class="delete_process">一</button></td>
          <td><input type="text" class="process_name" placeholder="請輸入製程名稱" style="width: 120px;"></td>
          <td><input type="number" class="process_times_input" step="10" max="10000"></td>
          <td><span class="cost_times"></span></td>
        </tr>
       `

    table.innerHTML += tableHTML
  }
  // 如果點擊到刪除按鈕，將table的一整行(table row)刪除，同時呼叫sumCostTimes更新數值
  if (target.classList.contains('delete_process')) {
    const workingHoursValue = workingHours.value
    target.parentElement.parentElement.remove()
    totalCostTimes.innerText = sumCostTimes(workingHoursValue)
  }
}
/* ============= */
/* 若欄位有變動，即時改變耗時(cost_times)計算 */
function inputChangeEvent (event) {
  let newProcessTimes
  const target = event.target
  const allCostTimes = document.querySelectorAll('.cost_times') // 有可能透過API或是新增按鈕增加table欄位，因此必須重新抓取節點
  // console.log(target)
  if (target.classList.contains('process_times_input') || target === peopleCounts || target === workingHours || target === productCounts) {
    allCostTimes.forEach(item => {
      // 如果是table裡面的平均工時遭到改變，取得新的值

      newProcessTimes = item.parentElement.previousElementSibling.firstChild.value
      const workingHoursValue = workingHours.value || 0
      const peopleCountsValue = peopleCounts.value || 0
      const productCountsValue = productCounts.value || 0
      // console.log('newProcessTimes', newProcessTimes)
      // console.log('workingHoursValue', workingHoursValue)
      // console.log('peopleCountsValue', peopleCountsValue)
      // console.log('productCountsValue', productCountsValue)
      // 呼叫costTimes 重新計算工時
      const newCostTimes = costTimes(newProcessTimes, peopleCountsValue, workingHoursValue, productCountsValue)
      item.innerText = newCostTimes
      totalCostTimes.innerText = sumCostTimes(workingHoursValue)
    })
  }
}

// 計算總耗時，每次此函式重新抓取CostTimes總節點，而不需要作為參數傳入，這是因為可能會因為透過API或是新增按鈕增加數個CostTime欄位
// 需要傳入每日工作時間的參數，這是為了可以超過工作時間時進位，假設一天工作8小時，在計算出結果為14小時9小時會進位成15天1小時
function sumCostTimes (workingHours) {
  const allCostTimes = document.querySelectorAll('.cost_times')
  let totalDays = 0
  let totalHours = 0
  allCostTimes.forEach(item => {
    // 提取天數與小時數
    const matches = item.innerText.match(/(\d+)天(\d+)小時/)

    if (matches) {
      const days = Number(matches[1]) // 提取天數
      const hours = Number(matches[2]) // 提取小時數
      totalDays = totalDays + days
      totalHours = totalHours + hours
      // 處理時間進位
      if (totalHours > workingHours) {
        totalHours = totalHours - workingHours
        totalDays = totalDays + 1
      }
    }
  })
  return '總共花費: ' + totalDays + '天' + totalHours + '小時'
}
let reqDateDatas = []
let reqPrecessDatas = []
// 處理批量複製的資料
function dataHandler () {
  reqDateDatas = [] // 初始化數據
  reqPrecessDatas = [] // 初始化數據
  // 取得各項參數
  let dateValue = dayjs(document.querySelector('#date_input').value) // 日期
  const productNumberValue = productNumber.value // 品號
  const productColorValue = productColor.value // 顏色
  const workingHoursValue = workingHours.value // 當日工時
  const peopleCountsValue = peopleCounts.value // 作業人數
  const productCountsValue = productCounts.value // 生產數量
  const totalCostTimesValue = totalCostTimes.innerText // 總耗時
  const lineValue = line.value
  /* ================================================================================================= */
  /* ============處理日期資料，為了發送請求到GAS的API，儲存資料到google sheets 日期資料的工作表============ */
  /* ================================================================================================= */
  // 整理日期資料，排除周末(六、日)
  const matches = totalCostTimesValue.match(/(\d+)天(\d+)小時/)
  let days = 0
  let hours = 0
  // let totalHours = 0
  if (matches) {
    days = Number(matches[1]) // 提取天數
    hours = Number(matches[2]) // 提取小時數
    // totalHours = days * workingHoursValue + hours // 計算總耗時的小時數，方便後續計算
    if (hours !== 0) days = days + 1 // 如果小時數有數字，則無條件進位一天
  }
  if (days === 0) return alert('總耗時天數合計為 0')

  // 準備資料，針對days迴圈，有幾天就增加幾筆的資料到google sheets，不包含最後一天
  for (let i = 0; i < days - 1; i++) {
    reqDateDatas.push({
      date: dateValue.format('YYYY-MM-DD'),
      working_hours: workingHoursValue,
      people_counts: peopleCountsValue,
      product_counts: productCountsValue,
      product_number: productNumberValue.toUpperCase(),
      product_color: productColorValue,
      belong_line: lineValue,
      current_working_times: workingHoursValue
    })
    // totalHours = totalHours - workingHoursValue
    dateValue = dateValue.add(1, 'day')
    while (isWeekend(dateValue)) { dateValue = dateValue.add(1, 'day') } // 檢測是否是假日，如果是假日就會再加一天，直到不是假日為止
  }
  // 處理最後一天的資料
  reqDateDatas.push({
    date: dateValue.format('YYYY-MM-DD'),
    working_hours: workingHoursValue,
    people_counts: peopleCountsValue,
    product_counts: productCountsValue,
    product_number: productNumberValue.toUpperCase(),
    product_color: productColorValue,
    belong_line: lineValue,
    current_working_times: hours.toString() // 其他value的類別都是string，為了一致性，這邊也改成string
  })
  /* ================================================================================================= */
  /* =======================設定批量複製事件，以整理成方便發送新增日曆事件的JSON========================= */
  /* ================================================================================================= */

  document.querySelector('.modal-body').innerHTML = '' // 初始化
  const client = document.querySelector('.client').value
  let textNumber = 0
  switch (lineValue) {
    case 'first_line':
      textNumber = '1.'
      break
    case 'second_line':
      textNumber = '2.'
      break
    case 'third_line':
      textNumber = '3.'
      break
    default:
      textNumber = ''
      break
  }

  for (let i = 0; i < reqDateDatas.length; i++) {
    const text = textNumber + client + '-' + reqDateDatas[i].product_number + reqDateDatas[i].product_color + '*' + reqDateDatas[i].product_counts
    const descriotion = document.querySelector('.T2Ybvb') ? document.querySelector('.T2Ybvb').innerText : ''
    const rowData = `
          <label for="date${i}" class="form-label">日期</label>
          <input type="date" id="date${i}" class="form-control  border-black" value="${reqDateDatas[i].date}">
          <label for="summary${i}" class="form-label">標題</label>
          <input type="text" id="summary${i}" class="form-control  border-black" value="${text}">
          <label for="description${i}" class="form-label">描述</label>
          <input type="text" id="description${i}" class="form-control  border-black" value="${descriotion}">
          <hr>
    `
    document.querySelector('.modal-body').innerHTML += rowData
  }

  /* ================================================================================================= */
  /* ============處理製程資料，為了發送請求到GAS的API，儲存資料到google sheets 製程關聯的工作============== */
  /* ================================================================================================= */

  // 取得table的所有資料
  // 選取表格所有列節點
  const rows = table.getElementsByTagName('tr')
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const rowData = []
    // const dateValue = dayjs(document.querySelector('#date_input').value) // 重新抓取日期，因為日期已經在前面被變更了
    // rowData.push(lineValue, dateValue.format('YYYY-MM-DD')) // 加入生產線和日期
    // 獲取該列的所有資料
    const cells = row.getElementsByTagName('td')

    // 遍歷該列的所有資料將其加進rowData
    for (let j = 2; j < cells.length; j++) { // 跳過+和-按鈕
      rowData.push(cells[j].textContent || cells[j].firstChild.value) // 取得欄位資料，如果是文字欄位，使用textContent取出內容，如果是input欄位，必須向子元素取值
    }

    // 將rowData加進reqPrecessDatas
    reqPrecessDatas.push(rowData)
  }
  // reqPrecessDatas整理成物件格式
  dateValue = dayjs(document.querySelector('#date_input').value) // 重新抓取日期，因為dateValue已經在前面被變更了
  reqPrecessDatas = reqPrecessDatas.map(item => ({
    process_name: item[0],
    workng_times: item[1],
    cost_times: item[2],
    belong_line: lineValue,
    date: dateValue.format('YYYY-MM-DD')
  }))
  /* ================================================================================================= */
  // 發送請求到GAS的API，儲存資料到google sheets並由GAS為google日曆發送新增事件
  /* ================================================================================================= */
  // 如果req的東西是陣列，外面要包ㄧ層result
  // 外面包一層result是為了讓GAS上面直接JSON.parse可以直接取用result裡面的陣列資料跑迴圈，沒包的話會變成物件stringify，並沒有陣列迭代方法可以用
  // console.log(reqDateDatas)
  // reqDateDatas = JSON.stringify({ result: reqDateDatas })
  // reqPrecessDatas = JSON.stringify({ result: reqPrecessDatas })

  // return saveData(reqDateDatas, reqPrecessDatas)
}

/* ================================================================================================= */
// 呼叫api保存所有資料
/* ================================================================================================= */
function saveData (event) {
  document.querySelector('#modal_message').innerText = '處理中，請耐心等候'
  saveButton.disabled = true
  saveButton.classList.remove('btn-primary')
  saveButton.classList.add('btn-secondary')
  // 創建一個空陣列，用於存儲資料物件
  const inputArray = []
  // 迭代每個資料區塊，將其轉換為物件並添加到陣列中
  for (let i = 0; i < reqDateDatas.length; i++) {
    const dateInput = document.querySelector(`#date${i}`).value
    const summaryInput = document.querySelector(`#summary${i}`).value
    const descriptionInput = document.querySelector(`#description${i}`).value

    const dataObject = {
      date: dateInput,
      summary: summaryInput,
      description: descriptionInput
    }

    inputArray.push(dataObject)
  }
  // 更新日期，並為其加上summary、description
  for (let i = 0; i < reqDateDatas.length; i++) {
    reqDateDatas[i].date = inputArray[i].date
    reqDateDatas[i].summary = inputArray[i].summary
    reqDateDatas[i].description = inputArray[i].description
  }

  reqDateDatas = JSON.stringify({ result: reqDateDatas })

  // console.log(inputArray)
  // console.log(reqDateDatas)
  axios.post(GAS_CALENDAR_POST_API, reqDateDatas)
    .then(res => {
      // 先將json轉回js物件
      reqDateDatas = JSON.parse(reqDateDatas).result
      // 將回傳的calendarEventId 加入到reqDateDatas
      for (let i = 0; i < reqDateDatas.length; i++) {
        reqDateDatas[i].calendar_event_id = res.data.events[i].calendarEventId
      }
      // 將回傳的calendarEventId 加入到reqPrecessDatas
      for (let i = 0; i < reqPrecessDatas.length; i++) {
        const result = res.data.events.find(event => event.date === reqPrecessDatas[i].date).calendarEventId
        reqPrecessDatas[i].calendar_event_id = result
      }
      console.log(reqDateDatas)
      console.log(reqPrecessDatas)
      // 再次轉化回json，發送請求新增資料到google sheets
      reqDateDatas = JSON.stringify({ result: reqDateDatas })
      reqPrecessDatas = JSON.stringify({ result: reqPrecessDatas })
      return Promise.all([
        axios.post(GAS_DATE_POST_API, reqDateDatas)
      //  axios.post(GAS_PROCESS_POST_API, reqPrecessDatas)
      ])
    })
    .then(([res1]) => {
      // alert('已經全部處理完成')
      document.querySelector('#modal_message').innerText = '按下確認後，處理需要一段時間'
      saveButton.disabled = false
      saveButton.classList.add('btn-primary')
      saveButton.classList.remove('btn-secondary')
      document.querySelector('.btn-close').click()
      window.history.back()
    })
    .catch(error => console.log(error))
}
/* ================================================================================================= */
// 給定一個日期，檢查該日期是否為周末，回傳布林值
/* ================================================================================================= */
function isWeekend (date) {
  return dayjs(date).day() === 0 || dayjs(date).day() === 6 // 0 表示週日，6 表示週六
}

/* ================================================================================================= */
// 給定一日期與生產線，顯示該生產線今日的各種數據
/* ================================================================================================= */
function showDateData (date, workLink) {
  // 整理成JSON格式
  const reqDateDatas = JSON.stringify({
    date: dayjs(date).format('YYYY-MM-DD'),
    belong_line: workLink
  })
  console.log(reqDateDatas)
  // 發送AJAX請求要求數據
  axios.post(GAS_DATE_GET_API, reqDateDatas)
    .then(res => {
      console.log(res.data)
    })
    .catch(error => console.log(error))
}
/* ================================================================================================= */
// 給定一日曆event Id，顯示該日的各種數據，隱藏複製設定按鈕，顯示修改按鈕
/* ================================================================================================= */
function showDateDataByEventId (eventId) {
  // 啟用載入中的遮罩
  loader.style.display = 'flex'
  // 整理成JSON格式
  const reqDateDatas = JSON.stringify({
    calendar_event_id: eventId
  })
  // 發送AJAX請求要求數據
  axios.post(GAS_DATE_GET_BY_ID_API, reqDateDatas)
    .then(res => {
      date.value = res.data.date || ''
      productNumber.value = res.data.product_number || ''
      productColor.value = res.data.product_color || ''
      workingHours.value = res.data.working_hours || ''
      peopleCounts.value = res.data.people_counts || ''
      productCounts.value = res.data.product_counts || ''
      const allLineOption = line.getElementsByTagName('option')
      for (let i = 0; i < allLineOption.length; i++) {
        if (allLineOption[i].value === res.data.belong_line) {
          allLineOption[i].selected = true
          break
        }
      }
      const allColorOption = productColor.getElementsByTagName('option')
      for (let i = 0; i < allColorOption.length; i++) {
        if (allColorOption[i].value === res.data.product_counts) {
          allColorOption[i].selected = true
          break
        }
      }
      // 更新工時使用量時間條
      updateProgressbar(workingHours.value, res.data.current_working_times)

      dataHandlerButton.innerText = '已保存'
      dataHandlerButton.disabled = true
      dataHandlerButton.classList.remove('btn-primary')
      dataHandlerButton.classList.add('btn-secondary')
      // 隱藏遮罩，讓使用者可輸入
      loader.style.display = 'none'
    })
    .catch(error => console.log(error))
}
/* ================================================================================================= */
// 更新工時使用量時間條
/* ================================================================================================= */
function updateProgressbar (workingHours, currentWorkingTimes = 0) {
  const barContent = document.querySelector('.bar_content')
  const bar = document.querySelector('.bar')
  // 計算百分比
  let widthPercent = (currentWorkingTimes / workingHours) * 100
  barContent.innerText = `工時使用量 : ${currentWorkingTimes}小時 / ${workingHours}小時`
  if (widthPercent > 100) {
    bar.style.backgroundColor = 'red'
    widthPercent = 100
  } else {
    bar.style.backgroundColor = 'rgb(116, 194, 92)'
  }
  bar.style.width = `${widthPercent}%`
}

// https://calendar.google.com/calendar/u/0/r/eventedit/NHAxNTFidm1ubHNtMGduYjFwZHA4aDNvYTAgbW1tOTk5eH... 擷取最後面的部分
function getCalendarId (calendarUrl) {
  // 使用 split 方法將網址分割成陣列，以斜槓為分隔符
  const segments = calendarUrl.split('/')

  // 獲取陣列中的最後一個元素，即最後一個斜槓後的所有字元
  const lastSegment = segments[segments.length - 1]
  return lastSegment
}

// https://calendar.google.com/calendar/u/0/r/eventedit?overrides=%5Bnull%2Cnull%2C%2220230913%...擷取2023-09-13的部分
function getDateFromUrl (calendarUrl) {
  // 從 URL 中擷取 % 之間的數字

  const matches = calendarUrl.match(/%2(\d+)/)

  if (matches && matches.length >= 2) {
    const matchedNumber = matches[1]

    // 去掉最前面的數字
    const extractedNumber = matchedNumber.slice(1)
    const year = extractedNumber.substr(0, 4)
    const month = extractedNumber.substr(4, 2)
    const day = extractedNumber.substr(6, 2)

    // 使用連字符（-）組合成所需的日期格式
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
  } else {
    return '格式錯誤'
  }
}

// 將2023年10月4日轉換成YYYY-MM-DD格式
function textToDate (text) {
  document.getElementById('modalContainer').innerText = ''
  const dateMatch = text.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (dateMatch) {
    const year = parseInt(dateMatch[1])
    const month = parseInt(dateMatch[2])
    const day = parseInt(dateMatch[3])
    // 可能要補 0，所以先轉化成dayjs日期物件再format
    const formattedDate = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD')
    return formattedDate
  } else {
    return '錯誤的日期格式'
  }
}
function deleteEvent (event) {
  // 刪除按鈕有可能點到svg也可能點到path，也可能點到button
  if (event.target.id === 'xDetDlgDelBu' || event.target.closest('#xDetDlgDelBu')) {
    let target = event.target
    if (target.tagName.toLowerCase() !== 'button') target = target.closest('#xDetDlgDelBu')
    // 取得含有data-eventid屬性的父元素
    const parentTarget = target.closest('[data-eventid]')
    const targerEventId = parentTarget.dataset.eventid
    const reqDeleteDate = JSON.stringify({
      result: {
        calendar_event_id: targerEventId
      }
    })
    console.log(reqDeleteDate)
    // 發送請求刪除該event id 的資料
    axios.post(GAS_DATE_DELETE_API, reqDeleteDate)
      .then(res => {
        console.log(res.data)
        document.querySelector('#overlay').style.display = 'none'
      })
  }
}
function workingTimeOverViewEvent () {
  const dayCounts = document.querySelector('#dayCounts').value
  if (dayCounts === '') {
    document.querySelector('#overview_message').innerText = '請輸入天數'
    return
  }
  if (dayCounts > 100) {
    document.querySelector('#overview_message').innerText = '請輸入小於100的整數'
    return
  }
  const date = document.querySelector('#date1').value
  if (date === '') {
    document.querySelector('#overview_message').innerText = '請選擇日期'
    return
  }
  getWorkingTimesFromDate(date, dayCounts)
}
/* ================================================================================================= */
// 給定一日期，獲取所有生產線自定義天數(最多為100)的工時數據
/* ================================================================================================= */
function getWorkingTimesFromDate (date, dayCounts) {
  if (dayCounts > 100) dayCounts = 100
  // 設定起始日期
  let startDate = dayjs(date)
  const resultArray = []
  // 開始迴圈，直到找到指定個符合條件的日期
  while (resultArray.length < dayCounts) {
    // 檢查當前日期是否是周日（0）
    if (startDate.day() !== 0) {
      // 如果不是周末，將該日期添加到結果陣列
      resultArray.push(startDate.format('YYYY-MM-DD'))
    }
    // 將日期往後移一天
    startDate = startDate.add(1, 'day')
  }
  const reqGetWorkingTimes = JSON.stringify({ result: resultArray })
  // 請求數據
  axios.post(GAS_WORKING_TIMES_GET_API, reqGetWorkingTimes)
    .then(res => workingTimeOverView(res.data.status, date))
}

function workingTimeOverView (data, date) {
  console.log(data)
  // 假設您希望生成的欄位數量
  const totalColumns = document.querySelector('#dayCounts').value

  // 假設每行的欄位數量
  const columnsPerRow = 5

  // 取得 modal 容器元素
  const modalContainer = document.getElementById('modalContainer')
  modalContainer.innerHTML = ''
  // 創建 modal 的內容
  const modalBody = document.createElement('div')
  modalBody.classList.add('modal-body')

  // 創建容納欄位的 row 容器
  let row = null

  // 開始日期
  const startDate = new Date(date)
  const endDate = new Date(date)
  endDate.setDate(endDate.getDate() + (totalColumns - 1)) // 假設要顯示20個日期

  // 創建一個字典來存儲日期和對應的數據
  const dateDataMap = {}

  // 遍歷數據並填充字典
  data.forEach(item => {
    const formattedDate = item.date
    if (!dateDataMap[formattedDate]) {
      dateDataMap[formattedDate] = []
    }
    dateDataMap[formattedDate].push(item)
  })

  for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    // 每5個欄位換一列
    if (modalBody.children.length % columnsPerRow === 0) {
      row = document.createElement('div')
      row.classList.add('row')
      modalBody.appendChild(row)
    }

    // 創建欄位
    const column = document.createElement('div')
    column.classList.add('col-md-2', 'border', 'border-dark', 'col-content')
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`
    column.textContent = formattedDate // 欄位內容

    // 檢查數據中是否有匹配的日期
    const matchingData = dateDataMap[formattedDate]

    // 創建進度條結構，如果有匹配的數據，則根據數據創建進度條，否則創建空的進度條
    for (let j = 1; j <= 3; j++) {
      const progressBar = document.createElement('div')
      progressBar.classList.add('progress_bar')

      const currentWorkingTimes = document.createElement('div')
      currentWorkingTimes.classList.add('current_working_times', 'bar')

      if (matchingData && matchingData.length > 0) {
        // 找到匹配的數據
        const lineData = matchingData.filter(item => item.belong_line === `line${j}`)
        if (lineData.length > 0) {
          // 計算合併後的 .bar 的寬度
          const totalCurrentWorkingTimes = lineData.reduce((acc, item) => acc + item.current_working_times, 0)
          const totalWorkingHours = lineData[0].working_hours // 假設多個 line 的 working_hours 相同
          let progressPercentage = (totalCurrentWorkingTimes / totalWorkingHours) * 100
          let Exceeded = false
          // 確保寬度不超過100%
          if (progressPercentage > 100) {
            progressPercentage = 100
            Exceeded = true
          }

          currentWorkingTimes.style.width = `${progressPercentage}%`

          // 設置文字內容
          currentWorkingTimes.textContent = `${totalCurrentWorkingTimes}/${totalWorkingHours}`

          // 設置對應的 class 名稱
          currentWorkingTimes.classList.add(lineData[0].belong_line)

          // 根據進度設置背景顏色
          if (Exceeded) {
            currentWorkingTimes.style.backgroundColor = 'red'
          } else {
            // currentWorkingTimes.style.backgroundColor = 'rgb(116, 194, 92)';
          }
        } else {
          // 如果沒有匹配的數據，則創建空的進度條
          currentWorkingTimes.textContent = ''// '0/0';
          currentWorkingTimes.style.width = '0%'
        }
      } else {
        // 如果沒有匹配的數據，則創建空的進度條
        currentWorkingTimes.textContent = '' // '0/0';
        currentWorkingTimes.style.width = '0%'
      }

      // 將進度條結構添加到欄位中
      progressBar.appendChild(currentWorkingTimes)
      column.appendChild(progressBar)
    }

    // 將欄位添加到 row 中
    row.appendChild(column)
  }

  // 將 modalBody 添加到 modalContainer 中
  modalContainer.appendChild(modalBody)
}
// workingTimeOverView()
