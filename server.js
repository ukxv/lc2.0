'use strict';
const express=require('express'),initSqlJs=require('sql.js'),bcrypt=require('bcryptjs'),jwt=require('jsonwebtoken'),rateLimit=require('express-rate-limit'),path=require('path'),fs=require('fs');
const app=express(),PORT=process.env.PORT||3000,JWT_SECRET='imkon_lc_2024_jwt_x9kP',DB_PATH='./data/imkon.db';
if(!fs.existsSync('./data'))fs.mkdirSync('./data');
// Tashkent UTC+5
process.env.TZ='Asia/Tashkent';
let db;
function saveDb(){fs.writeFileSync(DB_PATH,Buffer.from(db.export()));}
function dbRun(sql,p=[]){db.run(sql,p);const s=db.prepare('SELECT last_insert_rowid() AS id');s.step();const id=s.getAsObject().id||0;s.free();saveDb();return id;}
function dbGet(sql,p=[]){const s=db.prepare(sql);if(p.length)s.bind(p);const ok=s.step();const r=ok?s.getAsObject():null;s.free();return r;}
function dbAll(sql,p=[]){const s=db.prepare(sql);if(p.length)s.bind(p);const rows=[];while(s.step())rows.push(s.getAsObject());s.free();return rows;}

const SCHEMA=`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL,full_name TEXT NOT NULL,phone TEXT,created_at TEXT DEFAULT(datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS groups(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,teacher_id INTEGER,subject TEXT,created_at TEXT DEFAULT(datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS group_students(group_id INTEGER NOT NULL,student_id INTEGER NOT NULL,PRIMARY KEY(group_id,student_id));
CREATE TABLE IF NOT EXISTS schedules(id INTEGER PRIMARY KEY AUTOINCREMENT,group_id INTEGER NOT NULL,day_of_week INTEGER NOT NULL,start_time TEXT NOT NULL,room TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS lessons(id INTEGER PRIMARY KEY AUTOINCREMENT,group_id INTEGER NOT NULL,date TEXT NOT NULL,topic TEXT,homework TEXT,start_time TEXT,room TEXT,created_at TEXT DEFAULT(datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS student_attendance(id INTEGER PRIMARY KEY AUTOINCREMENT,lesson_id INTEGER NOT NULL,student_id INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'not_marked',homework_score INTEGER NOT NULL DEFAULT 0,activity_score INTEGER NOT NULL DEFAULT 0,UNIQUE(lesson_id,student_id));
CREATE TABLE IF NOT EXISTS student_balances(student_id INTEGER PRIMARY KEY,balance REAL NOT NULL DEFAULT 0,coins INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS teacher_rates(teacher_id INTEGER PRIMARY KEY,rate REAL NOT NULL DEFAULT 40);
CREATE TABLE IF NOT EXISTS revenues(id INTEGER PRIMARY KEY AUTOINCREMENT,entity_type TEXT NOT NULL,entity_id INTEGER NOT NULL DEFAULT 0,month INTEGER NOT NULL,year INTEGER NOT NULL,amount REAL NOT NULL DEFAULT 0,UNIQUE(entity_type,entity_id,month,year));
CREATE TABLE IF NOT EXISTS current_revenues(entity_type TEXT NOT NULL,entity_id INTEGER NOT NULL DEFAULT 0,amount REAL NOT NULL DEFAULT 0,PRIMARY KEY(entity_type,entity_id));
CREATE TABLE IF NOT EXISTS shop_items(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,description TEXT,price_coins INTEGER NOT NULL,image_data TEXT,available INTEGER NOT NULL DEFAULT 1,created_at TEXT DEFAULT(datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT,student_id INTEGER NOT NULL,item_id INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',order_number TEXT NOT NULL UNIQUE,created_at TEXT DEFAULT(datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS coin_transactions(id INTEGER PRIMARY KEY AUTOINCREMENT,student_id INTEGER NOT NULL,teacher_id INTEGER,amount INTEGER NOT NULL,description TEXT,created_at TEXT DEFAULT(datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS announcements(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,content TEXT,image_data TEXT,link TEXT,created_at TEXT DEFAULT(datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,description TEXT,event_date TEXT NOT NULL,event_time TEXT NOT NULL,venue TEXT,capacity INTEGER NOT NULL DEFAULT 0,group_id INTEGER,creator_id INTEGER NOT NULL,creator_role TEXT NOT NULL,created_at TEXT DEFAULT(datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS event_registrations(id INTEGER PRIMARY KEY AUTOINCREMENT,event_id INTEGER NOT NULL,student_id INTEGER NOT NULL,registered_at TEXT DEFAULT(datetime('now','localtime')),UNIQUE(event_id,student_id));
CREATE TABLE IF NOT EXISTS exams(id INTEGER PRIMARY KEY AUTOINCREMENT,group_id INTEGER NOT NULL,title TEXT NOT NULL,description TEXT,exam_date TEXT NOT NULL,exam_time TEXT NOT NULL,venue TEXT,max_score INTEGER NOT NULL DEFAULT 100,pass_score INTEGER NOT NULL DEFAULT 50,creator_id INTEGER NOT NULL,created_at TEXT DEFAULT(datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS exam_results(id INTEGER PRIMARY KEY AUTOINCREMENT,exam_id INTEGER NOT NULL,student_id INTEGER NOT NULL,score INTEGER,status TEXT NOT NULL DEFAULT 'pending',UNIQUE(exam_id,student_id));
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT);
`;

async function initDb(){
  const SQL=await initSqlJs();
  db=fs.existsSync(DB_PATH)?new SQL.Database(fs.readFileSync(DB_PATH)):new SQL.Database();
  db.run('PRAGMA foreign_keys=ON');db.run(SCHEMA);
  // migrations
  ['ALTER TABLE lessons ADD COLUMN start_time TEXT','ALTER TABLE lessons ADD COLUMN room TEXT'].forEach(s=>{try{db.run(s);}catch{}});
  saveDb();
  if(!dbGet("SELECT id FROM users WHERE username='khalimjonovv'")){
    dbRun("INSERT INTO users(username,password,role,full_name)VALUES(?,?,'admin','Administrator')",['khalimjonovv',bcrypt.hashSync('Utkir_rich1',12)]);
  }
  if(!dbGet("SELECT entity_type FROM current_revenues WHERE entity_type='center'"))
    dbRun("INSERT INTO current_revenues(entity_type,entity_id,amount)VALUES('center',0,0)");
  [['tg_support','https://t.me/imkon_support'],['tg_channel','https://t.me/imkon_lc'],['instagram','https://instagram.com/imkon_lc']].forEach(([k,v])=>{
    if(!dbGet('SELECT key FROM settings WHERE key=?',[k]))dbRun('INSERT INTO settings(key,value)VALUES(?,?)',[k,v]);
  });
  console.log('Database ready (Tashkent TZ)');
}

app.use(express.json({limit:'10mb'}));
app.use(express.static('public'));
app.use('/api/',rateLimit({windowMs:60*1000,max:600}));

function auth(req,res,next){
  const h=req.headers.authorization;
  if(!h?.startsWith('Bearer '))return res.status(401).json({error:'Unauthorized'});
  try{req.user=jwt.verify(h.slice(7),JWT_SECRET);next();}
  catch{res.status(401).json({error:'Invalid token'});}
}
function role(...roles){return(req,res,next)=>{if(!roles.includes(req.user?.role))return res.status(403).json({error:'Forbidden'});next();};}

