const GAS_POST_API = 'https://script.google.com/macros/s/AKfycbxHETqqmEQtDdDNbnzjkpIHaTTnivAysXKgmP-6qJlzyTof9Kg9x_t_HqD1-TtnxNSn/exec'

const submitButton = document.querySelector('#data_submit_button')

submitButton.addEventListener('click', () => {
  /* ======取得資料====== */
  const date = document.querySelector('#date_input').value
  const workingHours = document.querySelector('#working_hours_input').value
  const peopleCounts = document.querySelector('#people_counts_input').value
  const productCounts = document.querySelector('#product_counts_input').value
  /* =================== */
  const data = JSON.stringify({
    date,
    working_hours: workingHours,
    people_counts: peopleCounts,
    product_counts: productCounts
  })
  /* global axios */
  axios.post(GAS_POST_API, data)
    .then(res => {
      console.log(res.data.status)
    })
})
