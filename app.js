const app = document.querySelector('#app');
const role = document.querySelector('#role');
const source = 'https://stv.naer.edu.tw/data/course_outline/pta_18518_3555074_59836.pdf';
const roots = new Set(['port','phone','scope','gram','meter']);
const isPrefix = p => p.endsWith('-');
const isSuffix = p => p.startsWith('-');
const isCompound = q => q.p.every(p => !isPrefix(p) && !isSuffix(p));
const tileType = p => isPrefix(p) ? 'pre' : isSuffix(p) ? 'suf' : 'base';
const partKind = (part, question) => {
  if (isPrefix(part)) return ['Prefix', '字首', 'pre'];
  if (isSuffix(part)) return ['Suffix', '字尾', 'suf'];
  if (roots.has(part) && part !== 'port' && !isCompound(question)) {
    return ['Root', '字根', 'root'];
  }
  return ['Base', '基底詞', 'base'];
};
const partLabel = kind => `<span class="part-label ${kind[2]}">${kind[0]} <span lang="zh-Hant">${kind[1]}</span></span>`;
const partMeaning = (part, question) => specificMeanings[question.w]?.[part] ?? meanings[part];
const byWord = new Map(bank.map(q => [q.w,q]));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const shuffle = values => {
  const result = [...values];
  for (let i=result.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
};
const presets = {
  '字首入門': bank.filter(q => q.p.some(isPrefix)),
  '人物與職業': bank.filter(q => ['-er','-or','-ist','-ian','-ess'].includes(q.p[1])),
  '複合字': bank.filter(isCompound),
  '交通工具': bank.filter(q => ['airplane','bicycle','motorcycle','scooter','subway','airport','railway','railroad'].includes(q.w)),
  '校園生活': bank.filter(q => ['blackboard','classmate','classroom','homework','notebook','teacher','workbook'].includes(q.w)),
  '數量字首': bank.filter(q => ['bi-','tri-','centi-','kilo-'].includes(q.p[0])),
  '形容詞字尾': bank.filter(q => ['-ful','-less','-able','-ous','-y'].includes(q.p[1])),
  '常見副詞': bank.filter(q => q.p.includes('-ly'))
};
function readDraft(){
  try {return JSON.parse(localStorage.getItem('wordparts-draft-v1')) || {};}
  catch {return {};}
}
function teacher(){
  role.textContent='教師工作台';
  const savedDraft=readDraft();
  const openPeople=new URLSearchParams(location.search).get('preset')==='people';
  const defaultPreset='人物與職業';
  const draft=openPeople||!Array.isArray(savedDraft.words)
    ? {title:defaultPreset,words:presets[defaultPreset].map(q=>q.w)}
    : savedDraft;
  let selected=new Set(draft.words.filter(w=>byWord.has(w)));
  let tab='全部';
  let part='';
  app.innerHTML=`
    <section class="hero"><div><h1>國中構詞練習</h1><p>選字、預覽，再把拼字任務分享給學生。</p></div><div class="example">teach <span>+</span> -er <span>→</span> teacher</div></section>
    <div class="layout"><section class="panel">
      <div class="row spread"><h2>構詞題庫</h2><small>${bank.length} 題 · <a href="${source}" target="_blank" rel="noopener">108 課綱附錄五</a></small></div>
      <div class="row"><input id="search" class="search" type="search" placeholder="搜尋單字、構詞或中文" aria-label="搜尋題庫"><select id="tier" aria-label="字彙範圍"><option value="all">常用 2000 範圍</option><option value="1">基本 1200 範圍</option><option value="2">其餘參考字詞</option></select></div>
      <div class="tabs" id="tabs"></div><div class="chips" id="parts"></div>
      <div class="row spread divider"><small id="found"></small><div class="row"><button id="all" class="chip">勾選目前結果</button><button id="none" class="chip">取消目前結果</button></div></div>
      <div id="words" class="word-list"></div>
    </section><aside class="stack"><section class="panel stack">
      <div><h2>我的活動</h2><select id="preset" class="full" aria-label="套用題組"><option value="">套用現成題組…</option>${Object.keys(presets).map(p=>`<option>${p}</option>`).join('')}</select></div>
      <label class="field">活動名稱<input id="title" maxlength="32" placeholder="Word Parts Challenge"></label>
      <div class="row"><label class="field">玩法<select id="mode"><option value="build">組合單字</option><option value="split">拆解單字</option></select></label><label class="field">提示<select id="hint"><option value="en">英文</option><option value="both">英文＋中文按鈕</option><option value="zh">中文</option></select></label></div>
      <label class="row"><input id="random" type="checkbox"> 每次開啟時打亂題序</label>
      <div><div class="row spread"><strong id="count"></strong><button id="clear" class="chip">清空</button></div><p class="chosen" id="chosen"></p></div>
      <div class="actions"><a id="preview" class="button" target="_blank" rel="noopener">學生預覽</a><button class="primary" id="share">複製學生連結</button></div>
      <button id="qrBtn">顯示 QR Code</button><div id="qr" class="qr" hidden><canvas aria-label="學生任務 QR Code"></canvas><a id="download" class="button" download="word-parts-qr.png">下載 QR Code</a></div>
      <input id="link" class="full" aria-label="學生連結" readonly hidden>
      <div class="message muted" id="status" role="status"></div>
    </section></aside></div>`;
  const $=id=>document.getElementById(id);
  $('title').value=draft.title||'';
  $('mode').value=draft.mode==='split'?'split':'build';
  $('hint').value=['both','zh'].includes(draft.hint)?draft.hint:'en';
  $('random').checked=draft.random!==false;
  const category={
    '全部':()=>true,
    '字首':q=>q.p.some(isPrefix),
    '基底詞':q=>q.p.some(p=>tileType(p)==='base'&&!roots.has(p)),
    '字根':q=>q.p.some(p=>roots.has(p)&&!isCompound(q)),
    '字尾':q=>q.p.some(isSuffix),
    '複合字':isCompound
  };
  function results(){
    const term=$('search').value.trim().toLowerCase();
    return bank.filter(q=>category[tab](q)&&(!part||q.p.includes(part))&&($('tier').value==='all'||q.t===Number($('tier').value))&&[q.w,q.zh,...q.p].some(x=>x.includes(term)));
  }
  function renderParts(){
    $('tabs').innerHTML=Object.keys(category).map(key=>`<button data-tab="${key}" aria-pressed="${key===tab}">${key}</button>`).join('');
    const types={'字首':isPrefix,'字尾':isSuffix,'字根':p=>roots.has(p),'基底詞':p=>tileType(p)==='base'&&!roots.has(p),'複合字':()=>true};
    const values=tab==='全部'?[]:[...new Set(bank.filter(category[tab]).flatMap(q=>q.p.filter(types[tab])))].sort();
    $('parts').innerHTML=values.length?['',...values].map(p=>`<button class="chip" data-part="${p}" aria-pressed="${p===part}">${p||'全部'}</button>`).join(''):'';
  }
  function renderWords(){
    const rows=results();
    $('found').textContent=`找到 ${rows.length} 題`;
    $('all').disabled=$('none').disabled=!rows.length;
    $('words').innerHTML=rows.map(q=>`<label class="word"><input type="checkbox" value="${q.w}" ${selected.has(q.w)?'checked':''}><span><strong>${q.w}</strong><small>${q.p.join(' + ')} · ${q.zh}</small></span><span class="tag">${q.t===1?'基本 1200':'其餘字詞'}</span></label>`).join('')||'<p>沒有符合的單字。</p>';
  }
  function config(){
    return {title:$('title').value.trim(),mode:$('mode').value,hint:$('hint').value,random:$('random').checked,words:[...selected]};
  }
  function linkFor(data){
    const url=new URL(location.href);
    url.search='';
    const bits=new Uint8Array(Math.ceil(bank.length/8));
    for(const w of data.words){
      const i=bank.indexOf(byWord.get(w));
      bits[i>>3]|=1<<(i%8);
    }
    const title=btoa(String.fromCharCode(...new TextEncoder().encode(data.title))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    url.hash=['v2',btoa(String.fromCharCode(...bits)).replace(/=+$/,''),data.mode==='split'?'s':'b',data.hint,data.random?'1':'0',title].join('.');
    return url.href;
  }
  function update(saveDraft=true){
    const data=config();
    if(saveDraft){
      try{localStorage.setItem('wordparts-draft-v1',JSON.stringify(data));}catch{}
    }
    $('count').textContent=`已選 ${selected.size} 題`;
    $('chosen').textContent=data.words.join(' · ');
    $('preview').href=selected.size?linkFor(data):'#';
    $('preview').classList.toggle('disabled',!selected.size);
    $('preview').tabIndex=selected.size?0:-1;
    $('preview').setAttribute('aria-disabled',String(!selected.size));
    $('share').disabled=$('qrBtn').disabled=$('clear').disabled=!selected.size;
    $('qr').hidden=$('link').hidden=true;
    $('qrBtn').textContent='顯示 QR Code';
    $('status').textContent='';
  }
  $('tabs').onclick=e=>{const key=e.target.dataset.tab;if(key){tab=key;part='';renderParts();renderWords();}};
  $('parts').onclick=e=>{if('part' in e.target.dataset){part=e.target.dataset.part;renderParts();renderWords();}};
  $('search').oninput=$('tier').onchange=renderWords;
  $('words').onchange=e=>{const input=e.target;if(input.checked)selected.add(input.value);else selected.delete(input.value);update();};
  $('all').onclick=()=>{results().forEach(q=>selected.add(q.w));renderWords();update();};
  $('none').onclick=()=>{results().forEach(q=>selected.delete(q.w));renderWords();update();};
  $('clear').onclick=()=>{selected.clear();renderWords();update();};
  $('preset').onchange=()=>{
    const name=$('preset').value;
    if(!presets[name])return;
    selected=new Set(presets[name].map(q=>q.w));
    $('title').value=name;
    $('preset').value='';
    $('tier').value='all';
    $('search').value='';
    tab='全部';part='';
    renderParts();renderWords();update();
  };
  $('title').oninput=$('mode').onchange=$('hint').onchange=$('random').onchange=update;
  $('share').onclick=async()=>{
    const url=linkFor(config());
    $('link').value=url;$('link').hidden=false;
    try{await navigator.clipboard.writeText(url);$('status').textContent='已複製學生連結';}
    catch{$('link').select();$('status').textContent='請從上方欄位手動複製連結。';}
  };
  $('qrBtn').onclick=()=>{
    if(!$('qr').hidden){$('qr').hidden=true;$('qrBtn').textContent='顯示 QR Code';return;}
    try{
      const code=new QRCode(-1,1);
      code.addData(linkFor(config()));code.make();
      const canvas=$('qr').querySelector('canvas');
      const size=code.getModuleCount();
      canvas.width=canvas.height=(size+8)*8;
      const ctx=canvas.getContext('2d');
      ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#111';
      for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(code.isDark(r,c))ctx.fillRect((c+4)*8,(r+4)*8,8,8);
      $('download').href=canvas.toDataURL('image/png');
      $('qr').hidden=false;$('qrBtn').textContent='收起 QR Code';
    }catch{$('status').textContent='QR Code 產生失敗。可以使用學生連結。';}
  };
  renderParts();renderWords();update(false);
}
function readTask(){
  const [version,encoded,mode,hint,random,title]=location.hash.slice(1).split('.');
  if(!['v1','v2'].includes(version)||!encoded||!['s','b'].includes(mode)||!['en','both','zh'].includes(hint))throw Error('invalid task');
  const bits=atob(encoded);
  const legacyCount=94;
  const wordCount=version==='v1'?legacyCount:bank.length;
  const byteCount=Math.ceil(wordCount/8);
  if(!bits.length||bits.length>byteCount||(version==='v1'&&bits.length!==byteCount))throw Error('invalid task');
  const words=bank.filter((q,i)=>i<wordCount&&(bits.charCodeAt(i>>3)&(1<<(i%8))));
  if(!words.length)throw Error('empty task');
  const decoded=new TextDecoder().decode(Uint8Array.from(atob((title||'').replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)));
  return {words,mode,hint,random:random==='1',title:decoded.slice(0,32)||'Word Parts Challenge'};
}
function student(task){
  role.textContent='Student Practice';
  let words,index,correctFirst,q,choices,slots,active,tries,done,showZh,message;
  function restart(){
    words=task.random?shuffle(task.words):[...task.words];
    index=correctFirst=0;next();
  }
  function next(){
    q=words[index];
    if(!q){finish();return;}
    const distractors=q.p.flatMap(p=>shuffle([...new Set(bank.flatMap(x=>x.p))].filter(x=>partKind(x,q)[2]===partKind(p,q)[2]&&!q.p.includes(x))).slice(0,2));
    choices=shuffle([...new Set([...q.p,...distractors])]);
    slots=Array(q.p.length).fill(null);
    active=tries=0;done=showZh=false;message='';render();
  }
  function shell(content,progress){
    app.innerHTML=`<section class="game"><div class="game-head"><h1>${esc(task.title)}</h1><progress class="progress" aria-label="Progress" max="${words.length}" value="${progress}"></progress><small>${progress} / ${words.length}</small></div>${content}</section>`;
  }
  function finish(){
    shell(`<div class="panel paper finish-paper">
      <div class="sheryl-avatar" role="img" aria-label="Illustrated Sheryl holding a word card">
        <span class="avatar-hair"></span>
        <span class="avatar-face"><i></i><b></b></span>
        <span class="avatar-top"></span>
        <span class="avatar-card">WORD</span>
      </div>
      <h2>Nice work!</h2><p class="clue">You finished ${words.length} words.</p><p>Correct on the first try · ${correctFirst} / ${words.length}</p></div><button class="primary" id="again">Play again</button>`,words.length);
  }
  function render(){
    const clue=task.hint==='zh'?q.zh:q.en;
    shell(`<div class="panel paper"><p>${task.mode==='s'?'Split this word into parts':'Build the word that means'}</p>
      <p class="clue">${esc(task.mode==='s'?q.w:clue)}</p>
      ${task.hint==='both'&&!done?`<button id="hintBtn" class="chip">${showZh?'Hide Chinese':'中文提示'}</button>${showZh?` <span>${q.zh}</span>`:''}`:''}
      <div class="tiles answer-tiles ${done?'solved':''}">${slots.map((p,i)=>{
        const kind=partKind(q.p[i],q);
        return `${i?'<span class="part-plus" aria-hidden="true">+</span>':''}<div class="answer-part">${partLabel(kind)}<button class="tile ${p?partKind(p,q)[2]:'empty'} ${active===i&&!done?'active':''}" data-slot="${i}" aria-label="${kind[0]} ${kind[1]}, part ${i+1}${p?', '+p:''}" ${done?'disabled':''}>${p||'＋'}</button></div>`;
      }).join('')}</div>
      <div class="feedback" role="status">${message}</div>
      ${done?`<p class="solved-word"><span>${q.p.join(' + ')} → </span><strong>${q.w}</strong></p><p>${esc(clue)}${q.n?' · '+esc(q.n):''}</p>`:''}
      </div>
      ${done?'<button class="primary" id="next">Next</button>':`<div class="panel"><div class="tiles">${choices.map(p=>{
        const kind=partKind(p,q);
        return `<button class="tile choice-tile ${kind[2]}" data-tile="${p}" ${slots.includes(p)?'disabled':''}>${partLabel(kind)}<strong>${p}</strong><small>${esc(partMeaning(p,q))}</small></button>`;
      }).join('')}</div><div class="row game-actions"><button id="reset">Clear</button><button class="primary" id="check" ${slots.includes(null)?'disabled':''}>Check</button></div></div>`}`,index+Number(done));
  }
  app.onclick=e=>{
    const target=e.target.closest('button');
    if(!target||target.disabled)return;
    if(target.id==='again'){restart();return;}
    if(target.id==='next'){index++;next();return;}
    if(target.id==='hintBtn'){showZh=!showZh;render();return;}
    if(target.id==='reset'){slots.fill(null);active=0;message='';render();return;}
    if(target.id==='check'){
      if(slots.every((p,i)=>p===q.p[i])){
        done=true;message='You got it!';
        if(!tries)correctFirst++;
      }else{tries++;message='Try again. Tap a part to change it.';}
      render();return;
    }
    if(target.dataset.slot!==undefined){active=Number(target.dataset.slot);slots[active]=null;message='';render();return;}
    if(target.dataset.tile&&active>=0){
      slots[active]=target.dataset.tile;active=slots.indexOf(null);message='';render();
    }
  };
  restart();
}
function route(){
  app.onclick=null;
  if(!location.hash){teacher();return;}
  try{student(readTask());}
  catch{role.textContent='Student Practice';app.innerHTML='<section class="panel"><h2>活動連結無法開啟</h2><p>請向老師索取完整的活動連結。</p><p><a href="./">回教師工作台</a></p></section>';}
}
window.addEventListener('hashchange',route);
route();
