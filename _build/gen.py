import re
# gen.py — emits the 14 static beat pages + 2 scene pages for proactive-intelligence.
# Every on-screen value comes from DATA-CANON.md (intake). Usage: python3 -I gen.py <project-dir>
import json, sys, os, html
PROJ = sys.argv[1]
B = os.path.join(PROJ, '_build')
S = json.load(open(os.path.join(B, 'seed-svgs.json')))
ICONS = json.load(open(os.path.join(B, 'icons.json')))
def sv(i): return S[i]
def ic(n): return ICONS[n].replace(' xmlns="http://www.w3.org/2000/svg"', '')
APP = 'chrome/slack-shell/assets/apps/'
SF, SB, TAB = APP + 'salesforce.png', APP + 'slackbot.png', APP + 'tableau.svg'
GD, ASANA = 'assets/google-drive.png', 'assets/asana.png'
def av(n): return '../_kit/avatars/%s.png' % n
MAYA = av('maya-okonkwo')

class Ctx:
    """b = beat number (float). scene = (start, end) or None. Static page: include iff visible.
    Scene page: include always, hide attr iff not visible at the scene's load state."""
    def __init__(self, b, scene=None): self.b, self.scene = b, scene
    def on(self, beats):
        ok = self.b in beats if not callable(beats) else beats(self.b)
        if self.scene: return True, ('' if ok else ' data-demo-hide')
        return ok, ''
    def W(self, beats, html_):
        inc, h = self.on(beats)
        return html_.replace('{H}', h) if inc else ''
    def cls(self, beats, c):
        ok = self.b in beats if not callable(beats) else beats(self.b)
        return (' ' + c) if ok else ''

DAY2 = lambda b: b >= 11.5
SB_HOME = {1, 2, 3, 4, 5, 6, 11, 11.5, 12, 13}
SB_FILES = {7, 8, 9, 10, 14}
V_DM, V_SF, V_CANVAS, V_REPORT = {1, 11.5}, {2, 3, 4, 5, 6, 11, 12, 13}, {7, 8, 9, 10}, {14}
P_THREAD = {3}
P_SB = {5, 6, 7, 8, 9, 10, 11, 13, 14}

def topnav():
    return f'''<div class="sk-topnav" data-shell-region="topbar">
      <div class="sk-topnav-history">
        <div class="sk-traffic"><span class="is-close"></span><span class="is-min"></span><span class="is-zoom"></span></div>
        <button class="sk-topnav-btn" aria-label="Toggle sidebar">{sv(0)}</button>
        <span class="pi-hist-gap"></span>
        <button class="sk-topnav-btn" aria-label="Back">{sv(1)}</button>
        <button class="sk-topnav-btn is-disabled" aria-label="Forward">{sv(2)}</button>
        <button class="sk-topnav-btn" aria-label="History">{sv(3)}</button>
      </div>
      <div class="sk-topnav-search">{sv(4)}<span>Search Brightwater</span></div>
      <button class="sk-v2-slackbot-btn" aria-label="Slackbot">{sv(5)}</button>
      <div class="sk-v2-topnav-spacer"></div>
      <div class="sk-topnav-right"><button class="sk-topnav-btn" aria-label="Help">{sv(8)}</button></div>
    </div>'''

def wscol():
    return f'''<div class="pi-ws-col" aria-label="Workspaces"><div class="pi-ws-tile" title="Brightwater">B</div><div class="pi-ws-add">{ic('plus')}</div></div>'''

def rail(c):
    tabs = [('rt-today', sv(9), 'Today', set()), ('rt-home', sv(10), 'Home', SB_HOME), ('rt-dms', sv(11), 'DMs', set()),
            ('rt-activity', sv(12), 'Activity', set()), ('rt-files', sv(13), 'Files', SB_FILES),
            ('rt-todos', ic('check-circle'), 'To-dos', set()), ('rt-agents', sv(14), 'Agents<br>&amp; tools', set())]
    t = ''.join(f'<div class="sk-rail-tab{c.cls(a, "is-active")}" id="{i}"><div class="sk-rail-tab-icon">{s}</div><div class="sk-rail-tab-label">{l}</div></div>' for i, s, l, a in tabs)
    return f'''<div class="sk-rail" data-shell-region="rail">
        <div class="sk-account-switch" aria-label="Brightwater workspace"><div class="sk-workspace-icon">B</div></div>
        <div class="sk-rail-tabs">{t}</div>
        <div class="sk-rail-spacer"></div>
        <div class="sk-rail-controls">
          <button class="sk-v2-rail-circle" aria-label="Create">{sv(15)}</button>
          <button class="sk-v2-rail-circle" aria-label="Theme">{sv(16)}</button>
          <div class="sk-rail-user"><img src="{MAYA}" alt="Maya Okonkwo"><div class="sk-presence"></div></div>
        </div>
      </div>'''

def row(label, icon=None, img=None, extra='', rid='', badge='', contain=False, sq=None):
    lead = (f'<img class="sk-row-dm-avatar{" is-contain" if contain else ""}" src="{img}" alt="">' if img else
            f'<span class="pi-row-sq">{sq}</span>' if sq else f'<span class="sk-row-icon">{icon}</span>')
    b = f'<span class="sk-row-badge">{badge}</span>' if badge else ''
    return f'<div class="sk-row is-child{extra}"{(" id=%s" % rid) if rid else ""}>{lead}<span class="sk-row-label" data-amb-clip-ok>{label}</span>{b}</div>'

def sidebar_home(c):
    inc, h = c.on(SB_HOME)
    if not inc: return ''
    hashi = sv(28)
    sf_unread = c.b in {1, 11.5}
    sf_cls = c.cls(V_SF, 'is-active') + (' has-unread' if sf_unread else '')
    nora_cls = c.cls(V_DM, 'is-active')
    pinned = ''.join(f'<div class="sk-row"><span class="sk-row-icon">{s}</span><span class="sk-row-label" data-amb-clip-ok>{l}</span></div>' for s, l in
                     [(sv(21), 'Threads'), (sv(22), 'Huddles'), (sv(23), 'Recap'), (sv(24), 'Drafts &amp; sent'), (ic('bookmark'), 'Saved'), (sv(25), 'Directories')])
    chans = ''.join(row(n, hashi) for n in ['sales-leadership', 'pipeline-review', 'deal-desk', 'enablement'])
    deal = c.W(lambda b: b >= 9, f'<div class="sk-row is-child" id="row-deal"{{H}}><span class="sk-row-icon">{hashi}</span><span class="sk-row-label" data-amb-clip-ok>deal-northstar-q3</span></div>')
    dms = row('Nora Castellan', img=av('nora-castellan'), extra=nora_cls, rid='row-nora') + ''.join(
        row(n, img=av(n.lower().replace(' ', '-'))) for n in ['Ben Adeyemi', 'Chloe Park', 'Rafael Ortiz', 'Hannah Voss', 'Sam Iyer']) + \
        row('Ana Duarte, Leo Marsh, +6', sq='8', badge='8', extra=' has-unread')
    sf_badge = '<span class="sk-row-badge" id="sf-badge">1</span>' if (sf_unread or c.scene) else ''
    if c.scene and not sf_unread: sf_badge = sf_badge.replace('id="sf-badge"', 'id="sf-badge" data-demo-hide')
    apps = (f'<div class="sk-row is-child{sf_cls}" id="row-sf"><img class="sk-row-dm-avatar is-contain" src="{SF}" alt=""><span class="sk-row-label" data-amb-clip-ok>Salesforce</span>{sf_badge}</div>'
            + row('Google Drive', img=GD, contain=True) + row('Tableau', img=TAB, contain=True) + row('Asana', img=ASANA, contain=True))
    return f'''<div class="sk-sidebar" data-shell-region="sidebar" id="sb-home"{h}>
        <div class="sk-sidebar-header">
          <button class="sk-sidebar-ws"><span>Brightwater</span>{sv(17)}</button>
          <div class="sk-sidebar-header-actions"><button class="sk-sidebar-icon-btn" aria-label="Settings">{sv(18)}</button><button class="sk-sidebar-icon-btn" aria-label="Compose">{sv(19)}</button></div>
        </div>
        <div class="sk-v2-find">{sv(20)}<span>Find a conversation...</span></div>
        <div class="sk-sidebar-pinned">{pinned}</div>
        <div class="sk-v2-sidebar-rule"></div>
        <div class="sk-sidebar-scroll" data-amb-scroll>
          <div class="sk-sidebar-section"><div class="sk-section-heading">{sv(26)}<span class="sk-section-label">Starred</span></div>{row('revenue-ops', hashi)}{row('field-sales', hashi)}</div>
          <div class="sk-sidebar-section"><div class="sk-section-heading">{sv(27)}<span class="sk-section-label">Channels</span></div>{chans}{deal}</div>
          <div class="sk-sidebar-section"><div class="sk-section-heading">{sv(33)}<span class="sk-section-label">Direct messages</span></div>{dms}</div>
          <div class="sk-sidebar-section"><div class="sk-section-heading">{sv(35)}<span class="sk-section-label">Apps</span></div>{apps}</div>
        </div>
      </div>'''

