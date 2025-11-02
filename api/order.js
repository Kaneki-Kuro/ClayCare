const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const uri = process.env.MONGODB_URI;
let cachedClient = null;
async function connect(){
  if(cachedClient) return cachedClient;
  const client = new MongoClient(uri, { useNewUrlParser:true, useUnifiedTopology:true });
  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const body = req.body;
  if(!body || !body.productId || !body.buyer) return res.status(400).json({error:'invalid'});

  try{
    const client = await connect();
    const db = client.db(process.env.MONGODB_DB || 'claycare');
    const coll = db.collection('orders');

    const order = {
      orderId: uuidv4(),
      productId: body.productId,
      name: body.name,
      price: body.price,
      buyer: body.buyer,
      createdAt: new Date()
    };

    await coll.insertOne(order);

    // Here you would integrate Razorpay / payment initiation (server side)

    return res.json({ok:true, orderId: order.orderId});
  }catch(err){
    console.error(err);
    return res.status(500).json({error:'internal'});
  }
};
