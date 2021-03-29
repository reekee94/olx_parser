import mongoose from 'mongoose'

const adsSchema = mongoose.Schema(
  {
    olx_id: {
      type: String,
      required: true,
      unique: true
    },
    title: { type: String, required: true },
    posted_time: { type: String, required: true, default: '0.0' },
    image_href: { type: String, required: true },
    price: { type: String,  default: 'to consider'},
    negotiation: { type: Boolean },
    city_area: { type: String },
    city: { type: String, required: true },
    category: { type: String, required: true },
    sub_category: { type: String },
    },
  // {
  //   timestamps: true,
  // }
)

const HomePageAds = mongoose.model('HomePageAds', adsSchema)

export default HomePageAds