def sidebar_files(c):
    inc, h = c.on(SB_FILES)
    if not inc: return ''
    top = ''.join(f'<div class="sk-row"><span class="sk-row-icon">{s}</span><span class="sk-row-label" data-amb-clip-ok>{l}</span></div>' for s, l in
                  [(ic('files'), 'All files'), (ic('canvas'), 'Canvases'), (ic('lists'), 'Lists')])
    rep = c.W(DAY2, f'<div class="sk-row is-child is-active" id="row-report"{{H}}><span class="sk-row-icon">{ic("canvas")}</span><span class="sk-row-label" data-amb-clip-ok>Autonomous Insights — Q3 Pipeline</span></div>')
    can_active = '' if c.b >= 11.5 else ' is-active'
    recent = (rep + f'<div class="sk-row is-child{can_active}" id="row-canvas"><span class="sk-row-icon">{ic("canvas")}</span><span class="sk-row-label" data-amb-clip-ok>Pipeline Outlook Analysis</span></div>'
              + row('Q3 Forecast Assumptions.doc', img=GD, contain=True))
    return f'''<div class="sk-sidebar pi-files" data-shell-region="sidebar" id="sb-files"{h}>
        <div class="sk-sidebar-header">
          <button class="sk-sidebar-ws"><span>Files</span></button>
          <div class="sk-sidebar-header-actions"><button class="sk-sidebar-icon-btn" aria-label="Settings">{sv(18)}</button><button class="sk-sidebar-icon-btn" aria-label="New">{ic('plus')}</button></div>
        </div>
        <div class="sk-sidebar-pinned">{top}</div>
        <div class="sk-v2-sidebar-rule"></div>
        <div class="sk-sidebar-scroll">
          <div class="sk-sidebar-section"><div class="sk-section-heading">{ic('clock')}<span class="sk-section-label">Recently viewed</span></div>{recent}</div>
        </div>
      </div>'''

# ---------------- messages ----------------
YOU = '<span class="pi-you">you</span>'

def msg(sender, avatar, time, body, badge='', mid='', extra='', contain=False, attrs='', toolbar=''):
    b = f'<span class="sk-app-badge">{badge}</span>' if badge else ''
    return f'''<div class="sk-msg{extra}"{(' id="%s"' % mid) if mid else ''}{attrs}>
  <div class="sk-msg-gutter"><img class="sk-msg-avatar{' is-contain' if contain else ''}" src="{avatar}" alt=""></div>
  <div class="sk-msg-content">
    <div class="sk-msg-head"><span class="sk-msg-sender">{sender}</span>{YOU if sender == "Maya Okonkwo" else ""}{b}<span class="sk-msg-time">{time}</span></div>{toolbar}
    {body}
  </div>
</div>'''

def divider(label, new=False, did='', h=''):
    nf = '<em class="sk-new-flag">New</em>' if new else ''
    return f'<div class="sk-date-divider{" is-new" if new else ""}"{(" id=%s" % did) if did else ""}{h}><span>{label}{sv(41)}</span>{nf}</div>'

def toolbar(tid):
    q = ''.join(f'<span class="sk-toolbar-btn" role="button" aria-label="{a}">{e}</span>' for e, a in [('✅', 'React with check'), ('👀', 'React with eyes'), ('🙌', 'React with raised hands')])
    acts = ''.join(f'<span class="sk-toolbar-btn{x}" role="button" aria-label="{a}">{s}</span>' for s, a, x in
                   [(ic('add-reaction'), 'Add reaction', ''), (ic('threads'), 'Reply in thread', ''), (ic('share-message'), 'Forward message', ''),
                    (ic('bookmark'), 'Save for later', ''), (sv(5), 'Ask Slackbot', ' pi-tb-sb'), (ic('ellipsis-vertical-filled'), 'More actions', '')])
    return f'<div class="sk-msg-toolbar" id="{tid}">{q}<span class="pi-tb-sep"></span>{acts}</div>'

def prompts_menu(c, mid, hl_beats_i1, hl_beats_i2, vis):
    inc, h = c.on(vis)
    if not inc: return ''
    arrow = ic('arrow-bottom-right') if 'arrow-bottom-right' in ICONS else ic('arrow-right')
    def item(k, text, hlb):
        return f'<div class="pi-menu-item i{k}{c.cls(hlb, "is-hl")}">{arrow}<span>{text}</span></div>'
    return f'''<div class="pi-menu" id="{mid}" role="menu" data-overlay data-popover{h}>
      <div class="pi-menu-head" data-amb-inert>{sv(5)}<span>Suggested prompts</span></div>
      {item(1, 'What could most improve the outlook?', hl_beats_i1)}
      {item(2, 'Provide feedback to improve this insight', hl_beats_i2)}
      {item(3, 'Schedule an agent to monitor this situation', set())}
      <div class="pi-menu-rule"></div>
      <div class="pi-menu-item i4">{ic('edit')}<span>Write your own prompt</span></div>
    </div>'''

