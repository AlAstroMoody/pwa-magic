import{i as o}from"./IButton-hQYndbJf.js";import{d as r,o as i,i as n,w as s,b as l,u as c}from"./index-CviH_079.js";const m=r({__name:"WebShare",setup(u){function e(){navigator.share?navigator.share({title:"Radio",text:"Amazing radio",url:"https://alastromoody.github.io/radio/"}).then(()=>alert("Удалось поделиться")).catch(t=>alert(t)):alert("Не поддерживается на устройстве")}return(t,a)=>(i(),n(c(o),{onClick:e},{default:s(()=>a[0]||(a[0]=[l("click")])),_:1}))}});export{m as default};