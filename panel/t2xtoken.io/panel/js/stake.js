let stakeData = {
    entered_amount: 0,
    entered_days: 0,
    currentDay: void 0,
    stakingShare: void 0,
    clc_1: 0,
    clc_2: 0,
    shareRate: 0
}

const DESI_2 = 100000000

const LPB = 1820
const LPB_MAX_DAYS = 3640

const BPB_MAX_HEARTS = ((7 * 1000000) * (100000000))
const BPB = BPB_MAX_HEARTS * 100 / 10

let holder, clcD1 = true,
    clcD2 = true

let fingerprint = false
let finished = false
function refreshMyStakes() {
    getMyStakes()
}

function refreshMyEndedStakes() {
    fingerprint = false
    finished = false
    getEndedStakes()
}

function run_Stake(nIrstRn) {
    mainContract.globalInfo().call({
        shouldPollResponse: true
    }).then(res => {
        stakeData.stakingShare = tronWeb.fromSun(res[2]["_hex"]) * SUN

        $('.st-val-1')[0].innerHTML = currentDay + 1

        stakeData.shareRate = (100000 / stakeData.stakingShare) * 100000000
        $('.st-val-12')[0].innerHTML = abbreviate_number(stakeData.shareRate, 2) + "/T2X"
    })

    mainContract.xfLobby(currentDay).call({
        shouldPollResponse: true
    }).then(res => {
        $('.st-val-8')[0].innerHTML = abbreviate_number(tronWeb.fromSun(res._hex), 2) + " TRX"
    })

    if (nIrstRn) return
	
	startStakes()
}
function startStakes(){
	if( $('.my-stakes-table')[0] == undefined ){
		setTimeout(() => {
			startStakes()
		}, 500)
	}else{
		getMyStakes()
		refreshMyEndedStakes()
		getDaysData()
		estimateNextDay()
	}	
}

let DaysData = []

function getDaysData() {
    let xmlhttp_gu = new XMLHttpRequest();
    xmlhttp_gu.open("POST", "/get-days-data", true);
    xmlhttp_gu.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp_gu.send();

    xmlhttp_gu.onreadystatechange = (e) => {
        if (xmlhttp_gu.readyState !== 4 || xmlhttp_gu.status !== 200) return;
        if (xmlhttp_gu.responseText.length < 1) return;

        DaysData = JSON.parse(xmlhttp_gu.responseText)
    }
}

setInterval(() => {
    run_Stake(true)
}, 1000 * 20)

function stakeChangeDays() {
    stakeData.entered_days = parseInt($('.stake-inp-day')[0].value)

    const stakeDays = stakeData.entered_days + currentDay
    $('.st-val-2')[0].innerHTML = stakeDays
    $('.st-val-3')[0].innerHTML = stakeDays + 1

    let extraDays = stakeData.entered_days - 1
    if (extraDays > LPB_MAX_DAYS) extraDays = LPB_MAX_DAYS
    stakeData.clc_1 = (extraDays / 1820)

    holder = abbreviate_number_cu1((stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value)).toLocaleString(void 0, {
        minimumFractionDigits: 8
    }))
    $('.st-val-5')[0].innerHTML = "+ " + holder + " T2X"

    calculator()
}

function stakeChangeAmount() {
    stakeData.entered_amount = parseFloat($('.stake-inp-amount')[0].value)

    stakeData.clc_2 = stakeData.entered_amount * (Math.min(stakeData.entered_amount, 150000000) / 1500000000)

    holder = abbreviate_number_cu1((stakeData.clc_2).toLocaleString(void 0, {
        minimumFractionDigits: 8
    }))
    $('.st-val-4')[0].innerHTML = "+ " + holder + " T2X"

    holder = abbreviate_number_cu1((stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value)).toLocaleString(void 0, {
        minimumFractionDigits: 8
    }))
    $('.st-val-5')[0].innerHTML = "+ " + holder + " T2X"

    calculator()
}


