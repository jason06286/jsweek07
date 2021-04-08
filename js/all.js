// BootStrap Validation
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();


let url='https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json'
let data
let localData=JSON.parse(localStorage.getItem('newData')) || []

const listDom=document.querySelector('[data-list]')
const selectDom=document.querySelector('[data-select]')
const nowSelectDom=document.querySelector('[data-nowSelect]')
const btnDom=document.querySelector('[data-btn]')
const inputDom= document.querySelectorAll('input')
const formSelectDom=document.querySelector('[data-formSelect]')
const textareaDom=document.querySelector('[data-textarea]')


getData()


btnDom.addEventListener('click',getForm)

selectDom.addEventListener('change',function (e) {
  render(e.target.value)
})

function getData() {
  axios.get(url)
  .then((res)=>{
    data=res.data
    addNewData()
    renderChart()
    render()
  })
}


function render(location) {
  if(location!=undefined){
    let str=''
    let sum=0
      data.forEach(item => {
        if(item.area==location){
          sum++;
          str+=`
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
                                      剩下最後 ${item.group} 組
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
        }
      });
    nowSelectDom.innerHTML=`本次搜尋共 ${sum} 筆資料`
    listDom.innerHTML=str
  }else{
    let str=''
      data.forEach(item => {
        str+=`
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
                                    剩下最後 ${item.group} 組
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
      });
    listDom.innerHTML=str
    nowSelectDom.innerHTML=`本次搜尋共 ${data.length} 筆資料`
  }
}


function getForm() {
  let obj={}
  if (formSelectDom.value=='' || textareaDom.value=='')return
  for (let i = 0; i < inputDom.length; i++) {
    console.log(inputDom)
    if (inputDom[i].value=='')return
    console.log(inputDom[i]['id'])
    console.log(inputDom[i].value)
    obj[inputDom[i]['id']]=inputDom[i].value
  }
  obj.area=formSelectDom.value
  obj.description=textareaDom.value
  localData.push(obj)
  localStorage.setItem('newData',JSON.stringify(localData))
}


function addNewData() {
  localData.forEach(item=>{
    data.push(item)
  })
}

function renderChart() {
  let totalArea={}
  let chartData=[]
  let area
  
  data.forEach(item=>{
    totalArea[item.area] = totalArea[item.area] ? totalArea[item.area] + 1 : 1;
  })

  area=Object.keys(totalArea)
  area.forEach(item=>{
    let ary=[]
    ary.push(item)
    ary.push(totalArea[item])
    chartData.push(ary)
  })

  let chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: chartData,
      type : 'donut',
    },
    donut: {
      title: "地區"
    }
  });

}

