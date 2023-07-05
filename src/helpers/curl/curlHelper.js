require('dotenv').config();
const {EVP_BASE_URL,EVP_API_VERSION,EVP_API_KEY,EVP_API_SECRET} = process.env;
const FINAL_BASE_URL = EVP_BASE_URL+EVP_API_VERSION
const ENCODED_KEY = EVP_API_KEY+':'+EVP_API_SECRET;
const GENERATED_ENCODED_KEY = 'Basic '+ Buffer.from(ENCODED_KEY, 'utf8').toString('base64');

const axios = require("axios");

exports.makePostRequest = async function (apiEndpoint,requestBody = null,header = null)
{
	console.log(apiEndpoint , requestBody)
	return await axios.post('/'+apiEndpoint, requestBody).then(function (response) {
    	console.log(response.data);
    	return response.data;
  	}).catch(function (error) {
    	return error;
  	});
}

exports.makeGetRequest = async function (apiEndpoint,requestBody = null,header = null)
{
	console.log(apiEndpoint , requestBody)
	return await axios.get(apiEndpoint,requestBody).then(function (response) {
    	console.log(response.data);
    	return response.data;
  	}).catch(function (error) {
    	return error;
  	});
}

exports.makeGetRequestNew = async function (apiEndpoint,requestBody = null,header = null)
{
	console.log(apiEndpoint , requestBody)
	var axiosYoutube = require("axios");
	if(header)
	{
		 axiosYoutube = require("axios").create({headers: {'Authorization':'Bearer '+header}});
	}
	
	return await axiosYoutube.get(apiEndpoint,requestBody).then(function (response) {
    	console.log(response.data);
    	return response.data;
  	}).catch(function (error) {
    	return error;
  	});
}

exports.makePostRequestInternal = async function (apiEndpoint,requestBody = null,header = null)
{
	console.log(apiEndpoint , requestBody)
	return await axios.post(apiEndpoint, requestBody).then(function (response) {
    	console.log(response.data);
    	return response.data;
  	}).catch(function (error) {
    	return error;
  	});
}
