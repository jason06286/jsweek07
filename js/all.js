// BootStrap Validation
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation')
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
  }, false)
})()

const url = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json'
let data
const localData = JSON.parse(localStorage.getItem('newData')) || []

const listDom = document.querySelector('[data-list]')
const selectDom = document.querySelector('[data-select]')
const nowSelectDom = document.querySelector('[data-nowSelect]')
const btnDom = document.querySelector('[data-btn]')
const inputDom = document.querySelectorAll('input')
const formSelectDom = document.querySelector('[data-formSelect]')
const textareaDom = document.querySelector('[data-textarea]')

getData()

btnDom.addEventListener('click', getForm)

selectDom.addEventListener('change', function (e) {
  render(e.target.value)
})

function getData () {
  axios.get(url)
    .then((res) => {
      data = res.data
      addNewData()
      renderChart()
      render()
    })
}

function render (location) {
  let str = ''

  const filterData = data.filter(item => {
    if (!location) {
      return item
    }
    if (location) {
      return item.area === location
    }
  })

  filterData.forEach(item => {
    str += `
      <li class="col-12 col-lg-4 list-unstyled mb-5">
        <div class="card shadow border-0">
            <div class="position-relative">
                <img src=${item.imgUrl} class="card-img-top d-block" alt="..." >
                <div class="position-absolute " style="top: -10px;">
                    <span class="badge badge-secondary text-white p-2 px-3">${item.area}</span>
                </div>
                <div class="position-absolute " style="bottom: -10px;">
                    <span class="badge badge-primary text-white ">${item.rate}</span>
                </div>
            </div>
            <div class="card-body">
                <h5 class="card-title text-primary font-weight-bolder border-bottom pb-3 ">${item.name}</h5>
                <p class="card-text">
                  ${item.description}
                </p>
                <div class="d-flex align-items-center">
                    <p class="text-primary font-weight-bolder mb-0">
                        ???????????? ${item.group} ???
                    </p>
                    <p class="text-primary font-weight-bolder ml-auto h3 mb-0">
                        <small>TWD</small>
                        $${item.price}
                    </p>
                </div>
            </div>
        </div>
      </li>
    `
  })

  listDom.innerHTML = str
  nowSelectDom.innerHTML = `??????????????? ${filterData.length} ?????????`
}

function getForm () {
  const obj = {}
  if (formSelectDom.value === '' || textareaDom.value === '') return
  for (let i = 0; i < inputDom.length; i++) {
    if (inputDom[i].value === '') return
    obj[inputDom[i].id] = inputDom[i].value
  }
  obj.area = formSelectDom.value
  obj.description = textareaDom.value
  localData.push(obj)
  localStorage.setItem('newData', JSON.stringify(localData))
}

function addNewData () {
  localData.forEach(item => {
    data.push(item)
  })
}

function renderChart () {
  const totalArea = {}
  const chartData = []

  data.forEach(item => {
    totalArea[item.area] = totalArea[item.area] ? totalArea[item.area] + 1 : 1
  })

  const area = Object.keys(totalArea)
  area.forEach(item => {
    const ary = []
    ary.push(item)
    ary.push(totalArea[item])
    chartData.push(ary)
  })

  const chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: chartData,
      type: 'donut'
    },
    donut: {
      title: '??????'
    }
  })
}