def n1_body(latest='Last reply today at 8:05 AM'):
    # Proactive alert format from the product recording (2026-10-23): text only, no chart card; the charts live in the report.
    # No Generated stamp and no dates anywhere in the flow, so the demo stays evergreen (PM review 2026-10-23).
    sbimg = f'<img class="pi-inline-sb" src="{SB}" alt="">'
    return f'''<div class="sk-v2-bold-line">Q3 revenue likely to finish below the $48M target, with a 78% chance of missing</div>
    <div class="pi-severity">⚠️ High-severity insight</div>
    <ul class="pi-bullets">
      <li>Based on current pipeline conditions and the outcomes of comparable opportunities, Q3 revenue is projected to finish between <b>$41.2M</b> and <b>$45.8M</b>, below the <b>$48M</b> target. The analysis found a <b>78% likelihood</b> of missing the target under current conditions.</li>
      <li>Three opportunities represent <b>37%</b> of the remaining Commit forecast.</li>
      <li>Late-stage deals without recent executive engagement are converting at <b>less than half</b> the rate of comparable deals with active executive involvement. The pattern remains after accounting for region, industry, deal size, and sales segment.</li>
      <li>Close dates are moving later while the time needed to complete procurement, legal, and security reviews remains unchanged.</li>
    </ul>
    <div class="sk-v2-bold-line" style="margin-top:8px">Recommended actions</div>
    <ul class="pi-bullets">
      <li><b>Run an exec-sponsor sweep on late-stage deals.</b> Pair each one without recent exec engagement with a sponsor and book an exec-to-exec call this week.</li>
      <li><b>Hold deal-by-deal reviews on the 3 opportunities making up 37% of remaining Commit.</b> Confirm the economic buyer, open blockers, and close plan, and decide which to swap out of Commit if they can’t be de-risked.</li>
      <li><b>Start procurement, legal, and security reviews earlier.</b> Launch them in parallel at the proposal stage and run a weekly fast-lane triage on open deals.</li>
      <li><b>Build a gap-closing plan for the $2.2M–$6.8M shortfall.</b> Identify pull-in candidates and quick wins such as upsell, edition upgrades, and cross-sell.</li>
    </ul>
    <p class="pi-plain-line" style="margin-top:8px">Autonomous insights found this for you.</p>
    <p class="pi-plain-line">For more, click {sbimg}Slackbot in this message and ask for your newest insights.</p>
    <button class="pi-btn">Manage Alerts</button>
    <div class="sk-thread-replies" id="n1-replies"><img class="sk-v2-mini" src="{SF}" alt=""><span class="sk-thread-count">1 reply</span><span class="sk-thread-latest">{latest}</span></div>'''

def n2_body():
    sbimg = f'<img class="pi-inline-sb" src="{SB}" alt="">'
    return f'''<div class="sk-v2-bold-line">Pipeline concentration risk: three deals hold 37% of remaining Commit</div>
    <div class="pi-severity">⚠️ High-severity insight</div>
    <ul class="pi-bullets">
      <li>Based on your feedback: NorthStar, Acme Retail Group and Greenline Energy total <b>$10.7M</b>, or <b>37%</b> of the <b>$28.9M</b> remaining Commit forecast.</li>
      <li>NorthStar alone is <b>$5.2M</b> (18%) and has had no executive meeting in <b>29 days</b>. If it slips past quarter-end, modeled Q3 revenue falls by about <b>$2.4M</b>, to roughly <b>$41.3M</b>.</li>
      <li>Priya Raman owns NorthStar and two other late-stage deals (<b>$9.3M</b> combined) with no executive contact in over three weeks. This may be a good coaching conversation.</li>
      <li>The executive review on NorthStar is scheduled for Friday. The other two deals have no executive meeting on the calendar.</li>
    </ul>
    <p class="pi-plain-line" style="margin-top:8px">Autonomous insights found this for you.</p>
    <p class="pi-plain-line">For more, click {sbimg}Slackbot in this message and ask for your newest insights.</p>
    <button class="pi-btn">Manage Alerts</button>
    <div class="sk-thread-replies"><img class="sk-v2-mini" src="{SF}" alt=""><span class="sk-thread-count">1 reply</span><span class="sk-thread-latest">Last reply today at 8:05 AM</span></div>'''

def fmt_row():
    a = ''.join(f'<button class="sk-fmt-btn">{ic(n)}</button>' for n in ['bold', 'italic', 'underline', 'strikethrough'])
    b = ''.join(f'<button class="sk-fmt-btn">{ic(n)}</button>' for n in ['link', 'numbered-list', 'bulleted-list'])
    d = ''.join(f'<button class="sk-fmt-btn">{ic(n)}</button>' for n in ['quote', 'code', 'code-block'])
    return f'<div class="sk-composer-format is-open">{a}<div class="sk-fmt-divider"></div>{b}<div class="sk-fmt-divider"></div>{d}</div>'

def view_dm(c):
    inc, h = c.on(V_DM)
    if not inc: return ''
    nora, maya = av('nora-castellan'), MAYA
    file_ = f'<div class="pi-file"><span class="pi-doc">DOC</span><div><div class="pi-file-name">Q3 Forecast Assumptions.doc</div><div class="pi-file-sub">184 KB · Google Docs</div></div></div>'
    msgs = (divider('Wednesday, August 12th')
            + msg('Maya Okonkwo', maya, '3:02 PM', '<div class="sk-v2-text"><p>Can you send the Q3 forecast assumptions before Thursday\'s review?</p></div>')
            + msg('Nora Castellan', nora, '3:20 PM', '<div class="sk-v2-text"><p>Yes. The model now weights late-stage deals by exec engagement. I\'ll send the doc in an hour.</p></div>')
            + msg('Nora Castellan', nora, '4:11 PM', file_)
            + divider('Thursday, August 13th')
            + msg('Maya Okonkwo', maya, '9:30 AM', '<div class="sk-v2-text"><p>Thanks, this helps. Let\'s look at the top deals next week.</p></div>'))
    return f'''<div class="sk-main" id="v-dm"{h}>
        <div class="sk-view-header no-border" data-shell-region="channel-header">
          <div class="sk-view-header-title"><button class="sk-v2-hbox" aria-label="Star conversation">{sv(36)}</button><img class="pi-dm-av" src="{nora}" alt=""><span>Nora Castellan</span></div>
          <div class="sk-view-header-actions"><button class="sk-v2-hbox" aria-label="Start huddle">{ic('headphones')}</button><button class="sk-v2-hplain" aria-label="More">{sv(38)}</button></div>
        </div>
        <div class="sk-tabbar"><div class="sk-tab is-active">{sv(39)}<span>Messages</span></div><div class="sk-tab">{ic('files')}<span>Files</span></div></div>
        <div class="sk-pane"><div class="sk-channel-col">
          <div class="sk-messages" data-scroll="end">{msgs}</div>
          <div class="sk-composer-wrap" data-shell-region="composer"><div class="sk-composer">
            {fmt_row()}
            <div class="sk-composer-input" data-placeholder="Message Nora Castellan"></div>
            <div class="sk-composer-actions"><div class="sk-composer-actions-left">
              <button class="sk-icon-btn sk-icon-btn--attach" aria-label="Attach">{sv(80)}</button>
              <button class="sk-icon-btn sk-icon-btn--aa" aria-label="Formatting">Aa</button>
              <button class="sk-icon-btn" aria-label="Emoji">{ic('emoji')}</button>
              <button class="sk-icon-btn" aria-label="Mention someone">{ic('mentions')}</button>
              <div class="sk-composer-divider"></div>
              <button class="sk-icon-btn" aria-label="Record audio clip">{ic('microphone')}</button>
            </div>
            <div class="sk-composer-send"><button class="sk-send-btn" aria-label="Send">{sv(82)}</button><button class="sk-send-caret" aria-label="Schedule send">{sv(83)}</button></div></div>
          </div></div>
        </div></div>
      </div>'''

