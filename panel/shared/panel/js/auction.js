

$(document).ready(function() {
	//runAuctionDataSave()
	getAuctionData()
})

async function run_Auction() {
	getTodayLobby()
	let dataInt = setInterval(() => {
		if(auctionData.length > 20)
			getLobbies()
			clearInterval(dataInt)
	}, 1000)
}

async function getLobbies(){
	await getPastLobbies()
}

setInterval(() => {
    getTodayLobby()
}, 1000 * 20)

let auctionData = []
async function getAuctionData(){
	let xmlhttp_gu = new XMLHttpRequest();
    xmlhttp_gu.open("GET", "/auctionData", true);
    xmlhttp_gu.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp_gu.send();

    xmlhttp_gu.onreadystatechange = (e) => {
        if (xmlhttp_gu.readyState !== 4 || xmlhttp_gu.status !== 200) return;
        if (xmlhttp_gu.responseText.length < 1) return;

        auctionData = JSON.parse(xmlhttp_gu.responseText)
    }
	
	/*
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			auctionData = JSON.parse(this.responseText)
		}
	}
	xmlhttp.open("GET", "../../serverOps/auctionData.json", true)
	xmlhttp.send()
	*/
}

async function getTodayLobby() {
    $('.current-day-day')[0].innerHTML = "#" + currentDay

    $('.current-day-pool')[0].innerHTML = abbreviate_number(calcDaysLobbyPayout(currentDay) / 1e8, 2)

    let daysTotalUsersEntry = 0
    await mainContract.xfLobby(currentDay).call({
        shouldPollResponse: true,
    }).then(res => {
        daysTotalUsersEntry = parseFloat(tronWeb.fromSun(res))
        $('.current-day-ratio')[0].innerHTML = ((calcDaysLobbyPayout(currentDay) / 1e8) / daysTotalUsersEntry).toFixed(2)
    })

    let totalUserEntry = 0
    await mainContract.xfLobbyMembers(currentDay, user.address).call({
        shouldPollResponse: true,
    }).then(res => {
        for (var i = 0; i < res.tailIndex; i++) {
            mainContract.xfLobbyEntry(user.address, currentDay, i).call({
                shouldPollResponse: true,
            }).then(res => {
                totalUserEntry += parseFloat(tronWeb.fromSun(res.rawAmount._hex))
                $('.current-day-user')[0].innerHTML = abbreviate_number(totalUserEntry, 2)
                $('.current-day-rec')[0].innerHTML = abbreviate_number(((calcDaysLobbyPayout(currentDay) / 1e8) * totalUserEntry / daysTotalUsersEntry), 2)

            })
        }
    })

    await mainContract.xfLobby(currentDay).call({
        shouldPollResponse: true,
    }).then(res => {
        daysTotalUsersEntry = parseFloat(tronWeb.fromSun(res))
        $(`.current-day-total`)[0].innerHTML = abbreviate_number(daysTotalUsersEntry, 2)
    })
}

function calcDaysLobbyPayout(day) {
    if (day <= 365) {
        return 5000000 * (100000000) - ((day - 1) * 1095890410958)
    } else {
        return 1000000 * (100000000)
    }
}

