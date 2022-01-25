const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

//$('.maintenance')[0].innerHTML = `<div style="border: 2px solid #FF0000; text-align: center; color: #FF0000;">SITE IS UNDERGOING SOME UPDATES, THERE MAY BE ISSUES WHILE WE WORK.</div>`

$('.nav-menu')[0].innerHTML =
`
<ul class="non-t2x-headers" style="display: none;">

    <li>
        <a href="https://sunswap.com/#/scan/detail/trx/THsSSczBw9RRMJWYL5j2MtcgaPasL2xPGP" target="_blank" class="top-menu">
            <div class="top-menu__icon"> <i data-feather="refresh-cw"></i> </div>
            <div class="top-menu__title">SunSwap.com</div>
        </a>
    </li>
    <li>
        <a href="https://voidswap.io/" target="_blank" class="top-menu">
            <div class="top-menu__icon"> <i data-feather="refresh-cw"></i> </div>
            <div class="top-menu__title">Voidswap.io</div>
        </a>
    </li>

</ul>

<ul class="non-t2x-headers-2" style="display: none;">

    <li>
        <a href="https://2x.games" target="_blank" class="top-menu">
            <div class="top-menu__icon"> <i data-feather="dollar-sign"></i> </div>
            <div class="top-menu__title">2x.Games</div>
        </a>
    </li>
    <li>
        <a href="https://t2xtoken.io/panel/dice.html" class="top-menu">
            <div class="top-menu__icon"> <i data-feather="codesandbox"></i> </div>
            <div class="top-menu__title">Dice (on Chain)</div>
        </a>
    </li>

</ul>

<ul class="t2x-headers">
    <li>
        <a href="stake.html" id="menu-stake" class="top-menu">
            <div class="top-menu__icon"> <i data-feather="layers"></i> </div>
            <div class="top-menu__title">Staking</div>
        </a>
    </li>
    <li>
        <a href="auction.html" id="menu-auction" class="top-menu">
            <div class="top-menu__icon"> <i data-feather="server"></i> </div>
            <div class="top-menu__title">Auction</div>
        </a>
    </li>
    <li>
        <a href="roix.html" id="menu-roix" class="top-menu">
            <div class="top-menu__icon"> <i data-feather="cloud-drizzle"></i> </div>
            <div class="top-menu__title">RoiX</div>
        </a>
    </li>

    <li>
</li>
<li>
        <button onclick="headerToggle2()" class="top-menu">
            <div class="top-menu__icon"> <i data-feather="codesandbox"></i> </div>
            <div class="top-menu__title">Games</div>
        </button>
    </li>
    <li>
        <button onclick="headerToggle()" class="top-menu">
            <div class="top-menu__icon"> <i data-feather="refresh-cw"></i> </div>
            <div class="top-menu__title">Trade T2X</div>
        </button>
    </li>
</ul>



`
let hrefString =  $(location).attr("href");
var index = hrefString.lastIndexOf("/") + 1;
var pageName = hrefString.substr(index);
if(pageName == "stake.html")
	$('#menu-stake').addClass('top-menu--active');
if(pageName == "auction.html")
	$('#menu-auction').addClass('top-menu--active');
if(pageName == "xswapv2.html")
	$('#menu-xswapv2').addClass('top-menu--active');
if(pageName == "roix.html")
	$('#menu-roix').addClass('top-menu--active');
if(pageName == "dice.html")
	$('#menu-dice').addClass('top-menu--active');