// Today in Tashkent
function todayTZ(){return new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Tashkent'});}

// AUTH
app.post('/api/login',rateLimit({windowMs:15*60*1000,max:30}),(req,res)=>{
  const{username,password}=req.body;
  if(!username||!password)return res.status(400).json({error:'Fill all fields'});
  const user=dbGet('SELECT * FROM users WHERE username=?',[username.trim()]);
  if(!user||!bcrypt.compareSync(password,user.password))return res.status(401).json({error:'Wrong credentials'});
  const token=jwt.sign({id:user.id,username:user.username,role:user.role,full_name:user.full_name},JWT_SECRET,{expiresIn:'12h'});
  res.json({token,user:{id:user.id,username:user.username,role:user.role,full_name:user.full_name}});
});
app.post('/api/change-password',auth,(req,res)=>{
  const{old_password,new_password}=req.body;
  if(!old_password||!new_password||new_password.length<4)return res.status(400).json({error:'Invalid'});
  const user=dbGet('SELECT * FROM users WHERE id=?',[req.user.id]);
  if(!bcrypt.compareSync(old_password,user.password))return res.status(401).json({error:'Wrong old password'});
  dbRun('UPDATE users SET password=? WHERE id=?',[bcrypt.hashSync(new_password,10),req.user.id]);
  res.json({ok:true});
});
app.get('/api/settings',auth,(req,res)=>{
  const rows=dbAll('SELECT * FROM settings');const o={};rows.forEach(r=>o[r.key]=r.value);res.json(o);
});
app.get('/api/announcements',auth,(req,res)=>res.json(dbAll('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 10')));

// ── ADMIN ─────────────────────────────────────────────────────────────────────
const adm=express.Router();adm.use(auth,role('admin'));

adm.get('/dashboard',(req,res)=>{
  const stats={
    students:dbGet("SELECT COUNT(*) n FROM users WHERE role='student'").n,
    teachers:dbGet("SELECT COUNT(*) n FROM users WHERE role='teacher'").n,
    groups:dbGet("SELECT COUNT(*) n FROM groups").n,
    centerRevenue:dbGet("SELECT amount FROM current_revenues WHERE entity_type='center'")?.amount||0,
  };
  const teacherRevenues=dbAll(`SELECT u.id,u.full_name,COALESCE(cr.amount,0) AS revenue,COALESCE(tr.rate,40) AS rate FROM users u LEFT JOIN current_revenues cr ON cr.entity_type='teacher' AND cr.entity_id=u.id LEFT JOIN teacher_rates tr ON tr.teacher_id=u.id WHERE u.role='teacher' ORDER BY u.full_name`);
  stats.totalTeacherRevenue=teacherRevenues.reduce((s,t)=>s+t.revenue,0);
  const studentBalances=dbAll(`SELECT u.id,u.full_name,u.phone,COALESCE(sb.balance,0) AS balance,COALESCE(sb.coins,0) AS coins FROM users u LEFT JOIN student_balances sb ON sb.student_id=u.id WHERE u.role='student' ORDER BY u.full_name`);
  res.json({stats,teacherRevenues,studentBalances});
});

adm.get('/users',(req,res)=>res.json(dbAll("SELECT id,username,role,full_name,phone FROM users WHERE role!='admin' ORDER BY role,full_name")));
adm.post('/users',(req,res)=>{
  const{username,password,role:r,full_name,phone}=req.body;
  if(!username||!password||!r||!full_name)return res.status(400).json({error:'All fields required'});
  if(!['teacher','student'].includes(r))return res.status(400).json({error:'Invalid role'});
  if(dbGet('SELECT id FROM users WHERE username=?',[username.trim()]))return res.status(400).json({error:'Username exists'});
  try{
    const uid=dbRun('INSERT INTO users(username,password,role,full_name,phone)VALUES(?,?,?,?,?)',[username.trim(),bcrypt.hashSync(password,10),r,full_name.trim(),phone||null]);
    if(r==='student')dbRun('INSERT OR IGNORE INTO student_balances(student_id,balance,coins)VALUES(?,0,0)',[uid]);
    if(r==='teacher'){
      dbRun('INSERT OR IGNORE INTO teacher_rates(teacher_id,rate)VALUES(?,40)',[uid]);
      if(!dbGet("SELECT entity_type FROM current_revenues WHERE entity_type='teacher' AND entity_id=?",[uid]))
        dbRun("INSERT INTO current_revenues(entity_type,entity_id,amount)VALUES('teacher',?,0)",[uid]);
    }
    res.json({id:uid});
  }catch(e){res.status(500).json({error:e.message});}
});
adm.put('/users/:id',(req,res)=>{
  const{full_name,phone,password}=req.body;const uid=parseInt(req.params.id);
  if(password?.trim())dbRun('UPDATE users SET full_name=?,phone=?,password=? WHERE id=?',[full_name,phone||null,bcrypt.hashSync(password,10),uid]);
  else dbRun('UPDATE users SET full_name=?,phone=? WHERE id=?',[full_name,phone||null,uid]);
  res.json({ok:true});
});
adm.delete('/users/:id',(req,res)=>{
  const uid=parseInt(req.params.id);
  const u=dbGet('SELECT role FROM users WHERE id=?',[uid]);
  if(!u)return res.status(404).json({error:'Not found'});
  if(u.role==='admin')return res.status(403).json({error:'Cannot delete admin'});
  dbRun('DELETE FROM group_students WHERE student_id=?',[uid]);
  dbRun('DELETE FROM users WHERE id=?',[uid]);
  res.json({ok:true});
});

adm.get('/students/:id/progress',(req,res)=>{
  const sid=parseInt(req.params.id);
  const student=dbGet('SELECT id,full_name,phone FROM users WHERE id=? AND role="student"',[sid]);
  if(!student)return res.status(404).json({error:'Not found'});
  const bal=dbGet('SELECT balance,coins FROM student_balances WHERE student_id=?',[sid]);
  const months=dbAll(`SELECT strftime('%Y',l.date) AS yr,strftime('%m',l.date) AS mo,COUNT(l.id) AS total_lessons,SUM(COALESCE(sa.homework_score,0)) AS hw,SUM(COALESCE(sa.activity_score,0)) AS act,SUM(CASE WHEN sa.status='present' THEN 1 ELSE 0 END) AS attended FROM group_students gs JOIN lessons l ON l.group_id=gs.group_id LEFT JOIN student_attendance sa ON sa.lesson_id=l.id AND sa.student_id=? WHERE gs.student_id=? GROUP BY yr,mo ORDER BY yr DESC,mo DESC LIMIT 6`,[sid,sid]);
  res.json({student:{...student,balance:bal?.balance||0,coins:bal?.coins||0},months});
});

// Groups
adm.get('/groups',(req,res)=>{
  const groups=dbAll('SELECT g.*,u.full_name AS teacher_name FROM groups g LEFT JOIN users u ON u.id=g.teacher_id ORDER BY g.name');
  for(const g of groups){g.students=dbAll('SELECT u.id,u.full_name FROM group_students gs JOIN users u ON u.id=gs.student_id WHERE gs.group_id=?',[g.id]);g.schedules=dbAll('SELECT * FROM schedules WHERE group_id=? ORDER BY day_of_week,start_time',[g.id]);}
  res.json(groups);
});
adm.post('/groups',(req,res)=>{const{name,teacher_id,subject}=req.body;if(!name)return res.status(400).json({error:'Name required'});const id=dbRun('INSERT INTO groups(name,teacher_id,subject)VALUES(?,?,?)',[name,teacher_id||null,subject||null]);res.json({id});});
adm.put('/groups/:id',(req,res)=>{const{name,teacher_id,subject}=req.body;dbRun('UPDATE groups SET name=?,teacher_id=?,subject=? WHERE id=?',[name,teacher_id||null,subject||null,parseInt(req.params.id)]);res.json({ok:true});});
adm.delete('/groups/:id',(req,res)=>{dbRun('DELETE FROM groups WHERE id=?',[parseInt(req.params.id)]);res.json({ok:true});});
adm.post('/groups/:id/students',(req,res)=>{try{dbRun('INSERT OR IGNORE INTO group_students(group_id,student_id)VALUES(?,?)',[parseInt(req.params.id),parseInt(req.body.student_id)]);}catch{}res.json({ok:true});});
adm.delete('/groups/:gid/students/:sid',(req,res)=>{dbRun('DELETE FROM group_students WHERE group_id=? AND student_id=?',[parseInt(req.params.gid),parseInt(req.params.sid)]);res.json({ok:true});});

// Schedules
adm.get('/schedules',(req,res)=>res.json(dbAll(`SELECT s.*,g.name AS group_name,u.full_name AS teacher_name FROM schedules s JOIN groups g ON g.id=s.group_id LEFT JOIN users u ON u.id=g.teacher_id ORDER BY s.day_of_week,s.start_time`)));
adm.post('/schedules',(req,res)=>{const{group_id,day_of_week,start_time,room}=req.body;if(!group_id||day_of_week===undefined||!start_time||!room)return res.status(400).json({error:'All fields required'});const id=dbRun('INSERT INTO schedules(group_id,day_of_week,start_time,room)VALUES(?,?,?,?)',[group_id,day_of_week,start_time,room]);res.json({id});});
adm.put('/schedules/:id',(req,res)=>{const{group_id,day_of_week,start_time,room}=req.body;dbRun('UPDATE schedules SET group_id=?,day_of_week=?,start_time=?,room=? WHERE id=?',[group_id,day_of_week,start_time,room,parseInt(req.params.id)]);res.json({ok:true});});
adm.delete('/schedules/:id',(req,res)=>{dbRun('DELETE FROM schedules WHERE id=?',[parseInt(req.params.id)]);res.json({ok:true});});

// Lessons — improved generate
adm.post('/schedule/generate',(req,res)=>{
  const{group_id,month,year,days_of_week}=req.body; // days_of_week: array of 0-6 (Mon=0)
  if(!group_id||!month||!year||!days_of_week?.length)return res.status(400).json({error:'group_id,month,year,days_of_week required'});
  const scheds=dbAll('SELECT * FROM schedules WHERE group_id=?',[group_id]);
  if(!scheds.length)return res.status(400).json({error:'No schedule entries for this group'});
  const created=[];
  const daysInMonth=new Date(year,month,0).getDate();
  for(let d=1;d<=daysInMonth;d++){
    const date=new Date(year,month-1,d);
    const dow=(date.getDay()+6)%7; // 0=Mon
    if(!days_of_week.includes(dow))continue;
    const sched=scheds.find(s=>s.day_of_week===dow)||scheds[0];
    const dateStr=date.toISOString().slice(0,10);
    if(!dbGet('SELECT id FROM lessons WHERE group_id=? AND date=?',[group_id,dateStr])){
      const id=dbRun('INSERT INTO lessons(group_id,date,start_time,room)VALUES(?,?,?,?)',[group_id,dateStr,sched.start_time,sched.room]);
      created.push(id);
    }
  }
  res.json({ok:true,created:created.length});
});

adm.get('/lessons',(req,res)=>res.json(dbAll(`SELECT l.*,g.name AS group_name FROM lessons l JOIN groups g ON g.id=l.group_id ORDER BY l.date DESC LIMIT 100`)));
adm.delete('/lessons/:id',(req,res)=>{dbRun('DELETE FROM lessons WHERE id=?',[parseInt(req.params.id)]);res.json({ok:true});});
adm.delete('/lessons/month/:gid/:year/:month',(req,res)=>{
  const{gid,year,month}=req.params;
  const mo=String(month).padStart(2,'0');
  dbRun(`DELETE FROM lessons WHERE group_id=? AND strftime('%Y-%m',date)=?`,[parseInt(gid),`${year}-${mo}`]);
  res.json({ok:true});
});

// Balance
adm.post('/topup',(req,res)=>{
  const{student_id,amount}=req.body;if(!student_id||!amount||amount<=0)return res.status(400).json({error:'Invalid'});
  const sid=parseInt(student_id),amt=parseFloat(amount);
  const teachers=dbAll(`SELECT DISTINCT g.teacher_id,COALESCE(tr.rate,40) AS rate FROM group_students gs JOIN groups g ON g.id=gs.group_id LEFT JOIN teacher_rates tr ON tr.teacher_id=g.teacher_id WHERE gs.student_id=? AND g.teacher_id IS NOT NULL`,[sid]);
  let teacherTotal=0;
  if(teachers.length){
    const avgRate=teachers.reduce((s,t)=>s+t.rate,0)/teachers.length;
    teacherTotal=amt*avgRate/100;
    const perT=teacherTotal/teachers.length;
    for(const t of teachers){
      const ex=dbGet("SELECT entity_type FROM current_revenues WHERE entity_type='teacher' AND entity_id=?",[t.teacher_id]);
      if(ex)dbRun("UPDATE current_revenues SET amount=amount+? WHERE entity_type='teacher' AND entity_id=?",[perT,t.teacher_id]);
      else dbRun("INSERT INTO current_revenues(entity_type,entity_id,amount)VALUES('teacher',?,?)",[t.teacher_id,perT]);
    }
  }
  const cAmt=amt-teacherTotal;
  dbRun("UPDATE current_revenues SET amount=amount+? WHERE entity_type='center'",[cAmt]);
  const ex=dbGet('SELECT student_id FROM student_balances WHERE student_id=?',[sid]);
  if(ex)dbRun('UPDATE student_balances SET balance=balance+? WHERE student_id=?',[amt,sid]);
  else dbRun('INSERT INTO student_balances(student_id,balance,coins)VALUES(?,?,0)',[sid,amt]);
  res.json({ok:true,teacherTotal:+teacherTotal.toFixed(2),centerAmount:+(amt-teacherTotal).toFixed(2)});
});
adm.post('/reset-month',(req,res)=>{
  const now=new Date();const month=now.getMonth()+1;const year=now.getFullYear();
  for(const r of dbAll('SELECT * FROM current_revenues')){
    const ex=dbGet('SELECT id FROM revenues WHERE entity_type=? AND entity_id=? AND month=? AND year=?',[r.entity_type,r.entity_id,month,year]);
    if(ex)dbRun('UPDATE revenues SET amount=amount+? WHERE entity_type=? AND entity_id=? AND month=? AND year=?',[r.amount,r.entity_type,r.entity_id,month,year]);
    else dbRun('INSERT INTO revenues(entity_type,entity_id,month,year,amount)VALUES(?,?,?,?,?)',[r.entity_type,r.entity_id,month,year,r.amount]);
  }
  dbRun('UPDATE current_revenues SET amount=0');
  dbRun('UPDATE student_balances SET balance=0');
  res.json({ok:true});
});
adm.get('/teacher-rates',(req,res)=>res.json(dbAll(`SELECT u.id,u.full_name,COALESCE(tr.rate,40) AS rate FROM users u LEFT JOIN teacher_rates tr ON tr.teacher_id=u.id WHERE u.role='teacher' ORDER BY u.full_name`)));
adm.put('/teacher-rates/:id',(req,res)=>{
  const{rate}=req.body;const tid=parseInt(req.params.id);
  if(rate<0||rate>100)return res.status(400).json({error:'Rate 0-100'});
  if(dbGet('SELECT teacher_id FROM teacher_rates WHERE teacher_id=?',[tid]))dbRun('UPDATE teacher_rates SET rate=? WHERE teacher_id=?',[rate,tid]);
  else dbRun('INSERT INTO teacher_rates(teacher_id,rate)VALUES(?,?)',[tid,rate]);
  res.json({ok:true});
});

// Shop
adm.get('/shop',(req,res)=>res.json(dbAll('SELECT * FROM shop_items ORDER BY created_at DESC')));
adm.post('/shop',(req,res)=>{const{name,description,price_coins,image_data}=req.body;if(!name||!price_coins)return res.status(400).json({error:'Name and price required'});const id=dbRun('INSERT INTO shop_items(name,description,price_coins,image_data)VALUES(?,?,?,?)',[name,description||null,price_coins,image_data||null]);res.json({id});});
adm.put('/shop/:id',(req,res)=>{const{name,description,price_coins,image_data,available}=req.body;dbRun('UPDATE shop_items SET name=?,description=?,price_coins=?,image_data=?,available=? WHERE id=?',[name,description||null,price_coins,image_data||null,available!==false?1:0,parseInt(req.params.id)]);res.json({ok:true});});
adm.delete('/shop/:id',(req,res)=>{dbRun('DELETE FROM shop_items WHERE id=?',[parseInt(req.params.id)]);res.json({ok:true});});

// Orders
adm.get('/orders',(req,res)=>res.json(dbAll(`SELECT o.*,u.full_name AS student_name,si.name AS item_name,si.price_coins FROM orders o JOIN users u ON u.id=o.student_id JOIN shop_items si ON si.id=o.item_id ORDER BY o.created_at DESC`)));
adm.put('/orders/:id',(req,res)=>{
  const{status}=req.body;if(!['pending','confirmed','delivered','cancelled'].includes(status))return res.status(400).json({error:'Invalid status'});
  if(status==='cancelled'){const order=dbGet('SELECT * FROM orders WHERE id=?',[parseInt(req.params.id)]);if(order&&order.status!=='cancelled'){const item=dbGet('SELECT price_coins FROM shop_items WHERE id=?',[order.item_id]);if(item)dbRun('UPDATE student_balances SET coins=coins+? WHERE student_id=?',[item.price_coins,order.student_id]);}}
  dbRun('UPDATE orders SET status=? WHERE id=?',[status,parseInt(req.params.id)]);res.json({ok:true});
});

// Revenues
adm.get('/revenues',(req,res)=>{
  const monthly=dbAll(`SELECT r.*,CASE WHEN r.entity_type='center' THEN 'Центр' ELSE u.full_name END AS name FROM revenues r LEFT JOIN users u ON u.id=r.entity_id ORDER BY r.year DESC,r.month DESC`);
  const current=dbAll(`SELECT cr.*,CASE WHEN cr.entity_type='center' THEN 'Центр' ELSE u.full_name END AS name FROM current_revenues cr LEFT JOIN users u ON u.id=cr.entity_id`);
  res.json({monthly,current});
});

// Announcements
adm.get('/announcements',(req,res)=>res.json(dbAll('SELECT * FROM announcements ORDER BY created_at DESC')));
adm.post('/announcements',(req,res)=>{const{title,content,image_data,link}=req.body;if(!title)return res.status(400).json({error:'Title required'});const id=dbRun('INSERT INTO announcements(title,content,image_data,link)VALUES(?,?,?,?)',[title,content||null,image_data||null,link||null]);res.json({id});});
adm.put('/announcements/:id',(req,res)=>{const{title,content,image_data,link}=req.body;dbRun('UPDATE announcements SET title=?,content=?,image_data=?,link=? WHERE id=?',[title,content||null,image_data||null,link||null,parseInt(req.params.id)]);res.json({ok:true});});
adm.delete('/announcements/:id',(req,res)=>{dbRun('DELETE FROM announcements WHERE id=?',[parseInt(req.params.id)]);res.json({ok:true});});

// Events
adm.get('/events',(req,res)=>{const events=dbAll(`SELECT e.*,u.full_name AS creator_name,(SELECT COUNT(*) FROM event_registrations er WHERE er.event_id=e.id) AS registered,g.name AS group_name FROM events e JOIN users u ON u.id=e.creator_id LEFT JOIN groups g ON g.id=e.group_id ORDER BY e.event_date DESC`);res.json(events);});
adm.post('/events',(req,res)=>{const{title,description,event_date,event_time,venue,capacity,group_id}=req.body;if(!title||!event_date||!event_time)return res.status(400).json({error:'Required fields missing'});const id=dbRun('INSERT INTO events(title,description,event_date,event_time,venue,capacity,group_id,creator_id,creator_role)VALUES(?,?,?,?,?,?,?,?,?)',[title,description||null,event_date,event_time,venue||null,capacity||0,group_id||null,req.user.id,'admin']);res.json({id});});
adm.put('/events/:id',(req,res)=>{const{title,description,event_date,event_time,venue,capacity,group_id}=req.body;dbRun('UPDATE events SET title=?,description=?,event_date=?,event_time=?,venue=?,capacity=?,group_id=? WHERE id=?',[title,description||null,event_date,event_time,venue||null,capacity||0,group_id||null,parseInt(req.params.id)]);res.json({ok:true});});
adm.delete('/events/:id',(req,res)=>{dbRun('DELETE FROM events WHERE id=?',[parseInt(req.params.id)]);res.json({ok:true});});
adm.get('/events/:id/registrations',(req,res)=>res.json(dbAll(`SELECT er.*,u.full_name,u.phone FROM event_registrations er JOIN users u ON u.id=er.student_id WHERE er.event_id=? ORDER BY er.registered_at`,[parseInt(req.params.id)])));

// Exams (admin view)
adm.get('/exams',(req,res)=>res.json(dbAll(`SELECT e.*,g.name AS group_name,u.full_name AS creator_name FROM exams e JOIN groups g ON g.id=e.group_id JOIN users u ON u.id=e.creator_id ORDER BY e.exam_date DESC`)));
adm.get('/exams/:id/results',(req,res)=>res.json(dbAll(`SELECT er.*,u.full_name FROM exam_results er JOIN users u ON u.id=er.student_id WHERE er.exam_id=?`,[parseInt(req.params.id)])));

adm.put('/settings',(req,res)=>{for(const[k,v]of Object.entries(req.body)){if(dbGet('SELECT key FROM settings WHERE key=?',[k]))dbRun('UPDATE settings SET value=? WHERE key=?',[v,k]);else dbRun('INSERT INTO settings(key,value)VALUES(?,?)',[k,v]);}res.json({ok:true});});

// Calendar data (admin)
adm.get('/calendar/:gid/:year/:month',(req,res)=>{
  const{gid,year,month}=req.params;
  const mo=String(month).padStart(2,'0');
  const lessons=dbAll(`SELECT l.id,l.date,l.topic,l.homework,COALESCE(l.start_time,s.start_time) AS display_time FROM lessons l LEFT JOIN schedules s ON s.group_id=l.group_id AND s.day_of_week=((strftime('%w',l.date)+6)%7) WHERE l.group_id=? AND strftime('%Y-%m',l.date)=? GROUP BY l.id ORDER BY l.date`,[parseInt(gid),`${year}-${mo}`]);
  const exams=dbAll(`SELECT id,exam_date AS date,title FROM exams WHERE group_id=? AND strftime('%Y-%m',exam_date)=?`,[parseInt(gid),`${year}-${mo}`]);
  const students=dbAll(`SELECT u.id,u.full_name FROM group_students gs JOIN users u ON u.id=gs.student_id WHERE gs.group_id=? ORDER BY u.full_name`,[parseInt(gid)]);
  const attendance=dbAll(`SELECT sa.student_id,sa.lesson_id,sa.status,sa.homework_score,sa.activity_score FROM student_attendance sa JOIN lessons l ON l.id=sa.lesson_id WHERE l.group_id=? AND strftime('%Y-%m',l.date)=?`,[parseInt(gid),`${year}-${mo}`]);
  res.json({lessons,exams,students,attendance});
});

app.use('/api/admin',adm);

// ── TEACHER ───────────────────────────────────────────────────────────────────
const tch=express.Router();tch.use(auth,role('teacher'));

tch.get('/dashboard',(req,res)=>{
  const tid=req.user.id;
  const revenue=dbGet("SELECT amount FROM current_revenues WHERE entity_type='teacher' AND entity_id=?",[tid]);
  const students=dbAll(`SELECT DISTINCT u.id,u.full_name,COALESCE(sb.balance,0) AS balance,COALESCE(sb.coins,0) AS coins FROM group_students gs JOIN groups g ON g.id=gs.group_id JOIN users u ON u.id=gs.student_id LEFT JOIN student_balances sb ON sb.student_id=u.id WHERE g.teacher_id=? ORDER BY u.full_name`,[tid]);
  const today=todayTZ();
  const todayLessons=dbAll(`SELECT l.*,g.name AS group_name,g.subject,COALESCE(l.start_time,s.start_time) AS time,COALESCE(l.room,s.room) AS room_display FROM lessons l JOIN groups g ON g.id=l.group_id LEFT JOIN schedules s ON s.group_id=l.group_id WHERE g.teacher_id=? AND l.date=? GROUP BY l.id ORDER BY time`,[tid,today]);
  const announcements=dbAll('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 5');
  const monthlyRevenues=dbAll("SELECT * FROM revenues WHERE entity_type='teacher' AND entity_id=? ORDER BY year DESC,month DESC LIMIT 12",[tid]);
  res.json({revenue:revenue?.amount||0,students,todayLessons,announcements,monthlyRevenues});
});

tch.get('/weekly-schedule',(req,res)=>{
  const offset=parseInt(req.query.week)||0,tid=req.user.id;
  const now=new Date();const dow=now.getDay();const mon=new Date(now);
  mon.setDate(now.getDate()-(dow===0?6:dow-1)+offset*7);mon.setHours(0,0,0,0);
  const dates=Array.from({length:7},(_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return d.toISOString().slice(0,10);});
  const scheds=dbAll(`SELECT s.*,g.id AS group_id,g.name AS group_name,g.subject FROM schedules s JOIN groups g ON g.id=s.group_id WHERE g.teacher_id=?`,[tid]);
  const lessons=dbAll(`SELECT l.*,g.id AS group_id,g.name AS group_name,g.subject,COALESCE(l.start_time,s.start_time) AS display_time,COALESCE(l.room,s.room) AS display_room FROM lessons l JOIN groups g ON g.id=l.group_id LEFT JOIN schedules s ON s.group_id=l.group_id AND s.day_of_week=((strftime('%w',l.date)+6)%7) WHERE g.teacher_id=? AND l.date>=? AND l.date<=? GROUP BY l.id ORDER BY l.date,display_time`,[tid,dates[0],dates[6]]);
  const slots=[];
  for(const l of lessons){const sc=dbGet('SELECT COUNT(*) n FROM group_students WHERE group_id=?',[l.group_id]);slots.push({type:'lesson',...l,student_count:sc.n});}
  for(const s of scheds){const date=dates[s.day_of_week];if(!slots.find(sl=>sl.group_id===s.group_id&&sl.date===date)){const sc=dbGet('SELECT COUNT(*) n FROM group_students WHERE group_id=?',[s.group_id]);slots.push({type:'slot',schedule_id:s.id,day_of_week:s.day_of_week,date,start_time:s.start_time,room:s.room,group_id:s.group_id,group_name:s.group_name,subject:s.subject,lesson_id:null,student_count:sc.n});}}
  slots.sort((a,b)=>a.date.localeCompare(b.date)||(a.display_time||a.start_time||'').localeCompare(b.display_time||b.start_time||''));
  res.json({dates,slots});
});

tch.get('/groups',(req,res)=>{
  const groups=dbAll('SELECT * FROM groups WHERE teacher_id=? ORDER BY name',[req.user.id]);
  for(const g of groups){
    g.students=dbAll(`SELECT u.id,u.full_name,COALESCE(sb.balance,0) AS balance,COALESCE(sb.coins,0) AS coins FROM group_students gs JOIN users u ON u.id=gs.student_id LEFT JOIN student_balances sb ON sb.student_id=u.id WHERE gs.group_id=? ORDER BY u.full_name`,[g.id]);
    g.lessons=dbAll('SELECT * FROM lessons WHERE group_id=? ORDER BY date DESC LIMIT 15',[g.id]);
  }
  res.json(groups);
});

tch.post('/lessons',(req,res)=>{
  const{group_id,date,topic,homework}=req.body;
  if(!group_id||!date)return res.status(400).json({error:'group_id and date required'});
  if(!dbGet('SELECT id FROM groups WHERE id=? AND teacher_id=?',[group_id,req.user.id]))return res.status(403).json({error:'Not authorized'});
  const ex=dbGet('SELECT id FROM lessons WHERE group_id=? AND date=?',[group_id,date]);
  if(ex){dbRun('UPDATE lessons SET topic=?,homework=? WHERE id=?',[topic||null,homework||null,ex.id]);return res.json({id:ex.id});}
  const id=dbRun('INSERT INTO lessons(group_id,date,topic,homework)VALUES(?,?,?,?)',[group_id,date,topic||null,homework||null]);
  res.json({id});
});

tch.get('/lessons/:lid',(req,res)=>{
  const lid=parseInt(req.params.lid);
  const lesson=dbGet('SELECT l.*,g.teacher_id,g.id AS group_id FROM lessons l JOIN groups g ON g.id=l.group_id WHERE l.id=?',[lid]);
  if(!lesson||lesson.teacher_id!==req.user.id)return res.status(403).json({error:'Not authorized'});
  const students=dbAll(`SELECT u.id,u.full_name,COALESCE(sa.status,'not_marked') AS status,COALESCE(sa.homework_score,0) AS homework_score,COALESCE(sa.activity_score,0) AS activity_score FROM group_students gs JOIN users u ON u.id=gs.student_id LEFT JOIN student_attendance sa ON sa.lesson_id=? AND sa.student_id=u.id WHERE gs.group_id=? ORDER BY u.full_name`,[lid,lesson.group_id]);
  res.json({lesson,students});
});

tch.put('/lessons/:lid/grade',(req,res)=>{
  const lid=parseInt(req.params.lid);
  const{topic,homework,students}=req.body;
  const lesson=dbGet('SELECT l.*,g.teacher_id FROM lessons l JOIN groups g ON g.id=l.group_id WHERE l.id=?',[lid]);
  if(!lesson||lesson.teacher_id!==req.user.id)return res.status(403).json({error:'Not authorized'});
  if(topic!==undefined||homework!==undefined)dbRun('UPDATE lessons SET topic=?,homework=? WHERE id=?',[topic||null,homework||null,lid]);
  for(const s of students||[]){
    const old=dbGet('SELECT * FROM student_attendance WHERE lesson_id=? AND student_id=?',[lid,s.id]);
    const oldHw=old?.homework_score||0,oldAct=old?.activity_score||0;
    const newHw=Math.min(10,Math.max(0,parseInt(s.homework_score)||0));
    const newAct=Math.min(10,Math.max(0,parseInt(s.activity_score)||0));
    const coinDelta=(newHw+newAct)-(oldHw+oldAct);
    if(old)dbRun('UPDATE student_attendance SET status=?,homework_score=?,activity_score=? WHERE lesson_id=? AND student_id=?',[s.status||'not_marked',newHw,newAct,lid,s.id]);
    else dbRun('INSERT INTO student_attendance(lesson_id,student_id,status,homework_score,activity_score)VALUES(?,?,?,?,?)',[lid,s.id,s.status||'not_marked',newHw,newAct]);
    if(coinDelta!==0){
      const balEx=dbGet('SELECT student_id FROM student_balances WHERE student_id=?',[s.id]);
      if(balEx)dbRun('UPDATE student_balances SET coins=MAX(0,coins+?) WHERE student_id=?',[coinDelta,s.id]);
      else dbRun('INSERT INTO student_balances(student_id,balance,coins)VALUES(?,0,?)',[s.id,Math.max(0,coinDelta)]);
      if(coinDelta>0)dbRun('INSERT INTO coin_transactions(student_id,teacher_id,amount,description)VALUES(?,?,?,?)',[s.id,req.user.id,coinDelta,'Оценка за урок']);
    }
  }
  res.json({ok:true});
});

tch.get('/students/:id/progress',(req,res)=>{
  const sid=parseInt(req.params.id);
  if(!dbGet('SELECT 1 x FROM group_students gs JOIN groups g ON g.id=gs.group_id WHERE g.teacher_id=? AND gs.student_id=?',[req.user.id,sid]))return res.status(403).json({error:'Not your student'});
  const student=dbGet('SELECT id,full_name FROM users WHERE id=?',[sid]);
  const bal=dbGet('SELECT * FROM student_balances WHERE student_id=?',[sid]);
  const months=dbAll(`SELECT strftime('%Y',l.date) AS yr,strftime('%m',l.date) AS mo,COUNT(l.id) AS total_lessons,SUM(COALESCE(sa.homework_score,0)) AS hw,SUM(COALESCE(sa.activity_score,0)) AS act,SUM(CASE WHEN sa.status='present' THEN 1 ELSE 0 END) AS attended FROM group_students gs JOIN lessons l ON l.group_id=gs.group_id LEFT JOIN student_attendance sa ON sa.lesson_id=l.id AND sa.student_id=? WHERE gs.student_id=? GROUP BY yr,mo ORDER BY yr DESC,mo DESC LIMIT 6`,[sid,sid]);
  res.json({student:{...student,balance:bal?.balance||0,coins:bal?.coins||0},months});
});

tch.post('/give-coins',(req,res)=>{
  const{student_id,amount,description}=req.body;if(!student_id||!amount||amount<=0)return res.status(400).json({error:'Invalid'});
  const sid=parseInt(student_id);
  if(!dbGet('SELECT 1 x FROM group_students gs JOIN groups g ON g.id=gs.group_id WHERE g.teacher_id=? AND gs.student_id=?',[req.user.id,sid]))return res.status(403).json({error:'Not your student'});
  const ex=dbGet('SELECT student_id FROM student_balances WHERE student_id=?',[sid]);
  if(ex)dbRun('UPDATE student_balances SET coins=coins+? WHERE student_id=?',[parseInt(amount),sid]);
  else dbRun('INSERT INTO student_balances(student_id,balance,coins)VALUES(?,0,?)',[sid,parseInt(amount)]);
  dbRun('INSERT INTO coin_transactions(student_id,teacher_id,amount,description)VALUES(?,?,?,?)',[sid,req.user.id,parseInt(amount),description||null]);
  res.json({ok:true});
});

// Events (teacher)
tch.get('/events',(req,res)=>{
  const myGroups=dbAll('SELECT id FROM groups WHERE teacher_id=?',[req.user.id]).map(g=>g.id);
  if(!myGroups.length)return res.json([]);
  const events=dbAll(`SELECT e.*,(SELECT COUNT(*) FROM event_registrations er WHERE er.event_id=e.id) AS registered,g.name AS group_name FROM events e LEFT JOIN groups g ON g.id=e.group_id WHERE e.creator_id=? OR e.group_id IN(${myGroups.join(',')}) ORDER BY e.event_date DESC`,[req.user.id]);
  res.json(events);
});
tch.post('/events',(req,res)=>{
  const{title,description,event_date,event_time,venue,capacity,group_id}=req.body;
  if(!title||!event_date||!event_time||!group_id)return res.status(400).json({error:'Required fields missing'});
  if(!dbGet('SELECT id FROM groups WHERE id=? AND teacher_id=?',[group_id,req.user.id]))return res.status(403).json({error:'Not your group'});
  const id=dbRun('INSERT INTO events(title,description,event_date,event_time,venue,capacity,group_id,creator_id,creator_role)VALUES(?,?,?,?,?,?,?,?,?)',[title,description||null,event_date,event_time,venue||null,capacity||0,group_id,req.user.id,'teacher']);
  res.json({id});
});

// Exams (teacher)
tch.get('/exams',(req,res)=>{
  const myGroups=dbAll('SELECT id FROM groups WHERE teacher_id=?',[req.user.id]).map(g=>g.id);
  if(!myGroups.length)return res.json([]);
  const today=todayTZ();
  const exams=dbAll(`SELECT e.*,g.name AS group_name,CASE WHEN e.exam_date<? THEN 'past' ELSE 'upcoming' END AS exam_status FROM exams e LEFT JOIN groups g ON g.id=e.group_id WHERE e.group_id IN(${myGroups.join(',')}) ORDER BY e.exam_date DESC`,[today]);
  res.json(exams);
});
tch.post('/exams',(req,res)=>{
  const{group_id,title,description,exam_date,exam_time,venue,max_score,pass_score}=req.body;
  if(!group_id||!title||!exam_date||!exam_time)return res.status(400).json({error:'Required fields missing'});
  if(!dbGet('SELECT id FROM groups WHERE id=? AND teacher_id=?',[group_id,req.user.id]))return res.status(403).json({error:'Not your group'});
  const id=dbRun('INSERT INTO exams(group_id,title,description,exam_date,exam_time,venue,max_score,pass_score,creator_id)VALUES(?,?,?,?,?,?,?,?,?)',[group_id,title,description||null,exam_date,exam_time,venue||null,max_score||100,pass_score||50,req.user.id]);
  // auto-insert results for all group students
  const students=dbAll('SELECT student_id FROM group_students WHERE group_id=?',[group_id]);
  for(const s of students)dbRun('INSERT OR IGNORE INTO exam_results(exam_id,student_id,status)VALUES(?,?,?)',[id,s.student_id,'pending']);
  // Create announcement
  const grp=dbGet('SELECT name FROM groups WHERE id=?',[group_id]);
  dbRun('INSERT INTO announcements(title,content)VALUES(?,?)',['📝 Экзамен: '+title,`Группа: ${grp?.name||''} | Дата: ${exam_date} ${exam_time}${venue?' | Место: '+venue:''}`]);
  res.json({id});
});
tch.put('/exams/:id/results',(req,res)=>{
  const eid=parseInt(req.params.id);
  const exam=dbGet('SELECT e.*,g.teacher_id FROM exams e JOIN groups g ON g.id=e.group_id WHERE e.id=?',[eid]);
  if(!exam||exam.teacher_id!==req.user.id)return res.status(403).json({error:'Not authorized'});
  for(const r of req.body.results||[]){
    const score=parseInt(r.score)||0;
    const status=score>=exam.pass_score?'passed':'failed';
    const ex=dbGet('SELECT id FROM exam_results WHERE exam_id=? AND student_id=?',[eid,r.student_id]);
    if(ex)dbRun('UPDATE exam_results SET score=?,status=? WHERE exam_id=? AND student_id=?',[score,status,eid,r.student_id]);
    else dbRun('INSERT INTO exam_results(exam_id,student_id,score,status)VALUES(?,?,?,?)',[eid,r.student_id,score,status]);
    // coins = score
    const balEx=dbGet('SELECT student_id FROM student_balances WHERE student_id=?',[r.student_id]);
    if(balEx)dbRun('UPDATE student_balances SET coins=coins+? WHERE student_id=?',[score,r.student_id]);
    else dbRun('INSERT INTO student_balances(student_id,balance,coins)VALUES(?,0,?)',[r.student_id,score]);
    if(score>0)dbRun('INSERT INTO coin_transactions(student_id,teacher_id,amount,description)VALUES(?,?,?,?)',[r.student_id,req.user.id,score,'Экзамен: '+exam.title]);
  }
  res.json({ok:true});
});
tch.get('/exams/:id',(req,res)=>{
  const eid=parseInt(req.params.id);
  const exam=dbGet('SELECT e.*,g.teacher_id FROM exams e JOIN groups g ON g.id=e.group_id WHERE e.id=?',[eid]);
  if(!exam||exam.teacher_id!==req.user.id)return res.status(403).json({error:'Not authorized'});
  const results=dbAll(`SELECT er.*,u.full_name FROM exam_results er JOIN users u ON u.id=er.student_id WHERE er.exam_id=?`,[eid]);
  res.json({exam,results});
});

// Calendar (teacher)
tch.get('/calendar/:gid/:year/:month',(req,res)=>{
  const{gid,year,month}=req.params;
  if(!dbGet('SELECT id FROM groups WHERE id=? AND teacher_id=?',[parseInt(gid),req.user.id]))return res.status(403).json({error:'Not your group'});
  const mo=String(month).padStart(2,'0');
  const lessons=dbAll(`SELECT l.id,l.date,l.topic,COALESCE(l.start_time,s.start_time) AS display_time FROM lessons l LEFT JOIN schedules s ON s.group_id=l.group_id AND s.day_of_week=((strftime('%w',l.date)+6)%7) WHERE l.group_id=? AND strftime('%Y-%m',l.date)=? GROUP BY l.id ORDER BY l.date`,[parseInt(gid),`${year}-${mo}`]);
  const exams=dbAll(`SELECT id,exam_date AS date,title,max_score FROM exams WHERE group_id=? AND strftime('%Y-%m',exam_date)=?`,[parseInt(gid),`${year}-${mo}`]);
  const students=dbAll(`SELECT u.id,u.full_name FROM group_students gs JOIN users u ON u.id=gs.student_id WHERE gs.group_id=? ORDER BY u.full_name`,[parseInt(gid)]);
  const attendance=dbAll(`SELECT sa.student_id,sa.lesson_id,l.date,sa.status,sa.homework_score,sa.activity_score FROM student_attendance sa JOIN lessons l ON l.id=sa.lesson_id WHERE l.group_id=? AND strftime('%Y-%m',l.date)=?`,[parseInt(gid),`${year}-${mo}`]);
  const examResults=dbAll(`SELECT er.student_id,er.exam_id,er.score,er.status FROM exam_results er JOIN exams e ON e.id=er.exam_id WHERE e.group_id=? AND strftime('%Y-%m',e.exam_date)=?`,[parseInt(gid),`${year}-${mo}`]);
  res.json({lessons,exams,students,attendance,examResults});
});

app.use('/api/teacher',tch);

// ── STUDENT ───────────────────────────────────────────────────────────────────
const stu=express.Router();stu.use(auth,role('student'));

stu.get('/dashboard',(req,res)=>{
  const sid=req.user.id;
  const bal=dbGet('SELECT * FROM student_balances WHERE student_id=?',[sid]);
  const groups=dbAll(`SELECT g.id,g.name,g.subject,u.full_name AS teacher_name FROM group_students gs JOIN groups g ON g.id=gs.group_id LEFT JOIN users u ON u.id=g.teacher_id WHERE gs.student_id=?`,[sid]);
  const announcements=dbAll('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 5');
  const settings=(()=>{const rows=dbAll('SELECT * FROM settings');const o={};rows.forEach(r=>o[r.key]=r.value);return o;})();
  const user=dbGet('SELECT id,full_name,phone,username FROM users WHERE id=?',[sid]);
  res.json({balance:bal?.balance||0,coins:bal?.coins||0,groups,announcements,settings,user});
});

stu.get('/weekly-schedule',(req,res)=>{
  const offset=parseInt(req.query.week)||0,sid=req.user.id;
  const now=new Date();const dow=now.getDay();const mon=new Date(now);
  mon.setDate(now.getDate()-(dow===0?6:dow-1)+offset*7);mon.setHours(0,0,0,0);
  const dates=Array.from({length:7},(_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return d.toISOString().slice(0,10);});
  const slots=dbAll(`SELECT l.*,g.name AS group_name,g.subject,u.full_name AS teacher_name,COALESCE(sa.status,'not_marked') AS att_status,COALESCE(sa.homework_score,0) AS homework_score,COALESCE(sa.activity_score,0) AS activity_score,COALESCE(l.start_time,s.start_time) AS display_time,COALESCE(l.room,s.room) AS display_room FROM lessons l JOIN group_students gs ON gs.group_id=l.group_id JOIN groups g ON g.id=l.group_id LEFT JOIN users u ON u.id=g.teacher_id LEFT JOIN schedules s ON s.group_id=l.group_id AND s.day_of_week=((strftime('%w',l.date)+6)%7) LEFT JOIN student_attendance sa ON sa.lesson_id=l.id AND sa.student_id=? WHERE gs.student_id=? AND l.date>=? AND l.date<=? GROUP BY l.id ORDER BY l.date,display_time`,[sid,sid,dates[0],dates[6]]);
  res.json({dates,slots});
});

stu.get('/progress',(req,res)=>{
  const sid=req.user.id;
  const months=dbAll(`SELECT strftime('%Y',l.date) AS yr,strftime('%m',l.date) AS mo,COUNT(l.id) AS total_lessons,SUM(COALESCE(sa.homework_score,0)) AS hw,SUM(COALESCE(sa.activity_score,0)) AS act,SUM(CASE WHEN sa.status='present' OR sa.status='excused' THEN 1 ELSE 0 END) AS attended FROM group_students gs JOIN lessons l ON l.group_id=gs.group_id LEFT JOIN student_attendance sa ON sa.lesson_id=l.id AND sa.student_id=? WHERE gs.student_id=? GROUP BY yr,mo ORDER BY yr DESC,mo DESC LIMIT 6`,[sid,sid]);
  res.json(months);
});

stu.get('/exams',(req,res)=>{
  const sid=req.user.id;
  const today=todayTZ();
  const exams=dbAll(`SELECT e.*,g.name AS group_name,er.score,er.status AS result_status,CASE WHEN e.exam_date<? THEN 'past' ELSE 'upcoming' END AS exam_status FROM exams e JOIN group_students gs ON gs.group_id=e.group_id JOIN groups g ON g.id=e.group_id LEFT JOIN exam_results er ON er.exam_id=e.id AND er.student_id=? WHERE gs.student_id=? ORDER BY e.exam_date DESC`,[today,sid,sid]);
  res.json(exams);
});

stu.get('/calendar/:gid/:year/:month',(req,res)=>{
  const{gid,year,month}=req.params,sid=req.user.id;
  if(!dbGet('SELECT 1 x FROM group_students WHERE group_id=? AND student_id=?',[parseInt(gid),sid]))return res.status(403).json({error:'Not your group'});
  const mo=String(month).padStart(2,'0');
  const lessons=dbAll(`SELECT l.id,l.date,l.topic,COALESCE(l.start_time,s.start_time) AS display_time FROM lessons l LEFT JOIN schedules s ON s.group_id=l.group_id AND s.day_of_week=((strftime('%w',l.date)+6)%7) WHERE l.group_id=? AND strftime('%Y-%m',l.date)=? GROUP BY l.id ORDER BY l.date`,[parseInt(gid),`${year}-${mo}`]);
  const exams=dbAll(`SELECT id,exam_date AS date,title,max_score FROM exams WHERE group_id=? AND strftime('%Y-%m',exam_date)=?`,[parseInt(gid),`${year}-${mo}`]);
  const students=dbAll(`SELECT u.id,u.full_name FROM group_students gs JOIN users u ON u.id=gs.student_id WHERE gs.group_id=? ORDER BY u.full_name`,[parseInt(gid)]);
  const attendance=dbAll(`SELECT sa.student_id,sa.lesson_id,l.date,sa.status,sa.homework_score,sa.activity_score FROM student_attendance sa JOIN lessons l ON l.id=sa.lesson_id WHERE l.group_id=? AND strftime('%Y-%m',l.date)=?`,[parseInt(gid),`${year}-${mo}`]);
  const examResults=dbAll(`SELECT er.student_id,er.exam_id,er.score,er.status FROM exam_results er JOIN exams e ON e.id=er.exam_id WHERE e.group_id=? AND strftime('%Y-%m',e.exam_date)=?`,[parseInt(gid),`${year}-${mo}`]);
  res.json({lessons,exams,students,attendance,examResults});
});

stu.get('/shop',(req,res)=>{
  const items=dbAll('SELECT id,name,description,price_coins,image_data FROM shop_items WHERE available=1 ORDER BY created_at DESC');
  const bal=dbGet('SELECT coins FROM student_balances WHERE student_id=?',[req.user.id]);
  res.json({items,coins:bal?.coins||0});
});
stu.post('/order',(req,res)=>{
  const{item_id}=req.body,sid=req.user.id;
  const item=dbGet('SELECT * FROM shop_items WHERE id=? AND available=1',[parseInt(item_id)]);
  if(!item)return res.status(404).json({error:'Item not found'});
  const bal=dbGet('SELECT coins FROM student_balances WHERE student_id=?',[sid]);
  if(!bal||bal.coins<item.price_coins)return res.status(400).json({error:'Not enough coins'});
  const orderNum='ORD-'+Date.now().toString().slice(-5)+Math.floor(Math.random()*100);
  dbRun('UPDATE student_balances SET coins=coins-? WHERE student_id=?',[item.price_coins,sid]);
  const id=dbRun("INSERT INTO orders(student_id,item_id,status,order_number)VALUES(?,?,'pending',?)",[sid,item.id,orderNum]);
  res.json({id,order_number:orderNum});
});
stu.get('/orders',(req,res)=>res.json(dbAll(`SELECT o.*,si.name AS item_name,si.price_coins,si.image_data FROM orders o JOIN shop_items si ON si.id=o.item_id WHERE o.student_id=? ORDER BY o.created_at DESC`,[req.user.id])));

stu.get('/events',(req,res)=>{
  const sid=req.user.id;
  const myGroups=dbAll('SELECT group_id FROM group_students WHERE student_id=?',[sid]).map(g=>g.group_id);
  const groupIn=myGroups.length?`OR e.group_id IN(${myGroups.join(',')})`:' ';
  const events=dbAll(`SELECT e.*,g.name AS group_name,(SELECT COUNT(*) FROM event_registrations er WHERE er.event_id=e.id) AS registered,(SELECT COUNT(*) FROM event_registrations er WHERE er.event_id=e.id AND er.student_id=?) AS is_registered FROM events e LEFT JOIN groups g ON g.id=e.group_id WHERE e.group_id IS NULL ${groupIn} ORDER BY e.event_date DESC`,[sid]);
  res.json(events);
});
stu.post('/events/:id/register',(req,res)=>{
  const eid=parseInt(req.params.id),sid=req.user.id;
  const event=dbGet('SELECT * FROM events WHERE id=?',[eid]);
  if(!event)return res.status(404).json({error:'Not found'});
  const registered=dbGet('SELECT COUNT(*) n FROM event_registrations WHERE event_id=?',[eid]).n;
  if(event.capacity>0&&registered>=event.capacity)return res.status(400).json({error:'No spots left'});
  if(dbGet('SELECT id FROM event_registrations WHERE event_id=? AND student_id=?',[eid,sid]))return res.status(400).json({error:'Already registered'});
  dbRun('INSERT INTO event_registrations(event_id,student_id)VALUES(?,?)',[eid,sid]);
  res.json({ok:true});
});
stu.delete('/events/:id/register',(req,res)=>{dbRun('DELETE FROM event_registrations WHERE event_id=? AND student_id=?',[parseInt(req.params.id),req.user.id]);res.json({ok:true});});

app.use('/api/student',stu);
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));

initDb().then(()=>app.listen(PORT,'0.0.0.0',()=>console.log(`✅ Imkon LC → http://localhost:${PORT}`))).catch(e=>{console.error(e);process.exit(1);});
