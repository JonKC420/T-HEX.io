const t2xAddress = "THsSSczBw9RRMJWYL5j2MtcgaPasL2xPGP"
let t2x = undefined

async function autoContract() {
	const HttpProvider = TronWeb.providers.HttpProvider;
	const fullNode = new HttpProvider('https://api.trongrid.io');
	const solidityNode = new HttpProvider('https://api.trongrid.io');
	const eventServer = new HttpProvider('https://api.trongrid.io');
	
	let tronWeb = new TronWeb(fullNode, solidityNode, eventServer)
	tronWeb.setAddress(t2xAddress)
    try{
		await tronWeb.contract().at(contractAddress, function (error, result) {
			if (!error) {
				t2x = result
			} else{
				console.error(error)
				setTimeout(() => {
					autoContract()
				}, 300)
			}
		})
	}catch(e){
		console.log(e)
		setTimeout(() => {
			autoContract()
		}, 300)
	}
}

let cd
async function runAuctionDataSave() {
	autoContract()
	let checkForDay = setInterval(async () => {
		cd = await t2x.methods.currentDay().call()
		if(cd > 1){
			console.log('Starting auction data run...')
			getPastLobbyData()
			clearInterval(checkForDay)
		}
	}, 500)
}

function getPool(day) {
    if (day <= 365) {
        return 5000000 * (100000000) - ((day - 1) * 1095890410958)
    } else {
        return 1000000 * (100000000)
    }
}

async function getPastLobbyData() {
    for (var i = cd; i > 1; i--) {
        await lobbyDataTotal(i - 1)
    }
	console.log("Beginning save...")
	save()
}

let saveData = []
async function saveAuctionData(day, pool, auctionTotal){
	let newEntry 
	await (newEntry = {
		'day': day,
		'pool': pool,
		'ratio': pool / auctionTotal,
		'auctionTotal': auctionTotal
	})
	await saveData.push(newEntry)
}

async function lobbyDataTotal(day){
	try{
		dayTotalAuction = 0
		let res = await t2x.xfLobby(day).call()
		dayTotalAuction += res / 1e6
		let lobby = getPool(day) / 1e8
		
		await saveAuctionData(day, lobby, dayTotalAuction)
	}catch(e){
		console.log(e)
		await lobbyDataTotal(day)
	}
}

async function save(){
	var xhr = new XMLHttpRequest()

	xhr.open("POST", "/site/panel/server/auctionData.php")
	xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
	xhr.setRequestHeader("Accept", "*")
	xhr.setRequestHeader("Content-Type", "application/json")
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	xhr.setRequestHeader("Access-Control-Allow-Methods", "POST")
	xhr.setRequestHeader("Access-Control-Allow-Headers", "application/x-www-form-urlencoded, origin, x-requested-with, authorization, Content-Type, Accept")

	xhr.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {
			console.log('Save Complete, FileSize...')
			console.log(parseInt(this.response))
			if(parseInt(this.response) > 0)
				return true
		}
	}

	let data = JSON.stringify(saveData)
	await xhr.send(data)
}
