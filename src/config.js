/*jslint node: true */
"use strict";

/*
  App Configuration
*/

module.exports = {

	/* Web server config */
	SERVER_HOST: process.env.SERVER_HOST || '0.0.0.0',
	SERVER_PORT: process.env.SERVER_PORT || 8080,
	
	/* Database connection config */
	DB_HOST: process.env.DB_HOST || 'docker.for.mac.host.internal',
	DB_USER: process.env.DB_USER || 'devuser',
	DB_PASSWORD: process.env.DB_PASSWORD || 'password',

	/* S3 file storage config */
	S3_BUCKET: process.env.S3_BUCKET || 'img-srvc',
};