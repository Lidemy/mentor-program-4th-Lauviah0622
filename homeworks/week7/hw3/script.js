/* eslint-disable linebreak-style, prefer-arrow-callback */

const listItemTEMPLATE = document.querySelector('.list-item').innerHTML;
const todoList = [];

todoList.element = document.querySelector('.list');

todoList.createTask = (name) => {
  const Task = class {
    constructor(taskName) {
      // console.log('new task create!!');
      this.id = todoList.length;
      this.name = taskName;
      this.checked = false;
      this.element = this.createUIElement();
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
        newEle.innerHTML = listItemTEMPLATE.replace(/{{name}}/g, taskName || '沒事就找事');

        // add Listener
        newEle.addEventListener('click', function itemBtnHandler(e) {
          const btnType = e.target.getAttribute('data-btn');
          if (!btnType) return; // not check or delete
          const taskEleId = todoList.findParentItemIndex(e.target);
          todoList[btnType](taskEleId);
        });
        newEle.addEventListener('input', function itemTitleHandler(e) {
          const taskEleId = todoList.findParentItemIndex(e.target);
          todoList.rename(taskEleId, e.target.innerText);
        });
        return newEle;
      };

      const element = createEle(this.name, this.id, this.done);
      return element;
    }

    delete() {
      const i = todoList.findIndex(e => e.id === this.id);
      // 刪除 todoList 中的
      todoList.splice(i, 1);

      // 跑完特效在刪除(變超麻煩
      this.element.addEventListener('transitionend', (e) => {
        if (e.eventPhase !== 2 || !this.element) return;

        // 刪除 ui 上的 task
        todoList.element.removeChild(this.element);
        // 刪除 task 中的 element，不然因為 transitinoend 會被觸發多次所以會跳 error
        this.element = null;
      });
      this.element.classList.add('list-item--closed');
      return todoList;
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
      this.name = newname;
      return this;
    }
  };

  const task = new Task(name);
  todoList.push(task);
  todoList.element.appendChild(task.element);
  setTimeout(() => {
    task.element.classList.remove('list-item--closed');
  });
};

todoList.initialUITask = () => {
  // clear child
  todoList.element.innerHTML = '';

  // append child
  for (let i = 0; i < todoList.length; i += 1) {
    const taskElement = todoList[i].element;
    console.log(taskElement);
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
  const i = todoList.findIndex(e => e.id === +num);
  if (i < 0) return 'no element';
  todoList[i].delete();
  return todoList;
};

todoList.check = (num) => {
  const i = todoList.findIndex(e => e.id === +num);
  if (i < 0) return 'no element';
  todoList[i].check();
  return todoList;
};

todoList.rename = (num, name) => {
  const i = todoList.findIndex(e => e.id === +num);
  if (i < 0) return 'no element';
  todoList[i].rename(name);
  return todoList;
};


(function test() {
  for (let i = 0; i < 5; i += 1) {
    todoList.createTask(i);
  }
}());


function addTaskButtonHandeler() {
  const input = document.querySelector('.input__blank');
  const { value } = input;
  input.value = '';
  todoList.createTask(value);
}

document.querySelector('.input__blank').addEventListener('keydown', (e) => {
  if (e.code !== 'Enter') return;
  addTaskButtonHandeler();
});

document.querySelector('.input__button').addEventListener('click', addTaskButtonHandeler);

todoList.initialUITask();
