console.log('123123');
function addChecked (){
    const optionInputs = document.querySelectorAll('[data-default] > input');
    Array.from(optionInputs).forEach(input => {
        if (input.value === input.parentElement.getAttribute('data-default')) {
            input.checked = true;
        }
    })
}

addChecked();