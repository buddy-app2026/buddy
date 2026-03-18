import { useState, useRef, useEffect } from "react";

const LEVELS = [
  { code: "A1", label: "A1 - Beginner", color: "#FF6B6B" },
  { code: "A2", label: "A2 - Elementary", color: "#FF9F43" },
  { code: "B1", label: "B1 - Intermediate", color: "#FECA57" },
  { code: "B2", label: "B2 - Upper-Int", color: "#48DBFB" },
  { code: "C1", label: "C1 - Advanced", color: "#FF9FF3" },
  { code: "C2", label: "C2 - Mastery", color: "#54A0FF" },
];

const TARGET_LANGUAGES = [
  { id: "english",  label: "English",        flag: "🇺🇸", speechCode: "en-US" },
  { id: "spanish",  label: "Español",         flag: "🇪🇸", speechCode: "es-ES" },
  { id: "chinese",  label: "中文",            flag: "🇨🇳", speechCode: "zh-CN" },
  { id: "korean",   label: "한국어",          flag: "🇰🇷", speechCode: "ko-KR" },
  { id: "arabic",   label: "العربية الفصحى",  flag: "🇸🇦", speechCode: "ar-SA" },
  { id: "japanese", label: "日本語",          flag: "🇯🇵", speechCode: "ja-JP" },
  { id: "kurdish",  label: "Kurdî",           flag: "🏴", speechCode: "ku"    },
  { id: "persian",  label: "فارسی",           flag: "🇮🇷", speechCode: "fa-IR" },
];

const NATIVE_LANGUAGES = [
  { id: "english",  label: "English",   flag: "🇺🇸" },
  { id: "arabic",   label: "العربية",   flag: "🇸🇦" },
  { id: "spanish",  label: "Español",   flag: "🇪🇸" },
  { id: "chinese",  label: "中文",      flag: "🇨🇳" },
  { id: "french",   label: "Français",  flag: "🇫🇷" },
  { id: "korean",   label: "한국어",    flag: "🇰🇷" },
  { id: "japanese", label: "日本語",    flag: "🇯🇵" },
  { id: "kurdish",  label: "Kurdî",     flag: "🏴" },
  { id: "persian",  label: "فارسی",     flag: "🇮🇷" },
];

