// const GAS_DATE_POST_API = 'https://script.google.com/macros/s/AKfycbxHETqqmEQtDdDNbnzjkpIHaTTnivAysXKgmP-6qJlzyTof9Kg9x_t_HqD1-TtnxNSn/exec'
const GAS_PROCESS_POST_API = 'https://script.google.com/macros/s/AKfycbzoZpcFqCb9wVzRhQFgM_L3O2Sava4jqfbe7tdjPrr_tkRDxeCowYpHy9HzxKVggaBe/exec'
const submitButton = document.querySelector('#data_submit_button')
const peopleCountsInput = document.querySelector('#people_counts_input')
const workinghoursInput = document.querySelector('#working_hours_input')
const table = document.querySelector('.custom-table')
const container = document.querySelector('.container')
const date = document.querySelector('#date_input').value
const productNumber = document.querySelector('#product_number_input')
const productColor = document.querySelector('#product_color_input')
const workingHours = document.querySelector('#working_hours_input')
const peopleCounts = document.querySelector('#people_counts_input')
const productCounts = document.querySelector('#product_counts_input')
const allCostTimes = document.querySelectorAll('.cost_times')
/* 監聽器 */
peopleCountsInput.addEventListener('input', showPeopleValue)
workinghoursInput.addEventListener('input', showHoursValue)
table.addEventListener('click', addAndDeleteProcess)
container.addEventListener('input', costTimesInputChange)
/* ========== */

submitButton.addEventListener('click', () => {
  /* ======取得資料====== */
  const dateValue = document.querySelector('#date_input').value
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
  /* global axios */
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
          <td><input type="number" class="process_times_input" value="${process.assembly}"></td>
          <td><span class="cost_times">${processTimes}</span></td>
        </tr>
       `

        table.innerHTML += tableHTML
      })
    })
    .catch(error => console.log(error))
})
// 給定平均工時、作業人數、每人每日做的時間、生產數量，回傳完成的時間(以X天X小時顯示)
function costTimes (processTimes, peopleCounts, workingHours, productCounts) {
  let totalHours = productCounts / (peopleCounts * workingHours * processTimes) // 總小時
  const day = Math.floor(totalHours)
  totalHours -= day
  const hour = Math.ceil(totalHours * workingHours)
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
          <td><input type="number" class="process_times_input"></td>
          <td><span class="cost_times"></span></td>
        </tr>
       `

    table.innerHTML += tableHTML
  }
  // 如果點擊到刪除按鈕，將table的一整行(table row)刪除
  if (target.classList.contains('delete_process')) {
    target.parentElement.parentElement.remove()
  }
}
/* ============= */
/* 若欄位有變動，即時改變耗時(cost_times)計算 */
function costTimesInputChange (event) {
  let newProcessTimes
  const target = event.target

  // console.log(target)
  if (target.classList.contains('process_times_input') || target === peopleCounts || target === workingHours || target === productCounts) {
    allCostTimes.forEach(item => {
      // 如果是table裡面的平均工時遭到改變，取得新的值

      newProcessTimes = item.parentElement.previousElementSibling.firstChild.value
      const workingHoursValue = workingHours.value || 0
      const peopleCountsValue = peopleCounts.value || 0
      const productCountsValue = productCounts.value || 0
      // 呼叫costTimes 重新計算工時
      const newCostTimes = costTimes(newProcessTimes, peopleCountsValue, workingHoursValue, productCountsValue)
      item.innerText = newCostTimes
    })
  }
}
