import { MysqlError } from "mysql";

const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '514183',
	database: 'server'
})
// connection.connect();
// connection.end();
export function init () {
	connection.connect(() => {
		connection.query('CREATE DATABASE pluginServer', (error:MysqlError | null) => {

		})
	})
}

export function execute (query:string):Promise<{[key:string]:any }[]|any> {
	return new Promise((resolve, reject) => {
		connection.query(query, (error:MysqlError | null, results:any) => {
			if (error) {
				console.log(error);
				throw { status: 500, error: 'database error' }
			} else {
				resolve(results)
			}
		})
	})
}