function calculator() {
    if (!currentDay) return

    holder = abbreviate_number(stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value) + stakeData.clc_2, 2)
    $('.st-val-6')[0].innerHTML = holder + " T2X"

    let effective = parseFloat($('.stake-inp-amount')[0].value) + (stakeData.clc_1 * parseFloat($('.stake-inp-amount')[0].value) + stakeData.clc_2)
    holder = abbreviate_number(effective, 2)
    $('.st-val-7')[0].innerHTML = holder + " T2X"

    if ($('.st-val-13')[0].innerHTML) $('.st-val-13')[0].innerHTML = abbreviate_number(parseFloat(effective * stakeData.shareRate), 2)
}

function doStake() {
    $('.btn-usertransfer-load')[0].style.display = "block"
    $('.btn-usertransfer-txt')[0].innerHTML = ""

    mainContract.balanceOf(user.address).call({
        shouldPollResponse: true
    }).then(res => {
        if (tronWeb.fromSun(res._hex) / 100 < parseFloat($('.stake-inp-amount')[0].value)) {
            displayAlert(3, "Not Enough Balance !")
            $('.btn-usertransfer-load')[0].style.display = "none"
            $('.btn-usertransfer-txt')[0].innerHTML = "STAKE"
        } else {
            mainContract.stakeStart(parseFloat($('.stake-inp-amount')[0].value) * DESI, parseInt($('.stake-inp-day')[0].value)).send({
                shouldPollResponse: false
            }).then(res => {
                displayAlert(1, `Successfully staked ${parseFloat($('.stake-inp-amount')[0].value)} T2X for ${parseInt($('.stake-inp-day')[0].value)} days.`)
                refreshMyStakes()
            }).catch(err => {
                displayAlert(3, "Something went wrong !")
                console.log(err)
            }).finally(res => {
                $('.btn-usertransfer-load')[0].style.display = "none"
                $('.btn-usertransfer-txt')[0].innerHTML = "STAKE"
            })
        }
    })
}

