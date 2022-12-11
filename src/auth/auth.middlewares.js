const userModle = require('../users/users.models');
const authMethod = require('./auth.methods');

async function isAuth(req, res, next) {
	const accessTokenFromHeader = req.cookies.x_authorization;
	if (!accessTokenFromHeader) {
		return res
		.status(401)
		.redirect('/auth/login');
	}

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
	const verified = await authMethod.verifyToken( accessTokenFromHeader, accessTokenSecret );
	if (verified.statusCode === 401) {
        return res
			.writeHead(302, {'Location': '/auth/login'})
			.end();
	}
	const user = await userModle.getInfoUser(verified.data.payload.username);
	if(user.statusCode == 500) 
		return res
			.writeHead(302, {'Location': '/auth/login'})
			.end();
			
	req.user = user;
	return next();
};

async function isAuthAdmin(req, res, next) {
	try {
		const accessTokenFromHeader = req.cookies.x_authorization;
		if (!accessTokenFromHeader) {
			return res
				.writeHead(302, {'Location': '/auth/login'})
				.end();
		}

		const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
		const verified = await authMethod.verifyToken( accessTokenFromHeader, accessTokenSecret );
		if (verified.statusCode === 401) {
			return res
				.writeHead(302, {'Location': '/auth/login'})
				.end();
		}

		const user = await userModle.getInfoUser(verified.data.payload.username);
		console.log(user)

		console.log(user.result.Role);
		if (user.role !== 'Admin') 
			return res
				.writeHead(302, {'Location': '/auth/login'})
				.end();

		req.user = user;
		return next();
	} catch (error) {
		console.log(error);
		return res
			.writeHead(302, {'Location': '/auth/login'})
			.end();
	}
};

async function isAuthGiaoVien(req, res, next) {
	try {
		const accessTokenFromHeader = req.cookies.x_authorization;
		if (!accessTokenFromHeader) {
			return res
				.writeHead(302, {'Location': '/auth/login'})
				.end();
		}

		const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
		const verified = await authMethod.verifyToken( accessTokenFromHeader, accessTokenSecret );
		if (verified.statusCode === 401) {
			return res
				.writeHead(302, {'Location': '/auth/login'})
				.end();
		}

		const user = await userModle.getInfoUser(verified.data.payload.username);
		console.log(user.result.Role);

		console.log(user.result.Role);
		if (user.role !== 'GiaoVien' && user.role !== 'Admin') 
			return res
				.writeHead(302, {'Location': '/auth/login'})
				.end();

		req.user = user;
		return next();
	} catch (error) {
		console.log(error);
		return res
			.writeHead(302, {'Location': '/auth/login'})
			.end();
	}
};


async function isLogined(req, res, next) {
	const accessTokenFromHeader = req.cookies.x_authorization;
	if (!accessTokenFromHeader) 
		return next();

	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const verified = await authMethod.verifyToken( accessTokenFromHeader, accessTokenSecret );
	console.log(verified);

	if (verified.statusCode != 200) 
		return next();

	console.log("verified", verified);

	return res.redirect('/user/profile');
};

exports.isAuth = isAuth;
exports.isAuthAdmin = isAuthAdmin;
exports.isAuthGiaoVien = isAuthGiaoVien;
exports.isLogined = isLogined;