import{d as n,o as t,c as a}from"./index-C7aLZOck.js";const i={key:0,class:"error"},h=n({__name:"WebShare",setup(s){function o(){navigator.share&&navigator.share({title:"Radio",text:"Amazing radio",url:"https://alastromoody.github.io/radio/"}).then(()=>alert("Удалось поделиться")).catch(e=>alert(e))}const r=!!navigator.share;return(e,c)=>(t(),a("div",null,[r?(t(),a("button",{key:1,onClick:o},"click")):(t(),a("div",i,"Не поддерживается на устройстве"))]))}});export{h as default};