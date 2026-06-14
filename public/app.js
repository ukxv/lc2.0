'use strict';
// ═══ STATE
const S={user:null,token:localStorage.getItem('imkon_token'),lang:localStorage.getItem('imkon_lang')||'ru',theme:localStorage.getItem('imkon_theme')||'dark',nav:null,weekOffset:0,calMonth:null,calYear:null,calGroupId:null};

// ═══ THEME
function applyTheme(t){S.theme=t;document.documentElement.setAttribute('data-theme',t);localStorage.setItem('imkon_theme',t);document.querySelectorAll('.theme-toggle').forEach(b=>b.textContent=t==='dark'?'☀️':'🌙');}
function toggleTheme(){applyTheme(S.theme==='dark'?'light':'dark');}
window.toggleTheme=toggleTheme;
applyTheme(S.theme);

// ═══ TRANSLATIONS
const T={
ru:{login:'Войти',username:'Логин',password:'Пароль',logout:'Выйти',home:'Главная',schedule:'Расписание',events:'Ивенты',shop:'Магазин',profile:'Профиль',calendar:'Календарь',dashboard:'Панель',users:'Пользователи',groups:'Группы',balance:'Баланс',orders:'Заказы',revenues:'Доходы',announcements:'Новости',exams:'Экзамены',students:'Студенты',teachers:'Учителя',add:'Добавить',edit:'Редактировать',delete:'Удалить',save:'Сохранить',cancel:'Отмена',close:'Закрыть',name:'Имя',role:'Роль',phone:'Телефон',subject:'Предмет',teacher:'Учитель',student:'Студент',room:'Кабинет',day:'День',time:'Время',days:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],daysLong:['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'],months:['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],monthsFull:['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],topic:'Тема',homework:'Домашнее задание',present:'Присутствовал',absent:'Отсутствовал',excused:'По причине',not_marked:'Не отмечено',coins:'Коины',price:'Цена',description:'Описание',available:'Доступен',status:'Статус',pending:'Ожидает',confirmed:'Подтверждён',delivered:'Доставлен',cancelled:'Отменён',orderNumber:'№ заказа',topUp:'Пополнить баланс',amount:'Сумма',resetMonth:'Сбросить месяц',totalStudents:'Всего студентов',totalTeachers:'Всего учителей',totalGroups:'Всего групп',centerRevenue:'Выручка центра',teacherRevenue:'Выручка учителей',income:'Доход',image:'Фото',myOrders:'Мои заказы',orderNow:'Заказать',pickupMsg:'Заберите товар на ресепшне, номер заказа:',rate:'Ставка (%)',myGroups:'Мои группы',myCourses:'Мои курсы',progress:'Прогресс',greeting:'Добро пожаловать,',hwScore:'Домашняя работа (0–10)',actScore:'Активность (0–10)',saveGrades:'Сохранить оценки',noLessons:'Нет уроков на этой неделе',venue:'Место',capacity:'Мест',registered:'Записалось',register:'Записаться',unregister:'Отписаться',noSpots:'Мест нет',eventDate:'Дата',eventTime:'Время',support:'Поддержка',changePassword:'Изменить пароль',language:'Язык',theme:'Тема',oldPassword:'Старый пароль',newPassword:'Новый пароль',todayLessons:'Уроки сегодня',myStudents:'Студенты',news:'Объявления',contacts:'Контакты',tgSupport:'Чат поддержки',tgChannel:'Telegram канал',instagram:'Instagram',generate:'Генерировать уроки',pattern:'Дни недели',deleteConfirm:'Удалить? Необратимо.',link:'Ссылка',content:'Содержание',allStudents:'Все студенты',forGroup:'Для группы',noData:'Нет данных',sumLabel:'сум',adminTitle:'Администратор',teacherTitle:'Учитель',studentTitle:'Студент',attendanceTitle:'Посещаемость',currentMonth:'Текущий месяц',history:'История',spotsLeft:'мест',alreadyRegistered:'Записан',registrations:'Записавшиеся',examTitle:'Название экзамена',maxScore:'Максимальный балл',passScore:'Проходной балл',examResults:'Результаты',myExam:'Мой экзамен',upcoming:'Предстоящий',past:'Прошедший',passed:'Сдал',failed:'Не сдал',score:'Балл',setResults:'Выставить баллы',deleteLesson:'Удалить урок',deleteMonth:'Удалить месяц',mon:'Пн',tue:'Вт',wed:'Ср',thu:'Чт',fri:'Пт',sat:'Сб',sun:'Вс',darkTheme:'Тёмная',lightTheme:'Светлая',group:'Группа',lesson:'Урок',date:'Дата'},
uz:{login:'Kirish',username:'Login',password:'Parol',logout:'Chiqish',home:'Asosiy',schedule:'Jadval',events:'Tadbirlar',shop:"Do'kon",profile:'Profil',calendar:'Kalendar',dashboard:'Boshqaruv',users:'Foydalanuvchilar',groups:'Guruhlar',balance:'Balans',orders:'Buyurtmalar',revenues:'Daromadlar',announcements:"E'lonlar",exams:'Imtihonlar',students:'Talabalar',teachers:"O'qituvchilar",add:"Qo'shish",edit:'Tahrirlash',delete:"O'chirish",save:'Saqlash',cancel:'Bekor',close:'Yopish',name:'Ism',role:'Rol',phone:'Telefon',subject:'Fan',teacher:"O'qituvchi",student:'Talaba',room:'Xona',day:'Kun',time:'Vaqt',days:['Du','Se','Ch','Pa','Ju','Sh','Ya'],daysLong:['Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba','Yakshanba'],months:['Yan','Fev','Mar','Apr','May','Iyu','Iyl','Avg','Sen','Okt','Noy','Dek'],monthsFull:['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],topic:'Mavzu',homework:'Uyga vazifa',present:'Keldi',absent:'Kelmadi',excused:'Sababli',not_marked:'Belgilanmagan',coins:'Koinlar',price:'Narx',description:'Tavsif',available:'Mavjud',status:'Status',pending:'Kutilmoqda',confirmed:'Tasdiqlangan',delivered:'Yetkazilgan',cancelled:'Bekor',orderNumber:'Buyurtma №',topUp:"Balansni to'ldirish",amount:'Miqdor',resetMonth:'Tiklash',totalStudents:'Jami talabalar',totalTeachers:"Jami o'qituvchilar",totalGroups:'Jami guruhlar',centerRevenue:'Markaz daromadi',teacherRevenue:"O'qituvchi daromadi",income:'Daromad',image:'Rasm',myOrders:'Buyurtmalarim',orderNow:'Buyurtma',pickupMsg:'Tovarni retseptsiyadan oling:',rate:'Stavka (%)',myGroups:'Guruhlarim',myCourses:'Kurslarim',progress:'Rivojlanish',greeting:'Xush kelibsiz,',hwScore:'Uy vazifasi (0–10)',actScore:'Faollik (0–10)',saveGrades:'Saqlash',noLessons:"Bu haftada dars yo'q",venue:'Joyi',capacity:"O'rin",registered:'Yozilgan',register:'Yozilish',unregister:'Bekor',noSpots:"O'rin yo'q",eventDate:'Sana',eventTime:'Vaqt',support:'Yordam',changePassword:"Parolni o'zgartirish",language:'Til',theme:'Mavzu',oldPassword:'Eski parol',newPassword:'Yangi parol',todayLessons:'Bugungi darslar',myStudents:'Talabalar',news:"E'lonlar",contacts:'Kontaktlar',tgSupport:'Yordam chati',tgChannel:'Telegram kanal',instagram:'Instagram',generate:'Darslar yaratish',pattern:'Hafta kunlari',deleteConfirm:"O'chirilsinmi?",link:'Havola',content:'Mazmun',allStudents:'Barcha talabalar',forGroup:'Guruh uchun',noData:"Ma'lumot yo'q",sumLabel:"so'm",adminTitle:'Administrator',teacherTitle:"O'qituvchi",studentTitle:'Talaba',attendanceTitle:'Davomat',currentMonth:'Joriy oy',history:'Tarix',spotsLeft:"o'rin",alreadyRegistered:'Yozilgansiz',registrations:"Ro'yxat",examTitle:'Imtihon nomi',maxScore:'Maksimal ball',passScore:'Oʻtish balli',examResults:'Natijalar',myExam:'Imtihon',upcoming:'Kelgusi',past:'Oʻtgan',passed:'Topshirdi',failed:'Topshirmadi',score:'Ball',setResults:'Ball qoʻyish',deleteLesson:'Darsni oʻchirish',deleteMonth:'Oyni oʻchirish',mon:'Du',tue:'Se',wed:'Ch',thu:'Pa',fri:'Ju',sat:'Sh',sun:'Ya',darkTheme:'Qoʻngʻir',lightTheme:'Yorqin',group:'Guruh',lesson:'Dars',date:'Sana'},
en:{login:'Login',username:'Username',password:'Password',logout:'Logout',home:'Home',schedule:'Schedule',events:'Events',shop:'Shop',profile:'Profile',calendar:'Calendar',dashboard:'Dashboard',users:'Users',groups:'Groups',balance:'Balance',orders:'Orders',revenues:'Revenue',announcements:'News',exams:'Exams',students:'Students',teachers:'Teachers',add:'Add',edit:'Edit',delete:'Delete',save:'Save',cancel:'Cancel',close:'Close',name:'Name',role:'Role',phone:'Phone',subject:'Subject',teacher:'Teacher',student:'Student',room:'Room',day:'Day',time:'Time',days:['Mo','Tu','We','Th','Fr','Sa','Su'],daysLong:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],monthsFull:['January','February','March','April','May','June','July','August','September','October','November','December'],topic:'Topic',homework:'Homework',present:'Present',absent:'Absent',excused:'Excused',not_marked:'Not marked',coins:'Coins',price:'Price',description:'Description',available:'Available',status:'Status',pending:'Pending',confirmed:'Confirmed',delivered:'Delivered',cancelled:'Cancelled',orderNumber:'Order #',topUp:'Top Up',amount:'Amount',resetMonth:'Reset Month',totalStudents:'Total Students',totalTeachers:'Total Teachers',totalGroups:'Total Groups',centerRevenue:'Center Revenue',teacherRevenue:'Teacher Revenue',income:'Revenue',image:'Image',myOrders:'My Orders',orderNow:'Order',pickupMsg:'Pick up at reception, order number:',rate:'Rate (%)',myGroups:'My Groups',myCourses:'My Courses',progress:'Progress',greeting:'Welcome,',hwScore:'Homework (0–10)',actScore:'Activity (0–10)',saveGrades:'Save Grades',noLessons:'No lessons this week',venue:'Venue',capacity:'Capacity',registered:'Registered',register:'Register',unregister:'Unregister',noSpots:'No spots',eventDate:'Date',eventTime:'Time',support:'Support',changePassword:'Change Password',language:'Language',theme:'Theme',oldPassword:'Old Password',newPassword:'New Password',todayLessons:"Today's Lessons",myStudents:'Students',news:'Announcements',contacts:'Contacts',tgSupport:'Support Chat',tgChannel:'Telegram Channel',instagram:'Instagram',generate:'Generate Lessons',pattern:'Days of Week',deleteConfirm:'Delete? Cannot be undone.',link:'Link',content:'Content',allStudents:'All Students',forGroup:'For Group',noData:'No data',sumLabel:'sum',adminTitle:'Administrator',teacherTitle:'Teacher',studentTitle:'Student',attendanceTitle:'Attendance',currentMonth:'Current Month',history:'History',spotsLeft:'spots',alreadyRegistered:'Registered',registrations:'Registrations',examTitle:'Exam Title',maxScore:'Max Score',passScore:'Pass Score',examResults:'Results',myExam:'Exam',upcoming:'Upcoming',past:'Past',passed:'Passed',failed:'Failed',score:'Score',setResults:'Set Results',deleteLesson:'Delete Lesson',deleteMonth:'Delete Month',mon:'Mo',tue:'Tu',wed:'We',thu:'Th',fri:'Fr',sat:'Sa',sun:'Su',darkTheme:'Dark',lightTheme:'Light',group:'Group',lesson:'Lesson',date:'Date'}
};
const tr=k=>T[S.lang]?.[k]??T.ru[k]??k;