def view_sf(c):
    inc, h = c.on(V_SF)
    if not inc: return ''
    d2 = c.b >= 11.5
    hov1 = c.cls({2, 4}, 'is-hover-demo')
    n1 = msg('Salesforce', SF, '8:05 AM', n1_body('Last reply yesterday at 8:05 AM' if d2 else 'Last reply today at 8:05 AM'),
             badge='APP', mid='n1', extra=' has-toolbar' + hov1, contain=True,
             toolbar=toolbar('n1-tb').replace('pi-tb-sb', 'pi-tb-sb' + c.cls({4}, 'is-on')) + prompts_menu(c, 'n1-menu', {4, 5, 6, 7, 8, 9, 10}, {11}, {4}))
    if d2:
        n2 = msg('Salesforce', SF, '8:00 AM', n2_body(), badge='APP', mid='n2', extra=' has-toolbar', contain=True, toolbar=toolbar('n2-tb'))
        msgs = divider('Yesterday') + n1 + divider('Today', new=True) + n2
        rest = 'end'
    else:
        msgs = divider('Today', new=True) + n1
        rest = 'top'
    return f'''<div class="sk-main" id="v-sf"{h}>
        <div class="sk-view-header no-border" data-shell-region="channel-header">
          <div class="sk-view-header-title"><button class="sk-v2-hbox" aria-label="Star channel">{sv(36)}</button><img class="sk-v2-app-mark" src="{SF}" alt=""><span>Salesforce</span></div>
          <div class="sk-view-header-actions"><button class="sk-v2-hbox" aria-label="Notifications">{sv(37)}</button><button class="sk-v2-hplain" aria-label="More">{sv(38)}</button></div>
        </div>
        <div class="sk-tabbar"><div class="sk-tab is-active">{sv(39)}<span>Messages</span></div><div class="sk-tab">{sv(40)}<span>List views</span></div></div>
        <div class="sk-pane"><div class="sk-channel-col">
          <div class="sk-messages" id="sf-msgs" data-scroll="{rest}" data-amb-scroll>{msgs}</div>
          <div class="sk-composer-wrap" data-shell-region="composer"><div class="sk-v2-disabled-composer">Sending messages to this app has been turned off.</div></div>
        </div></div>
      </div>'''

def pane_thread(c):
    inc, h = c.on(P_THREAD)
    if not inc: return ''
    root = msg('Salesforce', SF, '8:05 AM', n1_body().split('<div class="sk-thread-replies"')[0], badge='APP', contain=True)
    reply = msg('Salesforce', SF, '8:05 AM', '''<div class="sk-v2-text"><p><b>Why did I receive this?</b><br>This insight was prioritized because the projected outcome could put your <b>$48M</b> Q3 revenue target at risk.</p>
    <p>It also reflects patterns the system has observed in your data over time:</p></div>
    <ul class="pi-bullets"><li>You have a defined quarterly revenue goal, and the current projected range falls below it.</li>
    <li>Similar late-stage opportunities without early executive engagement have historically converted at a much lower rate.</li>
    <li>In recent weeks, close dates have continued to move later while unresolved procurement and executive-engagement blockers have persisted.</li>
    <li>These same signals have appeared across multiple analyses, increasing confidence that the risk is meaningful rather than temporary.</li></ul>
    <div class="sk-v2-text"><p style="margin-top:8px">The insight was surfaced now because it is both important to your goal and actionable while there is still time to change the outcome.</p></div>''',
                badge='APP', contain=True, attrs=' data-rest')
    return f'''<div class="sk-thread-pane" data-shell-region="thread" id="p-thread"{h}>
        <div class="pi-thread-head"><span class="pi-thread-title">Thread</span>
          <div class="pi-thread-actions"><button class="sk-sb-btn" aria-label="More">{sv(46)}</button><button class="sk-sb-btn pi-close" aria-label="Close">{sv(47)}</button></div></div>
        <div class="sk-messages" id="thread-msgs" data-scroll="anchor" data-rest-offset="8">
          <div class="sk-thread-root">{root}</div>
          <div class="sk-thread-count-divider"><span>1 reply</span></div>
          {reply}
        </div>
        <div class="sk-composer-wrap"><div class="sk-v2-disabled-composer">Sending messages to this app has been turned off.</div></div>
      </div>'''

# ---------------- Slackbot panel ----------------
def sbmsg(time, rich, mid='', h='', cont=False, attrs=''):
    x = ' pi-cont' if cont else ''
    head = '' if cont else f'<div class="sk-msg-head"><span class="sk-msg-sender">Slackbot</span><span class="sk-app-badge">AGENT</span><span class="sk-msg-time">{time}</span></div>'
    return f'''<div class="sk-msg{x}"{(' id="%s"' % mid) if mid else ''}{h}{attrs}><div class="sk-msg-gutter"><img class="sk-msg-avatar" src="{SB}" alt=""></div>
  <div class="sk-msg-content">{head}<div class="sk-sb-rich">{rich}</div></div></div>'''

def umsg(time, rich, mid='', h='', attrs=''):
    return f'''<div class="sk-msg"{(' id="%s"' % mid) if mid else ''}{h}{attrs}><div class="sk-msg-gutter"><img class="sk-msg-avatar" src="{MAYA}" alt=""></div>
  <div class="sk-msg-content"><div class="sk-msg-head"><span class="sk-msg-sender">Maya Okonkwo</span><span class="sk-msg-time">{time}</span></div><div class="sk-sb-rich">{rich}</div></div></div>'''

def used(skill): return f'<div class="sk-sb-used is-head">{sv(57)}<span>Used <span class="sk-sb-skill" data-amb-inert>{ic("ai-sparkle")}{skill}</span></span></div>'
def tool(text, chev=True, img=None):
    lead = f'<img src="{img}" alt="" style="width:13px;height:13px;margin-top:3px">' if img else ic('settings')
    return f'<div class="pi-tool-row">{lead}<span>{text}{" ›" if chev else ""}</span></div>'
def feedback(): return f'<div class="sk-sb-feedback">{sv(62)}{sv(63)}{sv(64)}</div>'
def chip(): return f'Based on <span class="sk-sb-chip" data-amb-inert>{sv(53)}Salesforce</span>,'
def mention(n): return f'<span class="sk-mention-inline" data-amb-inert>@{n}</span>'
QUOTE = '<blockquote class="pi-quote">"Track NorthStar through the end of Q3 and notify me when the data shows a meaningful change in the deal outlook, including predicted close probability, expected revenue, close date, customer engagement, or unresolved blockers."</blockquote>'
def check(t): return f'<li>{ic("check")}<span>{t}</span></li>'

