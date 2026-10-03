const o=(e,a)=>{const c=new Date(e,a,0).getDate();let n=0;for(let t=1;t<=c;t++)new Date(e,a-1,t).getDay()!==0&&n++;return n};export{o as c};
