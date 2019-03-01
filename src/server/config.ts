import * as ini from 'ini';
import * as fs from 'fs'
import * as t from 'io-ts'
import optional from '../util/io-ts-optional'

const apiValidator = t.interface({
	host: t.string,
	https: t.boolean,
	port: optional(t.string),
	proxyPrefix: t.string,
})

const selfValidator = t.interface({
	host: t.string,
	https: t.boolean
})

type API = t.TypeOf<typeof apiValidator>;
type Self = t.TypeOf<typeof selfValidator>;

const configValidator = t.interface({
	SELF: selfValidator,
	API: apiValidator
})

export type ServerConfig = t.TypeOf<typeof configValidator>;

export default new Promise<ServerConfig>((resolve, reject) => {
	const config = ini.parse(fs.readFileSync('./ini/config.ini', 'utf-8'))
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