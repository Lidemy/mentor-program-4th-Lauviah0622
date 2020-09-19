/* eslint-disable linebreak-style, prefer-arrow-callback */

const listItemTEMPLATE = document.querySelector('.list-item').innerHTML;
const todoList = {};
todoList.tasks = [];
todoList.filterState = 'all';


todoList.element = document.querySelector('.list');

class Task {
  constructor(taskName, localStoredId, localStoredCheck) {
    const ids = todoList.tasks.map(e => e.id);
    let id = localStoredId || todoList.tasks.length;
    // 避免 ID 重複
    while (ids.includes(id)) {
      id += 1;
    }
    this.id = id;
    this.name = taskName;
    this.checked = localStoredCheck || false;
    this.element = this.createUIElement(this.nane, this.id, this.checked);
    this.show = true;
  }

  createUIElement() {
    const createEle = (taskName, id, done = false) => {
      const newEle = document.createElement('li');

      // set Attribute
      newEle.id = id;
      const classes = ['list-item', 'list-item--closed'];
      if (done) {
        classes.push('list-item--done');
      }
      newEle.classList.add(...classes);
      newEle.innerHTML = listItemTEMPLATE.replace(/{{name}}/g, escapeHtml(taskName) || '沒事就找事');

      // add Listener
      newEle.addEventListener('click', function itemBtnHandler(e) {
        const btnType = e.target.getAttribute('data-btn');
        if (!btnType) return; // not check or delete
        const taskEleId = todoList.findParentItemIndex(e.target);
        todoList[btnType](taskEleId);
      });
      newEle.addEventListener('input', function itemTitleHandler(e) {
        const taskEleId = todoList.findParentItemIndex(e.target);
        todoList.tasks.rename(taskEleId, e.target.innerText);
      });
      return newEle;
    };
    const element = createEle(this.name, this.id, this.checked);
    return element;
  }

  delete() {
    const i = todoList.tasks.findIndex(e => e.id === this.id);
    // 刪除 todoList.tasks 中的
    todoList.tasks.splice(i, 1);

    // 跑完特效在刪除(變超麻煩
    this.element.addEventListener('transitionend', (e) => {
      if (e.eventPhase !== 2 || !this.element) return;
      // 刪除 ui 上的 task
      todoList.element.removeChild(this.element);
      // 刪除 task 中的 element，不然因為 transitinoend 會被觸發多次所以會跳 error
      this.element = null;
    });
    this.element.classList.add('list-item--closed');
    return todoList.tasks;
  }

  setShow(isShow) {
    this.show = isShow;
    if (this.show) {
      this.element.classList.remove('list-item--closed');
    } else {
      this.element.classList.add('list-item--closed');
    }
    return this;
  }

  check() {
    this.checked = !this.checked;
    if (this.checked) {
      this.element.classList.add('list-item--done');
    } else {
      this.element.classList.remove('list-item--done');
    }
    // todoList.renderTask()
    return this;
  }

  rename(newname) {
    this.name = escapeHtml(newname);
    return this;
  }
};

todoList.createTask = (name, id, checked) => {
  const task = new Task(name, id, checked);
  todoList.tasks.push(task);
  todoList.element.appendChild(task.element);
  setTimeout(() => {
    task.element.classList.remove('list-item--closed');
  });

  todoList.saveLocalStorage();
};

todoList.initialUITask = () => {
  // clear child
  todoList.element.innerHTML = '';

  // append child
  for (let i = 0; i < todoList.tasks.length; i += 1) {
    const taskElement = todoList.tasks[i].element;
    todoList.element.appendChild(taskElement);
    setTimeout(() => {
      taskElement.classList.remove('list-item--closed');
    });
  }
  return todoList;
};

todoList.findParentItemIndex = (DOMelement) => {
  const parentItem = DOMelement.closest('.list-item');
  return parentItem.id || null;
};

todoList.delete = (num) => {
  const i = todoList.tasks.findIndex(e => e.id === +num);
  if (i < 0) return 'no element';
  todoList.tasks[i].delete();

  todoList.saveLocalStorage();
  return todoList;
};

todoList.check = (num) => {
  const i = todoList.tasks.findIndex(e => e.id === +num);
  if (i < 0) return 'no element';
  todoList.tasks[i].check();

  todoList.saveLocalStorage();
  return todoList;
};

todoList.rename = (num, name) => {
  const i = todoList.tasks.findIndex(e => e.id === +num);
  if (i < 0) return 'no element';
  todoList.tasks[i].rename(name);

  todoList.saveLocalStorage();
  return todoList;
};

