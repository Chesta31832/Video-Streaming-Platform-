import mongoose, {Schema} from "mongoose";
import mongooseaggregationPaginate from "mongoose-aggregation-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        published: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

    },
    {
        timestamps: true,
    }
)

videoSchema.plugin(mongooseaggregationPaginate);

export const Video = mongoose.model('Video', videoSchema);
