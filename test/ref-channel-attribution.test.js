// Trinity 검증: 웹 직링크 채널 귀속 (수정 전엔 전부 direct로 뭉개졌음)
function parse(sp, search){
  const qs = new URLSearchParams(search);
  const refUrl = qs.get("ref")||"", chUrl = qs.get("ch")||qs.get("channel")||"";
  let refId="", channel="direct";
  const mNew = /^ref_(\d+)_?(\w*)$/.exec(sp||"") || /^ref_(\d+)_?(\w*)$/.exec(refUrl||"");
  if(mNew){ refId=mNew[1]; channel=mNew[2]||"direct"; }
  else { const m=/^ref(\d{4,})$/.exec(sp||""); if(m) refId=m[1];
         else if(/^\d{4,}$/.test(refUrl)) refId=refUrl; }
  if(chUrl && channel==="direct") channel=String(chUrl).slice(0,16);
  return {refId, channel};
}
const cases=[
 ["TG 신형",      "ref_777123_tg",  "",                       {refId:"777123",channel:"tg"}],
 ["웹 ref_형",    "",               "?ref=ref_777123_x",      {refId:"777123",channel:"x"}],
 ["웹 ref+ch",    "",               "?ref=777123&ch=reddit",  {refId:"777123",channel:"reddit"}],
 ["웹 ch만",      "",               "?ch=x",                  {refId:"",      channel:"x"}],
 ["구형 TG",      "ref777123",      "",                       {refId:"777123",channel:"direct"}],
 ["무파라미터",   "",               "",                       {refId:"",      channel:"direct"}],
];
let pass=0;
for(const [name,sp,q,exp] of cases){
  const got=parse(sp,q);
  const ok = got.refId===exp.refId && got.channel===exp.channel;
  console.log((ok?"✅":"❌"), name, JSON.stringify(got));
  if(ok) pass++;
}
console.log(`\n${pass}/${cases.length} PASS`);
process.exit(pass===cases.length?0:1);