function getMyStakes() {
    mainContract.stakeCount(user.address).call({
        shouldPollResponse: true
    }).then(res => {
        setTimeout(() => {
            const myStakesCount = parseFloat(tronWeb.fromSun(res._hex)) * SUN

            let toBeRendered = []

            let strt = 0
            ck1()

            function ck1() {
                if (strt < myStakesCount) {
                    getDrc()
                    strt++
                }
            }

            function getDrc() {
                mainContract.stakeLists(user.address, strt).call({
                    shouldPollResponse: true
                }).then(res2 => {
                    toBeRendered.push(res2)

                    if (toBeRendered.length == myStakesCount) {
                        toBeRendered.sort((b, a) => parseInt(a.stakeId) - parseInt(b.stakeId))
                        renderMyStakes(toBeRendered)
                    } else {
                        ck1()
                    }
                })
            }

        }, 500)
    })
}
const defaultStakeTable =
`
<table class="my-stakes-table" style="width: 100%; overflow: auto;">
							
										<tr style="width: 100%; overflow: auto;">

											<td class="" style="text-align:center; font-weight: 900;">
												<span class="inbox__item--highlight">Start<br>Day</span>
											</td>

											<td class="" style="text-align:center; font-weight: 900;padding-left: 0%;">
												<span class="inbox__item--highlight" style="margin-left: 8%;">End<br>Day</span>
											</td>

											<td class="" style="text-align:center; font-weight: 900;padding-left: 0%;">
												<span class="inbox__item--highlight" style="margin-left: 8%;">Stake<br>Progress</span>
											</td>

											<td class="" style="text-align:center; font-weight: 900;padding-left: 0%;">
												<span class="inbox__item--highlight">Staked
												<br>
												<img class="mobile-image" src="./dist/imgs/t2x-icon-2.png"
													style="display: inline-block;width: 16px;margin-right: 0%;">
												T2X</span>
											</td>

											<td class="" style="text-align:center; font-weight: 900;">
												<span class="inbox__item--highlight">Stake<br>Shares</span>
											</td>

											<td class="" style="text-align:center; font-weight: 900;">
												<span class="inbox__item--highlight">Bonus<br>Rewards</span>
											</td>

											<td class="" style="text-align:center; font-weight: 900;">
												<img class="mobile-image" src="./dist/imgs/tron-icon-2.png"
													style="display: inline-block;width: 15px;margin-right: 0%;">
												<span class="inbox__item--highlight">TRX
												<br>
												Rewards</span>
											</td>
											
											<td class="" style="text-align:center; font-weight: 900;">
												<span class="inbox__item--highlight">Interest<br>Earned</span>
											</td>
											
											<td class="" style="text-align:center; font-weight: 900;">
												<span class="inbox__item--highlight">Total<br>Value</span>
											</td>
											
											<td class="" style="text-align:center; font-weight: 900;">
												<span class="inbox__item--highlight">Action</span>
											</td>
											
											
										</tr>
																				
									</table>
`
function renderMyStakes(data) {
	$('.my-stakes-table')[0].innerHTML = defaultStakeTable

    let ii = 0
    data.forEach(item => {
        ii++

        item.lockedDay = parseInt(item.lockedDay)
        item.stakedDays = parseInt(item.stakedDays)

        let progress, btnTheme = "bg-theme-101",
            btnTxt = "CANCEL"
        if (item.lockedDay == currentDay + 1) {
            progress = `
            <td class="w-64 sm:w-auto truncate"
                style="text-align:center; font-weight: 900;">
                <span class="inbox__item--highlight">In Waiting</span>
            </td>
            `
        } else if (item.lockedDay == currentDay) {
            progress = `
            <td class="w-64 sm:w-auto truncate"
                style="text-align:center; font-weight: 900;">
                <div class="progress-b" style=""><div class="progress-bn" style="width: 2%;"></div></div>
            </td>
            `
        } else if (item.lockedDay + item.stakedDays < currentDay + 1) {
            progress = `
            <td class="w-64 sm:w-auto truncate"
                style="text-align:center; font-weight: 900;">
                <div class="progress-b" style=""><div class="progress-bn" style="width: 100%;"></div></div>
            </td>
            `
            btnTxt = "COLLECT"
            btnTheme = "bg-theme-100"
        } else if (item.lockedDay < currentDay + 1 && (item.lockedDay + item.stakedDays >= currentDay + 1)) {
            let clcR1 = currentDay - item.lockedDay
            let clcR2 = (clcR1 / item.stakedDays) * 100
            progress = `
            <td class="w-64 sm:w-auto truncate"
                style="text-align:center; font-weight: 900;">
                <div class="progress-b" style=""><div class="progress-bn" style="width: ${clcR2}%;"></div></div>
            </td>
            `
        }



        let activeRow = "item-sln"
        if (!clcD1) activeRow = "item-slm"

        let stakedSuns = tronWeb.fromSun(item.stakedSuns._hex) / 100
        let stakeShares = tronWeb.fromSun(item.stakeShares._hex) / 100

        let stakeButton = `
        <td class="w-64 sm:w-auto truncate"
            style="text-align:center; font-weight: 900;">
            <button class="button w-24 mr-1 mb-2 ${btnTheme} text-white" onClick="endStake(${item.stakeId})"
                style="width: auto; padding: 0px 5px;margin: 0; opacity: 0.5;">
            ${btnTxt}</button>
        </td>
        `

        const newRow =
            `
            <tr class="${activeRow} row-body inbox__item text-gray-700 bg-gray-100 border-b border-gray-200" style="cursor: auto;">
    
                    <td class="w-64 sm:w-auto truncate"
                        style="text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${item.lockedDay}</span>
                    </td>
    
                    <td class="w-64 sm:w-auto truncate"
                        style="text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${item.lockedDay + item.stakedDays}</span>
                    </td>
    
                    ${progress}
    
                    <td class="w-64 sm:w-auto truncate"
                        style="text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${abbreviate_number(stakedSuns, 2)}</span>
                    </td>
    
                    <td class="w-64 sm:w-auto truncate"
                        style="text-align:center; font-weight: 900;">
                        <span class="inbox__item--highlight">${abbreviate_number(stakeShares / 1, 2)}</span>
                    </td>
    
                    <td class="w-64 sm:w-auto truncate"
                        style="text-align:center; font-weight: 900;">
                        <span class="daily-bonus-it-${ii} inbox__item--highlight" id="0">Loading</span>
                    </td>

                    <td class="w-64 sm:w-auto truncate"
                        style="text-align:center; font-weight: 900;">
                        <span class="dividends-it-${ii} inbox__item--highlight" id="0">Loading</span>
                    </td>
    
                    <td class="w-64 sm:w-auto truncate"
                        style="text-align:center; font-weight: 900;">
                        <span class="interest-tn-${ii} inbox__item--highlight">Loading</span>
                    </td>
    
                    <td class="w-64 sm:w-auto truncate"
                        style="text-align:center; font-weight: 900;">
                        <span class="interest-tm-${ii} inbox__item--highlight" id="${stakedSuns}">Loading</span>
                    </td>
    
                    ${stakeButton}
            </tr>
        `

		$('.active-stake-loading')[0].style.display = 'none'
        $('.my-stakes-table')[0].innerHTML += newRow
		
        calcInterest(`interest-tn-${ii}`, `interest-tm-${ii}`, `daily-bonus-it-${ii}`, tronWeb.fromSun(item.stakeShares._hex), item.lockedDay, item.stakedDays + item.lockedDay)

        calcDividends(`dividends-it-${ii}`, item.lockedDay, item.stakedDays, stakeShares)

        getDailyBonusRewards(parseInt(item.lockedDay), parseInt(item.stakedDays), stakeShares, `daily-bonus-it-${ii}`)

        clcD1 = !clcD1
    })

}


