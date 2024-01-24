const mongoose = require('mongoose')

const InputEditorSettingsSchema = new mongoose.Schema(
    {
        fontSize: { type: Number, default: 20 },
        tabSize: { type: Number, default: 4 },
        readOnly: { type: Boolean, default: false },
        useSpaces: { type: Boolean, default: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { versionKey: false, collection: 'InputEditorSettingsCollection' }
)

const InputEditorSettings = mongoose.model(
    'InputEditorSettings',
    InputEditorSettingsSchema
)
module.exports = InputEditorSettings