$('.shared-header')[0].innerHTML =
    `
<div class="mobile-menu md:hidden" style="border: 0;">
    <div class="mobile-menu-bar" style="background: #3f4366; box-shadow: 0px 0px 10px #121420; height: 60px;">
        <a href="" class="flex mr-auto" onclick="openMenuM()">
            <img alt="T2X token" class="w-6" src="../img/T2X-logo-s.png" style="width: 10vw;filter: drop-shadow(0px 0px 3px #120f27);">
        </a>

        <div class="top-bar-boxed flex items-center">
            <div style="background: #040417;/* box-shadow: 2px 2px 8px #202639a1; */height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #c5d6f3;font-size: 18px;font-weight: 500;margin-right: 20px;"><span id="countdownm" class="countdownm" style="padding-right: 10px;">Day Ends In: 01 : 17 : 22</span></div>

            <button onclick="transferToggle()" style="background: #040417;box-shadow: 2px 2px 8px #202639a1;height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #c5d6f3;font-size: 18px;font-weight: 500;margin-right: 10px;"><span class="my-acc-add">TDH1z...8m6d6</span><img class="img-tronlink" src="https://cdn.discordapp.com/attachments/572416318234427402/700398613230125076/IIWYRzhS_400x400.jpg" style="width: 28px;margin-top: -3.7px;margin: 0px 1px 0px 10px;float: right;border-radius: 4px;"></button>
        </div>

        <a onclick="openMenuM()"> <i data-feather="bar-chart-2"
                class="w-8 h-8 text-white transform -rotate-90"></i> </a>
    </div>

    <div class="mobile-exten" style="background: #3c3c63;box-shadow: 0px 0px 10px #121420;height: 60px;z-index: 1000000000;position: absolute;width: 100%;display: flex;align-items: center;display: none; height: auto;">
        <ul class="border-t border-theme-24 py-7">
            <li>
                <a href="stake.html" class="menu">
                    <div class="menu__icon"> <i data-feather="layers"></i> </div>
                    <div class="menu__title"> Staking </div>
                </a>
            </li>
            <li>
                <a href="auction.html" class="menu">
                    <div class="menu__icon"> <i data-feather="server"></i> </div>
                    <div class="menu__title"> Auction </div>
                </a>
            </li>
			<li>
                <a href="roix.html" class="menu ">
                    <div class="menu__icon"> <i data-feather="share-2"></i> </div>
                    <div class="menu__title"> RoiX </div>
                </a>
            </li>
			<li>
				<a href="dice.html" class="menu">
					<div class="menu__icon"> <i data-feather="codesandbox"></i> </div>
					<div class="menu__title"> Dice </div>
				</a>
			</li>



        </ul>
    </div>
</div>

<div class="border-b hd-nm border-theme-24 -mt-10 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 pt-3 md:pt-0 mb-10" style="background: #27273d;border-bottom: 1px solid #040417;">
    <div class="top-bar-boxed flex items-center">
        <!-- BEGIN: Logo -->
        <a href="" class="-intro-x hidden md:flex">
            <img href="https://t2xtoken.io" alt="T@X Token" class="w-6" src="../img/T2X-logo-s.png" style="width: 3rem; filter: drop-shadow(2px 2px 8px rgba(250, 95, 59, 0.58));">
            <span class="text-white text-lg ml-3" style="padding-top: 0.2rem;font-size: 28px;padding-left: 5px;font-weight: 500;color: #c5d6f3;">T2X</span>
        </a>
        <!-- END: Logo -->
        <!-- BEGIN: Breadcrumb -->
        <div class="-intro-x breadcrumb breadcrumb--light mr-auto" style="background: #27273d; border-left: 0px solid #040417;">
        <span style="font-size: 20px;color: #8585a8ba;font-weight: 400;">Defi Built On The Tron Blockchain</span></div>
        <!-- END: Breadcrumb -->
        <div style="background: #292943;/* box-shadow: 2px 2px 8px #202639a1; */height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #c5d6f3;font-size: 18px;font-weight: 500;margin-right: 20px;"><span class="" style="padding-right: 10px;"><a href="https://tronscan.org/#/contract/THsSSczBw9RRMJWYL5j2MtcgaPasL2xPGP" target="_blank">Tronscan</a></span></div>

        <div style="background: #292943;/* box-shadow: 2px 2px 8px #202639a1; */height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #c5d6f3;font-size: 18px;font-weight: 500;margin-right: 20px;"><span id="countdown" class="countdown" style="padding: 10px 10px 0px 0px; text-align: center;">Day Ends In: 00:00:00</span></div>

        <button onclick="transferToggle()" style="background: #292943;box-shadow: 2px 2px 8px #202639a1;height: 38px;border-radius: 6px;padding: 2px 0px 0px 10px;border: 3px solid #42527178;color: #c5d6f3;font-size: 18px;font-weight: 500;"><span class="my-acc-add">...</span><img class="img-tronlink" src="https://cdn.discordapp.com/attachments/572416318234427402/700398613230125076/IIWYRzhS_400x400.jpg" style="width: 28px;margin-top: -3.7px;margin: 0px 1px 0px 10px;float: right;border-radius: 4px;"></button>
    </div>
</div>
`

