const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const ShipmentSchema = new Schema(
  {
    /**
     * 1. Shipment
     * 2. Service
     */
    type: { type: String, default: '1' },
    title: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'service' },
    trucks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'truck' }],
    customerNote: String,
    internalNote: String,
    note: String,
    del: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    dueStart: Date,
    dueEnd: Date,
    originCompany: String,
    originFullAddr: String,
    originAptSuite: String,
    originCity: String,
    originState: String,
    originCountry: String,
    originPostalCode: String,
    destCompany: String,
    destFullAddr: String,
    destAptSuite: String,
    destCity: String,
    destState: String,
    destCountry: String,
    destPostalCode: String,
    packagesTableData: { type: Object },
    packagesTableDataSP: { type: Object },
    vendorsTableData: { type: Object },
    photosTableData: { type: Object },
    status: { type: String, default: '1' },
    insured: { type: mongoose.Schema.Types.Double, default: 0.0 },
    declared: { type: mongoose.Schema.Types.Double, default: 0.0 },
    PODDateTime: Date,
    PODWho: String,
    createdAt: Date,
    updatedAt: Date,
    pdfPath: String,
    isReciverCreated: { type: Boolean, default: false },
    price: { type: mongoose.Schema.Types.Double, default: 0.0 },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'driver' },
    customerRepresentative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customerRepresentative',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

ShipmentSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

ShipmentSchema.index({
  title: 1,
  originFullAddr: 1,
  destFullAddr: 1,
  originPostalCode: 1,
  destPostalCode: 1,
  originCompany: 1,
  destCompany: 1,
});

const Shipment = mongoose.model('shipment', ShipmentSchema);

module.exports = Shipment;