def conv1(c):
    W = c.W
    a1 = sbmsg('8:07 AM', f'''{used('Sales Data Intelligence — Q3 scenario modeling')}
      <p>Recovering at least <b>$2.4M</b> from high-potential <b>Best Case</b> opportunities and resolving blockers in <b>NorthStar</b> and <b>Acme Retail Group</b> would have the greatest impact.</p>
      <div class="pi-tile"><div><div class="pi-tile-v is-red">22%</div><div class="pi-tile-l">Today</div></div><div class="pi-tile-arrow">{ic('arrow-right')}</div>
        <div><div class="pi-tile-v is-green">66%</div><div class="pi-tile-l">With these changes</div></div><div class="pi-tile-cap">Probability of reaching the Q3 target</div></div>
      <p>Run <b>Pipeline Outlook Analysis</b> for a comprehensive scenario analysis, the deals to prioritize, and recommended actions you can take in Salesforce.</p>
      <div class="sk-sb-btns"><button class="sk-sb-action is-primary pi-run">{ic('play-filled')}Run Pipeline Outlook Analysis Skill</button></div>
      {feedback()}''', mid='c1-a1', h='{H}')
    run = umsg('8:08 AM', 'Run Pipeline Outlook Analysis Skill', mid='c1-run', h='{H}')
    ask = sbmsg('8:08 AM', f'''{used('Pipeline Outlook Analysis')}<p>Would you like it as a <b>message</b> or a <b>canvas</b>?</p>''', mid='c1-ask', h='{H}')
    can = umsg('8:09 AM', 'canvas', mid='c1-canvas', h='{H}')
    card = sbmsg('8:09 AM', f'''<p>Here's your Pipeline Outlook Analysis.</p>
      <div class="pi-canvas-card" id="cc-canvas"><div class="pi-cc-ic">{ic('canvas')}</div><div><div class="pi-cc-title">Pipeline Outlook Analysis</div><div class="pi-cc-sub">Maya Okonkwo (you) · Canvas</div></div></div>
      <p class="pi-saved">Saved to your Files.</p>{feedback()}''', mid='c1-card', h='{H}')
    flow = sbmsg('8:12 AM', f'''<div class="pi-ok-line">✅ Executive Deal Review Flow ran successfully</div>
      <p>Ran on <b>NorthStar</b>. Here's what happened:</p>
      <ul class="pi-checks">{check('Created high-priority tasks for the opportunity owner')}{check('Opened a dedicated Slack deal room')}{check('Requested an executive review meeting')}{check('Assigned owners to the open procurement and legal blockers')}{check('Set due dates for each critical next step')}</ul>
      <p>You'll be notified as blockers are resolved or become overdue.</p>
      <div class="pi-callout-green">Expected impact: approximately <b>$1.1M</b> in Q3 revenue</div>''', mid='c1-flow', h='{H}', attrs='{R9}')
    mon = sbmsg('', f'''<p>The Executive Deal Review Flow is now running on NorthStar. From here I can assign an agent to monitor it for you — instead of checking manually, it watches the data and flags whether the executive review is actually changing the deal outlook, not just that the tasks were created.</p>
      <div class="pi-label-sm">What the agent would monitor</div>{QUOTE}
      <p>Want me to assign an agent to monitor this? If so, choose how often the agent should check the data — <b>daily or weekly</b> — and let me know whether <b>anyone else should be notified</b> or whether alerts should be posted to a <b>Slack channel</b>.</p>{feedback()}''', mid='c1-mon', h='{H}', cont=True)
    yes = umsg('8:14 AM', f'yes daily for me and {mention("Theo Lindqvist")}', mid='c1-yes', h='{H}')
    done = sbmsg('8:14 AM', f'''<div class="pi-agent-chip"><span class="pi-ic">{ic('ai-agents')}</span>Agent assigned</div>
      <p>Done — I'm assigning an agent to monitor this. It'll check <b>once a day</b> and notify you and {mention('Theo Lindqvist')} individually when something meaningful changes.</p>{QUOTE}
      <p class="pi-foot-note">You can pause it, change the cadence, or update who's notified anytime.</p>{feedback()}''', mid='c1-done', h='{H}')
    r9 = ' data-rest' if c.b == 9 else ''
    flow = flow.replace('{R9}', r9)
    counts = {5: '1 reply', 6: '5 replies', 9: '7 replies', 10: '9 replies'}
    def cnt_beats(k):
        nxt = {5: 6, 6: 9, 9: 10, 10: 99}[k]
        return lambda b: k <= b < nxt
    cnt = ''.join(W(cnt_beats(k), f'<span class="pi-cnt" id="cnt-{k}"{{H}}>{t}</span>') for k, t in counts.items())
    r5 = ' data-rest' if c.b == 5 else ''
    body = (f'<div class="sk-thread-root"{r5}>' + umsg('8:07 AM', 'What could most improve the outlook?', mid='c1-q') + '</div>'
            + f'<div class="sk-thread-count-divider">{cnt}</div>'
            + W(lambda b: b >= 5, a1) + W(lambda b: b >= 6, run) + W(lambda b: b >= 6, ask) + W(lambda b: b >= 6, can) + W(lambda b: b >= 6, card)
            + W(lambda b: b >= 9, flow) + W(lambda b: b >= 9, mon) + W(lambda b: b >= 10, yes) + W(lambda b: b >= 10, done))
    return W(lambda b: 5 <= b <= 10, f'<div class="pi-conv" id="conv1"{{H}}>{body}</div>')

def conv2(c):
    q = umsg('8:50 AM', f'{chip()} This was helpful, but next time focus on high-risk, over-concentrated pipeline, or flag a direct report who needs coaching.', mid='c2-q', h='{H}')
    a = sbmsg('8:50 AM', f'''{used('Sales Data Intelligence — Autonomous Insights')}
      <p>I'll log this as feedback on that insight. Let me find the report that notification came from.</p>
      {tool('Used 2 tools')}
      <p>Logged your feedback on the Q3 revenue outlook insight. Future autonomous insights will flag areas of overconcentration, where your pipeline leans too heavily on individual deals, and will call out direct reports who may need coaching.</p>
      <p>For reference, that insight already hinted at this risk: three opportunities hold <b>37%</b> ($10.7M) of the <b>$28.9M</b> remaining Commit forecast, and <b>NorthStar</b> alone is <b>$5.2M</b> (18%). Going forward, those concentration risks will be called out explicitly.</p>{feedback()}''', mid='c2-a', h='{H}')
    body = (f'<div class="sk-thread-root" data-rest>' + c.W({11}, q) + '</div>'
            + c.W({11}, '<div class="sk-thread-count-divider" id="c2-div"{H}><span>1 reply</span></div>') + c.W({11}, a))
    return c.W({11}, f'<div class="pi-conv" id="conv2"{{H}}>{body}</div>')

def conv3(c):
    q = umsg('8:10 AM', f'{chip()} Give me my newest insights', mid='c3-q', h='{H}')
    a = sbmsg('8:10 AM', f'''{used('Sales Data Intelligence — Autonomous Insights')}
      <p>The user wants their newest insights report. Let me find the right tools and pull the latest report.</p>
      {tool('Used List Autonomous Insight Reports from Tableau Next', img=TAB)}
      <p>The newest report matches the notification. Let me pull its full content.</p>
      {tool('Used Get Autonomous Insights from Tableau Next', img=TAB)}
      <p>I've got your newest report. Building a visual surface now.</p>
      {tool('Created report: Autonomous Insights — Q3 Pipeline', chev=False)}
      <p>Here's your newest Autonomous Insights report, rendered as a visual surface.<br><a class="pi-link" id="rep-link">Autonomous Insights — Q3 Pipeline</a></p>
      <p>The headline: modeled Q3 revenue is <b>$43.7M</b> against the <b>$48M</b> target, three deals hold <b>37%</b> of remaining Commit, and NorthStar's <b>29 days</b> without an executive meeting is the biggest risk. All 4 insights are broken out with charts and takeaways.</p>
      <p>Want me to dig into any one of these, e.g. what's driving the coaching flag on Priya Raman, or set up an alert to track Greenline Energy daily?</p>
      <div class="pi-src-row"><span>Maya Okonkwo · Report</span>{sv(41)}</div>
      <div class="pi-canvas-card" id="cc-report"><div class="pi-cc-ic is-report">{ic('canvas')}</div><div><div class="pi-cc-title">Autonomous Insights — Q3 Pipeline</div><div class="pi-cc-sub">Report</div></div></div>
      {feedback()}''', mid='c3-a', h='{H}')
    body = ('<div class="sk-thread-root">' + c.W({13, 14}, q) + '</div>'
            + c.W({13, 14}, '<div class="sk-thread-count-divider" id="c3-div"{H}><span>1 reply</span></div>') + c.W({13, 14}, a))
    return c.W({13, 14}, f'<div class="pi-conv" id="conv3"{{H}}>{body}</div>')

