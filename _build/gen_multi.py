import re, sys, os, json
P = sys.argv[1]; S = os.path.join(P, 'slack')
G = open(os.path.join(P, '_build', 'gen.py')).read().split('\n')
ns = {'__name__': 'g'}
sys.argv = ['x', P]
exec('\n'.join(G[0:31]), ns)                      # constants, sv, ic, av
exec('\n'.join(G[304:324]), ns)                   # sbmsg, umsg, used, feedback, chip...
exec('\n'.join(G[212:218]), ns)                   # fmt_row
E = open('/tmp/build/gen_epic.py').read()
ns.update(dict(AG='', TAB='chrome/slack-shell/assets/apps/tableau.svg'))
exec(E[E.index('def chart('):E.index('# --- Insight')], ns)
exec(E[E.index('# --- Q&A content ---'):E.index('import json\ndata')], ns)
sbmsg, umsg, used, feedback, ic, sv, SB, MAYA, Q = [ns[k] for k in ['sbmsg','umsg','used','feedback','ic','sv','SB','MAYA','Q']]
SF = 'chrome/slack-shell/assets/apps/salesforce.png'

skills = ['Sales Data Intelligence — Commit forecast', 'Sales Data Intelligence — Close-date trends', 'Sales Data Intelligence — Q3 scenario modeling']
def clean(a): return re.sub(r'<div class="sk-v2-text">(<p>.*?</p>)</div>', r'\1', a, flags=re.S)
ANS = []
for i, x in enumerate(Q):
    a = clean(x['a'])
    if i == 2:
        a = a.replace('<p class="pi-plain-line">Biggest single lever: resolving blockers on <b>NorthStar</b>. Want me to run the Executive Deal Review Flow on it?</p>',
          '<p>The biggest single lever is resolving blockers on <b>NorthStar</b>: declining procurement activity, no recent executive engagement, and legal review not started. Run the <b>Executive Deal Review Flow</b> to create tasks, assign owners and bring in the right people.</p><div class="sk-sb-btns"><button class="sk-sb-action is-primary pi-run" id="runflow">' + ic('play-filled') + 'Run Executive Deal Review Flow for NorthStar</button></div>')
    ANS.append(dict(q=x['q'], t=x['t'], a=used(skills[i]) + a + feedback()))
FLOWQ = 'Run the Executive Deal Review Flow for NorthStar'
tool = lambda txt, img=None: f'<div class="pi-tool-row"><img src="{img}" alt="" style="width:13px;height:13px;margin-top:3px"><span>{txt}</span></div>'
WORK = used('Executive Deal Review Flow') + tool('Handing off to <b>Salesforce</b> to run the flow on NorthStar', SF)
chk = lambda t: f'<li>{ic("check")}<span>{t}</span></li>'
FLOWA = ('<div class="pi-ok-line">✅ Executive Deal Review Flow ran successfully</div><p>Ran on <b>NorthStar</b>. Here\'s what happened:</p><ul class="pi-checks">'
  + ''.join(chk(t) for t in ['Created high-priority tasks for the opportunity owner','Opened a dedicated Slack deal room','Requested an executive review meeting','Assigned owners to the open procurement and legal blockers','Set due dates for each critical next step'])
  + '</ul><p>You\'ll be notified as blockers are resolved or become overdue.</p><div class="pi-callout-green">Expected impact: approximately <b>$1.1M</b> in Q3 revenue</div>' + feedback())

