// DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const messageEl = document.getElementById('message');
const tabBtns = document.querySelectorAll('.tab-btn');
const currentDateEl = document.getElementById('current-date');
const prevDayBtn = document.getElementById('prev-day');
const nextDayBtn = document.getElementById('next-day');
const datePickerToggle = document.getElementById('date-picker-toggle');
const calendarPopup = document.getElementById('calendar-popup');

// 현재 선택된 필터 및 날짜 상태
let currentFilter = 'all';
// 현재 선택된 날짜
let selectedDate = new Date();
let calendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

// 모든 Todo 데이터를 저장하는 배열
// 각 항목: { text: string, date: 'YYYY-MM-DD', completed: boolean }
let todos = [];

// localStorage 키
const STORAGE_KEY = 'todoAppData';

// 날짜 객체를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
function getDateKey(date) {
  // YYYY-MM-DD using local date components to avoid timezone shifts
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 날짜를 'YYYY년 MM월 DD일 (요일)' 형식으로 포맷팅하는 함수
function formatDisplayDate(date) {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });
}

// 현재 선택된 날짜 표시 업데이트
function updateCurrentDateDisplay() {
  currentDateEl.textContent = formatDisplayDate(selectedDate);
}

// 선택된 달을 기준으로 달력 그리기
function renderCalendar() {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = getDateKey(new Date());
  const selectedKey = getDateKey(selectedDate);

  const monthLabel = calendarMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  let html = '<div class="calendar-header">';
  html += '<button type="button" data-calendar-action="prev">◀</button>';
  html += `<div class="calendar-title">${monthLabel}</div>`;
  html += '<button type="button" data-calendar-action="next">▶</button>';
  html += '</div>';
  html += '<div class="calendar-grid">';
  ['일','월','화','수','목','금','토'].forEach(label => {
    html += `<div class="calendar-day-label">${label}</div>`;
  });
  for (let i = 0; i < startDay; i += 1) {
    html += '<div></div>';
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const dateKey = getDateKey(date);
    const isToday = dateKey === todayKey;
    const isSelected = dateKey === selectedKey;
    html += `<button type="button" class="calendar-day${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}" data-date="${dateKey}">${day}</button>`;
  }
  html += '</div>';

  calendarPopup.innerHTML = html;
}

// 캘린더 팝업 열기/닫기 및 날짜 선택 처리
function openCalendar() {
  calendarPopup.classList.add('active');
  calendarPopup.setAttribute('aria-hidden', 'false');
  renderCalendar();
}

// 캘린더 팝업 닫기
function closeCalendar() {
  calendarPopup.classList.remove('active');
  calendarPopup.setAttribute('aria-hidden', 'true');
}

// 토글 함수: 열려있으면 닫고, 닫혀있으면 연다
function toggleCalendar() {
  if (calendarPopup.classList.contains('active')) closeCalendar();
  else openCalendar();
}

// 캘린더에서 날짜 선택 처리
function selectCalendarDate(date) {
  // date is expected as 'YYYY-MM-DD' (dateKey). Parse using local components
  const parts = String(date).split('-').map(Number);
  // parts: [YYYY, MM, DD]
  selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
  calendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  updateCurrentDateDisplay();
  applyFilter(currentFilter);
  renderCalendar();
  closeCalendar();
}

// localStorage에 todos 배열 저장
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// localStorage에서 todos 배열 로드
function loadTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      todos = JSON.parse(data);
      // DOM에 기존 todos 복원
      todos.forEach(todo => {
        const todoEl = createTodoElement(todo.text, todo.date, todo.completed);
        todoList.appendChild(todoEl);
      });
    }
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    todos = [];
  }
}

// 사용자에게 메시지를 보여주는 함수
// type: 'info' | 'error'
function showMessage(text, type = 'info') {
  messageEl.textContent = text;
  if (type === 'error') {
    messageEl.style.color = '#e04b4b';
  } else {
    messageEl.style.color = '#666';
  }
  // 2초 후 자동으로 메시지 제거
  if (text) setTimeout(() => { messageEl.textContent = ''; }, 2000);
}