def pane_sb(c):
    inc, h = c.on(P_SB)
    if not inc: return ''
    rest = {5: 'anchor', 6: 'end', 7: 'end', 8: 'end', 9: 'anchor', 10: 'end', 11: 'anchor', 13: 'end', 14: 'end'}.get(c.b, 'end')
    tabs = ''.join(f'<div class="sk-sb-tab{" is-active" if l == "Messages" else ""}">{sv(i)}{l}</div>' for i, l in [(48, 'Messages'), (49, 'History'), (50, 'Skills'), (51, 'Tasks')])
    think = f'<div class="sk-msg" id="sb-think" data-demo-hide><div class="sk-msg-gutter"><img class="sk-msg-avatar" src="{SB}" alt=""></div><div class="sk-msg-content" style="padding-top:10px"><span class="demo-dots"><i></i><i></i><i></i></span></div></div>' if c.scene else ''
    chipc = (f'<span id="sb-chip" data-demo-hide>{chip()} </span>' if c.scene else '')
    scene_tail = '<span class="pi-typed-host"></span><span class="pi-ph">Ask anything</span>' if c.scene else ''
    return f'''<div class="sk-thread-pane sk-sbpanel" data-shell-region="thread" id="p-sb"{h}>
        <div class="sk-sb-head">
          <div class="sk-sb-title"><img src="{SB}" alt="">Slackbot</div>
          <div class="sk-sb-actions"><button class="sk-sb-btn" aria-label="New message">{sv(44)}</button><button class="sk-sb-btn" aria-label="Search">{sv(45)}</button><button class="sk-sb-btn is-plain" aria-label="More">{sv(46)}</button><button class="sk-sb-btn is-plain" aria-label="Close">{sv(47)}</button></div>
        </div>
        <div class="sk-sb-tabs">{tabs}<div class="sk-sb-tab-add">{sv(52)}</div></div>
        <div class="sk-messages" id="sb-msgs" data-scroll="{rest}" data-rest-offset="8" data-amb-scroll>{conv1(c)}{conv2(c)}{conv3(c)}{think}</div>
        <div class="sk-composer-wrap"><div class="sk-composer" id="sb-composer">
          {fmt_row()}
          <div class="sk-composer-input" id="sb-input" data-placeholder="Ask anything">{chipc}{scene_tail}</div>
          <div class="sk-composer-actions"><div class="sk-composer-actions-left">
            <button class="sk-icon-btn" aria-label="Add">{ic('plus')}</button>
            <button class="sk-icon-btn sk-icon-btn--aa" aria-label="Formatting">Aa</button>
            <button class="sk-icon-btn" aria-label="Canvas">{ic('canvas')}</button>
            <button class="sk-icon-btn" aria-label="Tools">{ic('tools')}</button>
          </div>
          <button class="sk-icon-btn" aria-label="Record audio clip">{ic('microphone')}</button>
          <button class="pi-send-up" aria-label="Send">{ic('arrow-up')}</button></div>
        </div></div>
      </div>'''

# ---------------- canvas (DATA-CANON §8-§10) ----------------
def deal(did, name, amt, prob, upside_label, upside, extra_meta, risks, nxt, flowbox=''):
    meta = f'<span>Predicted close probability <b>{prob}</b></span><span>{upside_label} <b class="is-green">{upside}</b></span>' + extra_meta
    return f'''<div class="pi-deal" id="{did}"><div class="pi-deal-top"><span class="pi-deal-name" data-amb-inert>{name}</span><span class="pi-deal-amt">{amt}</span></div>
      <div class="pi-deal-meta">{meta}</div>
      <h3>What is driving the risk</h3><ol>{''.join('<li>%s</li>' % r for r in risks)}</ol>
      <h3>What to do next</h3><p>{nxt}</p>{flowbox}</div>'''

def view_canvas(c):
    inc, h = c.on(V_CANVAS)
    if not inc: return ''
    fb = f'''<div class="pi-flowbox" id="flowbox"><h4>Executive Deal Review Flow</h4><div class="pi-fl">This flow will:</div>
      <ol><li>Create high-priority tasks for the opportunity owner</li><li>Open a dedicated Slack deal room</li><li>Request an executive review meeting</li>
      <li>Assign owners to procurement and legal blockers</li><li>Set due dates for each critical next step</li><li>Notify the sales leader when blockers are resolved or overdue</li></ol>
      <p>Expected impact: Increase expected Q3 revenue by approximately <b>$1.1M</b></p>
      <button class="pi-gbtn" id="run-flow">{ic('play-filled')}Run Flow for NorthStar</button></div>'''
    ns = deal('deal-ns', 'NorthStar', '$5.2M', '47%', 'Estimated upside from intervention', '$1.1M',
              '</div><div class="pi-deal-meta"><span>Owner <b>Priya Raman</b></span><span>Expected close date <b>Fri, Sep 4</b></span>',
              ['No executive meeting in 28 days', 'Procurement activity declined by 41%', 'Legal review has not started', 'Similar deals typically require 30 days to close', 'Only 17 days remain before the expected close date'],
              'Run an executive deal review to re-establish executive engagement and assign owners to the unresolved blockers.', fb)
    acme = deal('deal-acme', 'Acme Retail Group', '$3.4M', '33%', 'Estimated upside', '$800K', '',
                ['The decision date moved twice', 'The economic buyer has not responded in 11 days', 'A competitor was mentioned on the last two calls', 'The expected close date has slipped by two weeks'],
                'Escalate to the executive sponsor and confirm the decision date with the economic buyer.')
    gl = deal('deal-gl', 'Greenline Energy', '$2.1M', '58%', 'Estimated upside', '$600K', '',
              ['The main champion changed roles two weeks ago', 'Contract redlines have been open for 9 days'],
              'Introduce a new executive sponsor and close the open redlines.')
    r8 = 'anchor' if c.b in (8, 9, 10) else 'top'
    if c.b in (8, 9, 10): ns = ns.replace('id="deal-ns"', 'id="deal-ns" data-rest', 1)
    return f'''<div class="sk-main" id="v-canvas"{h}>
        <div class="pi-doc-head" data-shell-region="channel-header"><span class="pi-star">{sv(36)}</span><span class="pi-doc-title">Pipeline Outlook Analysis</span>
          <span class="pi-doc-meta">Edited just now</span><button class="pi-hbtn">Share</button><button class="sk-v2-hplain" aria-label="Details">{ic('info')}</button><button class="sk-v2-hplain" aria-label="More">{sv(38)}</button></div>
        <div class="pi-doc-scroll" id="canvas-scroll" data-scroll="{r8}" data-rest-offset="12" data-amb-scroll><div class="pi-canvas">
          <div class="pi-crumb">✨ Generated canvas · Q3 Pipeline Outlook</div>
          <h1>Q3 Pipeline Outlook</h1>
          <div class="pi-byline">Q3 · Maya Okonkwo, VP of Sales · generated just now by Slackbot</div>
          <p>Q3 revenue is most likely to finish at <b>$43.7M</b>, below the <b>$48M</b> target.</p>
          <p class="is-red">If current conditions continue, there is a <b>22% likelihood of reaching target</b>.</p>
          <p>The strongest recovery path is to:</p>
          <ul><li>Resolve blockers in <a class="pi-a" href="#deal-ns"><b>NorthStar</b></a> and <a class="pi-a" href="#deal-acme"><b>Acme Retail Group</b></a></li>
          <li>Accelerate at least <b>$2.4M</b> from high-potential Best Case opportunities</li>
          <li>Prevent <a class="pi-a" href="#deal-gl"><b>Greenline Energy</b></a> from slipping</li></ul>
          <p class="is-green">If these interventions succeed, projected revenue could increase to <b>$48.6M</b>, raising the likelihood of reaching target to <b>66%</b>.</p>
          <h2>Deals that need attention</h2>
          {ns}{acme}{gl}
        </div></div>
      </div>'''

