const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const activationCodeSchema = new Schema({
	userId: String
});

const ActivationCode = mongoose.model('ActivationCodes', activationCodeSchema);

activationCodeSchema.virtual('id').get(function() {
	return this._id.toHexString();
});

// Ensure virtual fields are serialised.
activationCodeSchema.set('toJSON', {
	virtuals: true
});

activationCodeSchema.findById = function(cb) {
	return this.model('ActivationCodes').find({ id: this.id }, cb);
};

exports.createCode = (codeData) => {
	const code = new ActivationCode(codeData);
	return code.save();
};

exports.findById = (id) => {
	return ActivationCode.findById(id).then((result) => {
		result = result.toJSON();
		delete result._id;
		delete result.__v;
		return result;
	});
};

exports.removeById = (codeId) => {
	return new Promise((resolve, reject) => {
		ActivationCode.deleteOne({ _id: codeId }, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(err);
			}
		});
	});
};