const UI = {
  english:  { whatsName:"What's your name?",       namePh:"Enter your name...",       ageQ:"How old are you?",         kids:"Kids 6-12",      teens:"Teens 13-17",      adults:"Adults 18+",      nativeQ:"Your native language?",           targetQ:"Which language to learn?",     levelQ:"Your current level?",       next:"Next →",      chatPh:"Ask Buddy anything...",   pronTitle:"Pronunciation Trainer",   pronDesc:"Type a word, tap the mic & say it!",  pronPh:"Type a word...",   listenBtn:"🎙️ Tap & Speak", listening:"🔴 Listening...",  analyzing:"Analyzing... 🧠", planTitle:"Your Learning Roadmap", goalLabel:"Goal: C2 Mastery",   tryWords:"Try these words:", q1:"Teach me a word 📚", q2:"Grammar tip ✏️",        q3:"Pronunciation help 🎤", q4:"Quiz me! 🎯",      chat:"Chat", pron:"Pronounce", plan:"My Plan", rtl:false },
  spanish:  { whatsName:"¿Cómo te llamas?",         namePh:"Escribe tu nombre...",      ageQ:"¿Cuántos años tienes?",    kids:"Niños 6-12",     teens:"Jóvenes 13-17",    adults:"Adultos 18+",     nativeQ:"¿Tu idioma nativo?",              targetQ:"¿Qué idioma aprender?",        levelQ:"¿Tu nivel actual?",         next:"Siguiente →", chatPh:"Pregúntale a Buddy...",   pronTitle:"Entrenador de Pronunciación", pronDesc:"Escribe una palabra y toca el micro.", pronPh:"Escribe una palabra...",listenBtn:"🎙️ Toca y habla", listening:"🔴 Escuchando...", analyzing:"Analizando... 🧠",planTitle:"Tu Hoja de Ruta",       goalLabel:"Meta: Maestría C2",  tryWords:"Prueba estas palabras:", q1:"Enséñame una palabra 📚", q2:"Consejo gramática ✏️",  q3:"Ayuda pronunciación 🎤", q4:"¡Ponme a prueba! 🎯", chat:"Chat", pron:"Pronunciar", plan:"Mi Plan", rtl:false },
  chinese:  { whatsName:"你叫什么名字？",              namePh:"输入你的名字...",            ageQ:"你多大了？",               kids:"儿童 6-12",      teens:"青少年 13-17",     adults:"成人 18+",        nativeQ:"你的母语？",                       targetQ:"想学哪种语言？",              levelQ:"你的当前水平？",            next:"下一步 →",    chatPh:"问Buddy任何问题...",      pronTitle:"发音训练",               pronDesc:"输入词语，点击麦克风说！",           pronPh:"输入一个词...",   listenBtn:"🎙️ 点击说话",  listening:"🔴 正在听...",    analyzing:"分析中... 🧠",   planTitle:"你的学习路线图",        goalLabel:"目标：C2精通",       tryWords:"试试这些词：",    q1:"教我一个词 📚",        q2:"语法提示 ✏️",          q3:"发音帮助 🎤",          q4:"考考我！ 🎯",      chat:"聊天", pron:"发音", plan:"我的计划", rtl:false },
  french:   { whatsName:"Quel est ton prénom ?",     namePh:"Entrez votre prénom...",    ageQ:"Quel âge as-tu ?",         kids:"Enfants 6-12",   teens:"Ados 13-17",       adults:"Adultes 18+",     nativeQ:"Langue maternelle ?",             targetQ:"Quelle langue apprendre ?",    levelQ:"Ton niveau actuel ?",       next:"Suivant →",   chatPh:"Demande à Buddy...",      pronTitle:"Entraîneur de Prononciation", pronDesc:"Écris un mot, appuie sur le micro !",pronPh:"Écris un mot...",  listenBtn:"🎙️ Appuie et parle", listening:"🔴 Écoute...", analyzing:"Analyse... 🧠",   planTitle:"Ta Feuille de Route",   goalLabel:"Objectif : C2",      tryWords:"Essaie ces mots :",q1:"Apprends-moi un mot 📚",  q2:"Astuce gramm. ✏️",     q3:"Aide prononciation 🎤", q4:"Interroge-moi ! 🎯", chat:"Chat", pron:"Prononcer", plan:"Mon Plan", rtl:false },
  korean:   { whatsName:"이름이 뭐예요?",             namePh:"이름을 입력하세요...",        ageQ:"나이가 어떻게 되세요?",    kids:"어린이 6-12",    teens:"청소년 13-17",     adults:"성인 18+",        nativeQ:"모국어는?",                        targetQ:"어떤 언어를 배울까요?",        levelQ:"현재 레벨은?",              next:"다음 →",      chatPh:"Buddy에게 물어보세요...", pronTitle:"발음 트레이너",          pronDesc:"단어 입력 후 마이크를 눌러 말하세요!", pronPh:"단어 입력...",    listenBtn:"🎙️ 탭하고 말하기",listening:"🔴 듣는 중...", analyzing:"분석 중... 🧠",  planTitle:"나의 학습 로드맵",      goalLabel:"목표: C2 마스터리",  tryWords:"이 단어 시도:",    q1:"단어 가르쳐줘 📚",     q2:"문법 팁 ✏️",           q3:"발음 도움 🎤",         q4:"퀴즈 내줘! 🎯",    chat:"채팅", pron:"발음", plan:"내 계획", rtl:false },
  japanese: { whatsName:"お名前は？",                 namePh:"名前を入力...",              ageQ:"何歳ですか？",             kids:"子供 6-12",      teens:"10代 13-17",       adults:"大人 18+",        nativeQ:"母国語は？",                       targetQ:"どの言語を学ぶ？",            levelQ:"現在のレベルは？",          next:"次へ →",      chatPh:"Buddyに何でも聞いて...", pronTitle:"発音トレーナー",         pronDesc:"単語を入力してマイクをタップ！",     pronPh:"単語を入力...",   listenBtn:"🎙️ タップして話す",listening:"🔴 聞いています...",analyzing:"分析中... 🧠", planTitle:"学習ロードマップ",      goalLabel:"目標：C2マスタリー", tryWords:"試してみて：",     q1:"単語を教えて 📚",      q2:"文法のヒント ✏️",      q3:"発音の助け 🎤",        q4:"クイズ！ 🎯",      chat:"チャット", pron:"発音", plan:"マイプラン", rtl:false },
  kurdish:  { whatsName:"Navê te çi ye?",            namePh:"Navê xwe binivîse...",      ageQ:"Tu çend salî yî?",         kids:"Zarok 6-12",     teens:"Ciwan 13-17",      adults:"Mezinan 18+",     nativeQ:"Zimanê dayikê?",                  targetQ:"Kîjan ziman fêr bibî?",        levelQ:"Asta te ya niha?",          next:"Pêşve →",     chatPh:"Ji Buddy bipirse...",     pronTitle:"Rahênerê Bilêvkirinê",   pronDesc:"Peyvekê binivîse û mîkrofonê bikirtîne!", pronPh:"Peyvekê binivîse...",listenBtn:"🎙️ Bikirtîne û bipeyive",listening:"🔴 Guhdarî dike...",analyzing:"Analîz dike... 🧠",planTitle:"Nexşeya Fêrbûna Te",  goalLabel:"Armanc: C2",         tryWords:"Van peyvan biceribîne:", q1:"Peyvekê fêrî min bike 📚",q2:"Serişteyên gramer ✏️",  q3:"Alîkariya bilêvkirinê 🎤",q4:"Pirsên min bike! 🎯",chat:"Sohbet", pron:"Bilêvkirin", plan:"Plana Min", rtl:false },
  arabic:   { whatsName:"شو اسمك؟",                  namePh:"اكتب اسمك...",              ageQ:"شقد عمرك؟",               kids:"أطفال ٦-١٢",    teens:"مراهقون ١٣-١٧",   adults:"بالغون ١٨+",      nativeQ:"شو لغتك الأم؟",                   targetQ:"أي لغة تريد تتعلم؟",          levelQ:"شو مستواك الحالي؟",         next:"التالي ←",    chatPh:"اسأل Buddy أي شي...",    pronTitle:"تدريب النطق",            pronDesc:"اكتب كلمة، اضغط الميكروفون وقولها!",  pronPh:"اكتب كلمة...",    listenBtn:"🎙️ اضغط وتكلم",  listening:"🔴 يسمعك...",     analyzing:"يحلل... 🧠",      planTitle:"خارطة طريق تعلمك",      goalLabel:"الهدف: إتقان C2",    tryWords:"جرب هذي الكلمات:", q1:"علمني كلمة 📚",        q2:"نصيحة قواعد ✏️",       q3:"مساعدة نطق 🎤",        q4:"اختبرني! 🎯",      chat:"المحادثة", pron:"النطق", plan:"خطتي", rtl:true },
  persian:  { whatsName:"اسمت چیه؟",                 namePh:"اسمت رو بنویس...",          ageQ:"چند سالته؟",              kids:"کودکان ۶-۱۲",   teens:"نوجوانان ۱۳-۱۷",  adults:"بزرگسالان ۱۸+",  nativeQ:"زبان مادری‌ات؟",                  targetQ:"می‌خوای چه زبانی یاد بگیری؟", levelQ:"سطح فعلیت؟",               next:"بعدی ←",      chatPh:"از Buddy بپرس...",        pronTitle:"تمرین تلفظ",             pronDesc:"یه کلمه بنویس، روی میکروفون بزن!",  pronPh:"یه کلمه بنویس...", listenBtn:"🎙️ بزن و بگو",  listening:"🔴 داره گوش میده...",analyzing:"داره تحلیل می‌کنه... 🧠",planTitle:"نقشه راه یادگیری",  goalLabel:"هدف: تسلط C2",      tryWords:"این کلمه‌ها رو امتحان کن:", q1:"یه کلمه یادم بده 📚", q2:"نکته گرامری ✏️",      q3:"کمک با تلفظ 🎤",      q4:"ازم بپرس! 🎯",     chat:"چت", pron:"تلفظ", plan:"برنامه‌ام", rtl:true },
};