# ---------------- report (DATA-CANON §15) ----------------
REPORT = [
    ('01', 'Three deals hold 37% of remaining Commit, so Q3 depends on a few outcomes', 'high', 'HIGH · 94',
     [('Top-3 deals', '$10.7M', '37% of remaining Commit'), ('NorthStar', '$5.2M', '18% of remaining Commit'), ('Remaining Commit forecast', '$28.9M', 'all open Commit deals')],
     ['NorthStar ($5.2M), Acme Retail Group ($3.4M) and Greenline Energy ($2.1M) account for 37% of the remaining Commit forecast.',
      'NorthStar has a 47% predicted close probability; a slip would take about $2.4M off the modeled finish.',
      'Concentration is the pattern you asked me to call out after the Q3 revenue outlook insight.'],
     ['Run the Executive Deal Review Flow on NorthStar.', 'Build a backup plan for the next-largest Commit deals.']),
    ('02', 'Priya Raman has three late-stage deals with no executive contact for 3+ weeks', 'high', 'HIGH · 89',
     [('Late-stage deals', '3', 'including NorthStar'), ('Combined value', '$9.3M', ''), ('Avg days since executive contact', '24 days', 'across the three deals')],
     ["Priya Raman's three late-stage deals total $9.3M, including NorthStar.",
      'Late-stage deals without executive engagement are converting at less than half the rate of comparable deals with active executive involvement.',
      'Only NorthStar has an executive meeting scheduled (Friday).'],
     ['Schedule a coaching 1:1 with Priya Raman.', 'Pair an executive sponsor with each of the three deals.']),
    ('03', 'Greenline Energy at risk of slipping after champion change', 'med', 'MEDIUM · 72',
     [('Deal amount', '$2.1M', ''), ('Predicted close probability', '58%', ''), ('Contract redlines open', '9 days', '')],
     ['The main champion changed roles two weeks ago.', 'Contract redlines have been open for 9 days with no response from legal.'],
     ['Introduce a new executive sponsor.', 'Close the open redlines this week.']),
    ('04', 'Acme Retail Group decision date has moved twice', 'med', 'MEDIUM · 68',
     [('Deal amount', '$3.4M', ''), ('Predicted close probability', '33%', ''), ('Economic buyer silent', '11 days', '')],
     ['The decision date has moved twice.', 'A competitor was mentioned on the last two calls.'],
     ['Escalate to the executive sponsor.', 'Confirm the decision date with the economic buyer.']),
]

def view_report(c):
    inc, h = c.on(V_REPORT)
    if not inc: return ''
    cards = ''
    for n, t, sev, sl, kpis, buls, recs in REPORT:
        k = ''.join(f'<div class="pi-kpi"><div class="pi-kpi-l">{l}</div><div class="pi-kpi-v">{v}</div><div class="pi-kpi-s">{s}</div></div>' for l, v, s in kpis)
        r = ''.join(f'<div class="pi-ra">{ic("arrow-right")}<span>{x}</span></div>' for x in recs)
        cards += f'''<div class="pi-icard" id="ic{int(n)}"><div class="pi-icard-top"><span class="pi-icard-n">{n}</span><span class="pi-icard-t">{t}</span><span class="pi-sev is-{sev}">{sl}</span></div>
          <div class="pi-kpis">{k}</div><ul class="pi-ibul">{''.join('<li>%s</li>' % b for b in buls)}</ul>
          <div class="pi-rec"><div class="pi-rec-h">{ic('check-list')}Recommended actions</div>{r}</div></div>'''
    return f'''<div class="sk-main" id="v-report"{h}>
        <div class="pi-doc-head" data-shell-region="channel-header"><span class="pi-star">{sv(36)}</span><span class="pi-doc-title">Autonomous Insights — Q3 Pipeline</span>
          <span class="pi-doc-meta">Generated just now</span><button class="pi-hbtn">{ic('share-message')}Share</button><button class="pi-hbtn">{ic('ai-sparkle')}Dig Deeper</button><button class="sk-v2-hplain" aria-label="More">{sv(38)}</button></div>
        <div class="pi-doc-scroll pi-report-scroll" id="report-scroll" data-scroll="end" data-amb-scroll><div class="pi-report">{cards}</div></div>
        <div class="pi-report-foot">Generated today at 8:02 AM CT · 2 sources · AI-generated. Review for accuracy.</div>
      </div>'''

# ---------------- assembly ----------------
SCROLL_REST = open(os.path.join(B, 'scroll-rest.js')).read().strip()
FAV = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Crect width='36' height='36' rx='8' fill='%234a154b'/%3E%3C/svg%3E"
def title_for(b):
    if b in V_DM: return 'Nora Castellan (DM)'
    if b in V_CANVAS: return 'Pipeline Outlook Analysis'
    if b in V_REPORT: return 'Autonomous Insights — Q3 Pipeline'
    return 'Salesforce'

def page(c, flow=None):
    panel = (c.b in P_SB) or (c.b in P_THREAD)
    head_extra = '\n<link rel="stylesheet" href="../_kit/demo-flow/demo-flow.css">\n<link rel="stylesheet" href="../_kit/demo-flow/demo-ambient.css">' if flow else ''
    tail = ''
    if flow:
        tail = ('\n<script src="../_kit/demo-flow/scenes.js"></script>\n<script type="application/json" id="demo-flow">' + json.dumps(flow, ensure_ascii=False, indent=1)
                + '</script>\n<script>/* panes demo-flow has scrolled are its own; stop scroll-rest re-running on load/fonts */document.addEventListener(\'demo:scroll\',function(e){if(e.detail&&e.detail.removeAttribute)e.detail.removeAttribute(\'data-scroll\')});</script>\n<script src="../_kit/demo-flow/demo-flow.js"></script>\n<script src="../_kit/demo-flow/demo-ambient.js"></script>')
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Generated by _build/gen.py from DATA-CANON.md. Do not hand-edit; change gen.py and re-run. -->
<title>{title_for(c.b)} - Brightwater - Slack</title>
<link rel="icon" href="{FAV}">
<link rel="stylesheet" href="chrome/slack-shell/slack-shell.css?v=2">
<link rel="stylesheet" href="pi-skin.css?v=1">{head_extra}
</head>
<body class="is-fullbleed" data-amb-sb="mac" data-tip-skin="slack">
<div class="sk-window pi" data-shell="slack@v1" data-theme="v2">
  <div class="sk-app">
    {topnav()}
    <div class="sk-body{' has-panel' if panel else ''}">
      {wscol()}
      {rail(c)}
      {sidebar_home(c)}{sidebar_files(c)}
      {view_dm(c)}{view_sf(c)}{view_canvas(c)}{view_report(c)}
      {pane_thread(c)}{pane_sb(c)}
    </div>
  </div>
