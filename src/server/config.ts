import * as ini from 'ini';
import * as fs from 'fs'
import * as t from 'io-ts'
import optional from '../util/io-ts-optional'

const apiValidator = t.interface({
	host: t.string,
	https: t.boolean,
	port: optional(t.number),
	pathPrefix: t.string,
})

const selfValidator = t.interface({
	host: t.string,
	https: t.boolean
})

const configValidator = t.interface({
	SELF: selfValidator,
	API: apiValidator
})

export type ServerConfig = t.TypeOf<typeof configValidator>;

export default new Promise<ServerConfig>((resolve, reject) => {
	var config = ini.parse(fs.readFileSync('./ini/config.ini', 'utf-8'))
	config.API.port = Number(config.API.port)
	const result = configValidator.decode(config)

	result.fold(
		e => {
			reject({
				recevied: config,
				err: e.flatMap(e1 => e1.context.map(e2 => e2))
			})
		},
		c => resolve(c)
	)
})