src = open(os.path.join(S, 'C1-02-slack-panel.html')).read()
src = re.sub(r'<link rel="stylesheet" href="\.\./_kit/demo-flow[^>]*>\n?', '', src)
src = re.sub(r'<title>.*?</title>', '<title>Salesforce (App) - Brightwater - Slack</title>', src)
src = re.sub(r'<div class="sk-thread-replies" id="n1-replies">.*?</div>', '', src, flags=re.S)
src = src.replace('Reply in this DM', 'Reply in this DM')
tabs = ''.join(f'<div class="sk-sb-tab{" is-active" if l == "Messages" else ""}">{sv(i)}{l}</div>' for i, l in [(48,'Messages'),(49,'History'),(50,'Skills'),(51,'Tasks')])
PANEL = f'''<div class="sk-thread-pane sk-sbpanel" id="p-sb" style="display:none"><div class="ea-resize" id="rz" title="Drag to resize"></div>
<div class="sk-sb-head"><div class="sk-sb-title"><img src="{SB}" alt="">Slackbot</div><div class="sk-sb-actions"><button class="sk-sb-btn" aria-label="New message">{sv(44)}</button><button class="sk-sb-btn" aria-label="Search">{sv(45)}</button><button class="sk-sb-btn is-plain" aria-label="More">{sv(46)}</button><button class="sk-sb-btn is-plain" id="sbclose" aria-label="Close">{sv(47)}</button></div></div>
<div class="sk-sb-tabs">{tabs}<div class="sk-sb-tab-add">{sv(52)}</div></div>
<div class="sk-messages" id="sb-msgs"></div>
<div class="sk-composer-wrap"><div class="sk-composer" id="composer">{ns['fmt_row']()}<div class="sk-composer-input" id="cin" data-placeholder="Ask anything"></div>
<div class="sk-composer-actions"><div class="sk-composer-actions-left"><button class="sk-icon-btn" aria-label="Add">{ic('plus')}</button><button class="sk-icon-btn sk-icon-btn--aa" aria-label="Formatting">Aa</button><button class="sk-icon-btn" aria-label="Canvas">{ic('canvas')}</button><button class="sk-icon-btn" aria-label="Tools">{ic('tools')}</button></div><button class="sk-icon-btn" aria-label="Record audio clip">{ic('microphone')}</button><button class="pi-send-up" id="send" aria-label="Send">{ic('arrow-up')}</button></div></div></div></div>'''
tail = 'Sending messages to this app has been turned off.</div></div>\n        </div></div>'
assert tail in src
src = src.replace(tail, 'Sending messages to this app has been turned off.</div></div>\n        </div>' + PANEL + '</div>', 1)
css = '''<style>
#p-sb{position:relative}.ea-resize{position:absolute;left:-4px;top:0;bottom:0;width:8px;cursor:col-resize;z-index:5}.ea-resize:hover,.ea-resize.on{background:rgba(18,100,163,.35)}
body.ea-dragging{cursor:col-resize;user-select:none}.sk-channel-col{min-width:0;flex:1 1 auto}
.ea-typing{color:#616061;font-size:14px;padding:4px 0}.ea-typing b{display:inline-block;animation:eab 1s infinite}.ea-typing b:nth-child(2){animation-delay:.15s}.ea-typing b:nth-child(3){animation-delay:.3s}@keyframes eab{50%{opacity:.2}}
.sk-composer-input{min-height:44px}#composer{cursor:text}#p-sb .pi-chart{max-width:100%}
.pi-tb-sb{outline:2px solid #1264a3;outline-offset:-2px;border-radius:4px}.ea-hint{position:fixed;left:50%;bottom:6px;transform:translateX(-50%);font:12px -apple-system,sans-serif;color:rgba(255,255,255,.7);z-index:9}
</style>'''
src = src.replace('</head>', css + '</head>')
src = re.sub(r'<script>/\* scroll-rest.*?</script>', '', src, flags=re.S)
js = r'''<script>
var ANS=%s, FLOWQ=%s, WORK=%s, FLOWA=%s, SBI=%s, ME=%s, n=0, flow=0, open=false, busy=false;
var $=function(i){return document.getElementById(i)};
function typing(){return '<div class="ea-typing">Slackbot is working on it <b>&bull;</b><b>&bull;</b><b>&bull;</b></div>'}
function um(t,x){return '<div class="sk-msg"><div class="sk-msg-gutter"><img class="sk-msg-avatar" src="'+ME+'" alt=""></div><div class="sk-msg-content"><div class="sk-msg-head"><span class="sk-msg-sender">Maya Okonkwo</span><span class="sk-msg-time">'+t+'</span></div><div class="sk-sb-rich"><p>'+x+'</p></div></div></div>'}
function sm(t,b){return '<div class="sk-msg"><div class="sk-msg-gutter"><img class="sk-msg-avatar" src="'+SBI+'" alt=""></div><div class="sk-msg-content"><div class="sk-msg-head"><span class="sk-msg-sender">Slackbot</span><span class="sk-app-badge">AGENT</span><span class="sk-msg-time">'+t+'</span></div><div class="sk-sb-rich">'+b+'</div></div></div>'}
function render(pending){
  $('p-sb').style.display=open?'flex':'none';
  document.querySelector('.pi-tb-sb').classList.toggle('is-on',open);
  if(!open)return;
  var h='';
  for(var i=0;i<n;i++){h+=um(ANS[i].t,ANS[i].q); h+=(i===n-1&&pending==='q')?sm(ANS[i].t,typing()):sm(ANS[i].t,ANS[i].a)}
  if(flow){h+=um('8:12 AM',FLOWQ); h+=sm('8:12 AM',pending==='f'?WORK+typing():FLOWA)}
  var m=$('sb-msgs'); m.innerHTML=h;
  var ms=m.querySelectorAll('.sk-msg'); var k=pending||flow?ms.length-2:ms.length-2;
  if(ms.length>=2){m.scrollTop=ms[k].offsetTop-8}else m.scrollTop=0;
  $('cin').textContent=''; $('composer').classList.remove('has-content');
}
function typeThen(txt,cb){busy=true;var i=0,el=$('cin');var t=setInterval(function(){el.textContent=txt.slice(0,++i);$('composer').classList.add('has-content');if(i>=txt.length){clearInterval(t);setTimeout(cb,350)}},22)}
function next(){
  if(busy)return;
  if(!open){open=true;render();return}
  if(n<ANS.length){typeThen(ANS[n].q,function(){n++;render('q');setTimeout(function(){render();busy=false},1700)});return}
  if(!flow){typeThen(FLOWQ,function(){flow=1;render('f');setTimeout(function(){render();busy=false},2200)})}
}
function back(){if(busy)return; if(flow){flow=0;render()} else if(n>0){n--;render()} else if(open){open=false;render()}}
$('composer').addEventListener('click',function(){if(!busy&&!$('cin').textContent)next()});
$('send').addEventListener('click',function(e){e.stopPropagation()});
document.addEventListener('click',function(e){var t=e.target;
  if(t.closest&&t.closest('.pi-tb-sb')){if(!open)next();return}
  if(t.closest&&t.closest('#runflow')){if(n===ANS.length&&!flow)next();return}});
$('sbclose').addEventListener('click',function(){open=false;render()});
document.addEventListener('keydown',function(e){
  if(e.key==='ArrowRight'||e.key==='Enter'||e.key==='PageDown'){e.preventDefault();next()}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){back()}
  else if(e.key==='R'&&e.shiftKey){n=0;flow=0;open=false;busy=false;render()}});
(function(){var rz=$('rz'),th=$('p-sb');rz.addEventListener('mousedown',function(e){e.preventDefault();rz.classList.add('on');document.body.classList.add('ea-dragging');var pane=th.parentNode.getBoundingClientRect();
 function mv(ev){var w=pane.right-ev.clientX;w=Math.max(320,Math.min(w,pane.width-360));th.style.width=w+'px'}
 function up(){rz.classList.remove('on');document.body.classList.remove('ea-dragging');document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up)}
 document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up)})})();
render();
</script>''' % (json.dumps(ANS), json.dumps(FLOWQ), json.dumps(WORK), json.dumps(FLOWA), json.dumps(SB), json.dumps(MAYA))
hint = '<div class="ea-hint">Click the Slackbot icon on the insight (or press &rarr;) &bull; then click the message box for each question &bull; &larr; back &bull; Shift+R restart</div>'
src = src.replace('</body>', hint + js + '</body>')
open(os.path.join(S, 'scene-multiagent.html'), 'w').write(src)
print('ok', len(src))