// ═══ API
async function api(method,path,body=null){
  const opts={method,headers:{'Content-Type':'application/json',...(S.token?{'Authorization':'Bearer '+S.token}:{})}};
  if(body)opts.body=JSON.stringify(body);
  try{const r=await fetch(path,opts);const d=await r.json();if(!r.ok){toast(d.error||'Error','error');return null;}return d;}
  catch{toast('Network error','error');return null;}
}

// ═══ UTILS
function toast(msg,type='info'){const el=document.createElement('div');el.className=`toast toast-${type}`;el.textContent=msg;document.getElementById('toasts').appendChild(el);setTimeout(()=>el.remove(),3500);}
function showModal(html,opts={}){const ov=document.getElementById('modal-overlay');const m=document.getElementById('modal');m.innerHTML=`<span class="modal-handle"></span>${html}`;m.className='modal'+(opts.desktop?' desktop':'');ov.className='modal-overlay'+(opts.desktop?' center':'');ov.classList.remove('hidden');}
function closeModal(){document.getElementById('modal-overlay').classList.add('hidden');}
window.closeModal=closeModal;window.closeModalOutside=e=>{if(e.target.id==='modal-overlay')closeModal();};
function mH(t){return`<div class="modal-header"><h2>${t}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>`;}
function mB(h){return`<div class="modal-body">${h}</div>`;}
function mF(h){return`<div class="modal-footer">${h}</div>`;}
function v(id){return(document.getElementById(id)?.value||'').trim();}
function fmt(n){return Number(n||0).toLocaleString('ru-RU');}
function esc(s){return String(s||'').replace(/'/g,"\\'").replace(/"/g,'&quot;');}
function fmtDate(d){if(!d)return'';try{return new Date(d).toLocaleDateString('ru-RU');}catch{return d;}}
function loader(){return`<div class="loader"><div class="spin"></div></div>`;}
function empty(icon,msg){return`<div class="empty-state"><div class="empty-icon">${icon}</div>${msg}</div>`;}
function statusBadge(s){const m={pending:'badge-warn',confirmed:'badge-info',delivered:'badge-success',cancelled:'badge-gray'};return`<span class="badge ${m[s]||'badge-gray'}">${tr(s)}</span>`;}
function attPill(s){return`<span class="att-pill att-${s||'not_marked'}">${tr(s||'not_marked')}</span>`;}
function todayStr(){return new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Tashkent'});}
function getWeekDates(offset=0){const now=new Date();const dow=now.getDay();const mon=new Date(now);mon.setDate(now.getDate()-(dow===0?6:dow-1)+offset*7);mon.setHours(0,0,0,0);return Array.from({length:7},(_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return d.toISOString().slice(0,10);});}
function weekLabel(offset){const dates=getWeekDates(offset);const f=d=>{const dt=new Date(d);return`${dt.getDate()} ${tr('months')[dt.getMonth()]}`;};return`${f(dates[0])} – ${f(dates[6])}`;}
window.setLang=function(l){S.lang=l;localStorage.setItem('imkon_lang',l);navigate(S.nav);};
window.doLogout=function(){S.token=null;S.user=null;localStorage.removeItem('imkon_token');['mobile-app','admin-app'].forEach(id=>document.getElementById(id).classList.add('hidden'));showLoginPage();};

// ═══ NAVIGATE
window.navigate=function(id){S.nav=id;if(S.user.role==='admin')navAdmin(id);else if(S.user.role==='teacher')navTeacher(id);else navStudent(id);};

// ═══ MOBILE HEADER
function setMH(title,right=''){document.getElementById('m-header').innerHTML=`<div class="m-header-logo"><div class="m-logo-box">I</div><span class="m-logo-text">${title}</span></div><div class="m-header-right">${right}</div>`;}
function setMC(html){document.getElementById('m-content').innerHTML=html;}
function langSw(){return`<div style="display:flex;gap:3px">${['ru','uz','en'].map(l=>`<button class="lang-btn ${S.lang===l?'active':''}" onclick="setLang('${l}')">${l.toUpperCase()}</button>`).join('')}</div>`;}
function themeBtn(){return`<button class="theme-toggle" onclick="toggleTheme()">${S.theme==='dark'?'☀️':'🌙'}</button>`;}

// ═══ NAV ITEMS
const SNAV=()=>[{id:'home',icon:'🏠',label:tr('home')},{id:'schedule',icon:'📅',label:tr('schedule')},{id:'calendar',icon:'📆',label:tr('calendar')},{id:'events',icon:'🎉',label:tr('events')},{id:'shop',icon:'🛒',label:tr('shop')},{id:'profile',icon:'👤',label:tr('profile')}];
const TNAV=()=>[{id:'home',icon:'🏠',label:tr('home')},{id:'schedule',icon:'📅',label:tr('schedule')},{id:'calendar',icon:'📆',label:tr('calendar')},{id:'events',icon:'🎉',label:tr('events')},{id:'profile',icon:'👤',label:tr('profile')}];

function setupMNav(items){document.getElementById('m-nav').innerHTML=items.map(i=>`<button class="m-nav-item ${S.nav===i.id?'active':''}" onclick="navigate('${i.id}')"><div class="m-nav-icon${S.nav===i.id?' m-nav-icon-bg':''}">${i.icon}</div><span>${i.label}</span></button>`).join('');}

function navTeacher(id){setupMNav(TNAV());setMH('Imkon LC',themeBtn()+langSw());setMC(loader());({home:showTHome,schedule:showTSchedule,calendar:()=>showCalendar('teacher'),events:showTEvents,profile:showTProfile}[id]||showTHome)();}
function navStudent(id){setupMNav(SNAV());setMH('Imkon LC',themeBtn()+langSw());setMC(loader());({home:showSHome,schedule:showSSched,calendar:()=>showCalendar('student'),events:showSEvents,shop:showSShop,profile:showSProfile,orders:showSOrders}[id]||showSHome)();}

// ═══ ADMIN LAYOUT
const ANAV=()=>[{id:'dashboard',icon:'📊',label:tr('dashboard')},{id:'users',icon:'👥',label:tr('users')},{id:'groups',icon:'📚',label:tr('groups')},{id:'schedules',icon:'📅',label:tr('schedule')},{id:'balance',icon:'💳',label:tr('balance')},{id:'shop',icon:'🛒',label:tr('shop')},{id:'orders',icon:'📦',label:tr('orders')},{id:'revenues',icon:'💰',label:tr('revenues')},{id:'events',icon:'🎉',label:tr('events')},{id:'announcements',icon:'📢',label:tr('announcements')}];
function setupASidebar(){document.getElementById('a-sidebar').innerHTML=`<div class="a-logo"><div class="a-logo-box">I</div><span class="a-logo-text">Imkon LC</span></div><div class="a-user"><strong>${S.user.full_name}</strong><span class="a-role">${tr('adminTitle')}</span></div><nav class="a-nav">${ANAV().map(i=>`<button class="nav-item ${S.nav===i.id?'active':''}" onclick="navigate('${i.id}')"><span class="nav-icon">${i.icon}</span>${i.label}</button>`).join('')}</nav><div class="a-bottom"><button class="nav-item" onclick="doLogout()"><span class="nav-icon">🚪</span>${tr('logout')}</button></div>`;}
function setAC(html){document.getElementById('a-content').innerHTML=html;}
function setAH(title){document.getElementById('a-header').innerHTML=`<div class="a-header-title">${title}</div><div class="a-header-right"><button class="theme-toggle" onclick="toggleTheme()">${S.theme==='dark'?'☀️':'🌙'}</button><div class="header-lang">${['ru','uz','en'].map(l=>`<button class="lang-btn ${S.lang===l?'active':''}" onclick="setLang('${l}')">${l.toUpperCase()}</button>`).join('')}</div></div>`;}
function navAdmin(id){setupASidebar();const item=ANAV().find(i=>i.id===id)||ANAV()[0];setAH(item.label);setAC(loader());({dashboard:showADash,users:showAUsers,groups:showAGroups,schedules:showASched,balance:showABalance,shop:showAShop,orders:showAOrders,revenues:showARevenues,events:showAEvents,announcements:showAAnns}[id]||showADash)();}

// ═══ CONTACTS
function contactBtn(icon,cls,label,url){return`<a href="${url}" target="_blank" class="contact-btn"><div class="contact-icon ${cls}">${icon}</div><div><div class="contact-label">${label}</div></div><span class="pa-arrow">›</span></a>`;}

// ═══ PROGRESS CARDS
function buildProgressCards(months){
  if(!months||!months.length)return`<div class="progress-card"><div class="progress-header"><span class="progress-label">${tr('currentMonth')}</span><span class="progress-pct">—</span></div><div class="progress-bar-bg"><div class="progress-bar-fill" style="width:0%"></div></div></div>`;
  return months.slice(0,4).map((m,i)=>{
    const p=m.total_lessons>0?Math.round((+m.hw+ +m.act)/(m.total_lessons*20)*100):0;
    return`<div class="progress-card"><div class="progress-header"><span class="progress-label">${i===0?tr('currentMonth'):tr('monthsFull')[parseInt(m.mo)-1]+' '+m.yr}</span><span class="progress-pct">${p}%</span></div><div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${p}%"></div></div><div class="progress-sub">Уроков: ${m.total_lessons} · +${+m.hw+ +m.act} 🪙</div></div>`;
  }).join('');
}

// ═══ STUDENT HOME
async function showSHome(){
  const[d,progress]=await Promise.all([api('GET','/api/student/dashboard'),api('GET','/api/student/progress')]);
  if(!d)return;
  const{balance,coins,groups,announcements,settings,user}=d;
  setMC(`<div class="m-page">
    <div class="m-hero">
      <div class="m-hero-top">
        <div><div class="m-hero-greeting">${tr('greeting')}</div><div class="m-hero-name">${user?.full_name||S.user.full_name}</div></div>
        <div class="m-hero-badge">${tr('studentTitle')}</div>
      </div>
      <div class="m-hero-stats">
        <div class="m-stat-pill"><div class="m-stat-val">${fmt(balance)}</div><div class="m-stat-label">${tr('sumLabel')}</div></div>
        <div class="m-stat-pill gold"><div class="m-stat-val">${coins} 🪙</div><div class="m-stat-label">${tr('coins')}</div></div>
      </div>
    </div>
    <div class="m-section">
      <div class="m-section-header"><span class="m-section-title">📈 ${tr('progress')}</span></div>
      ${buildProgressCards(progress)}
    </div>
    ${announcements.length?`<div class="m-section"><div class="m-section-header"><span class="m-section-title">📢 ${tr('news')}</span></div>${announcements.map(a=>`<div class="ann-card" ${a.link?`onclick="window.open('${esc(a.link)}','_blank')"`:''}>
      ${a.image_data?`<img class="ann-img" src="${a.image_data}" alt=""/>`:''}
      <div class="ann-title">${a.title}</div>${a.content?`<div class="ann-content">${a.content}</div>`:''}
      ${a.link?`<span class="ann-link">Подробнее →</span>`:''}<div class="ann-date">${fmtDate(a.created_at)}</div>
    </div>`).join('')}</div>`:''}
    ${(settings?.tg_support||settings?.tg_channel||settings?.instagram)?`<div class="m-section"><div class="m-section-header"><span class="m-section-title">📞 ${tr('contacts')}</span></div>
      ${settings.tg_support?contactBtn('💬','tg',tr('tgSupport'),settings.tg_support):''}
      ${settings.tg_channel?contactBtn('📣','tg',tr('tgChannel'),settings.tg_channel):''}
      ${settings.instagram?contactBtn('📸','ig','Instagram',settings.instagram):''}
    </div>`:''}
  </div>`);}

// ═══ STUDENT SCHEDULE
async function showSSched(){
  const data=await api('GET',`/api/student/weekly-schedule?week=${S.weekOffset}`);if(!data)return;
  const{dates,slots}=data;const byDay={};dates.forEach(d=>byDay[d]=[]);slots.forEach(s=>{if(byDay[s.date])byDay[s.date].push(s);});const today=todayStr();
  setMC(`<div class="week-nav"><button class="week-btn" onclick="S.weekOffset--;showSSched()">←</button><span class="week-label">📅 ${weekLabel(S.weekOffset)}</span><button class="week-btn" onclick="S.weekOffset++;showSSched()">→</button></div>
    <div style="padding-bottom:16px">
    ${dates.map((date,i)=>{
      const ls=byDay[date]||[];if(!ls.length)return'';
      return`<div class="day-block"><div class="day-header ${date===today?'today':''}"><span class="day-name">${tr('daysLong')[i]}</span><span class="day-date-chip">${fmtDate(date)}</span></div>
      ${ls.map(l=>`<div class="lesson-card"><div class="lesson-top"><div class="lesson-subject">${l.group_name}${l.subject?` · ${l.subject}`:''}</div>${attPill(l.att_status)}</div>
        <div class="lesson-time-row"><span class="lesson-time">🕐 ${l.display_time||'—'}</span><span class="lesson-time">🚪 ${l.display_room||'—'}</span></div>
        <div class="lesson-teacher">👨‍🏫 ${l.teacher_name||'—'}</div>
        ${l.att_status!=='not_marked'&&(+l.homework_score+ +l.activity_score)>0?`<div class="scores-row"><span class="score-chip">🏠 ${l.homework_score}/10</span><span class="score-chip">⚡ ${l.activity_score}/10</span><span class="score-chip">+${+l.homework_score+ +l.activity_score} 🪙</span></div>`:''}
        ${l.topic?`<div class="lesson-meta" style="font-size:12px;color:var(--text2);margin-top:6px">📖 <strong>${tr('topic')}:</strong> ${l.topic}</div>`:''}
        ${l.homework?`<div class="lesson-hw">📝 ${l.homework}</div>`:''}
      </div>`).join('')}</div>`;
    }).join('')||`<div class="m-page">${empty('📅',tr('noLessons'))}</div>`}
    </div>`);}

// ═══ CALENDAR
async function showCalendar(role){
  const now=new Date();
  if(!S.calYear)S.calYear=now.getFullYear();
  if(!S.calMonth)S.calMonth=now.getMonth()+1;
  // get groups
  const groups=role==='teacher'?await api('GET','/api/teacher/groups'):await api('GET','/api/student/dashboard').then(d=>d?.groups||[]);
  if(!groups||!groups.length){setMC(`<div class="m-page">${empty('📆',tr('noData'))}</div>`);return;}
  if(!S.calGroupId||!groups.find(g=>g.id===S.calGroupId))S.calGroupId=groups[0].id;
  const endpoint=role==='teacher'?`/api/teacher/calendar/${S.calGroupId}/${S.calYear}/${S.calMonth}`:`/api/student/calendar/${S.calGroupId}/${S.calYear}/${S.calMonth}`;
  const cal=await api('GET',endpoint);if(!cal)return;
  const{lessons,exams,students,attendance,examResults}=cal;
  // Build date columns: lessons + exam dates
  const lessonDates=lessons.map(l=>l.date);
  const examDates=exams.map(e=>e.date);
  const allDates=[...new Set([...lessonDates,...examDates])].sort();
  // attendance map: student_id -> date -> {status, hw, act}
  const attMap={};
  for(const a of attendance){if(!attMap[a.student_id])attMap[a.student_id]={};attMap[a.student_id][a.date]={status:a.status,hw:a.homework_score,act:a.activity_score};}
  // exam result map: student_id -> exam_id -> score
  const erMap={};
  for(const r of (examResults||[])){if(!erMap[r.student_id])erMap[r.student_id]={};erMap[r.student_id][r.exam_id]=r.score;}
  const lessonByDate={};lessons.forEach(l=>lessonByDate[l.date]=l);
  const examByDate={};exams.forEach(e=>examByDate[e.date]=e);
  const monthLabel=tr('monthsFull')[S.calMonth-1]+' '+S.calYear;
  const groupSelector=groups.map(g=>`<button class="cal-group-btn ${g.id===S.calGroupId?'active':''}" onclick="S.calGroupId=${g.id};showCalendar('${role}')">${g.name||g.subject||'Группа'}</button>`).join('');
  let tableHtml=`<table class="cal-table"><thead><tr><th class="cal-name-cell">Студент</th>`;
  for(const date of allDates){
    const dt=new Date(date);const isExam=!!examByDate[date];
    tableHtml+=`<th class="${isExam?'exam-col':''}">${dt.getDate()}<br><span style="font-size:9px;font-weight:400">${isExam?'📝':tr('days')[(dt.getDay()+6)%7]}</span></th>`;
  }
  tableHtml+=`<th>Итог</th></tr></thead><tbody>`;
  for(const st of students){
    tableHtml+=`<tr><td class="cal-name-cell">${st.full_name}</td>`;
    let totalScore=0,totalMax=0;
    for(const date of allDates){
      if(lessonByDate[date]){
        const lid=lessonByDate[date].id;const a=attMap[st.id]?.[date];
        const status=a?.status||'not_marked';const score=(a?.hw||0)+(a?.act||0);const maxL=20;
        totalScore+=score;totalMax+=maxL;
        const pct=Math.round(score/maxL*100);
        tableHtml+=`<td><div class="day-dot dot-${status}">${status==='not_marked'?'—':pct+'%'}</div></td>`;
      } else if(examByDate[date]){
        const eid=examByDate[date].id;const score=erMap[st.id]?.[eid];const maxE=examByDate[date].max_score;
        totalScore+=(score||0);totalMax+=maxE;
        const pct=score!=null?Math.round(score/maxE*100):null;
        tableHtml+=`<td><div class="day-dot dot-exam">${pct!=null?pct+'%':'—'}</div></td>`;
      } else {tableHtml+=`<td><span class="dot-empty"></span></td>`;}
    }
    const totalPct=totalMax>0?Math.round(totalScore/totalMax*100):0;
    tableHtml+=`<td><span class="cal-total">${totalPct}%</span></td></tr>`;
  }
  tableHtml+=`</tbody></table>`;
  setMC(`<div class="cal-header">
    <div class="cal-month-nav">
      <button class="week-btn" onclick="S.calMonth--;if(S.calMonth<1){S.calMonth=12;S.calYear--;}showCalendar('${role}')">←</button>
      <span class="cal-month-label">📆 ${monthLabel}</span>
      <button class="week-btn" onclick="S.calMonth++;if(S.calMonth>12){S.calMonth=1;S.calYear++;}showCalendar('${role}')">→</button>
    </div>
    <div class="cal-group-selector">${groupSelector}</div>
  </div>
  <div class="cal-table-wrap">${tableHtml}</div>`);}

// ═══ STUDENT EVENTS
async function showSEvents(){
  const events=await api('GET','/api/student/events');if(!events)return;
  setMC(`<div class="m-page">
    <div class="m-section-header" style="margin-bottom:12px"><span class="m-section-title">🎉 ${tr('events')}</span></div>
    ${events.length?events.map(e=>{
      const isFull=e.capacity>0&&e.registered>=e.capacity&&!e.is_registered;
      const left=e.capacity>0?e.capacity-e.registered:null;
      return`<div class="event-card"><div class="event-title">${e.title}</div>
        <div class="event-meta"><span>📅 ${e.event_date} ${e.event_time}</span>${e.venue?`<span>📍 ${e.venue}</span>`:''}</div>
        ${e.description?`<div class="event-desc">${e.description}</div>`:''}
        <div class="event-footer">
          <span class="${isFull?'spots-full':'spots-ok'}">${e.capacity>0?(isFull?tr('noSpots'):`${left} ${tr('spotsLeft')}`):'∞'}</span>
          ${e.is_registered?`<button class="btn btn-secondary btn-sm" onclick="unreg(${e.id})">✓ ${tr('alreadyRegistered')}</button>`:isFull?`<button class="btn btn-secondary btn-sm" disabled>${tr('noSpots')}</button>`:`<button class="btn btn-primary btn-sm" onclick="reg(${e.id})">${tr('register')}</button>`}
        </div>
      </div>`;
    }).join(''):empty('🎉',tr('noData'))}
  </div>`);}
window.reg=async function(id){const r=await api('POST',`/api/student/events/${id}/register`);if(r){toast(tr('register')+' ✓','success');showSEvents();}};
window.unreg=async function(id){const r=await api('DELETE',`/api/student/events/${id}/register`);if(r){toast(tr('unregister')+' ✓','success');showSEvents();}};

// ═══ STUDENT SHOP — fixed price display
async function showSShop(){
  const d=await api('GET','/api/student/shop');if(!d)return;
  const{items,coins}=d;
  setMH('Imkon LC',themeBtn()+`<span class="shop-coins">${coins} 🪙</span>`);
  if(!items.length){setMC(`<div class="m-page">${empty('🛒',tr('noData'))}</div>`);return;}
  const cards=items.map(function(item){
    const dis=coins<item.price_coins;
    const imgHtml=item.image_data?('<img src="'+item.image_data+'" alt=""/>'):'🎁';
    const priceStr=item.price_coins+' 🪙';
    return '<div class="shop-card"><div class="shop-img">'+imgHtml+'</div><div class="shop-body"><div class="shop-name">'+item.name+'</div><div class="shop-desc">'+(item.description||'')+'</div><div class="shop-price">'+priceStr+'</div><button class="shop-btn" '+(dis?'disabled':'')+' onclick="sOrder('+item.id+','+item.price_coins+')">'+(dis?'🔒':tr('orderNow'))+'</button></div></div>';
  }).join('');
  setMC('<div class="shop-header"><span class="m-section-title">🛒 '+tr('shop')+'</span><span class="shop-coins">'+coins+' 🪙</span></div><div class="shop-grid">'+cards+'</div>');}
window.sOrder=async function(iid,price){
  if(!confirm(tr('orderNow')+' ('+price+' 🪙)?'))return;
  const r=await api('POST','/api/student/order',{item_id:iid});
  if(r){toast('🛒 '+r.order_number,'success');navigate('orders');}};

// ═══ STUDENT ORDERS
async function showSOrders(){
  const orders=await api('GET','/api/student/orders');if(!orders)return;
  setMH(tr('myOrders'),'');
  setMC(`<div class="m-page">${orders.length?orders.map(o=>`<div class="order-card">
    <div class="order-top"><div><div class="order-item">${o.item_name}</div><div class="order-num">${tr('orderNumber')}: ${o.order_number}</div></div>${statusBadge(o.status)}</div>
    <div class="order-price">${o.price_coins} 🪙</div>
    ${o.status==='delivered'?`<div class="order-pickup">📦 ${tr('pickupMsg')} <strong>${o.order_number}</strong></div>`:''}
  </div>`).join(''):empty('📦',tr('noData'))}</div>`);}

// ═══ STUDENT PROFILE
async function showSProfile(){
  const[d,exams]=await Promise.all([api('GET','/api/student/dashboard'),api('GET','/api/student/exams')]);
  if(!d)return;
  const{balance,coins,groups,settings,user}=d;
  setMC(`<div class="profile-hero">
    <div class="profile-avatar">👤</div>
    <div class="profile-name">${user?.full_name||S.user.full_name}</div>
    <div class="profile-role-badge"><span class="profile-role-pill">${tr('studentTitle')}</span></div>
    ${user?.phone?`<div style="text-align:center;font-size:13px;color:rgba(255,255,255,.5);margin-bottom:10px">📞 ${user.phone}</div>`:''}
    <div class="profile-stats">
      <div class="profile-stat"><div class="profile-stat-val">${fmt(balance)}</div><div class="profile-stat-label">${tr('sumLabel')}</div></div>
      <div class="profile-stat"><div class="profile-stat-val">${coins}</div><div class="profile-stat-label">🪙</div></div>
    </div>
  </div>
  <div class="profile-body">
    <button class="profile-action" onclick="openCP()"><div class="pa-icon">🔑</div><div class="pa-info"><div class="pa-label">${tr('changePassword')}</div></div><span class="pa-arrow">›</span></button>
    <button class="profile-action" onclick="openMyCourses(${JSON.stringify(groups).replace(/"/g,'&quot;')})"><div class="pa-icon">📚</div><div class="pa-info"><div class="pa-label">${tr('myCourses')}</div><div class="pa-sub">${groups.length} ${tr('groups')}</div></div><span class="pa-arrow">›</span></button>
    <button class="profile-action" onclick="openSExams(${JSON.stringify(exams||[]).replace(/"/g,'&quot;')})"><div class="pa-icon">📝</div><div class="pa-info"><div class="pa-label">${tr('exams')}</div><div class="pa-sub">${(exams||[]).length} ${tr('exams').toLowerCase()}</div></div><span class="pa-arrow">›</span></button>
    <button class="profile-action" onclick="navigate('orders')"><div class="pa-icon">📦</div><div class="pa-info"><div class="pa-label">${tr('myOrders')}</div></div><span class="pa-arrow">›</span></button>
    ${settings?.tg_support?`<a class="profile-action" href="${settings.tg_support}" target="_blank"><div class="pa-icon">💬</div><div class="pa-info"><div class="pa-label">${tr('support')}</div></div><span class="pa-arrow">›</span></a>`:''}
    <div class="profile-action" style="cursor:default">
      <div class="pa-icon">🌐</div><div class="pa-info"><div class="pa-label">${tr('language')}</div></div>
      <div style="display:flex;gap:4px;margin-left:auto">${['ru','uz','en'].map(l=>`<button class="lang-btn ${S.lang===l?'active':''}" onclick="setLang('${l}')">${l.toUpperCase()}</button>`).join('')}</div>
    </div>
    <div class="profile-action" style="cursor:default">
      <div class="pa-icon">${S.theme==='dark'?'🌙':'☀️'}</div><div class="pa-info"><div class="pa-label">${tr('theme')}</div></div>
      <button class="btn btn-secondary btn-sm" onclick="toggleTheme();showSProfile()">${S.theme==='dark'?tr('darkTheme'):tr('lightTheme')}</button>
    </div>
    <button class="profile-action danger" onclick="doLogout()"><div class="pa-icon">🚪</div><div class="pa-info"><div class="pa-label">${tr('logout')}</div></div></button>
  </div>`);}

window.openSExams=function(exams){
  showModal(mH('📝 '+tr('exams'))+mB(exams.length?exams.map(e=>{
    const st=e.exam_status==='past'?`<span class="exam-status-past">${tr('past')}</span>`:`<span class="exam-status-upcoming">${tr('upcoming')}</span>`;
    const res=e.result_status==='passed'?`<span class="exam-passed">${tr('passed')}: ${e.score}</span>`:e.result_status==='failed'?`<span class="exam-failed">${tr('failed')}: ${e.score}</span>`:'';
    return`<div class="exam-card"><div class="exam-header"><span class="exam-title">${e.title}</span>${st}</div>
      <div class="exam-meta"><span>📅 ${e.exam_date} ${e.exam_time}</span>${e.venue?`<span>📍 ${e.venue}</span>`:''}<span>📊 ${tr('passScore')}: ${e.pass_score}/${e.max_score}</span></div>
      ${e.score!=null?`<div class="exam-score">${e.score}<span style="font-size:16px;font-weight:600;color:var(--text2)">/${e.max_score}</span></div><div class="exam-score-sub">${res}</div>`:''}
    </div>`;
  }).join(''):empty('📝',tr('noData')))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('close')}</button>`));
};
window.openCP=function(){showModal(mH(tr('changePassword'))+mB(`<div class="form-group"><label>${tr('oldPassword')}</label><input id="m-op" type="password"/></div><div class="form-group"><label>${tr('newPassword')}</label><input id="m-np" type="password"/></div>`)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="submitCP()">${tr('save')}</button>`));};
window.submitCP=async function(){const r=await api('POST','/api/change-password',{old_password:v('m-op'),new_password:v('m-np')});if(r){toast(tr('save')+' ✓','success');closeModal();}};
window.openMyCourses=function(groups){showModal(mH(tr('myCourses'))+mB(groups.length?groups.map(g=>`<div style="background:var(--card2);border-radius:var(--radius);padding:12px;margin-bottom:8px"><div style="font-weight:700">${g.name}</div><div style="font-size:12px;color:var(--text2)">${g.subject||''}</div><div style="font-size:12px;color:var(--text3)">👨‍🏫 ${g.teacher_name||'—'}</div></div>`).join(''):empty('📚',tr('noData')))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('close')}</button>`));};

// ═══ TEACHER HOME
async function showTHome(){
  const[d,settings]=await Promise.all([api('GET','/api/teacher/dashboard'),api('GET','/api/settings')]);if(!d)return;
  const{revenue,students,todayLessons,announcements,monthlyRevenues}=d;
  setMC(`<div class="m-page">
    <div class="m-hero">
      <div class="m-hero-top">
        <div><div class="m-hero-greeting">${tr('greeting')}</div><div class="m-hero-name">${S.user.full_name}</div></div>
        <div class="m-hero-badge">${tr('teacherTitle')}</div>
      </div>
      <div class="m-hero-stats">
        <div class="m-stat-pill" onclick="openTRevHistory(${JSON.stringify(monthlyRevenues).replace(/"/g,'&quot;')})" style="cursor:pointer"><div class="m-stat-val">${fmt(revenue)}</div><div class="m-stat-label">${tr('income')} →</div></div>
        <div class="m-stat-pill gold" onclick="openTStudents(${JSON.stringify(students).replace(/"/g,'&quot;')})" style="cursor:pointer"><div class="m-stat-val">${students.length}</div><div class="m-stat-label">${tr('students')} →</div></div>
      </div>
    </div>
    ${todayLessons.length?`<div class="m-section"><div class="m-section-header"><span class="m-section-title">📅 ${tr('todayLessons')}</span></div>${todayLessons.map(l=>`<div class="lesson-card"><div class="lesson-subject">${l.group_name}${l.subject?` · ${l.subject}`:''}</div><div class="lesson-time-row"><span class="lesson-time">🕐 ${l.time||'—'}</span><span class="lesson-time">🚪 ${l.room_display||'—'}</span></div></div>`).join('')}</div>`:''}
    ${announcements.length?`<div class="m-section"><div class="m-section-header"><span class="m-section-title">📢 ${tr('news')}</span></div>${announcements.map(a=>`<div class="ann-card">${a.image_data?`<img class="ann-img" src="${a.image_data}" alt=""/>`:''}  <div class="ann-title">${a.title}</div>${a.content?`<div class="ann-content">${a.content}</div>`:''}<div class="ann-date">${fmtDate(a.created_at)}</div></div>`).join('')}</div>`:''}
    ${settings?`<div class="m-section"><div class="m-section-header"><span class="m-section-title">📞 ${tr('contacts')}</span></div>${settings.tg_support?contactBtn('💬','tg',tr('tgSupport'),settings.tg_support):''}${settings.tg_channel?contactBtn('📣','tg',tr('tgChannel'),settings.tg_channel):''}${settings.instagram?contactBtn('📸','ig','Instagram',settings.instagram):''}</div>`:''}
  </div>`);}

window.openTRevHistory=function(months){showModal(mH(tr('history')+' — '+tr('income'))+mB(months.length?months.map(m=>`<div class="rev-row"><span class="rev-name">${tr('monthsFull')[parseInt(m.month)-1]} ${m.year}</span><span class="rev-amount">${fmt(m.amount)} ${tr('sumLabel')}</span></div>`).join(''):empty('💰',tr('noData')))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('close')}</button>`));};
window.openTStudents=async function(students){showModal(mH(tr('myStudents'))+mB(students.length?students.map(s=>`<div onclick="openSProg(${s.id},'${esc(s.full_name)}',false)" style="background:var(--card2);border-radius:var(--radius);padding:12px;margin-bottom:8px;cursor:pointer;display:flex;justify-content:space-between;align-items:center"><div><div style="font-weight:700">${s.full_name}</div><div class="text-small text-muted">${fmt(s.balance)} ${tr('sumLabel')} · ${s.coins} 🪙</div></div><span class="pa-arrow">›</span></div>`).join(''):empty('👥',tr('noData')))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('close')}</button>`));};

async function openSProg(sid,name,isAdmin){
  const ep=isAdmin?`/api/admin/students/${sid}/progress`:`/api/teacher/students/${sid}/progress`;
  const d=await api('GET',ep);if(!d)return;
  const{student,months}=d;
  showModal(mH('📊 '+name)+mB(`<div class="m-hero-stats" style="margin-bottom:14px">
    <div class="m-stat-pill" style="background:var(--card2)"><div class="m-stat-val" style="color:var(--red)">${fmt(student.balance)}</div><div class="m-stat-label">${tr('sumLabel')}</div></div>
    <div class="m-stat-pill gold" style="background:var(--card2)"><div class="m-stat-val">${student.coins} 🪙</div><div class="m-stat-label">${tr('coins')}</div></div>
  </div>${buildProgressCards(months)}`)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('close')}</button>`),{desktop:true});}
