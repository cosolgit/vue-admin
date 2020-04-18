obj={key1:123,key2:1};

let aaa=(data)=>{
    console.log(data);
    data.key3=Math.random();
};

aaa({...obj});


let bbb=(data)=>{
    console.log(data);
    data.key4=Math.random();
};

bbb(obj);

console.log(obj)