// 새로운 Todo 항목 DOM을 생성해서 반환한다.
function createTodoElement(text, dateKey, isCompleted = false) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.completed = isCompleted;
  li.dataset.date = dateKey;

  const span = document.createElement('span');
  span.className = 'todo-text';
  if (isCompleted) span.classList.add('completed');
  span.textContent = text;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'btn edit';
  editBtn.textContent = '수정';
  editBtn.dataset.action = 'edit';

  const doneBtn = document.createElement('button');
  doneBtn.className = 'btn done';
  doneBtn.textContent = isCompleted ? '해제' : '완료';
  doneBtn.dataset.action = 'toggle';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn delete';
  deleteBtn.textContent = '삭제';
    deleteBtn.dataset.action = 'delete';

  actions.append(editBtn, doneBtn, deleteBtn);
  li.append(span, actions);
  return li;
}

// 필터에 맞는 항목만 표시하는 함수
function applyFilter(filter) {
  const activeDateKey = getDateKey(selectedDate);
  const items = todoList.querySelectorAll('.todo-item');
  items.forEach(item => {
    const isCompleted = item.dataset.completed === 'true';
    const isSameDate = item.dataset.date === activeDateKey;
    let shouldShow = false;
    if (!isSameDate) {
      shouldShow = false;
    } else if (filter === 'all') {
      shouldShow = true;
    } else if (filter === 'active') {
      shouldShow = !isCompleted;
    } else if (filter === 'completed') {
      shouldShow = isCompleted;
    }
    item.style.display = shouldShow ? 'flex' : 'none';
  });
}


// Todo 추가 처리
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) {
    showMessage('할 일을 입력해주세요.', 'error');
    return;
  }

  const todoDateKey = getDateKey(selectedDate);
  // todos 배열에 추가
  todos.unshift({ text, date: todoDateKey, completed: false });
  saveTodos();
  
  const todoEl = createTodoElement(text, todoDateKey, false);
  todoList.prepend(todoEl); // 최신 항목을 맨 위에
  todoInput.value = '';
  todoInput.focus();
  applyFilter(currentFilter); // 필터 재적용
  showMessage('Todo가 추가되었습니다.');
}

// 이벤트 위임으로 리스트 내 버튼 클릭 처리
todoList.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const li = e.target.closest('li');
  if (!li) return;

  if (action === 'toggle') {
    // 완료 토글
    const textEl = li.querySelector('.todo-text');
    const doneBtn = li.querySelector('[data-action="toggle"]');
    const isCompleted = textEl.classList.toggle('completed');
    li.dataset.completed = isCompleted;
    doneBtn.textContent = isCompleted ? '해제' : '완료';
    
    // todos 배열에서 해당 항목 업데이트
    const todoText = textEl.textContent;
    const todoDate = li.dataset.date;
    const todoIdx = todos.findIndex(t => t.text === todoText && t.date === todoDate && t.completed !== isCompleted);
    if (todoIdx !== -1) {
      todos[todoIdx].completed = isCompleted;
      saveTodos();
    }
    
    applyFilter(currentFilter); // 필터 재적용
  }

  if (action === 'delete') {
    // 삭제
    const textEl = li.querySelector('.todo-text');
    const todoText = textEl.textContent;
    const todoDate = li.dataset.date;
    
    // todos 배열에서 제거
    const todoIdx = todos.findIndex(t => t.text === todoText && t.date === todoDate);
    if (todoIdx !== -1) {
      todos.splice(todoIdx, 1);
      saveTodos();
    }
    
    li.remove();
    showMessage('Todo가 삭제되었습니다.');
  }

  if (action === 'edit') {
    // 수정 모드로 전환: 텍스트를 input으로 대체하고 버튼을 저장으로 변경
    const textEl = li.querySelector('.todo-text');
    const currentText = textEl.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'todo-input-edit';
    input.dataset.completed = li.dataset.completed;
    input.dataset.originalText = currentText;
    input.dataset.todoDate = li.dataset.date;

    // 저장 버튼 생성
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn edit';
    saveBtn.textContent = '저장';
    saveBtn.dataset.action = 'save';

    // 기존 edit 버튼을 save로 대체
    const editBtn = li.querySelector('[data-action="edit"]');
    editBtn.replaceWith(saveBtn);

    // 텍스트 엘리먼트 대체
    textEl.replaceWith(input);
    input.focus();

    // Enter로 저장 가능
    input.addEventListener('keyup', (ev) => {
      if (ev.key === 'Enter') saveEditedTodo(li, input, saveBtn);
    });
    
    // save 버튼 클릭 처리 (이벤트 위임에서 처리하지 않음)
    saveBtn.addEventListener('click', () => saveEditedTodo(li, input, saveBtn));
  
    //직접 추가기능(자동 완성기능 이용)    
    // 포커스 잃었을 때도 저장(필요한걸까?)
    input.addEventListener('blur', () => saveEditedTodo(li, input, saveBtn)); 
    //esc입력시 편집 취소
    input.addEventListener('keyup', (ev) => {
      if (ev.key === 'Escape') {
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = currentText;
        if (input.dataset.completed === 'true') span.classList.add('completed');
        input.replaceWith(span);
        saveBtn.replaceWith(editBtn);
      } 
    });
    
}
});