window.openSProg=openSProg;

// ═══ TEACHER SCHEDULE
async function showTSchedule(){
  const data=await api('GET',`/api/teacher/weekly-schedule?week=${S.weekOffset}`);if(!data)return;
  const{dates,slots}=data;const byDay={};dates.forEach(d=>byDay[d]=[]);slots.forEach(s=>{if(byDay[s.date])byDay[s.date].push(s);});const today=todayStr();
  setMC(`<div class="week-nav"><button class="week-btn" onclick="S.weekOffset--;showTSchedule()">←</button><span class="week-label">📅 ${weekLabel(S.weekOffset)}</span><button class="week-btn" onclick="S.weekOffset++;showTSchedule()">→</button></div>
    <div style="padding-bottom:16px">
    ${dates.map((date,i)=>{
      const ls=byDay[date]||[];if(!ls.length)return'';
      return`<div class="day-block"><div class="day-header ${date===today?'today':''}"><span class="day-name">${tr('daysLong')[i]}</span><span class="day-date-chip">${fmtDate(date)}</span></div>
      ${ls.map(sl=>`<div class="lesson-card clickable" onclick="openTLesson(${sl.lesson_id||0},${sl.group_id||sl.schedule_id||0},'${sl.date}','${esc(sl.group_name||'')}',${sl.student_count||0},'${sl.type||'slot'}')">
        <div class="lesson-top"><div class="lesson-subject">${sl.group_name}${sl.subject?` · ${sl.subject}`:''}</div>${sl.lesson_id?'<span class="badge badge-success">✓</span>':'<span class="badge badge-gray">—</span>'}</div>
        <div class="lesson-time-row"><span class="lesson-time">🕐 ${sl.display_time||sl.start_time||'—'}</span><span class="lesson-time">🚪 ${sl.display_room||sl.room||'—'}</span></div>
        <div class="lesson-teacher">👥 ${sl.student_count||0} ${tr('students')}</div>
        ${sl.topic?`<div style="font-size:12px;color:var(--text2);margin-top:4px">📖 ${sl.topic}</div>`:''}
      </div>`).join('')}</div>`;
    }).join('')||`<div class="m-page">${empty('📅',tr('noLessons'))}</div>`}
    </div>`);}

