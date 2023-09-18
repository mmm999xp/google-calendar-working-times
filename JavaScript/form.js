const GAS_DATE_POST_API = 'https://script.google.com/macros/s/AKfycbxHETqqmEQtDdDNbnzjkpIHaTTnivAysXKgmP-6qJlzyTof9Kg9x_t_HqD1-TtnxNSn/exec'
const GAS_PROCESS_POST_API = 'https://script.google.com/macros/s/AKfycbzoZpcFqCb9wVzRhQFgM_L3O2Sava4jqfbe7tdjPrr_tkRDxeCowYpHy9HzxKVggaBe/exec'
const submitButton = document.querySelector('#data_submit_button')

submitButton.addEventListener('click', () => {
  /* ======取得資料====== */
  const date = document.querySelector('#date_input').value
  const productNumber = document.querySelector('#product_number_input').value
  const productColor = document.querySelector('#product_color_input').value
  const workingHours = document.querySelector('#working_hours_input').value
  const peopleCounts = document.querySelector('#people_counts_input').value
  const productCounts = document.querySelector('#product_counts_input').value
  const table = document.querySelector('.custom-table')
  /* =================== */
  if (workingHours > 12 || workingHours < 1) return alert('當日工時輸入錯誤，請確認')
  if (peopleCounts > 10 || peopleCounts < 1) return alert('作業人數輸入錯誤，請確認')
  if (productCounts > 999999 || productCounts < 0) return alert('生產數量輸入錯誤，請確認')
  const data = JSON.stringify({
    date,
    product_number: productNumber,
    product_color: productColor,
    working_hours: workingHours,
    people_counts: peopleCounts,
    product_counts: productCounts
  })
  /* global axios */
  axios.post(GAS_DATE_POST_API, data)
    .then(res => {
      console.log(res.data.status)
      return axios.post(GAS_PROCESS_POST_API, data)
    })
    .then(res => {
      console.log(res.data)
      if (res.data.length === 0) return alert('沒有任何工時資料')
      res.data.forEach(process => {
        const processTimes = costTimes(process.assembly, peopleCounts, workingHours, productCounts)
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
  // const totalWorkingHours = workingHours * (peopleCounts * workingHours) // 取得總工作時數
  let totalHours = productCounts / (peopleCounts * workingHours * processTimes) // 總小時
  const day = Math.floor(totalHours)
  totalHours -= day
  const hour = Math.ceil(totalHours * workingHours)
  return day + '天' + hour + '小時'
}

function showValue () {
  const rangeValue = document.getElementById('people_counts_input').value
  document.getElementById('rangeValue1').innerHTML = rangeValue
}
function showHoursValue() {
  const rangeValue = document.getElementById('working_hours_input').value
  document.getElementById('rangeValue2').innerHTML = rangeValue
}