// 편집 저장 함수
function saveEditedTodo(li, inputEl, saveBtn) {
  const newValue = inputEl.value.trim();
  if (!newValue) {
    showMessage('빈 값으로 저장할 수 없습니다.', 'error');
    inputEl.focus();
    return;
  }

  // 원본 텍스트와 날짜를 input.dataset에서 가져오기
  const prevText = inputEl.dataset.originalText;
  const todoDate = inputEl.dataset.todoDate;
  const isCompleted = li.dataset.completed === 'true';

  // todos 배열에서 해당 항목 업데이트
  const todoIdx = todos.findIndex(t => t.text === prevText && t.date === todoDate);
  if (todoIdx !== -1) {
    todos[todoIdx].text = newValue;
    saveTodos();
  }

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = newValue;

  // 현재 완료 상태 유지
  if (isCompleted) span.classList.add('completed');

  inputEl.replaceWith(span);

  // save 버튼을 다시 edit 버튼으로 교체
  const newEditBtn = document.createElement('button');
  newEditBtn.className = 'btn edit';
  newEditBtn.textContent = '수정';
  newEditBtn.dataset.action = 'edit';

  saveBtn.replaceWith(newEditBtn);
  showMessage('Todo가 수정되었습니다.');
}

// 날짜 이동 핸들러
function changeSelectedDate(offsetDays) {
  selectedDate.setDate(selectedDate.getDate() + offsetDays);
  updateCurrentDateDisplay();
  applyFilter(currentFilter);
}

// 추가 버튼 및 Enter 키에 대해 addTodo 바인딩
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addTodo();
});

prevDayBtn.addEventListener('click', () => changeSelectedDate(-1));
nextDayBtn.addEventListener('click', () => changeSelectedDate(1));

// 캘린더 팝업 이벤트 처리
datePickerToggle.addEventListener('click', (e) => {
  // Prevent the toggle click from bubbling to document click handler
  e.stopPropagation();
  toggleCalendar();
});
calendarPopup.addEventListener('click', (e) => {
  // Prevent clicks inside the popup from bubbling to document-level click
  e.stopPropagation();
  const target = e.target;
  if (target.dataset.calendarAction === 'prev') {
    calendarMonth.setMonth(calendarMonth.getMonth() - 1);
    renderCalendar();
    return;
  }
  if (target.dataset.calendarAction === 'next') {
    calendarMonth.setMonth(calendarMonth.getMonth() + 1);
    renderCalendar();
    return;
  }
  if (target.dataset.date) {
    selectCalendarDate(target.dataset.date);
  }
});
document.addEventListener('click', (e) => {
  if (!calendarPopup.contains(e.target) && !datePickerToggle.contains(e.target)) {
    closeCalendar();
  }
});

// 탭 필터 버튼 이벤트 처리
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 이전 active 제거
    tabBtns.forEach(b => b.classList.remove('active'));
    // 새 active 추가
    btn.classList.add('active');
    // 필터 변경
    currentFilter = btn.dataset.filter;
    applyFilter(currentFilter);
  });
});

// 초기 화면 세팅
updateCurrentDateDisplay();
loadTodos(); // localStorage에서 저장된 todos 복원
applyFilter(currentFilter);