window.openTLesson=async function(lid,gid,date,gname,cnt,type){
  if(!lid||type==='slot'){const r=await api('POST','/api/teacher/lessons',{group_id:gid,date});if(!r)return;lid=r.id;}
  const d=await api('GET',`/api/teacher/lessons/${lid}`);if(!d)return;
  const{lesson,students}=d;window._GL={lid,students:students.map(s=>({...s}))};
  showModal(mH('📖 '+gname+' — '+date)+mB(`
    <div class="form-group"><label>${tr('topic')}</label><input id="m-lt" value="${esc(lesson.topic||'')}"/></div>
    <div class="form-group"><label>${tr('homework')}</label><textarea id="m-lh">${lesson.homework||''}</textarea></div>
    <div style="font-size:11px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">${tr('attendanceTitle')}</div>
    <div id="gl-list">${students.map((s,i)=>`<div class="grade-row"><div class="grade-name">${s.full_name}</div>
      <div class="status-sel">${['present','absent','excused','not_marked'].map(st=>`<button class="s-btn ${(s.status||'not_marked')===st?'sel':''}" data-s="${st}" onclick="gSt(this,${i},'${st}')">${tr(st)}</button>`).join('')}</div>
      <div class="score-inputs" id="sc-${i}" style="${s.status==='absent'?'opacity:.4;pointer-events:none':''}">
        <div class="score-field"><label>${tr('hwScore')}</label><input type="number" id="hw-${i}" value="${s.homework_score||0}" min="0" max="10"/></div>
        <div class="score-field"><label>${tr('actScore')}</label><input type="number" id="act-${i}" value="${s.activity_score||0}" min="0" max="10"/></div>
      </div>
    </div>`).join('')}</div>
  `)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="saveG(${lid})">${tr('saveGrades')}</button>`));};

window.gSt=function(btn,i,st){btn.closest('.grade-row').querySelectorAll('.s-btn').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel');if(window._GL)window._GL.students[i].status=st;const sc=document.getElementById('sc-'+i);if(sc){sc.style.opacity=st==='absent'?'.4':'1';sc.style.pointerEvents=st==='absent'?'none':'';}};
window.saveG=async function(lid){
  const topic=v('m-lt'),homework=v('m-lh');
  const students=(window._GL?.students||[]).map((s,i)=>({id:s.id,status:s.status||'not_marked',homework_score:Math.min(10,Math.max(0,parseInt(document.getElementById('hw-'+i)?.value)||0)),activity_score:Math.min(10,Math.max(0,parseInt(document.getElementById('act-'+i)?.value)||0))}));
  const r=await api('PUT',`/api/teacher/lessons/${lid}/grade`,{topic,homework,students});
  if(r){toast(tr('save')+' ✓','success');closeModal();showTSchedule();}};

// ═══ TEACHER EVENTS
async function showTEvents(){
  const[events,groups]=await Promise.all([api('GET','/api/teacher/events'),api('GET','/api/teacher/groups')]);if(!events)return;
  window._TG=groups||[];
  setMC(`<div class="m-page">
    <div class="m-section-header" style="margin-bottom:12px"><span class="m-section-title">🎉 ${tr('events')}</span><button class="btn btn-primary btn-sm" onclick="openTEvent()">+ ${tr('add')}</button></div>
    ${events.length?events.map(e=>`<div class="event-card"><div class="event-title">${e.title}</div>
      <div class="event-meta"><span>📅 ${e.event_date} ${e.event_time}</span>${e.venue?`<span>📍 ${e.venue}</span>`:''}<span>👤 ${e.registered}/${e.capacity>0?e.capacity:'∞'}</span></div>
      ${e.description?`<div class="event-desc">${e.description}</div>`:''}
    </div>`).join(''):empty('🎉',tr('noData'))}
  </div>`);}
window.openTEvent=function(){
  const gs=window._TG||[];
  showModal(mH('+ '+tr('events'))+mB(`<div class="form-group"><label>${tr('name')}</label><input id="m-et"/></div><div class="form-group"><label>${tr('description')}</label><textarea id="m-ed"></textarea></div><div class="form-row"><div class="form-group"><label>${tr('eventDate')}</label><input id="m-edt" type="date"/></div><div class="form-group"><label>${tr('eventTime')}</label><input id="m-etm" type="time" value="10:00"/></div></div><div class="form-row"><div class="form-group"><label>${tr('venue')}</label><input id="m-ev"/></div><div class="form-group"><label>${tr('capacity')}</label><input id="m-ec" type="number" value="0" min="0"/></div></div><div class="form-group"><label>${tr('forGroup')}</label><select id="m-eg">${gs.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}</select></div>`)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="submitTE()">${tr('save')}</button>`));};