if(!isMobile)
	$('.transferHeader')[0].innerHTML =
		`
		<div class="transfer-header" style="display: none; width: 100%; margin: 0px auto; background: #2e2e49; border-radius: 9px; box-shadow: 0px 0px 18px #1d1f2fb0; ">
			<div class="box-header flex items-center p-5 border-b border-gray-200" style="padding: 8px;padding-left: 20px; background: #31314d; border-radius: 9px;">
				<h2 class="font-medium text-base mr-auto"
					style="border: 2px solid grey; padding-right: 3px; padding-left: 3px;text-align: center; color: #b0b8c4; font-weight: 900;">
					Transfer T2X
					<br><div href="javascript:;" class="your-token-balance-hd tooltip text-gray-600 tooltipstered" style="font-weight: 600; ">--</div>
				</h2>
				<div class="mb-2" style="padding-left: 20px; padding-right: 5px; text-align: center; font-weight: 900;color: #b0b8c4;">To Address
				<input type="text" class="transfer-to-addr input w-full border flex-1" placeholder="Receiver's TRON Address"
					style="background-color: rgba(43, 43, 68, 0.91);color: #91979f; font-weight: 600;background-color: rgba(43, 43, 68, 0.91);border: 3px solid #50507e6b;">
				</div>
				<div class="mb-2" style="padding-right: 20px; text-align: center; font-weight: 900;color: #b0b8c4;">T2X Amount
				<input type="number" class="transfer-amount input w-full border flex-1" placeholder="1000.00 T2X"
					style="color: #91979f; font-weight: 600; background: linear-gradient(rgba(43, 43, 68, 0.57), rgba(43, 43, 68, 0.57)), url(https://t2xtoken.io/img/T2X-logo-s.png) no-repeat right 8px center;background-size: 24px;background-color: rgba(43, 43, 68, 0.91); border: 3px solid #50507e6b;">
				</div>
				<button onclick="userTransfer()"
						style="transition: all 0.9s ease-in-out; float: right;
							background-image: linear-gradient(45deg, #93c34a 0%, #52af4c 100%);box-shadow: 0 3px 6px rgba(0, 0, 0, .3), inset 0 0 10px 3px rgba(0, 0, 0, .2), 0 3px 20px #88c04aad, 0 3px 35px rgba(103, 174, 74, 0.28);
							color: #fff9f88f; font-size: 20px;"
						class="button text-white">
					<span class="transfer-text">Transfer T2X</span>
				</button>
			</div>
		</div>
		`
