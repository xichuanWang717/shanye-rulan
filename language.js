import {dictionary} from './english.js?v=66';
let language='zh';try{language=localStorage.getItem('shanye-language')==='en'?'en':'zh'}catch{}
const originals=new WeakMap(),attributes=new WeakMap();
const entries=Object.entries(dictionary).sort((a,b)=>b[0].length-a[0].length);
const cache=new Map();
function translate(text){
 if(cache.has(text))return cache.get(text);
 if(dictionary[text])return dictionary[text];
 const locked=text.match(/^山野里，还有几段故事等你发现。先去看看吧，染亭会在这里等你。还差 (\d+) 段记忆，可从右上角手记寻找。$/);
 if(locked)return `More stories await in the valley. Take your time—the pavilion will be here. ${locked[1]} memories remain; check the journal at the top right for clues.`;
 let result=text;for(const [zh,en] of entries)result=result.split(zh).join(en);cache.set(text,result);return result;
}
function visit(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  if(node.parentElement.closest('script,style,.language-switch'))continue;
  let saved=originals.get(node);if(!saved||node.data!==saved.output)saved={source:node.data};
  saved.output=language==='en'?translate(saved.source):saved.source;if(node.data!==saved.output)node.data=saved.output;originals.set(node,saved);
 }
 for(const el of root.querySelectorAll('[aria-label],[alt],[title]')){
  if(el.closest('.language-switch'))continue;const saved=attributes.get(el)||{};
  for(const name of ['aria-label','alt','title']){if(!el.hasAttribute(name))continue;const value=el.getAttribute(name);let item=saved[name];if(!item||value!==item.output)item={source:value};item.output=language==='en'?translate(item.source):item.source;if(value!==item.output)el.setAttribute(name,item.output);saved[name]=item;}attributes.set(el,saved);
 }
}
function controls(parent){const bar=document.createElement('div');bar.className='language-switch';bar.setAttribute('role','group');bar.setAttribute('aria-label','Language / 语言');bar.innerHTML='<button type="button" lang="zh-CN" data-language="zh">中文</button><button type="button" lang="en" data-language="en">English</button>';bar.onclick=e=>{const choice=e.target.closest('[data-language]');if(choice){language=choice.dataset.language;try{localStorage.setItem('shanye-language',language)}catch{}refresh();}};parent.append(bar);}
function refresh(){observer.disconnect();document.documentElement.lang=language==='en'?'en':'zh-CN';visit(document.body);document.title=language==='en'?'Into the Indigo Wilds · A batik journey home':'山野入蓝 · 一场蜡染归乡';for(const dialog of document.querySelectorAll('dialog'))if(!dialog.querySelector(':scope > .language-switch'))controls(dialog);for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['alt','aria-label','title']});}
const observer=new MutationObserver(refresh);controls(document.body);refresh();