</div>
{SCROLL_REST}{tail}
</body>
</html>
'''

def A(**k): return k
TB = {'type': '#sb-input', 'into': '.pi-typed-host', 'ph': '.pi-ph', 'send': '#sb-composer .pi-send-up', 'sendOn': 'is-ready'}
def typ(text, bubble): d = dict(TB); d.update(text=text, bubble=bubble); return d
def think(ms=1400): return {'think': '#sb-think', 'ms': ms}
def stream(sel): return {'stream': sel, 'follow': '#sb-msgs', 'wps': 28}
def rest(pane, to, off=8): return {'scroll': pane, 'to': to, 'offset': off}
def to_files(): return [A(hide='#sb-home'), A(show='#sb-files'), A(remove='#rt-home', cls='is-active'), A(add='#rt-files', cls='is-active')]
def to_home(): return [A(hide='#sb-files'), A(show='#sb-home'), A(remove='#rt-files', cls='is-active'), A(add='#rt-home', cls='is-active')]
def open_sf(): return [A(hide='#v-dm'), A(show='#v-sf', fx='fade'), A(remove='#row-nora', cls='is-active'), A(add='#row-sf', cls='is-active'),
                       A(remove='#row-sf', cls='has-unread'), A(hide='#sf-badge')]

FLOW1 = {'scene': 'day1', 'root': '../', 'next': 'scene-day2.html', 'steps': [
    {'beat': 'C1-01'},
    {'beat': 'C1-02', 'on': {'click': '#row-sf'}, 'do': open_sf() + [A(add='#n1', cls='is-hover-demo')], 'rest': rest('#sf-msgs', 'top')},
    {'beat': 'C1-03', 'on': {'click': '#n1-replies'}, 'do': [A(remove='#n1', cls='is-hover-demo'), A(add='.sk-body', cls='has-panel'), A(show='#p-thread', fx='slide')],
     'rest': rest('#thread-msgs', '#p-thread [data-rest]')},
    {'beat': 'C1-04', 'on': {'click': '#p-thread .pi-close'}, 'do': [A(hide='#p-thread'), A(remove='.sk-body', cls='has-panel'), A(add='#n1', cls='is-hover-demo')]},
    {'on': {'click': '#n1 .pi-tb-sb'}, 'do': [A(add='#n1 .pi-tb-sb', cls='is-on'), A(add='#n1-menu .i1', cls='is-hl'), A(show='#n1-menu', fx='pop')]},
    {'beat': 'C1-05', 'on': {'click': '#n1-menu .i1'}, 'do': [A(hide='#n1-menu'), A(remove='#n1 .pi-tb-sb', cls='is-on'), A(remove='#n1', cls='is-hover-demo'),
        A(add='.sk-body', cls='has-panel'), A(show='#p-sb', fx='slide'), A(show='#conv1', fx='pop'), A(show='#cnt-5'), think(), stream('#c1-a1')],
     'rest': rest('#sb-msgs', '#conv1 .sk-thread-root')},
    {'beat': 'C1-06', 'on': {'click': '#c1-a1 .pi-run'}, 'do': [A(press='#c1-a1 .pi-run'), A(show='#c1-run', fx='pop'), A(hide='#cnt-5'), A(show='#cnt-6'),
        think(1200), stream('#c1-ask'), typ('canvas', '#c1-canvas'), think(1600), stream('#c1-card')], 'rest': rest('#sb-msgs', 'end')},
    {'beat': 'C1-07', 'on': {'click': '#cc-canvas'}, 'do': [A(hide='#v-sf'), A(show='#v-canvas', fx='fade')] + to_files(), 'rest': rest('#canvas-scroll', 'top')},
    {'beat': 'C1-08', 'do': [rest('#canvas-scroll', '#deal-ns', 12)]},
    {'beat': 'C1-09', 'on': {'click': '#run-flow'}, 'do': [A(press='#run-flow'), A(show='#row-deal'), think(1800), A(hide='#cnt-6'), A(show='#cnt-9'),
        stream('#c1-flow'), stream('#c1-mon')], 'rest': rest('#sb-msgs', '#c1-flow')},
    {'beat': 'C1-10', 'on': {'click': '#sb-input'}, 'do': [typ('yes daily for me and @Theo Lindqvist', '#c1-yes'), A(hide='#cnt-9'), A(show='#cnt-10'),
        think(1400), stream('#c1-done')], 'rest': rest('#sb-msgs', 'end')},
    {'beat': 'C1-11', 'on': {'click': '#rt-home'}, 'do': to_home() + [A(hide='#v-canvas'), A(show='#v-sf', fx='fade'), A(add='#n1', cls='is-hover-demo')],
     'rest': rest('#sf-msgs', 'top')},
    {'on': {'click': '#n1 .pi-tb-sb'}, 'do': [A(add='#n1 .pi-tb-sb', cls='is-on'), A(remove='#n1-menu .i1', cls='is-hl'), A(add='#n1-menu .i2', cls='is-hl'), A(show='#n1-menu', fx='pop')]},
    {'on': {'click': '#n1-menu .i2'}, 'do': [A(hide='#n1-menu'), A(remove='#n1 .pi-tb-sb', cls='is-on'), A(remove='#n1', cls='is-hover-demo'),
        A(hide='#conv1'), A(show='#conv2'), A(show='#sb-chip'), A(hide='#sb-input .pi-ph'),
        typ('This was helpful, but next time focus on high-risk, over-concentrated pipeline, or flag a direct report who needs coaching.', '#c2-q'),
        A(hide='#sb-chip'), A(show='#sb-input .pi-ph'), A(show='#c2-div'), think(1600), stream('#c2-a')], 'rest': rest('#sb-msgs', '#conv2 .sk-thread-root')},
]}
FLOW2 = {'scene': 'day2', 'root': '../', 'prev': 'scene-day1.html?beat=last', 'steps': [
    {'beat': 'C1-12'},
    {'on': {'click': '#row-sf'}, 'do': open_sf(), 'rest': rest('#sf-msgs', 'end')},
    {'beat': 'C1-13', 'on': {'click': '#n2 .sk-msg-content'}, 'do': [A(add='#n2', cls='is-hover-demo')]},
    {'on': {'click': '#n2 .pi-tb-sb'}, 'do': [A(remove='#n2', cls='is-hover-demo'), A(add='.sk-body', cls='has-panel'), A(show='#p-sb', fx='slide'),
        A(show='#conv3'), A(show='#sb-chip'), A(hide='#sb-input .pi-ph'), typ('Give me my newest insights', '#c3-q'),
        A(hide='#sb-chip'), A(show='#sb-input .pi-ph'), A(show='#c3-div'), think(1600), stream('#c3-a'), rest('#sf-msgs', 'end')], 'rest': rest('#sb-msgs', 'end')},
    {'beat': 'C1-14', 'on': {'click': '#cc-report, #rep-link'}, 'do': [A(hide='#v-sf'), A(show='#v-report', fx='fade')] + to_files(), 'rest': rest('#report-scroll', 'top')},
    {'do': [rest('#report-scroll', '#ic2', 12)]},
    {'do': [rest('#report-scroll', '#ic3', 12)]},
    {'do': [rest('#report-scroll', 'end')]},
]}
# day-2 load state shows the Nora DM before Salesforce is reopened: views follow 11.5, scene start
# a fresh conversation (conv1/conv2 hidden), so the DAY2 scene's Ctx uses b = 11.5.

out = os.path.join(PROJ, 'slack')

def vb(html):
    """Mark the canon deal name "Acme Retail Group" data-verbatim in text nodes (fidelity-audit flags bare "Acme")."""
    out = re.split(r'(<[^>]*>)', html); skip = False
    for i, seg in enumerate(out):
        if seg.startswith('<'):
            t = seg[1:].split()[0].lower() if len(seg) > 2 else ''
            if t in ('script', 'style'): skip = True
            elif t in ('/script', '/style'): skip = False
        elif not skip:
            out[i] = seg.replace('Acme Retail Group', '<span data-verbatim>Acme Retail Group</span>')
    return ''.join(out)

for n in range(1, 15):
    open(os.path.join(out, 'C1-%02d-slack-panel.html' % n), 'w').write(vb(page(Ctx(n))))
open(os.path.join(out, 'scene-day1.html'), 'w').write(vb(page(Ctx(1, scene=(1, 11)), FLOW1)))
open(os.path.join(out, 'scene-day2.html'), 'w').write(vb(page(Ctx(11.5, scene=(11.5, 14)), FLOW2)))
print('wrote 14 beat pages + 2 scenes')