todoList.saveLocalStorage = () => {
  const data = JSON.stringify(todoList.tasks.map(e => ({
    name: e.name,
    id: e.id,
    checked: e.checked,
  })));
  localStorage.setItem('todolist', data);
  return todoList;
};

todoList.syncLocalStorage = (json) => {
  const data = (function () {

    try {
      return JSON.parse(json);
    } catch (e) {
      return new Error('localstorage parse ERROR');
    }
  }());
  if (!data) {
    (function test() {
      for (let i = 0; i < 5; i += 1) {
        todoList.createTask(`test_${i}`);
      }
    }());
  } else {
    data.forEach(e => {
      todoList.createTask(e.name, e.id, e.checked);
    });

  }
  return todoList;
};

todoList.clean = () => {

  todoList.tasks.filter(task => task.checked === true)
    .map(checkedTask => checkedTask.id)
    .forEach(checkedTaskId => todoList.delete(checkedTaskId));

}

todoList.filter = (mode) => {
  if (todoList.filterState === mode) {
    todoList.filterState = 'all';
  } else {
    todoList.filterState = mode;
  }
  switch (todoList.filterState) {
    case "all":
      todoList.tasks.forEach(task => {
        task.setShow(true);

        // ui
        $('.filter').each(function () {
          $(this).removeClass('filter--selected');
        })
      });
      break;
    case "check":
      todoList.tasks.forEach(task => {
        if (task.checked) {
          task.setShow(true);
        } else {
          task.setShow(false);
        }

        // ui
        $('.filter').each(function () {
          $(this).removeClass('filter--selected');
        })
        $('#filter-checked').addClass('filter--selected');
      });
      break;
    case "uncheck":
      todoList.tasks.forEach(task => {
        if (!task.checked) {
          task.setShow(true);
        } else {
          task.setShow(false);
        }

        // ui
        $('.filter').each(function () {
          $(this).removeClass('filter--selected');
        })
        $('#filter-unchecked').addClass('filter--selected');
      });
      break;
  }
}

todoList.save = () => {
  popup('saving, wait a minite');
  const data = JSON.stringify(todoList.tasks.map(e => ({
    name: e.name,
    id: e.id,
    checked: e.checked,
  })));

  $.ajax({
    url: 'http://mentor-program.co/mtr04group1/Lauviah/week12/hw2/todo.php',
    data: {
      json: data
    },
    dataType: "json",
    method: "POST",
    success: (data) => {
      let url = 'http://mentor-program.co/mtr04group1/Lauviah/week12/hw2/?id=' + data.insert_id;
      copy (url);
      popup('Saving Success!! Link have been copy to yuor clipboard');
      setTimeout(() => popup(false), 500);
      console.log(url);
    }
  })
}

function addTaskButtonHandeler() {
  const input = document.querySelector('.input__blank');
  const {
    value,
  } = input;
  input.value = '';
  todoList.createTask(value);
}


(function () {
  document.querySelector('.input__blank').addEventListener('keydown', (e) => {
    if (e.code !== 'Enter') return;
    addTaskButtonHandeler();
  });
  $('.input__button').click(addTaskButtonHandeler);

  $('#filter-checked').click(function () {
    todoList.filter('check');
  });

  $('#filter-unchecked').click(function () {
    todoList.filter('uncheck');
  });

  $('#delete').click(function () {
    todoList.clean();
  })

  $('#save').click(function () {
    todoList.save();
  })


  const urlStr = window.location.href;
  const url = new URL(urlStr);
  const id = url.searchParams.get('id');
  popup("loading...");
  if (id) {
    // console.log(213123);
    $.ajax({
      url: 'http://mentor-program.co/mtr04group1/Lauviah/week12/hw2/todo.php?id=' + id,
      metohd: 'GET',
      success: (data) => {
        console.log(data);
        if (!data.ok) {
          const json = localStorage.getItem('todolist');
          todoList.syncLocalStorage(json);
        } else {
          todoList.syncLocalStorage(data.content.json);
        } 
        popup(false);
      },

    })
  } else {
    const json = localStorage.getItem('todolist');
    todoList.syncLocalStorage(json);
    popup(false);

  }

  todoList.initialUITask();
})()

function copy (content) {
  const copyEle = document.querySelector('#for-copy');
  console.log(copyEle);
  copyEle.value = content;
  copyEle.focus();
  copyEle.select();
  console.log(copyEle.value);
  document.execCommand('copy');
  
}

function popup(msg) {
  const popup = $(".popup");
  if (!msg) {
    popup.fadeOut();
    return 
  }
  popup.text(msg);
  popup.show()
  
}

function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}
