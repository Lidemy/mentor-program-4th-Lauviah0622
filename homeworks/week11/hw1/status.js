let a = document.querySelector('.status > form');
const TEMPLATE = document.querySelector('#template').innerHTML;
(function addListener () {
    renderStatus();

    const addBtn = document.querySelector('input[data-method=add]');
    addBtn.addEventListener('click', addStatus);

    document.querySelector('#template').parentElement.removeChild(template);
})()

function renderStatus() {
    const target = document.querySelector('#render_target');
    target.innerHTML = '';

    const req = new XMLHttpRequest();
    req.open('GET', "http://mentor-program.co/mtr04group1/Lauviah/week11/hw1/status_api.php", true);
    req.onload = (e) => {
        data = JSON.parse(req.response).content;
        data.forEach(statusData => {
            const replacer = {
                id: statusData.status_id,
                name: statusData.name,
                add: statusData.can_add_comment === "1" ? "true" : "false",
                delete: statusData.can_delete_comment,
                edit: statusData.can_edit_comment,
                status: statusData.can_set_status,
            }
            const content = replaceTemplate(TEMPLATE, replacer);
            const div = document.createElement('div');
            div.classList.add('status');
            div.innerHTML = content;
            target.appendChild(div);
            div.children[0].children[3].addEventListener('click', editStatus);
            div.children[0].children[4].addEventListener('click', deleteStatus);
             
        })
        updateStatus();
        
        // console.dir(container);
    }

    req.send();
}

function replaceTemplate (template, replacer) {
    let content = template;
    Object.entries(replacer).forEach(([target, value]) => {
        content = content.replace('{{'+ target +'}}', value);
    })
    return content;
}





function getEditData(form) {
    console.dir(form);
    console.log(form.elements['add'].value);
    
    const data = {
        name: form.elements['name'].value,
        'can_add_comment': form.elements['add'].checked ? 1 : 0,
        'can_edit_comment': form.elements['edit'].value,
        'can_delete_comment': form.elements['delete'].value,
        'can_set_status': form.elements['status'].value,
    }
    if (form.elements['id']) {
        data.id = form.elements['id'].value;
    }
    
    return data

}

function editStatus (e) {
    e.preventDefault();
    const form = this.parentElement;
    
    
    data = getEditData(form);
    reqBody = Object.entries(data).map(([key, value]) => {
        return `${key}=${value}`
    }).join('&');
    console.log(reqBody)
    const req = new XMLHttpRequest();
    req.open("PATCH", "http://mentor-program.co/mtr04group1/Lauviah/week11/hw1/status_api.php", true);
    req.onload = (e) => {
        
        // 有點忘記怎麼判斷 http status 了，先放著，之後再去看第六周作業補上
        console.log(JSON.parse(req.response));
        location.reload();
    }
    req.send(reqBody);
    
}

function deleteStatus (e) {
    e.preventDefault();
    const id = this.parentElement.elements['id'].value;
    console.log(id);
    const req = new XMLHttpRequest();
    url = 'http://mentor-program.co/mtr04group1/Lauviah/week11/hw1/status_api.php?id=' + id;
    req.open("DELETE", url);
    req.onload = (e) => {
        
        console.log(JSON.parse(req.response));
        location.reload();
    }
    req.send();

} 

function addStatus (e) {
    e.preventDefault();
    const form = this.parentElement;
    data = getEditData(form);
    if (data.name.lenfth === 0) {
        // 加上去沒有輸入名子怎麼半
    }
    reqBody = Object.entries(data).map(([key, value]) => {
        return `${key}=${value}`
    }).join('&');
    console.log(reqBody);
    const req = new XMLHttpRequest();
    req.open("POST", "http://mentor-program.co/mtr04group1/Lauviah/week11/hw1/status_api.php", true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onload = (e) => {
        
        // 有點忘記怎麼判斷 http status 了，先放著，之後再去看第六周作業補上
        // console.log(JSON.parse(req.response));
        console.log(req.response);
        location.reload();

    }
    req.send(reqBody);
}

function updateStatus (){
    
    const options = document.querySelectorAll('[data-default] option');
    Array.from(options).forEach(option => {
        if (option.value === option.parentElement.getAttribute('data-default')) {
            option.selected = true;
        }
    })

    const checkboxes  = document.querySelectorAll('[type=checkbox]');
    Array.from(checkboxes).forEach(checkbox => {
        console.log(checkbox.getAttribute('data-default'));
        if (checkbox.getAttribute('data-default') === "true") {
            checkbox.checked = true;
            console.log(checkbox.checked);
        }
    })}

const status  = {
    edit: editStatus,

}


// funciton sendReq