const EXAMPLE_WORDS = {
  english:  ["beautiful","necessary","rhythm","thorough","pronunciation"],
  spanish:  ["murciélago","desarrollar","trabajar","aproximadamente","quirúrgico"],
  chinese:  ["你好","谢谢","漂亮","工作","学习"],
  korean:   ["안녕하세요","감사합니다","사랑해요","공부하다","아름다워"],
  arabic:   ["مرحباً","شكراً","جميل","يتعلم","مستقبل"],
  japanese: ["ありがとう","こんにちは","勉強する","美しい","頑張って"],
  kurdish:  ["spas","rohnî","kurdistan","hevallo","bijî"],
  persian:  ["ممنون","سلام","زیبا","یادگیری","آینده"],
};

const SYSTEM_PROMPT = (p) => {
  const nName = NATIVE_LANGUAGES.find(l=>l.id===p.nativeLang)?.label || "English";
  const tName = TARGET_LANGUAGES.find(l=>l.id===p.targetLang)?.label || "English";
  const ageDesc = p.ageGroup==="kids" ? "child 6-12 (simple, fun, cartoons & animals)"
    : p.ageGroup==="teens" ? "teenager 13-17 (music, social media, modern slang)"
    : "adult 18+ (professional contexts, travel, daily life)";
  return `You are "Buddy" — a warm, encouraging AI language coach. Your student is a ${ageDesc}.

KEY RULES:
1. Student's NATIVE language: ${nName}
2. Student is LEARNING: ${tName} at CEFR level ${p.level}
3. ALWAYS write in BOTH languages: explanations in ${nName}, learning content in ${tName}
4. Be like a best friend — warm, patient, fun, never harsh
5. Use emojis naturally
6. For pronunciation: give phonetic guide + describe mouth position
7. For grammar: 2 real-world examples in ${tName}
8. Max ~180 words total per reply
9. If ${tName} is Arabic → use Modern Standard Arabic (الفصحى)
10. If ${tName} is English → note ${p.accent} accent style`;
};

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [profile, setProfile] = useState({ name:"", ageGroup:"", nativeLang:"", targetLang:"", level:"", accent:"american" });
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pronWord, setPronWord] = useState("");
  const [pronScore, setPronScore] = useState(null);
  const [pronFeedback, setPronFeedback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const chatEndRef = useRef(null);

  const t = UI[profile.nativeLang] || UI.english;
  const rtl = t.rtl;

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const STEPS = [
    { key:"nativeLang", type:"langGrid", options:NATIVE_LANGUAGES },
    { key:"name",       type:"text" },
    { key:"ageGroup",   type:"ageGrid" },
    { key:"targetLang", type:"langGrid", options:TARGET_LANGUAGES },
    { key:"level",      type:"levelGrid" },
  ];
  const STEP_TITLES = (tUI) => [
    tUI.nativeQ, tUI.whatsName, tUI.ageQ, tUI.targetQ, tUI.levelQ
  ];

  const advance = (val) => {
    const s = STEPS[step];
    const updated = {...profile, [s.key]: val};
    setProfile(updated);
    if (step < STEPS.length-1) setStep(step+1);
    else launch(updated);
  };

  const launch = async (p) => {
    setScreen("home");
    setLoading(true);
    const tName = TARGET_LANGUAGES.find(l=>l.id===p.targetLang)?.label || p.targetLang;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system: SYSTEM_PROMPT(p),
          messages:[{role:"user", content:`Give ${p.name} a warm welcome (under 80 words). They want to learn ${tName}, currently at ${p.level}.`}]
        })
      });
      const data = await res.json();
      setMessages([{role:"assistant", content: data.content?.[0]?.text || `Hey ${p.name}! 🎉`}]);
    } catch {
      setMessages([{role:"assistant", content:`Hey ${p.name}! 👋 I'm Buddy! Let's learn ${tName} together! 🚀`}]);
    }
    setLoading(false);
    generatePlan(p);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = {role:"user", content:text};
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system: SYSTEM_PROMPT(profile), messages: newMsgs })
      });
      const data = await res.json();
      setMessages([...newMsgs, {role:"assistant", content: data.content?.[0]?.text || "Try again!"}]);
    } catch {
      setMessages([...newMsgs, {role:"assistant", content:"Connection issue 😅"}]);
    }
    setLoading(false);
  };

  const scorePron = async (word, spoken) => {
    setLoading(true);
    const tName = TARGET_LANGUAGES.find(l=>l.id===profile.targetLang)?.label || "the target language";
    const nName = NATIVE_LANGUAGES.find(l=>l.id===profile.nativeLang)?.label || "English";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user", content:`Student learning ${tName} (native: ${nName}) tried to say "${word}" and said "${spoken}". Score 0-100. Give feedback in ${nName}. Respond ONLY as JSON no markdown: {"score":85,"emoji":"🌟","feedback":"...","tip":"..."}`}]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim());
      setPronScore(parsed.score);
      setPronFeedback(parsed);
    } catch {
      setPronScore(70);
      setPronFeedback({score:70,emoji:"👍",feedback:"Good attempt! Keep practicing.",tip:"Practice slowly first."});
    }
    setLoading(false);
  };

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Use Chrome for mic support!"); return; }
    const r = new SR();
    r.lang = TARGET_LANGUAGES.find(l=>l.id===profile.targetLang)?.speechCode || "en-US";
    r.interimResults = false;
    r.onresult = (e) => { setIsRecording(false); scorePron(pronWord, e.results[0][0].transcript); };
    r.onerror = () => setIsRecording(false);
    r.onend = () => setIsRecording(false);
    r.start();
    setIsRecording(true);
    setPronScore(null);
    setPronFeedback(null);
  };

  const generatePlan = async (p) => {
    const tName = TARGET_LANGUAGES.find(l=>l.id===p.targetLang)?.label || "English";
    const nName = NATIVE_LANGUAGES.find(l=>l.id===p.nativeLang)?.label || "English";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user", content:`Learning roadmap for ${p.ageGroup} learning ${tName} from ${p.level} to C2. Native: ${nName}. Write phase titles & milestones in ${nName}. JSON only no markdown: {"phases":[{"phase":1,"title":"...","level":"A1→A2","weeks":"1-8","focus":["..."],"dailyGoal":"15 min","milestone":"..."}],"dailyHabits":["..."],"resources":["..."]} Include 6 phases.`}]
        })
      });
      const data = await res.json();
      setPlan(JSON.parse((data.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim()));
    } catch { setPlan(null); }
  };

  const scoreColor = (s) => s>=85?"#2ecc71":s>=65?"#f39c12":"#e74c3c";
  const targetLang = TARGET_LANGUAGES.find(l=>l.id===profile.targetLang);
  const nativeLang = NATIVE_LANGUAGES.find(l=>l.id===profile.nativeLang);
  const tUI = UI[profile.nativeLang] || UI.english;

  // ── ONBOARDING ──────────────────────────────────────────────────────────────
  if (screen === "onboarding") {
    const s = STEPS[step];
    const titles = STEP_TITLES(tUI);
    return (
      <div style={S.ob.wrap}>
        <div style={S.ob.card}>
          <div style={S.ob.dots}>
            {STEPS.map((_,i)=><div key={i} style={{...S.ob.dot, background: i<=step?"#6C63FF":"#ddd"}}/>)}
          </div>
          <div style={{fontSize:50,marginBottom:8}}>🤖</div>
          <h2 style={{...S.ob.title, direction: tUI.rtl?"rtl":"ltr"}}>{titles[step]}</h2>

          {s.type==="text" && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input id="ni" style={{...S.ob.input, direction: tUI.rtl?"rtl":"ltr"}}
                placeholder={tUI.namePh} autoFocus
                onKeyDown={e=>e.key==="Enter"&&e.target.value&&advance(e.target.value)}/>
              <button style={S.ob.btn}
                onClick={()=>{const v=document.getElementById("ni").value; if(v) advance(v);}}>
                {tUI.next}
              </button>
            </div>
          )}

          {s.type==="langGrid" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {s.options.map(opt=>(
                <button key={opt.id} style={S.ob.langBtn} onClick={()=>advance(opt.id)}>
                  <span style={{fontSize:24}}>{opt.flag}</span>
                  <span style={{fontSize:12,fontWeight:600}}>{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {s.type==="ageGrid" && (
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              {[{id:"kids",icon:"🧒"},{id:"teens",icon:"🧑"},{id:"adults",icon:"👨"}].map(a=>(
                <button key={a.id} style={S.ob.ageBtn} onClick={()=>advance(a.id)}>
                  <span style={{fontSize:34}}>{a.icon}</span>
                  <span style={{fontSize:12,fontWeight:600}}>{tUI[a.id]||a.id}</span>
                </button>
              ))}
            </div>
          )}

          {s.type==="levelGrid" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {LEVELS.map(l=>(
                <button key={l.code} style={S.ob.levelBtn} onClick={()=>advance(l.code)}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:l.color,flexShrink:0}}/>
                  <span style={{fontSize:13,fontWeight:600}}>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN APP ────────────────────────────────────────────────────────────────
  return (
    <div style={{...S.app.wrap, direction: rtl?"rtl":"ltr"}}>
      {/* Header */}
      <div style={S.app.header}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:28}}>🤖</span>
          <div>
            <div style={{fontWeight:800,fontSize:17}}>Buddy</div>
            <div style={{fontSize:11,opacity:.8}}>{profile.name} • {nativeLang?.flag}→{targetLang?.flag} • {profile.level}</div>
          </div>
        </div>
        <div style={S.app.badge}>{targetLang?.flag} {targetLang?.label}</div>
      </div>

      {/* Tabs */}
      <div style={S.app.tabs}>
        {[{id:"chat",icon:"💬",label:tUI.chat},{id:"pronunciation",icon:"🎤",label:tUI.pron},{id:"plan",icon:"📋",label:tUI.plan}].map(tab=>(
          <button key={tab.id} style={{...S.app.tab,...(activeTab===tab.id?S.app.tabActive:{})}} onClick={()=>setActiveTab(tab.id)}>
            <span>{tab.icon}</span><span style={{fontSize:11}}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── CHAT ── */}
      {activeTab==="chat" && (
        <div style={S.chat.wrap}>
          <div style={S.chat.msgs}>
            {messages.map((m,i)=>(
              <div key={i} style={{...S.chat.bubble,...(m.role==="user"?S.chat.bubbleUser:S.chat.bubbleBot)}}>
                {m.role==="assistant"&&<span style={{fontSize:22,flexShrink:0}}>🤖</span>}
                <div style={{...S.chat.text,...(m.role==="user"?S.chat.textUser:{}),textAlign:rtl?"right":"left"}}>{m.content}</div>
              </div>
            ))}
            {loading&&(
              <div style={{...S.chat.bubble,...S.chat.bubbleBot}}>
                <span style={{fontSize:22}}>🤖</span>
                <div style={{...S.chat.text,padding:"14px 18px"}}>
                  <span className="td"/><span className="td"/><span className="td"/>
                </div>
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>
          <div style={{...S.chat.inputRow,flexDirection:rtl?"row-reverse":"row"}}>
            <input style={{...S.chat.input,textAlign:rtl?"right":"left"}} value={input}
              onChange={e=>setInput(e.target.value)} placeholder={tUI.chatPh}
              onKeyDown={e=>e.key==="Enter"&&sendMessage(input)}/>
            <button style={S.chat.send} onClick={()=>sendMessage(input)} disabled={loading}>➤</button>
          </div>
          <div style={{...S.chat.quickRow,flexDirection:rtl?"row-reverse":"row"}}>
            {[tUI.q1,tUI.q2,tUI.q3,tUI.q4].map(q=>(
              <button key={q} style={S.chat.quickBtn} onClick={()=>sendMessage(q)}>{q}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── PRONUNCIATION ── */}
      {activeTab==="pronunciation" && (
        <div style={S.pron.wrap}>
          <h3 style={{...S.pron.title,textAlign:rtl?"right":"left"}}>🎤 {tUI.pronTitle}</h3>
          <p style={{color:"#888",fontSize:14,margin:0,textAlign:rtl?"right":"left"}}>{tUI.pronDesc}</p>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:24}}>{targetLang?.flag}</span>
            <input style={{...S.pron.input,flex:1,textAlign:rtl?"right":"left"}}
              placeholder={tUI.pronPh} value={pronWord}
              onChange={e=>{setPronWord(e.target.value);setPronScore(null);setPronFeedback(null);}}/>
          </div>
          <button style={{...S.pron.mic,background:isRecording?"#e74c3c":"#6C63FF"}}
            onClick={startRecording} disabled={!pronWord||loading}>
            {isRecording?tUI.listening:tUI.listenBtn}
          </button>
          {loading&&<div style={{textAlign:"center",color:"#888",fontSize:14,padding:16}}>{tUI.analyzing}</div>}
          {pronScore!==null&&pronFeedback&&(
            <div style={S.pron.card}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#eee" strokeWidth="9"/>
                  <circle cx="55" cy="55" r="48" fill="none" stroke={scoreColor(pronScore)} strokeWidth="9"
                    strokeDasharray={`${(pronScore/100)*301} 301`} strokeLinecap="round"
                    transform="rotate(-90 55 55)" style={{transition:"stroke-dasharray 1s ease"}}/>
                  <text x="55" y="52" textAnchor="middle" fontSize="26" fontWeight="bold" fill={scoreColor(pronScore)}>{pronScore}</text>
                  <text x="55" y="68" textAnchor="middle" fontSize="11" fill="#aaa">/100</text>
                </svg>
              </div>
              <div style={{fontSize:28,textAlign:"center",marginBottom:6}}>{pronFeedback.emoji}</div>
              <p style={{fontSize:14,color:"#444",textAlign:"center",margin:"0 0 10px",direction:rtl?"rtl":"ltr"}}>{pronFeedback.feedback}</p>
              <div style={{background:"#f0eeff",color:"#6C63FF",padding:"10px 14px",borderRadius:10,fontSize:13,direction:rtl?"rtl":"ltr"}}>💡 {pronFeedback.tip}</div>
            </div>
          )}
          <div style={{background:"white",borderRadius:14,padding:14,boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            <p style={{color:"#888",fontSize:12,margin:"0 0 8px",textAlign:rtl?"right":"left"}}>{tUI.tryWords}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {(EXAMPLE_WORDS[profile.targetLang]||EXAMPLE_WORDS.english).map(w=>(
                <button key={w} style={S.pron.chip}
                  onClick={()=>{setPronWord(w);setPronScore(null);setPronFeedback(null);}}>{w}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PLAN ── */}
      {activeTab==="plan" && (
        <div style={S.plan.wrap}>
          <h3 style={{...S.pron.title,textAlign:rtl?"right":"left"}}>📋 {tUI.planTitle}</h3>
          <div style={S.plan.goal}>
            <span style={{fontSize:30}}>🏆</span>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>{tUI.goalLabel}</div>
              <div style={{fontSize:12,opacity:.8}}>{profile.level} → C2 • {targetLang?.flag} {targetLang?.label}</div>
            </div>
          </div>
          {!plan?(
            <div style={{textAlign:"center",color:"#888",padding:30}}>✨ Generating your plan...</div>
          ):(
            <>
              {plan.phases?.map((ph,i)=>(
                <div key={i} style={S.plan.card}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={S.plan.num}>{ph.phase}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:14,textAlign:rtl?"right":"left"}}>{ph.title}</div>
                      <div style={{color:"#6C63FF",fontSize:12}}>{ph.level} • Weeks {ph.weeks}</div>
                    </div>
                    <div style={{background:"#f0eeff",color:"#6C63FF",padding:"3px 8px",borderRadius:8,fontSize:11,fontWeight:600}}>{ph.dailyGoal}</div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>
                    {ph.focus?.map((f,j)=><span key={j} style={{background:"#f8f9ff",border:"1px solid #eee",padding:"2px 8px",borderRadius:8,fontSize:11,color:"#555"}}>{f}</span>)}
                  </div>
                  <div style={{fontSize:12,color:"#777",fontStyle:"italic",textAlign:rtl?"right":"left"}}>🎯 {ph.milestone}</div>
                </div>
              ))}
              {plan.dailyHabits&&(
                <div style={S.plan.extras}>
                  <h4 style={{margin:"0 0 8px",color:"#6C63FF",fontSize:14}}>📅 Daily Habits</h4>
                  {plan.dailyHabits.map((h,i)=><div key={i} style={S.plan.item}>✅ {h}</div>)}
                </div>
              )}
              {plan.resources&&(
                <div style={S.plan.extras}>
                  <h4 style={{margin:"0 0 8px",color:"#FF6B9D",fontSize:14}}>📚 Resources</h4>
                  {plan.resources.map((r,i)=><div key={i} style={S.plan.item}>📖 {r}</div>)}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}
        .td{display:inline-block;width:8px;height:8px;background:#ccc;border-radius:50%;animation:bounce 1.2s infinite;margin:0 2px}
        .td:nth-child(2){animation-delay:.2s}.td:nth-child(3){animation-delay:.4s}
      `}</style>
    </div>
  );
}

const S = {
  ob:{
    wrap:{minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Segoe UI',sans-serif"},
    card:{background:"white",borderRadius:24,padding:"36px 28px",maxWidth:400,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.2)",textAlign:"center"},
    dots:{display:"flex",gap:8,justifyContent:"center",marginBottom:20},
    dot:{width:9,height:9,borderRadius:"50%",transition:"background .3s"},
    title:{fontSize:20,fontWeight:700,color:"#2d2d2d",marginBottom:20},
    input:{padding:"13px 16px",borderRadius:12,border:"2px solid #eee",fontSize:15,outline:"none",textAlign:"center",width:"100%",boxSizing:"border-box",fontFamily:"inherit"},
    btn:{padding:14,background:"#6C63FF",color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"},
    langBtn:{padding:"14px 10px",background:"white",border:"2px solid #eee",borderRadius:14,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,fontFamily:"inherit"},
    ageBtn:{padding:"16px 18px",background:"white",border:"2px solid #eee",borderRadius:16,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,fontFamily:"inherit"},
    levelBtn:{padding:"12px 10px",background:"white",border:"2px solid #eee",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"},
  },
  app:{
    wrap:{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:"#f8f9ff",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column"},
    header:{background:"linear-gradient(135deg,#6C63FF,#764ba2)",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",color:"white"},
    badge:{background:"rgba(255,255,255,.2)",padding:"5px 12px",borderRadius:20,fontSize:13,fontWeight:600},
    tabs:{display:"flex",background:"white",borderBottom:"1px solid #eee",boxShadow:"0 2px 8px rgba(0,0,0,.05)"},
    tab:{flex:1,padding:"11px 0",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:"#aaa",fontSize:17},
    tabActive:{color:"#6C63FF",borderBottom:"2px solid #6C63FF"},
  },
  chat:{
    wrap:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"},
    msgs:{flex:1,overflowY:"auto",padding:"14px 12px",display:"flex",flexDirection:"column",gap:10},
    bubble:{display:"flex",alignItems:"flex-end",gap:7},
    bubbleUser:{flexDirection:"row-reverse"},
    bubbleBot:{flexDirection:"row"},
    text:{maxWidth:"75%",padding:"11px 14px",borderRadius:18,background:"white",color:"#2d2d2d",fontSize:14,lineHeight:1.55,boxShadow:"0 2px 8px rgba(0,0,0,.07)"},
    textUser:{background:"#6C63FF",color:"white",borderRadius:"18px 18px 4px 18px"},
    inputRow:{display:"flex",padding:"8px 10px",gap:7,background:"white",borderTop:"1px solid #eee"},
    input:{flex:1,padding:"11px 14px",borderRadius:22,border:"2px solid #eee",fontSize:14,outline:"none",fontFamily:"inherit"},
    send:{width:46,height:46,borderRadius:"50%",background:"#6C63FF",color:"white",border:"none",fontSize:17,cursor:"pointer",flexShrink:0},
    quickRow:{display:"flex",gap:7,padding:"7px 10px 11px",overflowX:"auto"},
    quickBtn:{flexShrink:0,padding:"7px 13px",background:"#f0eeff",color:"#6C63FF",border:"none",borderRadius:18,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"},
  },
  pron:{
    wrap:{flex:1,overflowY:"auto",padding:18,display:"flex",flexDirection:"column",gap:14},
    title:{fontSize:19,fontWeight:800,color:"#2d2d2d",margin:0},
    input:{padding:"13px 16px",borderRadius:13,border:"2px solid #eee",fontSize:15,outline:"none",fontFamily:"inherit"},
    mic:{padding:15,borderRadius:13,border:"none",color:"white",fontSize:15,fontWeight:700,cursor:"pointer",transition:"background .3s",fontFamily:"inherit"},
    card:{background:"white",borderRadius:18,padding:20,boxShadow:"0 4px 18px rgba(0,0,0,.08)"},
    chip:{padding:"5px 13px",background:"#f0eeff",color:"#6C63FF",border:"none",borderRadius:18,fontSize:12,cursor:"pointer",fontWeight:500,fontFamily:"inherit"},
  },
  plan:{
    wrap:{flex:1,overflowY:"auto",padding:18,display:"flex",flexDirection:"column",gap:12},
    goal:{background:"linear-gradient(135deg,#6C63FF,#764ba2)",borderRadius:14,padding:18,display:"flex",alignItems:"center",gap:14,color:"white"},
    card:{background:"white",borderRadius:14,padding:14,boxShadow:"0 2px 8px rgba(0,0,0,.05)"},
    num:{width:34,height:34,borderRadius:"50%",background:"#6C63FF",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,flexShrink:0,fontSize:14},
    extras:{background:"white",borderRadius:14,padding:14,boxShadow:"0 2px 8px rgba(0,0,0,.05)"},
    item:{fontSize:13,color:"#444",padding:"5px 0",borderBottom:"1px solid #f5f5f5"},
  },
};