function calcDividends(elm, lockedDay, stakedDays, stakeShares) {
	if(DaysData.length >= currentDay - 5){
		let addUpDivs = 0
		for (var i = 0; i < stakedDays; i++) {
			DaysData.forEach(item => {
				if (item.day == lockedDay + i) {
		  let totalDividends = parseInt(item.totalDividends)
		  let stakeSharesTotal = parseInt(item.stakeSharesTotal)
		  if(Number.isNaN(totalDividends) || Number.isNaN(stakeSharesTotal) || totalDividends == 0 || stakeSharesTotal == 0){
			totalDividends = 0
			stakeSharesTotal = 1
		  }
			addUpDivs += (totalDividends * 0.95) * stakeShares / stakeSharesTotal
					$(`.${elm}`)[0].innerHTML = abbreviate_number((addUpDivs * 100), 3) + " TRX"
				}
			})

		}
	}else{
		setTimeout(() => {
			calcDividends(elm, lockedDay, stakedDays, stakeShares)
		}, 3000)
	}
}

function getDailyBonusRewards(startDay, stakedDays, stakeShares, item) {
	if(DaysData.length >= currentDay - 5){
        let counter = 0
        for (var ii = startDay; ii < stakedDays + startDay; ii++) {
            if (counter < 4) {
                counter++;
            } else {
                processDailyBonus(ii, item)
                counter = 0;
            }
        }

        function processDailyBonus(theDay, _elm) {
            DaysData.forEach(item => {
                if (item.day == theDay) {
                    let elm = document.getElementsByClassName(`${_elm}`)[0]
                    if (!item.payoutTotal) {
                        if (elm.innerHTML === "..." || elm.innerHTML === "0") elm.innerHTML = "0"
                        return
                    }
                    let calc = (((item.payoutTotal * stakeShares) / item.stakeSharesTotal) * 2)
                    if (elm && elm.id) {
                        elm.innerHTML = abbreviate_number(parseFloat(elm.id) + parseFloat(calc), 2)
                        elm.id = calc
                    }
                }
            })
        }
	}else{
		setTimeout(() => {
			getDailyBonusRewards(startDay, stakedDays, stakeShares, item)
		}, 3000)
	}
}