let clcD1 = true
let dayPool = 0
let dayRatio = 0
let dayTotal = 0
async function getPastLobbies() {
	$('.unclaimed-auctions')[0].innerHTML =
		`
		<tr style="border-bottom: 1px solid #000000;">
			<td style="width: 33%; ">Day</td>
			<td style="width: 33%; ">Unclaimed T2X</td>
			<td style="width: 33%; ">Action</td>
		</tr>
		`
    $('.holder-table-10')[0].innerHTML = ""
	$('.holder-table-all')[0].innerHTML = ""
	let i2 = 0
    for (var i = currentDay; i > 1; i--) {
		dayPool = auctionData[i2].pool
		dayRatio = auctionData[i2].ratio
		dayTotal = auctionData[i2].auctionTotal
		i2++

        let enBtn =
            `
        <div style="">
            <button class="ended-button button w-24 shadow-md mr-1 mb-2 bg-gray-200 text-gray-600"
                style="margin: 0;padding: 5px 10px;width: 85%; cursor: auto; float: right;">ENDED</button>
        </div>
        `

        let activeRow = ""
        if (!clcD1) activeRow = "tb-active-row-2"


        let row = 
            `
        <tr class="box zoom-in px-4 py-4 mb-3 ${activeRow} day-${i-1}-display"
            style="padding: 8px 0px; cursor: auto; margin-bottom: 7px; color: #b4c5e1a3; background: #3b3b59;">

            <td class="w-64 sm:w-auto truncate"
                style="text-align:center;font-weight: 900;">
                <span class="day-day-${i - 1} inbox__item--highlight">#${i - 1}</span>
            </td>

            <td class="w-64 sm:w-auto truncate"
                style="text-align:center; font-weight: 900">
                <span class="pool-day-${i - 1} inbox__item--highlight" style="padding-left: 0%;">${abbreviate_number(dayPool, 2)}</span>
            </td>

            <td class="w-64 sm:w-auto truncate"
                style="text-align:center;font-weight: 900;">
                <span class="ratio-day-${i - 1} inbox__item--highlight" style="padding-left: 0%;margin-left: 8%;">${dayRatio.toFixed(2)}</span>
            </td>

            <td class="w-64 sm:w-auto truncate"
                style="text-align:center;font-weight: 900;">
                <span class="state-day-${i - 1} inbox__item--highlight" style="padding-right: 0%;margin-left: 8%;">Closed</span>
            </td>

            <td class="w-64 sm:w-auto truncate"
                style="text-align:center;font-weight: 900;">
                <span class="user-rec-day-${i - 1} inbox__item--highlight" style="padding-right: 0%;">--</span>
            </td>

            <td class="w-64 sm:w-auto truncate"
                style="text-align:center;font-weight: 900;">
                <span class="user-total-day-${i - 1} inbox__item--highlight" style="padding-left: 0%;">--</span>
            </td>

            <td class="w-64 sm:w-auto truncate"
                style="text-align:center;font-weight: 900;">
                <span class="total-day-${i - 1} inbox__item--highlight" style="padding-left: 0%;">${abbreviate_number(dayTotal,2)}</span>
            </td>

            <td class="button-day-${i - 1}" style="width: 15.5%; padding-right: 1%;">${enBtn}</div>
        </tr>
        `

		if(i+1 < currentDay-8){
			$('.holder-table-all')[0].innerHTML += row
			$(`.day-${i-1}-display`)[0].style.display = "none"
		}
		else{
			$('.holder-table-10')[0].innerHTML += row
		}
		
		$(`.auction-display`)[0].innerHTML = '<span style="border-radius: 6px; border: 3px solid #7439ad; color: #FFFFFF; padding: 1px 10px 1px 10px">Remaining '+i+' Auctions Loading<span>'

        await userLobby(i - 1)

    }
	if(currentDay > 20){
		displayReduce()
	}
}
function displayAll(){
	for(let i = currentDay-8; i > 1; i--){
		$(`.day-${i-1}-display`)[0].style.display = ""
	}
	$(`.auction-display`)[0].innerHTML =
	`
		<button onclick="displayReduce()" style="border-radius: 6px; border: 3px solid #7439ad; color: #FFFFFF; padding: 1px 10px 1px 10px">Reduce Auction Display</button>
	`
	$(`.auction-display-end`)[0].innerHTML =
	`
		<button onclick="displayReduce()" style="border-radius: 6px; border: 3px solid #7439ad; color: #FFFFFF;padding: 1px 10px 1px 10px">Reduce Auction Display</button>
	`
}

function displayReduce(){
	for(let i = currentDay-10; i > 1; i--){
		$(`.day-${i-1}-display`)[0].style.display = "none"
	}

	$(`.auction-display`)[0].innerHTML =
	`
		<button onclick="displayAll()" style="border-radius: 6px; border: 3px solid #7439ad; color: #FFFFFF;padding: 1px 10px 1px 10px">Display All Auctions</button>
	`
	$(`.auction-display-end`)[0].innerHTML = ""
}

