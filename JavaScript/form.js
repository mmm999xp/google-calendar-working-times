const GAS_DATE_POST_API = 'https://script.google.com/macros/s/AKfycbxKk00fgCisGJKXJ_CjHsJtQ5enOqho2ob5ze647camB8v0X1L6EEvsihPtG0I2RZUh/exec'
const GAS_PROCESS_POST_API = 'https://script.google.com/macros/s/AKfycbzoZpcFqCb9wVzRhQFgM_L3O2Sava4jqfbe7tdjPrr_tkRDxeCowYpHy9HzxKVggaBe/exec'
const GAS_PROCESS_ADDPOST_API = 'https://script.google.com/macros/s/AKfycbzLRPGW6i-KVR208KlPTrhhgA7-Zzbp3kAwDnu4KAUEyDq1R1t3whG2TlcCLKWO4vJA/exec'
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
const saveButton = document.querySelector('.save_button')
const line = document.querySelector('#production_line')
dayjs.extend(window.dayjs_plugin_utc)
dayjs.extend(window.dayjs_plugin_timezone)
dayjs.tz.setDefault('Asia/Taipei') // 設定為台灣時區
/* 監聽器 */
peopleCounts.addEventListener('input', showPeopleValue)
workingHours.addEventListener('input', showHoursValue)
table.addEventListener('click', addAndDeleteProcess)
container.addEventListener('input', costTimesInputChange)
saveButton.addEventListener('click', saveDateData)
/* ========== */

submitButton.addEventListener('click', () => {
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
  axios.post(GAS_PROCESS_POST_API, data)
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
        saveButton.disabled = false // 啟用保存按鈕
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
function costTimesInputChange (event) {
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
// 保存所有設定
function saveDateData () {
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
  let reqDateDatas = []
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
  /* ============處理製程資料，為了發送請求到GAS的API，儲存資料到google sheets 製程關聯的工作============== */
  /* ================================================================================================= */
  let reqPrecessDatas = []
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
  reqDateDatas = JSON.stringify({ result: reqDateDatas })
  reqPrecessDatas = JSON.stringify({ result: reqPrecessDatas })
  return Promise.all([
    axios.post(GAS_DATE_POST_API, reqDateDatas), // 日期資料試算表
    axios.post(GAS_PROCESS_ADDPOST_API, reqPrecessDatas) // 製程關聯試算表
  ])
    .then(([res1, res2]) => {
      console.log(res1.data.status)
      console.log(res2.data.status)
      alert('已經全部新增完成')
    })
    .catch(error => console.log(error))
}

// 給定一個日期，檢查該日期是否為周末，回傳布林值
function isWeekend (date) {
  return dayjs(date).day() === 0 || dayjs(date).day() === 6 // 0 表示週日，6 表示週六
}