window.submitTE=async function(){const r=await api('POST','/api/teacher/events',{title:v('m-et'),description:v('m-ed'),event_date:v('m-edt'),event_time:v('m-etm'),venue:v('m-ev'),capacity:parseInt(v('m-ec'))||0,group_id:parseInt(v('m-eg'))});if(r){toast(tr('save')+' ✓','success');closeModal();showTEvents();}};

// ═══ TEACHER PROFILE
async function showTProfile(){
  const[d,exams,settings]=await Promise.all([api('GET','/api/teacher/dashboard'),api('GET','/api/teacher/exams'),api('GET','/api/settings')]);if(!d)return;
  const{revenue,students,monthlyRevenues}=d;
  setMC(`<div class="profile-hero">
    <div class="profile-avatar">👨‍🏫</div>
    <div class="profile-name">${S.user.full_name}</div>
    <div class="profile-role-badge"><span class="profile-role-pill">${tr('teacherTitle')}</span></div>
    <div class="profile-stats">
      <div class="profile-stat"><div class="profile-stat-val">${fmt(revenue)}</div><div class="profile-stat-label">${tr('sumLabel')}</div></div>
      <div class="profile-stat"><div class="profile-stat-val">${students.length}</div><div class="profile-stat-label">${tr('students')}</div></div>
    </div>
  </div>
  <div class="profile-body">
    <button class="profile-action" onclick="openCP()"><div class="pa-icon">🔑</div><div class="pa-info"><div class="pa-label">${tr('changePassword')}</div></div><span class="pa-arrow">›</span></button>
    <button class="profile-action" onclick="openTStudents(${JSON.stringify(students).replace(/"/g,'&quot;')})"><div class="pa-icon">👥</div><div class="pa-info"><div class="pa-label">${tr('myStudents')}</div><div class="pa-sub">${students.length} ${tr('students')}</div></div><span class="pa-arrow">›</span></button>
    <button class="profile-action" onclick="openTRevHistory(${JSON.stringify(monthlyRevenues).replace(/"/g,'&quot;')})"><div class="pa-icon">💰</div><div class="pa-info"><div class="pa-label">${tr('income')}</div><div class="pa-sub">${fmt(revenue)} ${tr('sumLabel')}</div></div><span class="pa-arrow">›</span></button>
    <button class="profile-action" onclick="openTExams(${JSON.stringify(exams||[]).replace(/"/g,'&quot;')})"><div class="pa-icon">📝</div><div class="pa-info"><div class="pa-label">${tr('exams')}</div><div class="pa-sub">${(exams||[]).length} ${tr('exams').toLowerCase()}</div></div><span class="pa-arrow">›</span></button>
    ${settings?.tg_support?`<a class="profile-action" href="${settings.tg_support}" target="_blank"><div class="pa-icon">💬</div><div class="pa-info"><div class="pa-label">${tr('support')}</div></div><span class="pa-arrow">›</span></a>`:''}
    <div class="profile-action" style="cursor:default"><div class="pa-icon">🌐</div><div class="pa-info"><div class="pa-label">${tr('language')}</div></div><div style="display:flex;gap:4px;margin-left:auto">${['ru','uz','en'].map(l=>`<button class="lang-btn ${S.lang===l?'active':''}" onclick="setLang('${l}')">${l.toUpperCase()}</button>`).join('')}</div></div>
    <div class="profile-action" style="cursor:default"><div class="pa-icon">${S.theme==='dark'?'🌙':'☀️'}</div><div class="pa-info"><div class="pa-label">${tr('theme')}</div></div><button class="btn btn-secondary btn-sm" onclick="toggleTheme();showTProfile()">${S.theme==='dark'?tr('darkTheme'):tr('lightTheme')}</button></div>
    <button class="profile-action danger" onclick="doLogout()"><div class="pa-icon">🚪</div><div class="pa-info"><div class="pa-label">${tr('logout')}</div></div></button>
  </div>`);}

window.openTExams=function(exams){
  showModal(mH('📝 '+tr('exams'))+mB(`
    <div style="display:flex;justify-content:flex-end;margin-bottom:12px"><button class="btn btn-primary btn-sm" onclick="closeModal();openCreateExam()">+ ${tr('add')}</button></div>
    ${exams.length?exams.map(e=>`<div class="exam-card"><div class="exam-header">
      <span class="exam-title">${e.title}</span>
      ${e.exam_status==='past'?`<span class="exam-status-past">${tr('past')}</span>`:`<span class="exam-status-upcoming">${tr('upcoming')}</span>`}
    </div>
    <div class="exam-meta"><span>📅 ${e.exam_date} ${e.exam_time}</span>${e.venue?`<span>📍 ${e.venue}</span>`:''}<span>👥 ${e.group_name}</span></div>
    ${e.exam_status==='past'?`<button class="btn btn-secondary btn-sm" style="margin-top:8px" onclick="openExamResults(${e.id},'${esc(e.title)}')">${tr('setResults')}</button>`:''}
    </div>`).join(''):empty('📝',tr('noData'))}`)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('close')}</button>`));};

window.openCreateExam=async function(){
  const groups=await api('GET','/api/teacher/groups');if(!groups?.length)return toast(tr('noData'),'error');
  showModal(mH('+ '+tr('exams'))+mB(`
    <div class="form-group"><label>${tr('examTitle')}</label><input id="m-ext"/></div>
    <div class="form-group"><label>${tr('description')}</label><textarea id="m-exd"></textarea></div>
    <div class="form-group"><label>${tr('forGroup')}</label><select id="m-exg">${groups.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}</select></div>
    <div class="form-row"><div class="form-group"><label>${tr('eventDate')}</label><input id="m-exdt" type="date"/></div><div class="form-group"><label>${tr('eventTime')}</label><input id="m-extm" type="time" value="10:00"/></div></div>
    <div class="form-group"><label>${tr('venue')}</label><input id="m-exv"/></div>
    <div class="form-row"><div class="form-group"><label>${tr('maxScore')}</label><input id="m-exmax" type="number" value="100" min="1"/></div><div class="form-group"><label>${tr('passScore')}</label><input id="m-expass" type="number" value="50" min="0"/></div></div>
  `)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="submitExam()">${tr('save')}</button>`));};
window.submitExam=async function(){
  const r=await api('POST','/api/teacher/exams',{group_id:parseInt(v('m-exg')),title:v('m-ext'),description:v('m-exd'),exam_date:v('m-exdt'),exam_time:v('m-extm'),venue:v('m-exv'),max_score:parseInt(v('m-exmax'))||100,pass_score:parseInt(v('m-expass'))||50});
  if(r){toast(tr('save')+' ✓','success');closeModal();}};

