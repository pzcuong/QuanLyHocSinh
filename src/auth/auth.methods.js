const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

async function generateToken(payload, secretSignature, tokenLife) {
	try {
		return await sign(
			{
				payload,
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: tokenLife,
			},
		);
	} catch (error) {
		console.log(`Error in generate access token:  + ${error}`);
		return null;
	}
};

async function authMethod (token, secretKey) {
	try {
		return await verify(token, secretKey, {
			ignoreExpiration: true,
		});
	} catch (error) {
		console.log(`Error in decode access token: ${error}`);
		return null;
	}
};

async function decodeToken (token, secretKey) {
	try {
		let data = await verify(token, secretKey);
		return await ({
			statusCode: 200,
			data
		});
	} catch (error) {
		console.log(`Error in decode access token: ${error}`);
		return ({
			statusCode: 401,
			message: 'Token không hợp lệ hoặc đã hết hạn',
			alert: 'Token không hợp lệ hoặc đã hết hạn! Vui lòng đăng nhập lại!',
			redirect: '/auth/login'
		});
	}
}

exports.generateToken = generateToken;
exports.authMethod = authMethod;
exports.decodeToken = decodeToken;
exports.verifyToken = decodeToken;
