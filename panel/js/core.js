function debug__callSUN(method) {
    mainContract[method]().call().then((res) => {
        console.log(tronWeb.fromSun(res))
    })

}

function debug__plusDay(days) {
    mainContract.plusDay(days).send({
        shouldPollResponse: false
    }).catch(err => {
        console.error(err, "er")
    }).then(res => {
        aa()
    })
}

function aa() {
    mainContract.dailyDataUpdate(0).send({
        shouldPollResponse: false
    }).then(res => {
        console.error(res, "res")
    }).catch(err => {
        console.error(err, "er")
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////
const DESI = 1e8
const SUN = 1e6
const zeroAddress = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"
let mainContract, currentDay
let contractAddress = "THsSSczBw9RRMJWYL5j2MtcgaPasL2xPGP"

let burnAddress = "TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy"

let user = {
    address: undefined,
    balance: undefined,
    referrer: zeroAddress
}


function setUpContracts(_address) {
    console.log(tronWeb)
    if (!contractAddress && !_address) return void 0
    tronWeb.contract().at(contractAddress || _address, function (error, result) {
        if (!error) {
            mainContract = result;
            contractLoaded()
            console.log("Contract Loaded")
        } else
            console.error(error);
    });
}

const loginPromise = new Promise((resolve, reject) => {
        if (window.tronWeb && window.tronWeb.ready) {
            resolve(true)
        } else {
            window.addEventListener('load', () => {
                let tbAcc = setInterval(() => {
                    if (window.tronWeb && window.tronWeb.ready) resolve(true)
                    clearInterval(tbAcc)
                }, 200)

                setTimeout(() => {
                    clearInterval(tbAcc)
                }, 10000)
            })
        }
    })
    .then(() => {
        console.log("Tronweb installed and logged in")
        return true
    })
    .catch((err) => {
        console.error('Error while detecting tronweb', err)
        return false
    })

loginPromise.then((result) => {
    return new Promise((resolve, reject) => {
        const userAddress = window.tronWeb.defaultAddress.base58
        if (!userAddress) return resolve(false)

        user.address = userAddress
        updateHeadAddress()

        setUpContracts()
        if ($('.ref-link')[0]) $('.ref-link')[0].value = "https://t2xtoken.io/?ref=" + user.address

        window.addEventListener('load', (event) => {})

        setInterval(() => {
            if (window.tronWeb && user.address !== window.tronWeb.defaultAddress.base58) location.reload()
        }, 700)
    })
})

function updateHeadAddress() {
    let p2 = user.address.slice(34 - 5)
    $('.my-acc-add')[1].innerHTML = user.address.slice(0, 5) + "..." + p2
}

function contractLoaded() {
    if (!user.address) return

    getUserBalance()
    getBurnBalance()
    setInterval(() => {
        getUserBalance()
        getBurnBalance()
    }, 1000 * 6)

    getCurrentDay()

    let intso = setInterval(() => {
        if (currentDay) {
            clearInterval(intso)

            if (typeof run_Stake === "function") run_Stake()
            if (typeof run_Auction === "function") run_Auction()
            //if (typeof run_Dividends === "function") run_Dividends()
        }
    }, 100)
}

async function getCurrentDay() {
    currentDay = parseInt(await mainContract.methods.currentDay().call())
    setTimeout(() => {
        getCurrentDay()
    }, 1000 * 60 * 7)
}

// get balance of user and set it on the header
function getUserBalance() {
    mainContract.balanceOf(user.address).call({
        shouldPollResponse: false
    }).then(res => {
        user.balance = parseFloat(tronWeb.fromSun(res)) / 100
        if ($('.your-token-balance-hd')[0])
			$('.your-token-balance-hd')[0].innerHTML = "Your T2X balance: " + (user.balance).toLocaleString()
		if ($('.your-token-balance-hd')[1])
			$('.your-token-balance-hd')[1].innerHTML = "Your T2X balance: " + (user.balance).toLocaleString()
    })
}

function getBurnBalance() {
    mainContract.balanceOf(burnAddress).call({
        shouldPollResponse: false
    }).then(res => {
        if ($('.total-burned')[0])
			$('.total-burned')[0].innerHTML = "T2X Tokens Burned: " + (res/1e8).toLocaleString()
    })
}

function abbreviate_number(_num, fixed) {
    let num = parseFloat(_num)
    if (num === null) {
        return null;
    } // terminate early
    if (num === 0) {
        return '0';
    } // terminate early
    fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
    var b = (num).toPrecision(2).split("e"), // get power
        k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
        c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
        d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
        e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power

    return e;
}

function toFixedNoRounding(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function abbreviate_number_cu1(num) {
    let number = num.replace(/,/g, '')
    const indexDes = number.indexOf(".")
    let lcNm, doSk

    if (indexDes == 1 && number[0] === "0") {
        number = number.slice(0, indexDes + 9)
        lcNm = 8
    } else if (indexDes == 1 && number[0] !== "0") {
        number = number.slice(0, indexDes + 8)
        lcNm = 7
    } else if (indexDes == 2) {
        number = number.slice(0, indexDes + 6)
        lcNm = 5
    } else if (indexDes == 3) {
        number = number.slice(0, indexDes + 4)
        lcNm = 3
    } else if (indexDes > 3) {
        number = abbreviate_number(parseFloat(number), 2)
        doSk = true
    }

    if (doSk) {
        return number
    } else {
        number = (parseFloat(number)).toLocaleString(void 0, {
            minimumFractionDigits: lcNm
        })
        return number
    }
}

function extraDesi(a) {
    if (a.indexOf(".") == -1) return a

    if (a.length - a.indexOf(".") >= 4) {
        return a
    } else if (a.length - a.indexOf(".") == 3) {
        return a + "0"
    } else if (a.length - a.indexOf(".") == 2) {
        return a + "00"
    } else if (a.length - a.indexOf(".") == 1) {
        return a + "000"
    }
}

let int1, tm1, tm2

function displayAlert(type, text, duration) {
    const elm = $(`.alert-tb`)[type - 1]
    if (!elm) return

    clearInterval(int1)
    clearTimeout(tm1)
    clearTimeout(tm2)

    elm.style.display = "block"
    elm.style.opacity = "1"

    $('.alert-inner')[type - 1].innerHTML = text

    tm1 = setTimeout(() => {
        int1 = setInterval(() => {
            elm.style.opacity = parseFloat(elm.style.opacity) - 0.01
        }, 10)
    }, duration || 3000)

    tm2 = setTimeout(() => {
        elm.style.display = "none"
        clearInterval(int1)
    }, duration + 2000 || 5000)
}

function accessCookie(cookieName) {
    let name = cookieName + "=";
    let allCookieArray = document.cookie.split(';');
    for (let i = 0; i < allCookieArray.length; i++) {
        let temp = allCookieArray[i].trim();
        if (temp.indexOf(name) == 0)
            return temp.substring(name.length, temp.length);
    }
    return "";
}

if (accessCookie("ref").length > 0) {
    if (validateAddress(accessCookie("ref"))) user.referrer = accessCookie("ref")
}

function validateAddress(address) {
    if (typeof address !== 'string')
        return false;

    if (address[0] === "T" && address.length == 34)
        return true;

    return false;
}




let rTargetTime
getTimer()

function getTimer() {
    let xmlhttp_gu = new XMLHttpRequest();
    xmlhttp_gu.open("POST", "/get-next-round", true);
    xmlhttp_gu.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp_gu.send('address=' + user.address);

    xmlhttp_gu.onreadystatechange = (e) => {
        if (xmlhttp_gu.readyState !== 4 || xmlhttp_gu.status !== 200) return;
        if (xmlhttp_gu.responseText.length < 1) return;

        rTargetTime = xmlhttp_gu.responseText
    }
}

setInterval(() => {
    getTimer()
}, 1000 * 60 * 5)