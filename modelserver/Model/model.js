const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const userHistorySchema = new mongoose.Schema({
    generationId: String,
    userId: String,
    focalCode: String,
    testCode: String
});
const UserHistory = mongoose.model('UserHistory', userHistorySchema);

mongoose.connect(process.env['CONNECTION_STRING'])
    .then(() => console.log('MongoDB bağlantısı başarılı.'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

async function save2Db(userId, focal, test, generationId) {
    const newUserHistory = new UserHistory({
        generationId: generationId,
        userId: userId,
        focalCode: focal,
        testCode: test
    });

    try {
        await newUserHistory.save();
        console.log('Veri başarıyla kaydedildi.');
    } catch (error) {
        console.error('Veri kaydetme hatası:', error);
    }
}

async function getResultsByUserId(userId) {
    try {
        const results = await UserHistory.find({ userId: userId });
        return results;
    } catch (error) {
        console.error('Veri getirme hatası:', error);
        throw error;
    }
}

module.exports = { save2Db, getResultsByUserId };