function calcInterest(item, item2, item3, stakeShares, startDay, endDay) {
	if(DaysData.length >= currentDay - 5){
        let interest = 0

        for (var i = startDay; i < endDay; i++) {
            DaysData.forEach(item => {
                if (item.day == i) {
                    if (item.payoutTotal * stakeShares / item.stakeSharesTotal) interest += item.payoutTotal * stakeShares / item.stakeSharesTotal
                }
            })
        }

        $(`.${item}`)[0].innerHTML = `${abbreviate_number(interest / 100, 2)}`
        if ($(`.${item2}`)[0].id && $(`.${item3}`)[0].id) $(`.${item2}`)[0].innerHTML = `${abbreviate_number(parseFloat($(`.${item2}`)[0].id) + parseFloat($(`.${item3}`)[0].id) + interest / 100, 2)}`
    }else{
		setTimeout(() => {
			calcInterest(item, item2, item3, stakeShares, startDay, endDay)
		}, 3000)
	}
}

function addUpCurrentValue() {
    $('.interest-tm-${ii}')
}

function endStake(stakeId) {
    getStakesCount()

    function getStakesCount() {
        mainContract.stakeCount(user.address).call({
            shouldPollResponse: true
        }).then(res => {
            for (var i = 0; i < res; i++) {
                checkListForIndex(i)
            }
        })
    }

    function checkListForIndex(i) {
        mainContract.stakeLists(user.address, i).call({
            shouldPollResponse: true
        }).then(res => {
            if (res.stakeId == stakeId) doEnd(i)
        })
    }

    function doEnd(stakeIndex) {
        mainContract.stakeEnd(stakeIndex, stakeId).send({
            shouldPollResponse: true
        }).then(res => {
            refreshMyStakes()
            setTimeout(() => {
                refreshMyEndedStakes()
            }, 1500)
        })
    }
}

async function getEndedStakes(){
    let address = user.address
    let hexAddress = '0x'+tronWeb.address.toHex(address).slice(2, 42)
    if(!finished)
        await tronWeb.getEventResult(contractAddress, {
            eventName:'StakeEnd',
            size: 200,
            fingerprint: fingerprint == false ? "" : fingerprint,
            filters: { result_stakerAddr: hexAddress },
            page:20
        }).then(data => {
            console.log(data)
            let length = data.length
            for(let i = 0; i < length; i++){
                if(data[i].result.stakerAddr == hexAddress){
                    let temp = data[i].result
                    tronWeb.trx.getTransactionInfo(data[i].transaction).then(res => { 
                        console.log(res)
                        if(res.internal_transactions != undefined)
                            temp.trx = parseInt(res.internal_transactions[0].callValueInfo[0].callValue) / SUN
                        console.log(i, temp)
                        renderStake(temp)
                    })

                }                                          
            }
            if(data[length-1].fingerprint == undefined){
                finished = true
            }
            if(!finished){
                fingerprint = data[length-1].fingerprint
                getEndedStakes()
            }else{
                console.log("Finished")
            }   
        });
}

