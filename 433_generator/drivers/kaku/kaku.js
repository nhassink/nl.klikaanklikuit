'use strict';

const DefaultDriver = require('../../../drivers/lib/driver');

module.exports = class Kaku extends DefaultDriver {
	generateData() {
		const data = {
			address: this.generateRandomBitString(26),
			group: 0,
			channel: this.generateRandomBitString(2),
			unit: this.generateRandomBitString(2),
			state: 0,
		};
		data.id = `${data.address}:${data.channel}:${data.unit}`;
		return data;
	}

	payloadToData(payload) { // Convert received data to usable variables
		if (payload.length === 32) {
			const data = {
				address: this.bitArrayToString(payload.slice(0, 26)),
				group: payload[26],
				channel: this.bitArrayToString(payload.slice(28, 30)),
				unit: this.bitArrayToString(payload.slice(30, 32)),
				state: payload[27],
			};
			data.id = `${data.address}:${data.channel}:${data.unit}`;
			return data;
		}
		return null;
	}

	dataToPayload(data) {
		if (
			data &&
			data.address && data.address.length === 26 &&
			data.channel && data.channel.length === 2 &&
			data.unit && data.unit.length === 2 &&
			typeof data.group !== 'undefined' &&
			typeof data.state !== 'undefined'
		) {
			const address = this.bitStringToBitArray(data.address);
			const channel = this.bitStringToBitArray(data.channel);
			const unit = this.bitStringToBitArray(data.unit);
			return address.concat(Number(data.group), Number(data.state), channel, unit);
		}
		return null;
	}

	generateDevice(data) {
		data.group = 0;
		data.state = Number(data.state) ? 1 : 0;
		delete data.dim;
		return super.generateDevice(data);
	}
};
