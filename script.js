const createBox = document.getElementsByClassName("createBox")[0];
const notes = document.getElementsByClassName("notes")[0];
const input = document.getElementById("user-input");
var contentArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
var contentCoords = localStorage.getItem('coords') ? JSON.parse(localStorage.getItem('coords')) : [];
var samplePositions=[[0,0],[0,300],[0,600],[0,900],[0,1200],[305,0],[305,300],[305,600],[305,900],[305,1200]];
var i = 0;
const margin = () => {
  var random_margin = ["-5px","1px", "5px", "10px","15px","20px"];
  return random_margin[Math.floor(Math.random() * random_margin.length)];
}

const rotate = () => {
  var random_degree = ["rotate(3deg)","rotate(1deg)","rotate(-1deg)","rotate(-3deg)","rotate(-5deg)", "rotate(-10deg)"];
  return random_degree[Math.floor(Math.random() * random_degree.length)];
}

const position = () =>{
  return [Math.floor(Math.random()*(window.innerHeight*0.7-notes.style.height)),Math.floor(Math.random()*(window.innerWidth*0.7-notes.style.width))];
}

var random_colors = ["#ff7eb9","#ff65a3","#7afcff","#feff9c","#fff740","#fff"];

const color = () => {
  return random_colors[Math.floor(Math.random() * (random_colors.length-1))];
}

