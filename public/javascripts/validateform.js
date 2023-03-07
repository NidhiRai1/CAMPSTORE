(function () {
    'use strict'
   
    const allForms = document.querySelectorAll(".validated-form")
   
    Array.from(allForms)
    .forEach(function(form){
      form.addEventListener('submit',function(evntObjct){
        if (!form.checkValidity()) {
          evntObjct.preventDefault()
          evntObjct.stopPropagation()
        }
   
        form.classList.add('was-validated')
      },false)
    })
  })()