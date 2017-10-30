let url = "https://mail.zoho.com/zm/#mail/views/unread";



// chrome.alarms.create("repeatCallFunction", {when: Date.now(), periodInMinutes: 1});


// chrome.alarms.onAlarm.addListener(function( alarm ) {
//     // chrome.alarms.create("repeatCallFunction", {periodInMinutes: 1})
//     // console.log(alarm.name);
//     getData(url);
//   });


//Get data from js of the script
function getData(url) {

    $.get(url, function(data){
        
        let mailListIndexStart = data.search("zmail.mailList=");
        
        let strLength = "zmail.mailList=".length;
        
        let subDataStr = data.substring(mailListIndexStart + strLength);

        let mailListIndexEnd = subDataStr.search("]");

        let mailListArrayStr = subDataStr.substring(0, mailListIndexEnd + 1);

        // Get no of unread msg
        let countUnread = mailListArrayStr.match(/unread/g);

        if(countUnread != null && countUnread.length > 0){

            chrome.browserAction.setBadgeText({text : String(countUnread.length)});

            let mailListArray = JSON.parse(mailListArrayStr);

            for (var index = 0; index < countUnread.length; index++) {
                let id = mailListArray[index].M;
                let senderName = mailListArray[index].SN;
                let subject = mailListArray[index].SB;

                // console.log(id, senderName, subject);
            }
        }
        else{
            chrome.browserAction.setBadgeText({text : ""});
        }
    });
}


//Open Zolo Unread on click
chrome.browserAction.onClicked.addListener(function( tab ) {
    chrome.tabs.query({url: "*://mail.zoho.com/*"}, function(alreadyOpen){

        if(alreadyOpen != null && alreadyOpen.length === 0){
            chrome.tabs.create({ url: url });
        }
        else{
            // console.log(alreadyOpen[0]);

            chrome.tabs.update(alreadyOpen[0].id, {selected: true});

        }
    });
});

// function showNotification(id, name, subject){
//     chrome.notifications.create({title: name, message: subject});
// }
getData(url);
window.setInterval(function(){getData(url)}, 5000);