window.openExamResults=async function(eid,title){
  const d=await api('GET',`/api/teacher/exams/${eid}`);if(!d)return;
  const{exam,results}=d;
  showModal(mH('📊 '+title)+mB(`
    <div style="font-size:12px;color:var(--text2);margin-bottom:14px">${tr('passScore')}: <strong>${exam.pass_score}</strong> / ${tr('maxScore')}: <strong>${exam.max_score}</strong></div>
    ${results.map((r,i)=>`<div class="grade-row"><div class="grade-name">${r.full_name}</div>
      <div class="score-field"><label>${tr('score')} (0–${exam.max_score})</label><input type="number" id="exsc-${i}" data-sid="${r.student_id}" value="${r.score||0}" min="0" max="${exam.max_score}"/></div>
      ${r.status!=='pending'?`<div style="margin-top:6px">${r.status==='passed'?`<span class="exam-passed">${tr('passed')}</span>`:`<span class="exam-failed">${tr('failed')}</span>`}</div>`:''}
    </div>`).join('')}
  `)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="submitExamResults(${eid},${results.length})">${tr('save')}</button>`));};
window.submitExamResults=async function(eid,count){
  const results=Array.from({length:count},(_,i)=>({student_id:parseInt(document.getElementById('exsc-'+i)?.dataset.sid),score:parseInt(document.getElementById('exsc-'+i)?.value)||0}));
  const r=await api('PUT',`/api/teacher/exams/${eid}/results`,{results});
  if(r){toast(tr('save')+' ✓','success');closeModal();}};

// ═══ ADMIN DASHBOARD
async function showADash(){
  const d=await api('GET','/api/admin/dashboard');if(!d)return;
  const{stats,teacherRevenues,studentBalances}=d;
  setAC(`<div class="stats-grid">
    <div class="stat-card" onclick="admStudents()"><div class="stat-label">${tr('totalStudents')}</div><div class="stat-value stat-info">${stats.students}</div><div class="stat-sub">→ список</div></div>
    <div class="stat-card" onclick="admTeachers(${JSON.stringify(teacherRevenues).replace(/"/g,'&quot;')})"><div class="stat-label">${tr('totalTeachers')}</div><div class="stat-value stat-red">${stats.teachers}</div><div class="stat-sub">→ список</div></div>
    <div class="stat-card" onclick="navigate('groups')"><div class="stat-label">${tr('totalGroups')}</div><div class="stat-value stat-warn">${stats.groups}</div><div class="stat-sub">→ список</div></div>
    <div class="stat-card" onclick="navigate('revenues')"><div class="stat-label">${tr('income')}</div><div class="stat-value stat-success">${fmt(stats.centerRevenue+stats.totalTeacherRevenue)}</div><div class="stat-sub">${tr('sumLabel')}</div></div>
    <div class="stat-card" onclick="admTeachers(${JSON.stringify(teacherRevenues).replace(/"/g,'&quot;')})"><div class="stat-label">${tr('teacherRevenue')}</div><div class="stat-value stat-warn">${fmt(stats.totalTeacherRevenue)}</div><div class="stat-sub">${tr('sumLabel')}</div></div>
    <div class="stat-card" onclick="navigate('revenues')"><div class="stat-label">${tr('centerRevenue')}</div><div class="stat-value stat-success">${fmt(stats.centerRevenue)}</div><div class="stat-sub">${tr('sumLabel')}</div></div>
  </div>
  <div class="cards-grid">
    <div class="card"><div class="card-header"><span class="card-title">👨‍🏫 ${tr('teachers')}</span></div>${teacherRevenues.map(t=>`<div class="rev-row"><span class="rev-name">${t.full_name} <span class="badge badge-gray">${t.rate}%</span></span><span class="rev-amount">${fmt(t.revenue)} ${tr('sumLabel')}</span></div>`).join('')||empty('👥',tr('noData'))}</div>
    <div class="card"><div class="card-header"><span class="card-title">🎓 ${tr('students')}</span></div>${studentBalances.map(s=>`<div class="rev-row" onclick="openSProg(${s.id},'${esc(s.full_name)}',true)" style="cursor:pointer"><div><div>${s.full_name}</div><div class="text-small text-muted">${s.phone||''}</div></div><div style="text-align:right"><div class="rev-amount">${fmt(s.balance)} ${tr('sumLabel')}</div><div style="color:var(--warn);font-size:12px">${s.coins} 🪙</div></div></div>`).join('')||empty('🎓',tr('noData'))}</div>
  </div>`);}

window.admStudents=async function(){const d=await api('GET','/api/admin/dashboard');if(!d)return;showModal(mH('🎓 '+tr('students'))+mB(d.studentBalances.map(s=>`<div onclick="openSProg(${s.id},'${esc(s.full_name)}',true)" style="background:var(--card2);border-radius:var(--radius);padding:12px;margin-bottom:8px;cursor:pointer;display:flex;justify-content:space-between"><div><div style="font-weight:700">${s.full_name}</div><div class="text-small text-muted">${s.phone||''}</div></div><div style="text-align:right"><div style="color:var(--success);font-weight:700">${fmt(s.balance)} ${tr('sumLabel')}</div><div style="color:var(--warn);font-size:12px">${s.coins} 🪙</div></div></div>`).join('')||empty('🎓',tr('noData')))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('close')}</button>`),{desktop:true});};
window.admTeachers=function(ts){showModal(mH('👨‍🏫 '+tr('teachers'))+mB(ts.map(t=>`<div class="rev-row"><span class="rev-name">${t.full_name} <span class="badge badge-gray">${t.rate}%</span></span><span class="rev-amount">${fmt(t.revenue)} ${tr('sumLabel')}</span></div>`).join('')||empty('👥',tr('noData')))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('close')}</button>`),{desktop:true});};

// ═══ ADMIN USERS
async function showAUsers(){
  const users=await api('GET','/api/admin/users');if(!users)return;
  setAC(`<div class="page-header"><h1>👥 ${tr('users')}</h1><button class="btn btn-primary" onclick="oAU()">+ ${tr('add')}</button></div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>${tr('name')}</th><th>Login</th><th>${tr('role')}</th><th>${tr('phone')}</th><th>—</th></tr></thead>
    <tbody>${users.map(u=>`<tr><td>${u.full_name}</td><td><code>${u.username}</code></td><td>${u.role==='teacher'?`<span class="badge badge-red">${tr('teacher')}</span>`:`<span class="badge badge-info">${tr('student')}</span>`}</td><td>${u.phone||'—'}</td><td class="td-actions"><button class="btn btn-secondary btn-sm" onclick="oEU(${u.id},'${esc(u.full_name)}','${u.phone||''}')">✏️</button><button class="btn btn-danger btn-sm" onclick="dU(${u.id},'${esc(u.full_name)}')">🗑</button></td></tr>`).join('')}</tbody>
  </table></div></div>`);}
window.oAU=function(){showModal(mH('+ '+tr('users'))+mB(`<div class="form-row"><div class="form-group"><label>${tr('name')}</label><input id="m-fn"/></div><div class="form-group"><label>Login</label><input id="m-un"/></div></div><div class="form-row"><div class="form-group"><label>${tr('password')}</label><input id="m-pw" type="password"/></div><div class="form-group"><label>${tr('role')}</label><select id="m-rl"><option value="student">${tr('student')}</option><option value="teacher">${tr('teacher')}</option></select></div></div><div class="form-group"><label>${tr('phone')}</label><input id="m-ph" placeholder="+998..."/></div>`)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sAU()">${tr('save')}</button>`),{desktop:true});};
window.sAU=async function(){const r=await api('POST','/api/admin/users',{full_name:v('m-fn'),username:v('m-un'),password:v('m-pw'),role:v('m-rl'),phone:v('m-ph')});if(r){toast(tr('save')+' ✓','success');closeModal();showAUsers();}};
window.oEU=function(id,name,phone){showModal(mH('✏️ '+tr('edit'))+mB(`<div class="form-group"><label>${tr('name')}</label><input id="m-fn" value="${name}"/></div><div class="form-group"><label>${tr('phone')}</label><input id="m-ph" value="${phone}"/></div><div class="form-group"><label>Новый пароль (пусто — не менять)</label><input id="m-pw" type="password"/></div>`)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sEU(${id})">${tr('save')}</button>`),{desktop:true});};
window.sEU=async function(id){const r=await api('PUT',`/api/admin/users/${id}`,{full_name:v('m-fn'),phone:v('m-ph'),password:v('m-pw')});if(r){toast(tr('save')+' ✓','success');closeModal();showAUsers();}};
window.dU=async function(id,name){if(!confirm(tr('deleteConfirm')+'\n'+name))return;const r=await api('DELETE',`/api/admin/users/${id}`);if(r){toast(tr('delete')+' ✓','success');showAUsers();}};

// ═══ ADMIN GROUPS — improved generate
async function showAGroups(){
  const[groups,users]=await Promise.all([api('GET','/api/admin/groups'),api('GET','/api/admin/users')]);if(!groups||!users)return;
  window._AT=users.filter(u=>u.role==='teacher');window._AS=users.filter(u=>u.role==='student');window._AG=groups;
  setAC(`<div class="page-header"><h1>📚 ${tr('groups')}</h1><button class="btn btn-primary" onclick="oAG()">+ ${tr('add')}</button></div>
  ${groups.map(g=>`<div class="card"><div class="card-header"><div><div class="card-title">${g.name} ${g.subject?`<span class="badge badge-gray">${g.subject}</span>`:''}</div><div class="card-sub">👨‍🏫 ${g.teacher_name||'—'}</div></div>
    <div class="td-actions">
      <button class="btn btn-secondary btn-sm" onclick="oGL(${g.id},'${esc(g.name)}')">📅 ${tr('generate')}</button>
      <button class="btn btn-secondary btn-sm" onclick="oEditGroup(${g.id},'${esc(g.name)}','${g.teacher_id||''}','${esc(g.subject||'')}')">✏️</button>
      <button class="btn btn-danger btn-sm" onclick="dG(${g.id})">🗑</button>
    </div></div>
    <div style="margin-bottom:8px"><strong style="font-size:12px;color:var(--text2)">${tr('students')}:</strong>
      <div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:4px;align-items:center">
        ${g.students.map(s=>`<span class="group-tag">${s.full_name}<button onclick="rSG(${g.id},${s.id})" style="color:var(--red);background:none;border:none;cursor:pointer;margin-left:3px;font-size:11px">✕</button></span>`).join('')||`<span class="text-muted text-small">—</span>`}
        <button class="btn btn-secondary btn-xs" onclick="oASG(${g.id})">+ ${tr('add')}</button>
      </div>
    </div>
    <div><strong style="font-size:12px;color:var(--text2)">${tr('schedule')}:</strong>${g.schedules.map(s=>`<span class="group-tag">${tr('daysLong')[s.day_of_week]} ${s.start_time} — ${s.room}</span>`).join('')||' —'}</div>
  </div>`).join('')||empty('📚',tr('noData'))}`);}

window.oAG=function(){const ts=window._AT||[];showModal(mH('+ '+tr('groups'))+mB(`<div class="form-group"><label>${tr('name')}</label><input id="m-gn"/></div><div class="form-row"><div class="form-group"><label>${tr('teacher')}</label><select id="m-gt"><option value="">—</option>${ts.map(t=>`<option value="${t.id}">${t.full_name}</option>`).join('')}</select></div><div class="form-group"><label>${tr('subject')}</label><input id="m-gs"/></div></div>`)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sAG()">${tr('save')}</button>`),{desktop:true});};
window.sAG=async function(){const r=await api('POST','/api/admin/groups',{name:v('m-gn'),teacher_id:v('m-gt')||null,subject:v('m-gs')});if(r){toast(tr('save')+' ✓','success');closeModal();showAGroups();}};
window.oEditGroup=function(id,name,tid,subj){const ts=window._AT||[];showModal(mH('✏️ '+tr('groups'))+mB(`<div class="form-group"><label>${tr('name')}</label><input id="m-gn" value="${name}"/></div><div class="form-row"><div class="form-group"><label>${tr('teacher')}</label><select id="m-gt"><option value="">—</option>${ts.map(t=>`<option value="${t.id}" ${t.id==tid?'selected':''}>${t.full_name}</option>`).join('')}</select></div><div class="form-group"><label>${tr('subject')}</label><input id="m-gs" value="${subj}"/></div></div>`)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sEG(${id})">${tr('save')}</button>`),{desktop:true});};
window.sEG=async function(id){const r=await api('PUT',`/api/admin/groups/${id}`,{name:v('m-gn'),teacher_id:v('m-gt')||null,subject:v('m-gs')});if(r){toast(tr('save')+' ✓','success');closeModal();showAGroups();}};
window.dG=async function(id){if(!confirm(tr('deleteConfirm')))return;const r=await api('DELETE',`/api/admin/groups/${id}`);if(r)showAGroups();};
window.oASG=function(gid){const grp=(window._AG||[]).find(g=>g.id===gid);const ex=(grp?.students||[]).map(s=>s.id);const av=(window._AS||[]).filter(s=>!ex.includes(s.id));showModal(mH('+ '+tr('student'))+mB(`<div class="form-group"><label>${tr('student')}</label><select id="m-sid">${av.map(s=>`<option value="${s.id}">${s.full_name}</option>`).join('')}</select></div>`)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sASG(${gid})">${tr('save')}</button>`),{desktop:true});};
window.sASG=async function(gid){const r=await api('POST',`/api/admin/groups/${gid}/students`,{student_id:v('m-sid')});if(r){toast(tr('save')+' ✓','success');closeModal();showAGroups();}};
window.rSG=async function(gid,sid){if(await api('DELETE',`/api/admin/groups/${gid}/students/${sid}`))showAGroups();};

// IMPROVED generate lessons — choose specific days of week
window.oGL=function(gid,gname){
  const now=new Date();
  const daysOpts=tr('daysLong').map((d,i)=>`<label style="display:inline-flex;align-items:center;gap:4px;margin:3px;padding:5px 10px;border:1.5px solid var(--border);border-radius:20px;cursor:pointer;font-size:12px"><input type="checkbox" id="dow-${i}" value="${i}" style="accent-color:var(--red)"/> ${d}</label>`).join('');
  showModal(mH('📅 '+tr('generate')+': '+gname)+mB(`
    <div class="form-row">
      <div class="form-group"><label>Месяц</label><select id="m-gmo">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${i+1===now.getMonth()+1?'selected':''}>${tr('monthsFull')[i]}</option>`).join('')}</select></div>
      <div class="form-group"><label>Год</label><select id="m-gyr"><option value="${now.getFullYear()}">${now.getFullYear()}</option><option value="${now.getFullYear()+1}">${now.getFullYear()+1}</option></select></div>
    </div>
    <div class="form-group"><label>${tr('pattern')}</label><div style="margin-top:4px">${daysOpts}</div></div>
    <div class="divider"></div>
    <div style="font-size:12px;color:var(--text2)">Быстрый выбор: <button class="btn btn-secondary btn-xs" onclick="[1,3,5].forEach(i=>document.getElementById('dow-'+i).checked=true)">Вт, Чт, Сб</button> <button class="btn btn-secondary btn-xs" onclick="[0,2,4].forEach(i=>document.getElementById('dow-'+i).checked=true)">Пн, Ср, Пт</button></div>
    <div class="divider"></div>
    <div style="font-size:12px;color:var(--text2);background:var(--warn-bg);border-radius:8px;padding:8px 10px;border:1px solid var(--warn)">⚠️ Удаление: <button class="btn btn-danger btn-xs" style="margin-left:4px" onclick="openDeleteMonth(${gid},'${esc(gname)}')">${tr('deleteMonth')}</button></div>
  `)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sGL(${gid})">${tr('generate')}</button>`),{desktop:true});};
window.sGL=async function(gid){
  const days=[];for(let i=0;i<7;i++){if(document.getElementById('dow-'+i)?.checked)days.push(i);}
  if(!days.length)return toast('Выберите хотя бы 1 день','error');
  const r=await api('POST','/api/admin/schedule/generate',{group_id:gid,month:parseInt(v('m-gmo')),year:parseInt(v('m-gyr')),days_of_week:days});
  if(r){toast(`${tr('generate')}: ${r.created} уроков ✓`,'success');closeModal();}};

window.openDeleteMonth=function(gid,gname){
  const now=new Date();
  showModal(mH('🗑 '+tr('deleteMonth')+': '+gname)+mB(`
    <div class="form-row">
      <div class="form-group"><label>Месяц</label><select id="m-dmo">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${i+1===now.getMonth()+1?'selected':''}>${tr('monthsFull')[i]}</option>`).join('')}</select></div>
      <div class="form-group"><label>Год</label><select id="m-dyr"><option value="${now.getFullYear()}">${now.getFullYear()}</option><option value="${now.getFullYear()-1}">${now.getFullYear()-1}</option></select></div>
    </div>
    <div style="color:var(--red);font-size:13px;margin-top:8px">⚠️ Все уроки этого месяца для группы будут удалены!</div>
  `)+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-danger" onclick="submitDeleteMonth(${gid})">${tr('delete')}</button>`),{desktop:true});};
window.submitDeleteMonth=async function(gid){
  if(!confirm(tr('deleteConfirm')))return;
  const r=await api('DELETE',`/api/admin/lessons/month/${gid}/${v('m-dyr')}/${v('m-dmo')}`);
  if(r){toast(tr('delete')+' ✓','success');closeModal();}};

// ═══ ADMIN SCHEDULES
async function showASched(){
  const[scheds,groups]=await Promise.all([api('GET','/api/admin/schedules'),api('GET','/api/admin/groups')]);if(!scheds||!groups)return;
  window._AG=groups;
  setAC(`<div class="page-header"><h1>📅 ${tr('schedule')}</h1><button class="btn btn-primary" onclick="oAS()">+ ${tr('add')}</button></div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>${tr('groups')}</th><th>${tr('teacher')}</th><th>${tr('day')}</th><th>${tr('time')}</th><th>${tr('room')}</th><th>—</th></tr></thead>
    <tbody>${scheds.map(s=>`<tr><td>${s.group_name}</td><td>${s.teacher_name||'—'}</td><td>${tr('daysLong')[s.day_of_week]}</td><td>${s.start_time}</td><td>${s.room}</td>
      <td class="td-actions"><button class="btn btn-secondary btn-sm" onclick="oES(${s.id},${s.group_id},${s.day_of_week},'${s.start_time}','${esc(s.room)}')">✏️</button><button class="btn btn-danger btn-sm" onclick="dSch(${s.id})">🗑</button></td></tr>`).join('')}
    </tbody></table></div></div>`);}
function sFB(gid,dow,time,room){const gs=window._AG||[];return`<div class="form-group"><label>${tr('groups')}</label><select id="m-sgid">${gs.map(g=>`<option value="${g.id}" ${g.id==gid?'selected':''}>${g.name}</option>`).join('')}</select></div><div class="form-row"><div class="form-group"><label>${tr('day')}</label><select id="m-sdow">${tr('daysLong').map((d,i)=>`<option value="${i}" ${i==dow?'selected':''}>${d}</option>`).join('')}</select></div><div class="form-group"><label>${tr('time')}</label><input id="m-stime" type="time" value="${time||'09:00'}"/></div></div><div class="form-group"><label>${tr('room')}</label><input id="m-sroom" value="${room||''}"/></div>`;}
window.oAS=function(){showModal(mH('+ '+tr('schedule'))+mB(sFB())+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sAS()">${tr('save')}</button>`),{desktop:true});};
window.sAS=async function(){const r=await api('POST','/api/admin/schedules',{group_id:parseInt(v('m-sgid')),day_of_week:parseInt(v('m-sdow')),start_time:v('m-stime'),room:v('m-sroom')});if(r){toast(tr('save')+' ✓','success');closeModal();showASched();}};
window.oES=function(id,gid,dow,time,room){showModal(mH('✏️ '+tr('schedule'))+mB(sFB(gid,dow,time,room))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sES(${id})">${tr('save')}</button>`),{desktop:true});};
window.sES=async function(id){const r=await api('PUT',`/api/admin/schedules/${id}`,{group_id:parseInt(v('m-sgid')),day_of_week:parseInt(v('m-sdow')),start_time:v('m-stime'),room:v('m-sroom')});if(r){toast(tr('save')+' ✓','success');closeModal();showASched();}};
window.dSch=async function(id){if(!confirm(tr('deleteConfirm')))return;if(await api('DELETE',`/api/admin/schedules/${id}`)){toast(tr('delete')+' ✓','success');showASched();}};

// ═══ ADMIN BALANCE
async function showABalance(){
  const[d,rates]=await Promise.all([api('GET','/api/admin/dashboard'),api('GET','/api/admin/teacher-rates')]);if(!d||!rates)return;
  setAC(`<div class="page-header"><h1>💳 ${tr('balance')}</h1><button class="btn btn-danger" onclick="doRM()">🔄 ${tr('resetMonth')}</button></div>
  <div class="cards-grid">
    <div class="card"><div class="card-header"><span class="card-title">💰 ${tr('topUp')}</span></div>
      <div class="form-group"><label>${tr('student')}</label><select id="b-sid"><option value="">—</option>${d.studentBalances.map(s=>`<option value="${s.id}">${s.full_name} (${fmt(s.balance)} ${tr('sumLabel')})</option>`).join('')}</select></div>
      <div class="form-group"><label>${tr('amount')} (${tr('sumLabel')})</label><input id="b-amt" type="number" min="0"/></div>
      <button class="btn btn-primary btn-full" onclick="doTU()">💳 ${tr('topUp')}</button>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">📊 ${tr('rate')}</span></div>
      ${rates.map(t=>`<div class="att-row"><span class="att-name">${t.full_name}</span><div style="display:flex;gap:6px;align-items:center"><input type="number" id="rate-${t.id}" value="${t.rate}" min="0" max="100" style="width:60px;background:var(--card2);border:1.5px solid var(--border);border-radius:8px;padding:5px 8px;color:var(--text)"/><span style="color:var(--text2)">%</span><button class="btn btn-secondary btn-sm" onclick="sRate(${t.id})">${tr('save')}</button></div></div>`).join('')}
    </div>
  </div>
  <div class="card"><div class="card-header"><span class="card-title">🎓 ${tr('students')}</span></div>
    <div class="table-wrap"><table><thead><tr><th>${tr('name')}</th><th>${tr('balance')}</th><th>🪙</th></tr></thead>
    <tbody>${d.studentBalances.map(s=>`<tr><td>${s.full_name}</td><td style="color:var(--success);font-weight:700">${fmt(s.balance)} ${tr('sumLabel')}</td><td style="color:var(--warn);font-weight:700">${s.coins}</td></tr>`).join('')}</tbody></table></div>
  </div>`);}
window.doTU=async function(){const sid=v('b-sid'),amount=parseFloat(v('b-amt'));if(!sid||!amount||amount<=0)return toast('Fill fields','error');const r=await api('POST','/api/admin/topup',{student_id:parseInt(sid),amount});if(r){toast(tr('topUp')+' ✓','success');showABalance();}};
window.sRate=async function(tid){const rate=parseFloat(document.getElementById('rate-'+tid)?.value);if(isNaN(rate))return;if(await api('PUT',`/api/admin/teacher-rates/${tid}`,{rate}))toast(tr('save')+' ✓','success');};
window.doRM=async function(){if(!confirm(tr('resetMonth')+'?'))return;if(await api('POST','/api/admin/reset-month')){toast(tr('resetMonth')+' ✓','success');showABalance();}};

// ═══ ADMIN SHOP
async function showAShop(){
  const items=await api('GET','/api/admin/shop');if(!items)return;
  setAC(`<div class="page-header"><h1>🛒 ${tr('shop')}</h1><button class="btn btn-primary" onclick="oAddI()">+ ${tr('add')}</button></div>
  <div class="shop-admin-grid">${items.map(i=>`<div class="shop-admin-card"><div class="shop-admin-img">${i.image_data?`<img src="${i.image_data}" alt=""/>`:'🎁'}</div><div class="shop-admin-body"><div class="shop-admin-name">${i.name}</div><div class="shop-admin-price">${i.price_coins} 🪙</div><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick='oEditI(${JSON.stringify(i)})'>✏️</button><button class="btn btn-danger btn-xs" onclick="dItem(${i.id})">🗑</button></div></div></div>`).join('')||empty('🛒',tr('noData'))}</div>`);}
function iFB(i={}){return`<div class="form-group"><label>${tr('name')}</label><input id="m-in" value="${esc(i.name||'')}"/></div><div class="form-group"><label>${tr('description')}</label><textarea id="m-id">${i.description||''}</textarea></div><div class="form-group"><label>${tr('price')} (🪙)</label><input id="m-ip" type="number" value="${i.price_coins||''}"/></div><div class="form-group"><label>${tr('image')}</label><div class="img-preview" onclick="document.getElementById('m-if').click()">${i.image_data?`<img id="m-ip2" src="${i.image_data}"/>`:`<span id="m-ip2">📷</span>`}</div><input type="file" id="m-if" accept="image/*" style="display:none" onchange="prvI(this)"/></div>${i.id?`<div class="form-group"><label>${tr('available')}</label><select id="m-ia"><option value="1" ${i.available?'selected':''}>✓</option><option value="0" ${!i.available?'selected':''}>✗</option></select></div>`:''}`;}
window.oAddI=function(){window._EI=null;showModal(mH('+ '+tr('shop'))+mB(iFB())+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sAddI()">${tr('save')}</button>`),{desktop:true});};
window.oEditI=function(i){window._EI=i.image_data||null;showModal(mH('✏️ '+tr('shop'))+mB(iFB(i))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sEditI(${i.id})">${tr('save')}</button>`),{desktop:true});};
window.prvI=function(input){const file=input.files[0];if(!file)return;if(file.size>2*1024*1024)return toast('Max 2MB','error');const r=new FileReader();r.onload=e=>{window._EI=e.target.result;const p=document.getElementById('m-ip2');if(p.tagName==='IMG')p.src=e.target.result;else{const img=document.createElement('img');img.id='m-ip2';img.src=e.target.result;p.replaceWith(img);}};r.readAsDataURL(file);};
window.sAddI=async function(){const r=await api('POST','/api/admin/shop',{name:v('m-in'),description:v('m-id'),price_coins:parseInt(v('m-ip')),image_data:window._EI||null});if(r){toast(tr('save')+' ✓','success');closeModal();showAShop();}};
window.sEditI=async function(id){const r=await api('PUT',`/api/admin/shop/${id}`,{name:v('m-in'),description:v('m-id'),price_coins:parseInt(v('m-ip')),image_data:window._EI||null,available:parseInt(v('m-ia'))});if(r){toast(tr('save')+' ✓','success');closeModal();showAShop();}};
window.dItem=async function(id){if(!confirm(tr('deleteConfirm')))return;if(await api('DELETE',`/api/admin/shop/${id}`)){toast(tr('delete')+' ✓','success');showAShop();}};

// ═══ ADMIN ORDERS
async function showAOrders(){
  const orders=await api('GET','/api/admin/orders');if(!orders)return;
  setAC(`<div class="page-header"><h1>📦 ${tr('orders')}</h1></div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>${tr('orderNumber')}</th><th>${tr('student')}</th><th>${tr('shop')}</th><th>${tr('price')}</th><th>${tr('status')}</th><th>—</th></tr></thead>
    <tbody>${orders.map(o=>`<tr><td><code>${o.order_number}</code></td><td>${o.student_name}</td><td>${o.item_name}</td><td style="color:var(--warn)">${o.price_coins} 🪙</td><td>${statusBadge(o.status)}</td>
      <td><select class="btn btn-secondary btn-xs" onchange="uOS(${o.id},this.value)">${['pending','confirmed','delivered','cancelled'].map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${tr(s)}</option>`).join('')}</select></td></tr>`).join('')}
    </tbody></table></div></div>`);}
window.uOS=async function(id,status){if(await api('PUT',`/api/admin/orders/${id}`,{status}))toast(tr('save')+' ✓','success');};

// ═══ ADMIN REVENUES
async function showARevenues(){
  const d=await api('GET','/api/admin/revenues');if(!d)return;
  const{monthly,current}=d;const gr={};
  for(const r of monthly){const k=`${r.year}-${String(r.month).padStart(2,'0')}`;if(!gr[k])gr[k]={month:r.month,year:r.year,items:[]};gr[k].items.push(r);}
  const keys=Object.keys(gr).sort().reverse();
  setAC(`<div class="page-header"><h1>💰 ${tr('revenues')}</h1></div>
  <div class="cards-grid">
    <div class="card"><div class="card-header"><span class="card-title">📅 ${tr('currentMonth')}</span></div>${current.map(r=>`<div class="rev-row"><span class="rev-name">${r.name}</span><span class="rev-amount">${fmt(r.amount)} ${tr('sumLabel')}</span></div>`).join('')}</div>
    <div class="card"><div class="card-header"><span class="card-title">🕒 ${tr('history')}</span></div>${keys.map(k=>`<div class="month-group"><div class="month-label">${tr('monthsFull')[gr[k].month-1]} ${gr[k].year}</div>${gr[k].items.map(r=>`<div class="rev-row"><span class="rev-name">${r.name}</span><span class="rev-amount">${fmt(r.amount)} ${tr('sumLabel')}</span></div>`).join('')}</div>`).join('')||empty('💰',tr('noData'))}</div>
  </div>`);}

// ═══ ADMIN EVENTS
async function showAEvents(){
  const[events,groups]=await Promise.all([api('GET','/api/admin/events'),api('GET','/api/admin/groups')]);if(!events)return;
  window._AEG=groups||[];
  setAC(`<div class="page-header"><h1>🎉 ${tr('events')}</h1><button class="btn btn-primary" onclick="oAE()">+ ${tr('add')}</button></div>
  <div class="cards-grid">${events.map(e=>`<div class="card"><div class="card-header"><div><div class="card-title">${e.title}</div><div class="card-sub">${e.event_date} ${e.event_time}${e.venue?' · '+e.venue:''}</div></div>
    <div class="td-actions"><button class="btn btn-secondary btn-sm" onclick="vRegs(${e.id},'${esc(e.title)}')">👥</button><button class="btn btn-secondary btn-sm" onclick='oEE(${JSON.stringify(e)})'>✏️</button><button class="btn btn-danger btn-sm" onclick="dE(${e.id})">🗑</button></div></div>
    ${e.description?`<div style="font-size:13px;color:var(--text2);margin-bottom:10px">${e.description}</div>`:''}
    <div style="display:flex;justify-content:space-between"><span>${e.group_name?`<span class="badge badge-red">${e.group_name}</span>`:'<span class="badge badge-gray">Все</span>'}</span><span class="badge badge-success">👤 ${e.registered}/${e.capacity>0?e.capacity:'∞'}</span></div>
  </div>`).join('')||empty('🎉',tr('noData'))}</div>`);}
function eFB(e={}){const gs=window._AEG||[];return`<div class="form-group"><label>${tr('name')}</label><input id="m-et" value="${esc(e.title||'')}"/></div><div class="form-group"><label>${tr('description')}</label><textarea id="m-ed">${e.description||''}</textarea></div><div class="form-row"><div class="form-group"><label>${tr('eventDate')}</label><input id="m-edt" type="date" value="${e.event_date||''}"/></div><div class="form-group"><label>${tr('eventTime')}</label><input id="m-etm" type="time" value="${e.event_time||'10:00'}"/></div></div><div class="form-row"><div class="form-group"><label>${tr('venue')}</label><input id="m-ev" value="${esc(e.venue||'')}"/></div><div class="form-group"><label>${tr('capacity')}</label><input id="m-ec" type="number" value="${e.capacity||0}" min="0"/></div></div><div class="form-group"><label>${tr('forGroup')}</label><select id="m-eg"><option value="">Все студенты</option>${gs.map(g=>`<option value="${g.id}" ${e.group_id===g.id?'selected':''}>${g.name}</option>`).join('')}</select></div>`;}
window.oAE=function(){showModal(mH('+ '+tr('events'))+mB(eFB())+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sAE()">${tr('save')}</button>`),{desktop:true});};
window.sAE=async function(){const b={title:v('m-et'),description:v('m-ed'),event_date:v('m-edt'),event_time:v('m-etm'),venue:v('m-ev'),capacity:parseInt(v('m-ec'))||0,group_id:v('m-eg')||null};if(!b.title)return toast('Title required','error');if(await api('POST','/api/admin/events',b)){toast(tr('save')+' ✓','success');closeModal();showAEvents();}};
window.oEE=function(e){showModal(mH('✏️ '+tr('events'))+mB(eFB(e))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sEE(${e.id})">${tr('save')}</button>`),{desktop:true});};
window.sEE=async function(id){const b={title:v('m-et'),description:v('m-ed'),event_date:v('m-edt'),event_time:v('m-etm'),venue:v('m-ev'),capacity:parseInt(v('m-ec'))||0,group_id:v('m-eg')||null};if(await api('PUT',`/api/admin/events/${id}`,b)){toast(tr('save')+' ✓','success');closeModal();showAEvents();}};
window.dE=async function(id){if(!confirm(tr('deleteConfirm')))return;if(await api('DELETE',`/api/admin/events/${id}`)){toast(tr('delete')+' ✓','success');showAEvents();}};
window.vRegs=async function(id,title){const regs=await api('GET',`/api/admin/events/${id}/registrations`);if(!regs)return;showModal(mH('👥 '+title)+mB(regs.length?`<div class="table-wrap"><table><thead><tr><th>#</th><th>${tr('name')}</th><th>${tr('phone')}</th><th>${tr('date')}</th></tr></thead><tbody>${regs.map((r,i)=>`<tr><td>${i+1}</td><td>${r.full_name}</td><td>${r.phone||'—'}</td><td>${fmtDate(r.registered_at)}</td></tr>`).join('')}</tbody></table></div>`:empty('👥',tr('noData')))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('close')}</button>`),{desktop:true});};

// ═══ ADMIN ANNOUNCEMENTS
async function showAAnns(){
  const anns=await api('GET','/api/admin/announcements');if(!anns)return;
  setAC(`<div class="page-header"><h1>📢 ${tr('announcements')}</h1><button class="btn btn-primary" onclick="oAAnn()">+ ${tr('add')}</button></div>
  <div class="cards-grid">${anns.map(a=>`<div class="card">${a.image_data?`<img src="${a.image_data}" style="width:100%;height:140px;object-fit:cover;border-radius:var(--radius);margin-bottom:10px" alt=""/>`:''}<div class="card-header" style="margin-bottom:8px;padding-bottom:8px"><span class="card-title">${a.title}</span><div class="td-actions"><button class="btn btn-secondary btn-sm" onclick='oEAnn(${JSON.stringify(a)})'>✏️</button><button class="btn btn-danger btn-sm" onclick="dAnn(${a.id})">🗑</button></div></div>${a.content?`<div style="font-size:13px;color:var(--text2)">${a.content}</div>`:''}${a.link?`<a href="${a.link}" target="_blank" style="font-size:12px;color:var(--red);display:block;margin-top:6px">🔗 ${a.link}</a>`:''}<div style="font-size:11px;color:var(--text3);margin-top:8px">${fmtDate(a.created_at)}</div></div>`).join('')||empty('📢',tr('noData'))}</div>`);}
function aFB(a={}){return`<div class="form-group"><label>${tr('name')}</label><input id="m-at" value="${esc(a.title||'')}"/></div><div class="form-group"><label>${tr('content')}</label><textarea id="m-ac">${a.content||''}</textarea></div><div class="form-group"><label>${tr('link')}</label><input id="m-al" value="${esc(a.link||'')}" placeholder="https://..."/></div><div class="form-group"><label>${tr('image')}</label><div class="img-preview" onclick="document.getElementById('m-af').click()">${a.image_data?`<img id="m-ap" src="${a.image_data}"/>`:`<span id="m-ap">📷</span>`}</div><input type="file" id="m-af" accept="image/*" style="display:none" onchange="prvA(this)"/></div>`;}
window.prvA=function(input){const file=input.files[0];if(!file)return;if(file.size>2*1024*1024)return toast('Max 2MB','error');const r=new FileReader();r.onload=e=>{window._AI=e.target.result;const p=document.getElementById('m-ap');if(p.tagName==='IMG')p.src=e.target.result;else{const img=document.createElement('img');img.id='m-ap';img.src=e.target.result;p.replaceWith(img);}};r.readAsDataURL(file);};
window.oAAnn=function(){window._AI=null;showModal(mH('+ '+tr('announcements'))+mB(aFB())+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sAAnn()">${tr('save')}</button>`),{desktop:true});};
window.oEAnn=function(a){window._AI=a.image_data||null;showModal(mH('✏️ '+tr('announcements'))+mB(aFB(a))+mF(`<button class="btn btn-secondary" onclick="closeModal()">${tr('cancel')}</button><button class="btn btn-primary" onclick="sEAnn(${a.id})">${tr('save')}</button>`),{desktop:true});};
window.sAAnn=async function(){if(await api('POST','/api/admin/announcements',{title:v('m-at'),content:v('m-ac'),link:v('m-al'),image_data:window._AI||null})){toast(tr('save')+' ✓','success');closeModal();showAAnns();}};
window.sEAnn=async function(id){if(await api('PUT',`/api/admin/announcements/${id}`,{title:v('m-at'),content:v('m-ac'),link:v('m-al'),image_data:window._AI||null})){toast(tr('save')+' ✓','success');closeModal();showAAnns();}};
window.dAnn=async function(id){if(!confirm(tr('deleteConfirm')))return;if(await api('DELETE',`/api/admin/announcements/${id}`)){toast(tr('delete')+' ✓','success');showAAnns();}};

// ═══ LOGIN PAGE
function showLoginPage(){
  document.getElementById('login-screen').classList.remove('hidden');
  renderLP();
}
function renderLP(){
  const tl={ru:'Образовательный центр',uz:"O'quv markazi",en:'Learning Center'};
  document.getElementById('login-tagline').textContent=tl[S.lang]||tl.ru;
  document.getElementById('lbl-welcome').textContent=S.lang==='uz'?"Xush kelibsiz!":S.lang==='en'?'Welcome!':'Добро пожаловать!';
  document.getElementById('lbl-sub').textContent=S.lang==='uz'?"Hisobingizga kiring":S.lang==='en'?'Sign in to your account':'Войдите в свой аккаунт';
  document.getElementById('btn-login').textContent=tr('login');
  document.querySelectorAll('#login-screen .lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===S.lang));
}
function initLogin(){
  renderLP();
  document.querySelectorAll('#login-screen .lang-btn').forEach(b=>b.onclick=()=>{S.lang=b.dataset.lang;localStorage.setItem('imkon_lang',S.lang);renderLP();});
  document.getElementById('theme-toggle-login').onclick=toggleTheme;
  document.getElementById('inp-pw').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
  document.getElementById('btn-login').onclick=doLogin;
}
async function doLogin(){
  const username=document.getElementById('inp-un').value.trim(),password=document.getElementById('inp-pw').value;
  const errEl=document.getElementById('login-error');errEl.classList.add('hidden');
  if(!username||!password){errEl.textContent='Fill all fields';errEl.classList.remove('hidden');return;}
  const r=await api('POST','/api/login',{username,password});
  if(!r){errEl.textContent=S.lang==='uz'?"Noto'g'ri login yoki parol":S.lang==='en'?'Wrong credentials':'Неверный логин или пароль';errEl.classList.remove('hidden');return;}
  S.token=r.token;S.user=r.user;localStorage.setItem('imkon_token',r.token);launchApp();
}
function launchApp(){
  document.getElementById('login-screen').classList.add('hidden');
  if(S.user.role==='admin'){document.getElementById('admin-app').classList.remove('hidden');navigate('dashboard');}
  else{document.getElementById('mobile-app').classList.remove('hidden');navigate('home');}
}

// ═══ INIT
async function init(){
  initLogin();showLoginPage();
  if(S.token){
    try{const p=JSON.parse(atob(S.token.split('.')[1]));if(p.exp*1000>Date.now()){S.user={id:p.id,username:p.username,role:p.role,full_name:p.full_name};document.getElementById('login-screen').classList.add('hidden');launchApp();return;}}
    catch{}S.token=null;localStorage.removeItem('imkon_token');
  }
}
document.addEventListener('DOMContentLoaded',init);
