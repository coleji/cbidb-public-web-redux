export default (phone: string) => ({
	first: phone.substr(1,3),
	second: phone.substr(4,3),
	third: phone.substr(7,3),
	ext: phone.substr(10)
})