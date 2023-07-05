const { sequelize } = require("../../sql-connections/models");

exports.getUserDeviceTokenById = async (userId) => {
	return new Promise((resolve, reject) => {
		var deviceTokens = []
		let string = "";
		userId.map((res) => {
			string += "'"
			string += res
			string += "'"
			string += ","

		})
		sequelize.query("SELECT device_token FROM devices WHERE users_id IN (" + string.replace(/,\s*$/, "") + ")", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Device Tokens', queryData)
			let deviceTokenList = queryData
			for (const deviceToken of deviceTokenList) {
				if (deviceToken.device_token) {
					deviceTokens.push(deviceToken.device_token);
				}
			}
			console.log('Device Tokens Array', deviceTokens)
			resolve(deviceTokens)
		}).catch(error => {
			console.log('Device Tokens Error', error)
			reject(error)
		})
	})
}

exports.getLoginTokenByUserId = async(userId) => 
{
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT access_token FROM users WHERE id = '"+userId+"'",{type: sequelize.QueryTypes.SELECT}).then(queryData => {        
			console.log('Access Token',queryData[0])
			let loginToken = queryData[0].access_token
			resolve(loginToken)
		}).catch(error => {
			console.log('Access Token Error',error)
			reject(error)
		})
	})
}