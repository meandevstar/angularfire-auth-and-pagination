export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email ? re.test(email.toLowerCase()) : false;
}

export function validatePhoneNumber(phoneNumber) {
	const re = /^\+\d{9,15}$/;
	return phoneNumber ? re.test(phoneNumber) : false;
}

export function validatePhoneCode(code) {
	const re = /^\d{6}$/;
	return code ? re.test(code) : false;
}

export function isEmptyObject(val) {
	return val === null || Object.keys(val).length === 0;
}