function renderStake(item) {
    item.lockedDay = parseInt(item.lockedDay)
    item.servedDays = parseInt(item.servedDays)

    let progress, tstStyle
    if (item.currentDay < item.lockedDay) {
        progress = "pending"
    } else if (item.currentDay > item.lockedDay + (item.lockedDay - 1)) {
        progress = "100%"
    } else if (item.currentDay == item.lockedDay + (item.lockedDay - 1)) {
        progress = "0%"
    } else if (item.currentDay < item.lockedDay + (item.lockedDay - 1)) {
        progress = (100 / item.lockedDay).toFixed(2) + "%"
    }

    let endDay = item.lockedDay + item.servedDays
    progress = "Canceled"
    tstStyle = "c06054db"

    if (item.servedDays > 0 && item.payout !== "0") {
        progress = "Finished"
        tstStyle = "8db85b"
    }

    let activeRow = "item-sln"
    if (!clcD2) activeRow = "item-slm"

    let row =
        `
        <tr class="${activeRow} row-body inbox__item text-gray-700 bg-gray-100 border-b border-gray-200"
            style="cursor: auto;">

                <td class="w-64 sm:w-auto truncate"
                        style="padding-left: 10px, padding-right: 10px; text-align:center; font-weight: 900;">
                    <span class="inbox__item--highlight">${item.lockedDay}</span>
                </td>

                <td class="w-64 sm:w-auto truncate"
                    style="padding-left: 10px, padding-right: 10px;  text-align:center; font-weight: 900;">
                    <span class="inbox__item--highlight">${endDay}</span>
                </td>

                <td class="w-64 sm:w-auto truncate"
                    style="padding-left: 10px, padding-right: 10px;  text-align:center; font-weight: 900; color:#${tstStyle}">
                    <span class="inbox__item--highlight">${progress}</span>
                </td>

                <td class="w-64 sm:w-auto truncate"
                    style="padding-left: 10px, padding-right: 10px; text-align:center; font-weight: 900;">
                    <span class="inbox__item--highlight">${abbreviate_number(item.stakedSuns / DESI, 2)} T2X</span>
                </td>

                <td class="w-64 sm:w-auto truncate"
                    style="padding-left: 10px, padding-right: 10px; text-align:center; font-weight: 900;">
                    <span class="inbox__item--highlight">${abbreviate_number(item.stakeShares / DESI, 2)}</span>
                </td>

                <td class="w-64 sm:w-auto truncate"
                    style="padding-left: 10px, padding-right: 10px; text-align:center; font-weight: 900;">
                    <span class="inbox__item--highlight">${abbreviate_number(parseInt(item.payout) / DESI, 2)} T2X</span>
                </td>

                <td class="w-64 sm:w-auto truncate"
                    style="padding-left: 10px, padding-right: 10px; text-align:center; font-weight: 900;">
                    <span class="inbox__item--highlight">${abbreviate_number(parseInt(item.stakeReturn) / DESI, 2)} T2X</span>
                </td>

                <td class="w-64 sm:w-auto truncate"
                    style="padding-left: 10px, padding-right: 10px; text-align:center; font-weight: 900;">
                    <span class="inbox__item--highlight">${item.trx ? abbreviate_number(item.trx, 4) : 0 } TRX</span>
                </td>

        </tr>
    `
    clcD2 = !clcD2
    $('.my-ended-stakes-table')[0].innerHTML += row
}

setInterval(() => {
    eligibleBonusDays()
}, 500)

function eligibleBonusDays() {
    $('.bounty-days-el')[0].innerHTML = `Eligible for ${Math.floor(parseInt($('.stake-inp-day')[0].value || 1) / 5)} BonusDays`
}

function estimateNextDay() {
    for (var i = currentDay; i > currentDay - 3; i--) {
        getLobbyData(i - 1)
    }
}

let pstEntries = 0

function getLobbyData(day) {
    mainContract.xfLobby(day).call({
        shouldPollResponse: true,
    }).then(res => {
        pstEntries += parseFloat(tronWeb.fromSun(res))
        $('.st-val-9')[0].innerHTML = "~" + abbreviate_number(pstEntries / 3, 2) + " TRX"
    })
}