function parseColor(color) {
  var arr=[]; color.replace(/[\d+\.]+/g, function(v) { arr.push(parseFloat(v)); });
  return {
      hex: "#" + arr.slice(0, 3).map(toHex).join(""),
      opacity: arr.length == 4 ? arr[3] : 1
  };
}
function toHex(int) {
  var hex = int.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const darkerShade=(color)=>{
  var random_colors = ["#ff7eb9","#ff65a3","#7afcff","#feff9c","#fff740","#fff"];
  var darkerShades=["#ff5eb9","#ff45a3","#09ecf0","#fcff52","#fdf110","rgb(200,200,200"];
  for (let i=0;i<random_colors.length;i++){
    if (random_colors[i]==color){
      return darkerShades[i];
    }
  }
}
input.contentWindow.document.body.style="padding: 30px; max-width: 300px; overflow-x: hidden";
document.getElementById("done").addEventListener('click',()=>{
    if (input.contentWindow.document.body.innerText==""){
      createBox.style.display = "none";
    }else{
      contentCoords.push(position());
      contentArray.push(input.contentWindow.document.body.innerHTML);
      localStorage.setItem('coords',JSON.stringify(contentCoords));
      localStorage.setItem('items', JSON.stringify(contentArray));
      divMaker(input.contentWindow.document.body.innerHTML,setColor);
      input.contentWindow.document.body.innerHTML = '';
      createBox.style.display = "none";
    }
})
var setColor=color();
input.contentWindow.document.body.style.background="white";
document.getElementById("createNote").addEventListener("click", () => {
  createBox.style.display = "block";
  setColor=color();
  input.contentWindow.document.body.style.background=setColor;
});

document.getElementById("hide").addEventListener("click", () =>{
  createBox.style.display = "none";
});

document.getElementById("deleteNotes").addEventListener("click", () => {
  localStorage.clear();
  notes.innerHTML = '';
  contentArray = [];
  contentCoords=[];
});
contentArray.forEach(divMaker);
var temp=false;
function divMaker(text){
  var div = document.createElement("div");
  var cross=document.createElement("button");
  var edit=document.createElement("button");
  var grabBar=document.createElement("div");
  grabBar.className="grabber";
  edit.innerHTML="<i class='fas fa-edit'></i>";
  edit.id="edit";
  edit.style="position: absolute; top: 0; right:30px; z-index: 2;";
  cross.innerHTML="<i class='fas fa-times'></i>";
  cross.style="position: absolute; top: 0; right:5px; transition: 0; z-index: 2;";
  div.className = 'note';
  div.innerHTML = text;
  let selectedMargin=margin();
  div.setAttribute('style', 'position: absolute; margin:'+selectedMargin+'; transform:'+rotate()+'; background:linear-gradient('+setColor+','+darkerShade(setColor)+'); padding: 40px 35px; font-size:25px; text-overflow: hidden');
  const ind=contentArray.indexOf(text);
  div.style.top=contentCoords[ind][0]+"px";
  div.style.left=contentCoords[ind][1]+"px";
  div.style.zIndex=1;
  grabBar.style.margin=selectedMargin;
  grabBar.appendChild(edit);
  grabBar.appendChild(cross);
  div.appendChild(grabBar);
  notes.appendChild(div);
  grabBar.style="background:linear-gradient("+darkerShade(setColor)+",transparent)";
  setColor=color();
  edit.onclick=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    const index=contentArray.indexOf(text);
    if (index>-1){
      contentArray.splice(index,1);
      contentCoords.splice(index,1);
    }
    localStorage.setItem('items', JSON.stringify(contentArray));
    localStorage.setItem('coords', JSON.stringify(contentCoords));
    notes.removeChild(div);
    createBox.style.display = "block";
    input.contentWindow.document.body.style.background=setColor;
    input.contentWindow.document.body.innerHTML = text;
    if (temp){
      input.contentWindow.document.body.innerHTML = '';
      createBox.style.display = "none";
      temp=false;
    }
  }
  cross.addEventListener('click',function(e){
    temp=true;
    edit.onclick(e);
  });
  var x, y, target = null;
  grabBar.addEventListener('click',function(e){
    for (let i=0;i<document.getElementsByClassName("note").length;i++){
      if (document.getElementsByClassName("note")[i]==div){
        document.getElementsByClassName("notes")[0].removeChild(document.getElementsByClassName("note")[i]);
        break;
      }
    }
    document.getElementsByClassName("notes")[0].appendChild(div);
  })
  grabBar.addEventListener('mousedown', function(e) {
    target = div;
    target.classList.add('dragging');
    x = e.clientX - target.style.left.slice(0, -2);
    y = e.clientY - target.style.top.slice(0, -2);
    target.style.zIndex=4;
  },false);

  grabBar.addEventListener('mouseup', function() {
    if (target !== null) target.classList.remove('dragging');
    target = null;
    div.style.zIndex=1;
    div.style.transform=rotate();
    contentCoords[ind][0]=div.style.top.slice(0,-2);
    contentCoords[ind][1]=div.style.left.slice(0,-2);
    localStorage.setItem('coords', JSON.stringify(contentCoords));
    setColor=parseColor(div.style.background).hex;
    div.style.boxShadow="2px 12px 8px rgb(0,0,0,0.8)";
    grabBar.style="background:linear-gradient("+darkerShade(setColor)+",transparent)";
    div.style.cursor=grabBar.style.cursor;
  },false);
  grabBar.addEventListener('mouseenter',()=>{
    grabBar.style.cursor="grab";
  })
  grabBar.addEventListener('mouseleave',()=>{
    grabBar.style.cursor="pointer";
  })
  document.addEventListener('mousemove', function(e) {
    if (target === null) return;
    div.style.cursor="grab";
    div.style.boxShadow="15px 25px 15px rgba(0,0,0,0.8)";
    grabBar.style="background:transparent";
    target.style.left = e.clientX - x + 'px';
    target.style.top = e.clientY - y + 'px';
    var pRect = target.parentElement.getBoundingClientRect();
    var tgtRect = target.getBoundingClientRect();
    if (tgtRect.left < pRect.left-5) target.style.left = 0;
    if (tgtRect.top < pRect.top-5) target.style.top = 0;
    if (tgtRect.right > pRect.right+5) target.style.left = pRect.width - tgtRect.width + 'px';
    if (tgtRect.bottom > pRect.bottom+5) target.style.top = pRect.height - tgtRect.height + 'px';
  },false);
  grabBar.addEventListener('touchmove', function(e) {
    var touchLocation = e.targetTouches[0];
    div.style.left =touchLocation.pageX-window.innerWidth*0.2+ 'px';
    div.style.top =touchLocation.pageY-window.innerHeight*0.2+ 'px';
    var pRect = div.parentElement.getBoundingClientRect();
    var tgtRect = div.getBoundingClientRect();
    if (tgtRect.left < pRect.left-5) div.style.left = 0;
    if (tgtRect.top < pRect.top-5) div.style.top = 0;
    if (tgtRect.right > pRect.right+5) div.style.left = pRect.width - tgtRect.width + 'px';
    if (tgtRect.bottom > pRect.bottom+5) div.style.top = pRect.height - tgtRect.height + 'px';
  })
  
  grabBar.addEventListener('touchend', function(e) {
    var x = parseInt(div.style.left);
    var y = parseInt(div.style.top);
    div.style.zIndex=1;
    contentCoords[ind][0]=div.style.top.slice(0,-2);
    contentCoords[ind][1]=div.style.left.slice(0,-2);
    localStorage.setItem('coords', JSON.stringify(contentCoords));
    setColor=parseColor(div.style.background).hex;
    div.style.boxShadow="2px 12px 8px rgb(0,0,0,0.8)";
    grabBar.style="background:linear-gradient("+darkerShade(setColor)+",transparent)";
    div.style.cursor=grabBar.style.cursor;
  })
  
}
textField.document.designMode="On";
textField.document.body.style.fontSize=25;
function execCmd(command){
    textField.document.execCommand(command,false,null);
}
createBox.style.display = "none";

var buttons=document.getElementById("editButtons").querySelectorAll("button");
for (let i=1;i<buttons.length-1;i++){
  buttons[i].addEventListener('click',()=>{
    if (buttons[i].classList.contains('active')){
      buttons[i].classList.remove('active');
    }else{
      buttons[i].classList.add("active");
    }
  })
}