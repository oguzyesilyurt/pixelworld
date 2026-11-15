const {app,BrowserWindow}=require('electron');const path=require('path');
function create(){const w=new BrowserWindow({width:1400,height:900,backgroundColor:'#1a1328',autoHideMenuBar:true,icon:path.join(__dirname,'icons/icon-512.png')});w.loadFile('index.html')}
app.whenReady().then(create);app.on('window-all-closed',()=>app.quit());