let totalUserEntry = 0
async function userLobby(day){
		let newUncollectedRow = ''
		totalUserEntry = 0
		// how many times entered current day's lobby
		let res = await mainContract.xfLobbyMembers(day, user.address).call()
		for (var i = 0; i < res.tailIndex; i++) {
			getUserLobbies(day, i)
		}
		if(totalUserEntry > 0 && day != currentDay){
			$('.unclaimed-placeholder')[0].style.display = "none"
			$('.unclaimed-auctions')[0].innerHTML += 
				`		
					<tr>
						<td style="width: 33%; ">${day}</td>
						<td style="width: 33%; ">${ ((calcDaysLobbyPayout(day) / 1e8) / dayTotal * totalUserEntry).toFixed(2) }
						<td style="width: 33%; "><button uncollected-${day} class="button w-24 shadow-md mr-1 mb-2 bg-theme-9 text-white" onClick="collectLobby(${day})">COLLECT</button></td>
					</tr>
				`
		}
}

async function getUserLobbies(day, i){
	await mainContract.xfLobbyEntry(user.address, day, i).call({}, function(error, res2){
		if(error){
			$(`.user-total-day-${day}`)[0].innerHTML = '--'
			$(`.user-rec-day-${day}`)[0].innerHTML = '--'

			$(`.button-day-${day}`)[0].innerHTML =
				`
			<div style="">
				<button class="collected-button button w-24 shadow-md mr-1 mb-2 bg-theme-9 text-white"
					style="margin: 0;padding: 5px 10px;float: right;width: 85%; float: right;">COLLECTED</button>
			</div>
			`
		}else{
			totalUserEntry += parseFloat(tronWeb.fromSun(res2.rawAmount._hex))
			$(`.user-total-day-${day}`)[0].innerHTML = abbreviate_number(totalUserEntry, 2)
			$(`.user-rec-day-${day}`)[0].innerHTML = abbreviate_number(dayPool * totalUserEntry / dayTotal, 2)

			$(`.button-day-${day}`)[0].innerHTML =
				`
			<div style="">
				<button class="collect-button button w-24 shadow-md mr-1 mb-2 bg-theme-9 text-white"
					style="margin: 0;padding: 5px 10px;float: right;width: 85%; float: right;" onClick="collectLobby(${day})">COLLECT</button>
			</div>
			`
		}
	}).catch(err => {
		console.error(err, "er")
		userLobby(day)
	})
}			


function collectLobby(day) {
    mainContract.xfLobbyExit(day, 0).send({
        shouldPollResponse: true
    }).then(res => {
		if($('.uncollected-'+day) != undefined)
			$('.uncollected-'+day).innerHTML = "COLLECTED"
	}).catch(err => {
        console.error(err, "er")
    }).finally(res => {
        getPastLobbies()
    })
}

function enterLobby() {
    $('.btn-auction-enter-load')[0].style.display = "block"
    $('.btn-auction-enter-txt')[0].innerHTML = ""

    let int1 = setInterval(() => {
        if (!$(".modal.show")[0]) {
            clearInterval(int1)
            $('.btn-auction-enter-load')[0].style.display = "none"
            $('.btn-auction-enter-txt')[0].innerHTML = "ENTER"
        }
    }, 300)
}

function enterLobbyFinal() {
    let referrer = user.referrer
    if (user.referrer === zeroAddress) user.referrer = "TKNJ1QtBfJtfsRDg7M57h8hEg9oKRYyN2Q"
 
    mainContract.xfLobbyEnter(referrer).send({
        shouldPollResponse: true,
        callValue: parseInt(parseFloat($('.auction-amount-entry')[0].value * SUN)) 
    }).then(res => {
        getTodayLobby()
    }).catch(err => {
        console.error(err, "er")
    }).finally(res => {})

    $('.close-modal-a').click()
}