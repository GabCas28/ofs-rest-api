const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const recoveryCodeSchema = new Schema({
	userId: String,
});

const RecoveryCode = mongoose.model('RecoveryCodes', recoveryCodeSchema);

recoveryCodeSchema.virtual('id').get(function() {
	return this._id.toHexString();
});

// Ensure virtual fields are serialised.
recoveryCodeSchema.set('toJSON', {
	virtuals: true
});

recoveryCodeSchema.findById = function(cb) {
	return this.model('ActivationCodes').find({ id: this.id }, cb);
};

exports.createCode = (codeData) => {
	const code = new RecoveryCode(codeData);
	return code.save();
};

exports.findById = (id) => {
	return RecoveryCode.findById(id).then((result) => {
		result = result.toJSON();
		delete result._id;
		delete result.__v;
		return result;
	});
};

exports.removeById = (codeId) => {
	return new Promise((resolve, reject) => {
		RecoveryCode.deleteOne({ _id: codeId }, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(err);
			}
		});
	});
};
