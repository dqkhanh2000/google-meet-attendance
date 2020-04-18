let btnStart = document.getElementById('btn_start'),
    downloadTag = document.getElementById('download')
btnStart.addEventListener('click', ()=>{
    btnStart.style.display = "none"
    document.getElementById('btn_loading').style.display = "inline"
    chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id, {msg: "start_attendance", urls: getArrayUrl()})
      });
})

downloadTag.addEventListener('click', (e)=>{
    e.preventDefault()
    chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id, {msg: "download"})
      });
})

document.getElementById("btn_more_url").addEventListener('click', ()=>{
    document.getElementById("group_url").insertAdjacentHTML('beforeend', '<input type="text" class="url">')
})

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if(msg.status === "done"){
        document.getElementById('count').innerText = msg.onlines
        if(msg.offlines > 0)
            document.getElementById('count-offline').innerText = msg.offlines
        else
            document.getElementById('offline').style.display = "none"
        document.getElementById('btn_loading').style.display = "none"
        document.getElementById('result').style.display="block"
    }
});

function getArrayUrl(){
    let urls = []
    document.querySelectorAll('.url').forEach((e)=>{
        if(e.value && urls.indexOf(e.value) == -1) urls.push(e.value)
    })
    return urls
}