else
	$('.transferHeader')[0].innerHTML =
		`
		<div class="transfer-header" style="display: none; width: 100%; margin: 0px auto; background: #2e2e49; border-radius: 9px; box-shadow: 0px 0px 18px #1d1f2fb0; ">
				<h2 class="font-medium text-base mr-auto"
					style="border: 2px solid grey; padding-right: 3px; padding-left: 3px;text-align: center; color: #b0b8c4; font-weight: 900;">
					Transfer T2X
					<br><div href="javascript:;" class="your-token-balance-hd tooltip text-gray-600 tooltipstered" style="font-weight: 600; ">--</div>
				</h2>
			<div class="box-header flex items-center p-5 border-b border-gray-200" style="padding: 8px;padding-left: 20px; background: #31314d; border-radius: 9px;">
				<div class="mb-2" style="padding-left: 20px; padding-right: 5px; text-align: center; font-weight: 900;color: #b0b8c4;">To Address
				<input type="text" class="transfer-to-addr input w-full border flex-1" placeholder="Receiver's TRON Address"
					style="background-color: rgba(43, 43, 68, 0.91);color: #91979f; font-weight: 600;background-color: rgba(43, 43, 68, 0.91);border: 3px solid #50507e6b;">
				</div>
				<div class="mb-2" style="padding-right: 20px; text-align: center; font-weight: 900;color: #b0b8c4;">T2X Amount
				<input type="number" class="transfer-amount input w-full border flex-1" placeholder="1000.00 T2X"
					style="color: #91979f; font-weight: 600; background: linear-gradient(rgba(43, 43, 68, 0.57), rgba(43, 43, 68, 0.57)), url(https://t2xtoken.io/img/T2X-logo-s.png) no-repeat right 8px center;background-size: 24px;background-color: rgba(43, 43, 68, 0.91); border: 3px solid #50507e6b;">
				</div>
				<button onclick="userTransfer()"
						style="transition: all 0.9s ease-in-out; float: right;
							background-image: linear-gradient(45deg, #93c34a 0%, #52af4c 100%);box-shadow: 0 3px 6px rgba(0, 0, 0, .3), inset 0 0 10px 3px rgba(0, 0, 0, .2), 0 3px 20px #88c04aad, 0 3px 35px rgba(103, 174, 74, 0.28);
							color: #fff9f88f; font-size: 20px;"
						class="button text-white">
					<span class="transfer-text">Transfer T2X</span>
				</button>
			</div>
		</div>
		`

function headerToggle(){
	if( $('.non-t2x-headers')[0].style.display == 'none'){
		$('.non-t2x-headers')[0].style.display = ''
	}else
		$('.non-t2x-headers')[0].style.display = 'none'

}

function headerToggle2(){
	if( $('.non-t2x-headers-2')[0].style.display == 'none'){
		$('.non-t2x-headers-2')[0].style.display = ''
	}else
		$('.non-t2x-headers-2')[0].style.display = 'none'

}

function transferToggle(){
	if( $('.transfer-header')[0].style.display == 'none'){
		$('.transfer-header')[0].style.display = ''
	}else
		$('.transfer-header')[0].style.display = 'none'
}

let mmO
setInterval(() => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('.hd-nm')[0].style.display = "none"
        $('.my-acc-add')[0].style.fontSize = "16px"
        $('.countdownm')[0].style.fontSize = "16px"
    }
}, 1000)

function openMenuM() {
    if (mmO) {
        mmO = false
        $('.mobile-exten')[0].style.display = "none"
    } else {
        mmO = true
        $('.mobile-exten')[0].style.display = "block"
    }
}

function zeroPrefix(val) {
	if ((val.toString()).length < 2) {
		val = '0' + val;
	}
	return val;
}

setInterval(function time() {
	let d = new Date(),
		hours = 23 - d.getUTCHours(),
		min = 59 - d.getUTCMinutes(),
		sec = 59 - d.getUTCSeconds()

	if(!isMobile)
	   document.getElementById('countdown').innerHTML = 'Auction End ' + zeroPrefix(hours) + ' : ' + zeroPrefix(min) + ' : ' + zeroPrefix(sec)
	if(isMobile)
		document.getElementById('countdownm').innerHTML = zeroPrefix(hours) + ' : ' + zeroPrefix(min) + ' : ' + zeroPrefix(sec)
}, 1000);

async function userTransfer() {
    let toAddress = $('.transfer-to-addr')[0].value
    let amount = $('.transfer-amount')[0].value

    if (!amount || !mainContract) return

    $('.transfer-text')[0].innerHTML = "Processing"
	if(!validateAddress(toAddress) || toAddress == user.address)
		alert("Invalid transfer-to address.")
	else
		await mainContract.transfer(toAddress, parseInt(parseFloat(amount) * 1e8)).send({
			shouldPollResponse: false
		}).then(res => {
			setTimeout(() => {
				getUserBalance()
			}, 7 * 1000)
		}).catch(err => {
			console.error(err, "er")
		}).finally(res => {
			$('.transfer-text')[0].innerHTML = "Transfer T2X"
		})
}
