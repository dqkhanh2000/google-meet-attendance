let creator = "",
    downloader = document.createElement('a')
    
function scrollAndGetOnline(){
    return new Promise((resolve, reject)=>{
        let index = 1,
        names = []
        if(document.querySelector('.KKjvXb')) document.querySelector('.ThdJC').click()
        if(!document.querySelector('.mKBhCf.qwU8Me.RlceJe.kjZr4')) document.querySelector('.NzPR9b .uArJ5e').click()
        
        setTimeout(()=>{
            let total = parseInt(document.querySelector('.rua5Nb').innerText.slice(1, document.querySelector('.rua5Nb').innerText.length-1))
            let inv = setInterval(()=>{
                if(names.length+2>=total || (index-5)*100>document.querySelector('.TnISae').style.height.replace("px", "")){
                    resolve(names)
                    clearInterval(inv)
                }
                document.querySelectorAll('.cS7aqe').forEach(e=>{
                    name = e.innerHTML
                    if(name.indexOf("(Bạn")!==-1) creator = name
                    else if(name.indexOf("(")===-1){
                        if(names.indexOf(name)<0) names.push(name)
                    }
                })
                if(document.querySelector('.HALYaf')){
                    document.querySelector('.HALYaf').scrollTo(0,index*100)
                }   
                index++;
            },200)
        }, 500);
    })
}

function makeTextFile(text){
    let textFile;
    var data = new Blob([text], {type:'text/plain;charset=UTF-8'});
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
}

function getTime(){
    let today = new Date(),
    date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear(),
    time = today.getHours() + "h" + today.getMinutes()
    return time+' '+date;
}

function checkOffline(listMembers, onlines){
    let offlines = []
    listMembers.forEach(member =>{
        if(onlines.indexOf(member)<0) offlines.push(member)
    })
    return offlines
}

function formatName(names = []){
     return names.map((e, index)=>{
        let i = e.indexOf(" "),
        name = e.substring(i+1)+" "+e.substring(0, i)
        return name
    })
}

function getListMember(urls = []){
    let members = []
    urls.forEach(url => {
        let data = getJSON(url)
        if(data.err)
            alert("Error!\nError when getting list member("+url+"): "+data.err)
        else{
            data.forEach(member => members.push(member))
        }
    })
    return members
}

function getJSON(url) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, false)
    xhr.send(null)
    let status = xhr.status
    if (status === 200) {
        return JSON.parse(xhr.response)
    } else {
        return {err: status}
    }
};

async function start(urls = []){
    let link,
        allData = await getAllData(urls),
        listOnlines = allData[0],
        listOfflines = [],
        headOfFIle = "Danh sách được lập bởi "+creator+" lúc "+getTime()
                        +'\nDanh sách có '+listOnlines.length+' người online.',
        copyRight = `\nCreated by GoogleMeet Attendance extensions`
                        +`\nDesign by Quốc Khánh, script thanks Hoàng Vũ`,
        breakLine = `\n-------------------------------------------\n`,
        fileName = "DiemDanh_"+getTime()+".txt"
    
    
    if(urls.length > 0){
        listOfflines = allData[1]
        headOfFIle+='\nVắng '+listOfflines.length+' người.'
        link = makeTextFile(headOfFIle + breakLine + 'Danh sách online\n\n'
                        +listOnlines.join("\n").toString()
                        +breakLine + 'Danh sách vắng\n\n'
                        +listOfflines.join("\n").toString()
                        +breakLine
                        +copyRight)
    }
    else{
        link = makeTextFile(headOfFIle + breakLine + 'Danh sách online\n\n'
                        +listOnlines.join("\n").toString()
                        +breakLine
                        +copyRight)
    }
    downloader.href = link
    downloader.download = fileName
    downloader.style.display = 'none'
    document.body.appendChild(downloader)

    chrome.runtime.sendMessage({
        status: "done",
        onlines: listOnlines.length,
        offlines: listOfflines.length
    }); 
}

async function getAllData(urls){
    let listOnlines = [],
    listOfflines = [],
    listMembers = []
    await scrollAndGetOnline()
    .then(rawData => {
        listOnlines = formatName(rawData)
    })
    
    if(urls.length > 0){
        listMembers = getListMember(urls)
        listOfflines = checkOffline(listMembers, listOnlines)
        return [listOnlines, listOfflines, listMembers]
    }
    else{
        return [listOnlines, listOfflines, listMembers]
    }            
       
}

chrome.runtime.onMessage.addListener(function (msg) {
    if(msg.msg === "start_attendance"){
        start(msg.urls)
    }
    if(msg.msg === "download"){
        downloader.click()
    }
})