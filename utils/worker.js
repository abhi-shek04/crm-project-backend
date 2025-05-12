const redis = require('redis');
const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');

async function startWorker() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crm_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const subscriber = redis.createClient();
  await subscriber.connect();

  await subscriber.subscribe('campaign-delivery', async (message) => {
    const data = JSON.parse(message);
    console.log('Received campaign delivery:', data);
    const { campaignId, audience, message: campaignMessage } = data;
    try {
      // Update campaign status
      await Campaign.findByIdAndUpdate(campaignId, { status: 'delivered' });
      // Log delivery for each customer
      for (const customerId of audience) {
        await CommunicationLog.create({
          campaign: campaignId,
          customer: customerId,
          status: 'delivered',
          message: campaignMessage
        });
      }
      console.log(`Processed delivery for campaign ${campaignId}`);
    } catch (err) {
      console.error('Worker failed to process delivery:', err);
    }
  });

  console.log('Worker is listening for campaign deliveries...');
}

startWorker(); 